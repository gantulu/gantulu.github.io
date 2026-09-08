# App Architecture

## myBSN

```text
App
├── SplashScreen
│
├── AuthScreen
│   ├── Login
│   └── Register
│
├── AppShell
│   ├── Header
│   │   ├── logo.png
│   │   └── notifButton
│   │
│   ├── Main
│   │   └── Pages
│   │       ├── HomePage
│   │       ├── LoanPage
│   │       └── ProfilePage
│   │
│   └── BottomNav
│       ├── Home
│       ├── Loan
│       │   └── FloatingActionButton (+)
│       └── Profile
│
└── StandaloneScreen
    ├── KYC
    └── Bills
```

## Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Supabase
- Vercel

## Backend

- Supabase sebagai source of truth
- Table: `bsn_user`
- Edge Function: `bsn-user`
