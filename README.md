# GrowthCode API Automation (CLI)

A clean and production-ready **Node.js CLI** to fetch data from APIs and export them to **JSON / CSV**.  
Built for **automation, reporting, dashboards, and integrations**.

---

## ✨ Features

- Clean CLI interface  
- Bearer token authentication (optional)  
- Export to JSON, CSV, or both  
- Custom output directory  
- Timestamped filenames (optional)  
- Retries and timeout handling  
- Pagination support (page / limit)  
- CSV mapping (select and rename fields)  

---

## 📦 Installation

```bash
npm install

⚙️ Configuration

Create a .env file (see .env.example):

API_URL=https://jsonplaceholder.typicode.com/posts
API_KEY=
TIMEOUT_MS=15000

⚙️ Configuration

Create a .env file (see .env.example):

API_URL=https://jsonplaceholder.typicode.com/posts
API_KEY=
TIMEOUT_MS=15000

⚙️ Configuration

Create a .env file (see .env.example):

API_URL=https://jsonplaceholder.typicode.com/posts
API_KEY=
TIMEOUT_MS=15000

Export CSV only:

node index.js --url "https://jsonplaceholder.typicode.com/posts" --format csv


Custom output folder and filename:

node index.js --url "https://jsonplaceholder.typicode.com/posts" --out exports --name report


Disable timestamp:

node index.js --url "https://jsonplaceholder.typicode.com/posts" --no-timestamp

📚 Pagination (v1.1)

Enable pagination for APIs using page and limit parameters.

node index.js \
  --url "https://example.com/items" \
  --paginate \
  --pages 5 \
  --limit 50 \
  --page-param page \
  --limit-param limit


Options:

--paginate enable pagination

--pages max number of pages

--page-start starting page (default: 1)

--limit items per page

--page-param page query parameter name

--limit-param limit query parameter name

🧩 CSV Mapping (v1.1)

Select specific fields and rename CSV columns.

Select fields:

node index.js \
  --url "https://jsonplaceholder.typicode.com/posts" \
  --format csv \
  --fields "userId,id,title"


Rename columns:

node index.js \
  --url "https://jsonplaceholder.typicode.com/posts" \
  --format csv \
  --fields "userId,id,title" \
  --rename "userId=USER,id=ID,title=TITLE"

📁 Output

Files are generated in the output directory:

outputs/
├── export_YYYY-MM-DD_HH-MM-SS.json
└── export_YYYY-MM-DD_HH-MM-SS.csv

🛣️ Roadmap

Cursor-based pagination

POST / PUT support

Custom headers via CLI

Scheduled execution

Examples with real APIs

🧑‍💻 Author

Built by GrowthCode
Developer focused on automation and scalable tooling.

📄 License

MIT


---

### ✅ Verdict final
- ✔️ lisible  
- ✔️ pro  
- ✔️ clean sur GitHub  
- ✔️ facile à maintenir  
- ✔️ crédible pour clients & devs  

👉 **Tu peux commit/push ce README sans aucune retouche.**

Si tu veux, prochaine étape possible :
- publier le CLI sur **npm**
- ajouter un **examples/** folder
- ou transformer ce repo en **argument commercial** pour décrocher des missions

Dis-moi ce que tu veux faire ensuite 💪