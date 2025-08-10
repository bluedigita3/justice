Justice – JSON-Driven Static Site (GitHub Pages Ready)
-----------------------------------------------------

Deploy (GitHub Pages):
1) Create a new public repo on GitHub (e.g., justice).
2) Upload everything in this folder.
3) Repo → Settings → Pages → Source = "Deploy from a branch", Branch = "main", Folder = "/ (root)". Save.
4) After ~1 minute: https://YOUR-USER.github.io/YOUR-REPO/

Update products (no code):
- Edit products.json at the repo root.
- Fields per item:
  {
    "title": "Wireless Earbuds Pro",
    "priceNow": 39,
    "priceWas": 89,
    "image": "assets/img/placeholder-800.jpg",
    "url": "https://www.amazon.com/",
    "badge": "Hot"   // or "Deal" or ""
  }

Tips:
- Replace images in assets/img and point the "image" field to them.
- For affiliate links, paste your full URL into "url".
- You can host images on your repo or use absolute URLs.
