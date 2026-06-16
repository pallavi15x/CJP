# 🪳 CJP — Cockroach Justice Party Platform

> *"They called us cockroaches. We made it our badge of resilience."*

A full-featured youth civic engagement web platform built with React + TypeScript + Vite. CJP empowers India's youth to share stories, sign petitions, vote on polls, create memes, report issues, and build communities — all in one place.

---

## 🚀 Live Demo

🔗 [https://pallavi15x.github.io/CJP/](https://pallavi15x.github.io/CJP/)

---

## ✨ Features

| Feature | Description |
|---|---|
| 📖 **Story Wall** | Share anonymous or public stories of struggle and triumph |
| ✊ **Petitions** | Create and sign petitions for systemic change |
| 🗳️ **Voice Polls** | Vote on youth issues and manifesto priorities |
| 📜 **Youth Manifesto 2026** | Live crowdsourced manifesto with real-time vote tracking |
| 😂 **Meme Parliament** | Political meme creation and sharing |
| 🗺️ **Issue Map** | Report and upvote local civic issues by district |
| 🏘️ **Communities** | Join or create interest-based groups |
| 🤖 **AI Assistant** | Built-in chatbot for CJP info and guidance |
| 🏆 **Leaderboard** | Reputation-based rankings with badges |
| 🛒 **CJP Store** | Merchandise for movement supporters |
| 📊 **Youth Dashboard** | Personal stats and activity tracker |
| 🔔 **Notifications** | Real-time activity alerts |
| 🌙 **Dark Mode** | Sleek dark-themed UI throughout |

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS v3
- **Charts**: Recharts
- **Icons**: Lucide React
- **State**: React Context API + LocalStorage persistence
- **Auth**: Custom local auth (no backend required)

---

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/pallavi15x/CJP.git
cd cjp

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 🔐 Demo Login

You can log in with these pre-seeded accounts:

| Email | Password | Username |
|---|---|---|
| `lazy@rebel.com` | `password123` | Lazy_Rebel |
| `delhi@fighter.com` | `password123` | DelhiFighter |

Or create a new account via **Sign Up**.

---

## 📁 Project Structure

```
cjp/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Base UI primitives
│   │   ├── Navbar.tsx
│   │   ├── LeftSidebar.tsx
│   │   └── RightSidebar.tsx
│   ├── contexts/           # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── DataContext.tsx
│   │   ├── CartContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── ToastContext.tsx
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page-level components (20+ pages)
│   ├── App.tsx             # Root component with routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles + Tailwind
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 🌐 Deployment

This project is deployed on **GitHub Pages** using the `gh-pages` branch.

To deploy manually:

```bash
npm run build
npx gh-pages -d dist
```

---

## 🙌 Contributing

Pull requests are welcome! For major changes, please open an issue first.

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add YourFeature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a Pull Request

---

## 📄 License

MIT License © 2026 Pallavi — CJP Platform

---

<p align="center">Made with ❤️ for India's Youth Movement 🪳</p>
