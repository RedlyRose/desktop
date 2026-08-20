import asyncio
from playwright.async_api import async_playwright
import os
import re
import json

async def test():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
        )
        page = await context.new_page()
        print("Navigating to subreddit...")
        await page.goto("https://www.reddit.com/r/HentaiCensore/", wait_until="networkidle", timeout=60000)
        print("Title:", await page.title())
        posts = await page.query_selector_all("shreddit-post")
        print(f"Found {len(posts)} posts directly!")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(test())
