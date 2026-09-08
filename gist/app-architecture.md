App
├── SplashScreen
│   └── AuthScreen / AppShell
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
│       ├── Loan (+) FAB
│       └── Profile
│
├── StandaloneScreen
│   ├── kycPage
│   └── BillsPage
│
├── MobileOverlay
│   ├── Modal
│   ├── BottomSheet
│   ├── Dropdown
│   ├── Popover
│   ├── Toast
│   ├── Alert
│   ├── Confirmation
│   ├── ActionSheet
│   └── Tooltip
│
└── Supabase
    ├── supabaseUrl
    ├── supabaseAnonKey
    │
    ├── EdgeFunction
    │   └── bsn-user
    │
    └── Database
        │
        └── public.bsn_user
            │
            ├── phone                ← Primary Key
            ├── password
            ├── role                 ← default: customer
            ├── status               ← default: active
            │
            ├── personal             ← JSONB
            │   ├── full_name
            │   ├── email
            │   ├── gender
            │   ├── date_of_birth
            │   ├── nationality
            │   └── address
            │
            ├── balance              ← JSONB
            │   ├── available
            │   ├── pending
            │   └── currency
            │
            ├── loan                 ← JSONB
            │   ├── id
            │   ├── amount
            │   ├── applied_amount
            │   ├── approved_amount
            │   ├── approved
            │   ├── status
            │   ├── interest
            │   ├── tenure
            │   ├── tenure_months
            │   ├── monthly_payment
            │   └── monthly_installment
            │
            ├── kyc                  ← JSONB
            │   ├── status
            │   ├── id_type
            │   ├── full_name
            │   ├── nationality
            │   ├── verified_at
            │   ├── id_image_url
            │   ├── mykad_number
            │   ├── date_of_birth
            │   ├── face_image_url
            │   └── selfie_image_url
            │
            ├── bank                 ← JSONB
            │   ├── bank_code
            │   ├── bank_name
            │   ├── account_name
            │   └── account_number
            │
            ├── bills                ← JSONB Array
            │   └── Bill
            │       ├── id
            │       ├── name
            │       ├── amount
            │       ├── fee
            │       ├── bill_is_active
            │       ├── method_qr
            │       ├── method_qr_url
            │       ├── method_bank
            │       ├── method_bank_name
            │       └── method_bank_number
            │
            ├── created_at
            └── updated_at
