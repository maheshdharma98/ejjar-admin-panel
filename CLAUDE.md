# EJJAR Admin Panel
Type: Web application (browser)
Stack: React 18 + TypeScript, Vite, TailwindCSS v3,
shadcn/ui, React Router v6, Zustand, Recharts,
i18next + react-i18next
Primary: #1A4FBA | Sidebar: #0F172A
Mock data: ../../shared/mock/
Admin sees ALL data — no masking
Roles: Super Admin / Moderator / Viewer
Language: EN/AR same as supplier portal
localStorage: ejjar_admin_lang
Pages: /login /dashboard /rfqs /suppliers
/contractors /taxonomy /notifications

Setup (same as supplier portal):
1. npm create vite@latest . -- --template react-ts
2. npm install tailwindcss postcss autoprefixer
   react-router-dom zustand recharts axios
   lucide-react date-fns i18next react-i18next
3. npx tailwindcss init -p
4. npx shadcn@latest init (same config)
5. npx shadcn@latest add button card input label
   select table badge tabs dialog sheet skeleton
   toast separator avatar progress dropdown-menu accordion
6. Cairo font in index.html
7. Same folder structure as supplier portal
8. i18n same setup
9. LanguageSwitcher same component
10. Dark sidebar #0F172A with lucide icons:
    LayoutDashboard → /dashboard
    FileText → /rfqs
    Building2 → /suppliers
    Users → /contractors
    Tags → /taxonomy
    Bell → /notifications
11. Navbar: LanguageSwitcher + admin name + logout
12. Layout: sidebar + navbar + main content
13. App.tsx: all routes

Reply: SETUP DONE
