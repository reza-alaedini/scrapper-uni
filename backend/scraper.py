import re
from playwright.sync_api import sync_playwright
import time

def fa_to_en(text):
    fa_digits = '۰۱۲۳۴۵۶۷۸۹'
    en_digits = '0123456789'
    return text.translate(str.maketrans(fa_digits, en_digits))

def extract_price_number(ad_element):
    price_elements = ad_element.query_selector_all(".kt-post-card__description")
    
    if not price_elements or len(price_elements) == 0:
        return None, None
    
    prices_found = []
    
    for price_el in price_elements:
        raw_text = price_el.inner_text().strip()
        
        if "تومان" in raw_text:
            clean_text = fa_to_en(raw_text)
            digits_only = re.sub(r'[^\d]', '', clean_text)
            
            if digits_only:
                price_num = int(digits_only)
                prices_found.append((raw_text, price_num))
    
    if not prices_found:
        return None, None
    return max(prices_found, key=lambda x: x[1])

def scrape_divar(city: str, category: str, limit: int = 20, min_price: int = None, max_price: int = None, debug_mode: bool = False):
   
    price_param = f"?price={min_price if min_price else ''}-{max_price if max_price else ''}"
    url = f"https://divar.ir/s/{city}/{category}{price_param}"
    
    print(f"\n[DEBUG] Connecting to: {url}", flush=True)
    ads = []

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True, 
            args=[
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-blink-features=AutomationControlled'
            ]
        )
        
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={'width': 1920, 'height': 1080},
            locale='fa-IR'
        )
        
        page = context.new_page()
        
        try:
            print("[DEBUG] Loading page...", flush=True)
            
            try:
                response = page.goto(url, timeout=60000, wait_until='networkidle')
                print(f"[DEBUG] Response status: {response.status}", flush=True)
            except Exception as network_error:
                print("[DEBUG] networkidle failed, trying with domcontentloaded...", flush=True)
                response = page.goto(url, timeout=60000, wait_until='domcontentloaded')
                print(f"[DEBUG] Response status: {response.status}", flush=True)
            
            print("[DEBUG] Waiting for content...", flush=True)
            time.sleep(5) 
            
            if debug_mode:
                html_content = page.content()
                with open("debug_page.html", "w", encoding="utf-8") as f:
                    f.write(html_content)
                print("[DEBUG] HTML saved to debug_page.html", flush=True)
            
            print("[DEBUG] Checking for articles...", flush=True)
            
            max_retries = 3
            articles = []
            for attempt in range(max_retries):
                try:
                    page.wait_for_selector("article.kt-post-card", timeout=20000)
                    articles = page.query_selector_all("article.kt-post-card")
                    if len(articles) > 0:
                        break
                    print(f"[DEBUG] Attempt {attempt + 1}: No articles found, waiting...", flush=True)
                    time.sleep(2)
                except Exception as e:
                    if attempt < max_retries - 1:
                        print(f"[DEBUG] Attempt {attempt + 1} failed, retrying...", flush=True)
                        time.sleep(2)
                    else:
                        raise
            
            print(f"[DEBUG] Found {len(articles)} articles", flush=True)
            
            page.screenshot(path="debug_screenshot.png")
            print("[DEBUG] Screenshot saved as debug_screenshot.png", flush=True)
            
            for idx, ad in enumerate(articles):
                if len(ads) >= limit: break
                
                print(f"[DEBUG] Processing article {idx + 1}...", flush=True)
                
                if debug_mode:
                    try:
                        ad.screenshot(path=f"debug_ad_{idx}.png")
                    except:
                        pass
                
                price_text, price_number = extract_price_number(ad)
                
                if price_number is None:
                    print(f"[DEBUG] Article {idx + 1}: No valid price, skipping", flush=True)
                    continue

                title_el = ad.query_selector(".kt-post-card__title")
                title = title_el.inner_text() if title_el else "بدون عنوان"
                
                link_el = ad.query_selector("a.kt-post-card__action")
                link = "https://divar.ir" + link_el.get_attribute("href") if link_el else ""

                img_el = ad.query_selector(".kt-image-block__image")
                image_url = img_el.get_attribute("src") if img_el else ""

                print(f"[FOUND] {title} -> {price_number} Toman", flush=True)

                ads.append({
                    "title": title,
                    "price_number": price_number,
                    "link": link,
                    "image_url": image_url
                })
                
        except Exception as e:
            print(f"[ERROR] {e}", flush=True)
            import traceback
            traceback.print_exc()
            
            try:
                page.screenshot(path="error_screenshot.png")
                print("[DEBUG] Error screenshot saved", flush=True)
            except:
                pass
                
        finally:
            browser.close()
            
    print(f"[DEBUG] Total ads collected: {len(ads)}", flush=True)
    return ads