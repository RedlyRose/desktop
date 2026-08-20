import asyncio
import os
import re
import sys
import subprocess
import urllib.request
from playwright.async_api import async_playwright

# Ensure utf-8 output in Windows terminal
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

BASE_DIR = os.path.join(os.getcwd(), "stuff", "reddit_HentaiCensore")
GIFS_DIR = os.path.join(BASE_DIR, "gifs")
VIDEOS_DIR = os.path.join(BASE_DIR, "videos")
IMAGES_DIR = os.path.join(BASE_DIR, "images")

os.makedirs(GIFS_DIR, exist_ok=True)
os.makedirs(VIDEOS_DIR, exist_ok=True)
os.makedirs(IMAGES_DIR, exist_ok=True)

def sanitize_filename(name):
    clean = re.sub(r'[\\/*?:"<>|\r\n\t]', "", name)
    # Remove non-ascii or encode cleanly
    clean = clean.encode('ascii', 'ignore').decode('ascii')
    return clean.strip()[:80]

async def download_all():
    print(f"Target directories:\n  GIFs: {GIFS_DIR}\n  Videos: {VIDEOS_DIR}\n  Images: {IMAGES_DIR}\n")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 1080}
        )
        page = await context.new_page()
        
        print("Navigating to https://www.reddit.com/r/HentaiCensore/ ...")
        await page.goto("https://www.reddit.com/r/HentaiCensore/", wait_until="networkidle", timeout=60000)
        
        previous_count = 0
        scroll_attempts = 0
        max_scroll_attempts = 10
        
        while scroll_attempts < max_scroll_attempts:
            posts = await page.query_selector_all("shreddit-post")
            count = len(posts)
            print(f"Loaded {count} posts...")
            if count == previous_count and count > 0:
                scroll_attempts += 1
            else:
                scroll_attempts = 0
                previous_count = count
            
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await asyncio.sleep(2.5)
        
        posts = await page.query_selector_all("shreddit-post")
        print(f"\nTotal posts discovered: {len(posts)}\nDownloading media...\n")
        
        for idx, post in enumerate(posts, 1):
            title = await post.get_attribute("post-title") or f"post_{idx}"
            permalink = await post.get_attribute("permalink") or ""
            content_href = await post.get_attribute("content-href") or ""
            post_type = await post.get_attribute("post-type") or ""
            
            clean_title = sanitize_filename(f"{idx:03d}_{title}")
            if not clean_title:
                clean_title = f"{idx:03d}_post"
            full_url = f"https://www.reddit.com{permalink}" if permalink.startswith("/") else permalink
            
            print(f"[{idx}/{len(posts)}] Processing: {clean_title} (Type: {post_type})")
            
            downloaded = False
            
            # Check if GIF
            is_gif = (content_href and (".gif" in content_href.lower())) or "preview.redd.it" in content_href and "format=mp4" not in content_href
            
            # If Redgifs / v.redd.it / video link -> Download with yt-dlp to videos
            if post_type in ["video", "crosspost"] or "v.redd.it" in (content_href or "") or "redgifs" in (content_href or "") or "imgur.com" in (content_href or ""):
                target_out = os.path.join(VIDEOS_DIR, f"{clean_title}.%(ext)s")
                cmd = ["yt-dlp", "-q", "--no-warnings", "-o", target_out, full_url]
                try:
                    res = subprocess.run(cmd, capture_output=True, text=True, timeout=90)
                    if res.returncode == 0:
                        print(f"  -> Saved video to videos/")
                        downloaded = True
                except Exception as e:
                    pass
            
            # Try gallery-dl directly on post url if not downloaded yet
            if not downloaded:
                target_folder = GIFS_DIR if is_gif else (VIDEOS_DIR if post_type == "video" else IMAGES_DIR)
                cmd = ["gallery-dl", "-q", "-d", target_folder, full_url]
                try:
                    res = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
                    if res.returncode == 0:
                        print(f"  -> Downloaded via gallery-dl")
                        downloaded = True
                except Exception:
                    pass

            # Fallback direct download
            if not downloaded and content_href and content_href.startswith("http"):
                dest = os.path.join(GIFS_DIR if ".gif" in content_href.lower() else IMAGES_DIR, f"{clean_title}.jpg")
                try:
                    req = urllib.request.Request(content_href, headers={"User-Agent": "Mozilla/5.0"})
                    with urllib.request.urlopen(req, timeout=15) as r, open(dest, 'wb') as f:
                        f.write(r.read())
                    print(f"  -> Direct URL saved")
                    downloaded = True
                except Exception:
                    pass
                    
        await browser.close()
        print("\nAll downloads finished successfully!")

if __name__ == "__main__":
    asyncio.run(download_all())
