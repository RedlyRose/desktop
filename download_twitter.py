import asyncio
import sys
import os
import re
import urllib.request
import subprocess
from playwright.async_api import async_playwright

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

TARGET_DIR = os.path.join(os.getcwd(), "stuff", "twitter_sfs8editor")
os.makedirs(TARGET_DIR, exist_ok=True)

async def run():
    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 1080}
        )
        page = await context.new_page()
        
        print("Navigating to https://x.com/sfs8editor ...")
        await page.goto("https://x.com/sfs8editor", timeout=60000)
        await asyncio.sleep(5)
        
        # Scroll to load tweets
        for i in range(15):
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await asyncio.sleep(2)
            
        articles = await page.query_selector_all("article")
        print(f"Found {len(articles)} tweet articles rendered.")
        
        links = set()
        # Find all images and videos
        imgs = await page.query_selector_all("img")
        for img in imgs:
            src = await img.get_attribute("src")
            if src and "pbs.twimg.com/media/" in src:
                # Get high res version
                high_res = re.sub(r'name=[a-zA-Z0-9]+', 'name=orig', src)
                links.add(high_res)
                
        # Find videos/status links
        for art in articles:
            anchors = await art.query_selector_all("a")
            for a in anchors:
                href = await a.get_attribute("href")
                if href and "/status/" in href:
                    full = f"https://x.com{href}" if href.startswith("/") else href
                    links.add(full)
                    
        print(f"Total media/status URLs extracted: {len(links)}")
        
        for idx, item in enumerate(links, 1):
            if "pbs.twimg.com" in item:
                # Direct image download
                match = re.search(r'media/([a-zA-Z0-9_-]+)', item)
                name = match.group(1) if match else f"img_{idx}"
                dest = os.path.join(TARGET_DIR, f"{name}.jpg")
                try:
                    urllib.request.urlretrieve(item, dest)
                    print(f"[{idx}/{len(links)}] Downloaded image {name}")
                except Exception as e:
                    print(f"[{idx}/{len(links)}] Error downloading image: {e}")
            elif "/status/" in item:
                # Video / tweet via yt-dlp
                cmd = ["yt-dlp", "-q", "--no-warnings", "-P", TARGET_DIR, "-o", "%(id)s.%(ext)s", item]
                try:
                    res = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
                    if res.returncode == 0:
                        print(f"[{idx}/{len(links)}] Downloaded video/media from {item}")
                except Exception:
                    pass
                    
        await browser.close()
        print("Twitter scraping & download complete!")

if __name__ == "__main__":
    asyncio.run(run())
