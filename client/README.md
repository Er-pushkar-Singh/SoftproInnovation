# SoftproInnovation — Electronics Store Frontend

## Project Structure

```
src/
├── App.jsx                   ← Root component (theme + routing)
├── styles/
│   └── theme.css             ← ALL CSS (dark/light themes, animations, components)
├── components/
│   ├── Navbar.jsx            ← Sticky navbar with theme toggle
│   └── Footer.jsx            ← Full footer with social links
└── pages/
    ├── Home.jsx              ← Hero slider, categories, products, testimonials, newsletter
    ├── About.jsx             ← Mission, values, timeline, team
    ├── Products.jsx          ← Filter bar, search, sortable product grid
    ├── Contact.jsx           ← Info cards + contact form
    ├── Login.jsx             ← Clean auth form
    └── Register.jsx          ← Registration form (4 fields, 2-column layout)
```

## Dependencies

```bash
npm install react-router-dom axios bootstrap
```

## Setup

1. Copy all files into your `src/` folder maintaining the structure above.

2. In your `main.jsx` (or `index.jsx`), import Bootstrap CSS **before** your app:
   ```jsx
   import 'bootstrap/dist/css/bootstrap.min.css'
   import 'bootstrap/dist/js/bootstrap.bundle.min.js'
   import React from 'react'
   import ReactDOM from 'react-dom/client'
   import App from './App'

   ReactDOM.createRoot(document.getElementById('root')).render(<App />)
   ```

3. Run:
   ```bash
   npm run dev
   ```

## Features

- **Dark / Light Theme** — toggle in the navbar; preference is saved to localStorage.
- **Responsive** — mobile-first grid using Bootstrap 5; navbar collapses on small screens.
- **Animated hero slider** — Bootstrap Carousel with custom CSS captions and Ken Burns effect.
- **Scroll-triggered animations** — IntersectionObserver drives `.fade-up` entrance animations.
- **Product filter + search + sort** — client-side, no backend needed.
- **Auth pages** — Login and Register connect to `http://localhost:5000/api/user/` (your existing backend).

## Theme Customisation

All colours, fonts and radii live in `styles/theme.css` under `[data-theme="light"]` and `[data-theme="dark"]` blocks. Change `--accent` to retheme the entire site instantly.