# 🚀 Space Voyager Hub

Explore the universe with real-time space data from NASA!  
This app uses NASA's Open APIs to showcase astronomy pictures, Mars rover photos, Earth imagery, and near-Earth asteroid data — all wrapped in a sleek, responsive interface.

---

## 🌌 Features

- 🔭 **Astronomy Picture of the Day (APOD)**  
- 🤖 **Mars Rover Photo Gallery**  
- 🌍 **Earth Polychromatic Imaging (EPIC)**  
- ☄️ **Near-Earth Objects Tracker (NEO)**  
- 📊 Clean data visualizations & responsive UI  
- ⚡ Powered by NASA Open APIs  
- 🎨 Built with Shadcn UI + Tailwind CSS  
- 🧠 Fast, optimized React + TypeScript + Vite stack

---

## 🛠 Tech Stack

| Layer     | Stack                       |
|-----------|-----------------------------|
| Frontend  | React, Vite, TypeScript     |
| UI        | Tailwind CSS, shadcn/ui     |
| APIs      | [NASA Open APIs](https://api.nasa.gov/) |

---

## 💻 How to Run Locally

> Requires **Node.js** and **npm**. You can install via [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### 1. Clone the repo

```bash
git clone https://github.com/lavuchandu169/Nasa-open-data-api-personal.git
cd Nasa-open-data-api-personal

npm install

npm run dev

project structure:

.
├── src/
│   ├── components/           # UI + Data Sections
│   ├── pages/                # Index.tsx, NotFound.tsx
│   ├── hooks/                # Custom Hooks
│   ├── lib/                  # Utilities
│   └── main.tsx              # Entry Point
├── public/                   # Static Assets
├── index.html
├── vite.config.ts
├── tailwind.config.ts
└── README.md

