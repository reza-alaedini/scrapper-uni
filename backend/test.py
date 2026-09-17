from scraper import scrape_divar

print("Starting test...")
results = scrape_divar("karaj", "vehicles")

print(f"\n\nTotal results: {len(results)}")


print(f"\n\nResults: {results}")

for i, ad in enumerate(results, 1):
    print(f"\n{i}. {ad['title']}")
    print(f"   Price: {ad['price_number']:,}")
    print(f"   Link: {ad['link']}")
    print(f"   Image: {ad['image_url'][:60] if ad['image_url'] else 'No image'}")