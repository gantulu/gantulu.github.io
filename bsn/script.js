const API_URL =
  "https://oszqantvugvbvydlizix.supabase.co/functions/v1/bsn-admin";

const state = {
  users: [],
  mode: null,
  selectedUser: null,
  toastTimer: null
};


// ============================================================
// FORM DEFAULT
// ============================================================

const formDefaults = {
  phone: "",
  password: "",
  role: "customer",
  status: "active",

  personal: {
    full_name: "",
    email: "",
    gender: "",
    date_of_birth: "",
    nationality: "",

    address: {
      address_line: "",
      city: "",
      state: "",
      postcode: "",
      country: ""
    }
  },

  balance: {
    available: null,
    pending: null,
    currency: ""
  },

  kyc: {
    status: "",
    id_type: "",
    mykad_number: "",
    full_name: "",
    date_of_birth: "",
    nationality: "",
    id_image_url: "",
    face_image_url: "",
    selfie_image_url: "",
    verified_at: ""
  },

  bank: {
    bank_code: "",
    bank_name: "",
    account_name: "",
    account_number: ""
  },

  loan: {
    id: "",
    amount: null,
    status: "",
    tenure: null,
    approved: false,
    interest: null,
    monthly_payment: null
  },

  bills: [],

  created_at: "",
  updated_at: ""
};


// ============================================================
// FIELD DEFINITIONS
// ============================================================

const fieldDefinitions = {
  basic: [
    {
      path: "phone",
      label: "Phone",
      type: "tel",
      required: true
    },
    {
      path: "password",
      label: "Password",
      type: "password"
    },
    {
      path: "role",
      label: "Role",
      type: "select",
      options: ["customer", "admin"]
    },
    {
      path: "status",
      label: "Status",
      type: "select",
      options: ["active", "inactive"]
    }
  ],

  personal: [
    {
      path: "personal.full_name",
      label: "Full Name",
      type: "text"
    },
    {
      path: "personal.email",
      label: "Email",
      type: "email"
    },
    {
      path: "personal.gender",
      label: "Gender",
      type: "select",
      options: ["male", "female"]
    },
    {
      path: "personal.date_of_birth",
      label: "Date of Birth",
      type: "date"
    },
    {
      path: "personal.nationality",
      label: "Nationality",
      type: "text"
    }
  ],

  address: [
    {
      path: "personal.address.address_line",
      label: "Address Line",
      type: "text"
    },
    {
      path: "personal.address.city",
      label: "City",
      type: "text"
    },
    {
      path: "personal.address.state",
      label: "State",
      type: "text"
    },
    {
      path: "personal.address.postcode",
      label: "Postcode",
      type: "text"
    },
    {
      path: "personal.address.country",
      label: "Country",
      type: "text"
    }
  ],

  balance: [
    {
      path: "balance.available",
      label: "Available",
      type: "number"
    },
    {
      path: "balance.pending",
      label: "Pending",
      type: "number"
    },
    {
      path: "balance.currency",
      label: "Currency",
      type: "text"
    }
  ],

  kyc: [
    {
      path: "kyc.status",
      label: "Status",
      type: "select",
      options: ["pending", "verified", "rejected"]
    },
    {
      path: "kyc.id_type",
      label: "ID Type",
      type: "text"
    },
    {
      path: "kyc.mykad_number",
      label: "MyKad Number",
      type: "text"
    },
    {
      path: "kyc.full_name",
      label: "Full Name",
      type: "text"
    },
    {
      path: "kyc.date_of_birth",
      label: "Date of Birth",
      type: "date"
    },
    {
      path: "kyc.nationality",
      label: "Nationality",
      type: "text"
    },
    {
      path: "kyc.id_image_url",
      label: "ID Image URL",
      type: "url"
    },
    {
      path: "kyc.face_image_url",
      label: "Face Image URL",
      type: "url"
    },
    {
      path: "kyc.selfie_image_url",
      label: "Selfie Image URL",
      type: "url"
    },
    {
      path: "kyc.verified_at",
      label: "Verified At",
      type: "datetime-local"
    }
  ],

  bank: [
    {
      path: "bank.bank_code",
      label: "Bank Code",
      type: "text"
    },
    {
      path: "bank.bank_name",
      label: "Bank Name",
      type: "text"
    },
    {
      path: "bank.account_name",
      label: "Account Name",
      type: "text"
    },
    {
      path: "bank.account_number",
      label: "Account Number",
      type: "text"
    }
  ],

  loan: [
    {
      path: "loan.id",
      label: "Loan ID",
      type: "text"
    },
    {
      path: "loan.amount",
      label: "Amount",
      type: "number"
    },
    {
      path: "loan.status",
      label: "Status",
      type: "select",
      options: ["pending", "approved", "rejected"]
    },
    {
      path: "loan.tenure",
      label: "Tenure",
      type: "number"
    },
    {
      path: "loan.approved",
      label: "Approved",
      type: "checkbox"
    },
    {
      path: "loan.interest",
      label: "Interest",
      type: "number"
    },
    {
      path: "loan.monthly_payment",
      label: "Monthly Payment",
      type: "number"
    }
  ]
};


const billFields = [
  {
    key: "id",
    label: "Bill ID",
    type: "text"
  },
  {
    key: "fee",
    label: "Fee",
    type: "number"
  },
  {
    key: "name",
    label: "Name",
    type: "text"
  },
  {
    key: "amount",
    label: "Amount",
    type: "number"
  },
  {
    key: "method_qr",
    label: "Method QR",
    type: "checkbox"
  },
  {
    key: "method_bank",
    label: "Method Bank",
    type: "checkbox"
  },
  {
    key: "method_qr_url",
    label: "QR URL",
    type: "url"
  },
  {
    key: "bill_is_active",
    label: "Bill Active",
    type: "checkbox"
  },
  {
    key: "method_bank_name",
    label: "Bank Name",
    type: "text"
  },
  {
    key: "method_bank_number",
    label: "Bank Number",
    type: "text"
  }
];


// ============================================================
// UTILITY
// ============================================================

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}


function escapeHtml(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function safeText(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return escapeHtml(value);
}


function getPath(object, path) {
  return path.split(".").reduce((current, key) => {
    if (current === null || current === undefined) {
      return undefined;
    }

    return current[key];
  }, object);
}


function setPath(object, path, value) {
  const keys = path.split(".");
  let current = object;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value;
      return;
    }

    if (
      current[key] === null ||
      current[key] === undefined ||
      typeof current[key] !== "object"
    ) {
      current[key] = {};
    }

    current = current[key];
  });
}


function mergeObject(base, source) {
  if (
    source === null ||
    source === undefined ||
    typeof source !== "object" ||
    Array.isArray(source)
  ) {
    return source;
  }

  const result =
    base && typeof base === "object" && !Array.isArray(base)
      ? deepClone(base)
      : {};

  Object.keys(source).forEach((key) => {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      result[key] = mergeObject(result[key], source[key]);
    } else {
      result[key] = source[key];
    }
  });

  return result;
}


function normalizeUser(user) {
  return mergeObject(formDefaults, user || {});
}


function isoToDatetimeLocal(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (number) => String(number).padStart(2, "0");

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  );
}


function datetimeLocalToIso(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString();
}


function displayDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return safeText(value);
  }

  return date.toLocaleString();
}


function displayMoney(value, currency = "MYR") {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return safeText(value);
  }

  return `${currency || "MYR"} ${number.toLocaleString()}`;
}


// ============================================================
// API CLIENT
// ============================================================

async function apiRequest(method, options = {}) {
  const {
    phone = null,
    body = undefined
  } = options;

  let url = API_URL;

  if (phone) {
    url += `?phone=${encodeURIComponent(phone)}`;
  }

  const requestOptions = {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  };

  if (body !== undefined) {
    requestOptions.body = JSON.stringify(body);
  }

  let response;

  try {
    response = await fetch(url, requestOptions);
  } catch (error) {
    throw new Error(
      "Network error. Please check your internet connection."
    );
  }

  let result = null;

  try {
    result = await response.json();
  } catch {
    if (!response.ok) {
      throw new Error(
        `Request failed with HTTP ${response.status}.`
      );
    }

    throw new Error("Invalid JSON response from API.");
  }

  if (!response.ok) {
    const message =
      result?.message ||
      result?.error ||
      `Request failed with HTTP ${response.status}.`;

    throw new Error(message);
  }

  return result;
}


// ============================================================
// LOAD USERS
// ============================================================

async function loadUsers() {
  setLoading(true);
  hideError();

  try {
    const result = await apiRequest("GET");

    const data = Array.isArray(result?.data)
      ? result.data
      : [];

    state.users = data.map(normalizeUser);

    renderList();
  } catch (error) {
    state.users = [];
    renderList();

    showError(error.message);
  } finally {
    setLoading(false);
  }
}


// ============================================================
// RENDER LIST
// ============================================================

function renderList() {
  const list = document.getElementById("user-list");
  const empty = document.getElementById("empty-state");

  document.getElementById("user-count").textContent =
    `${state.users.length} ${state.users.length === 1 ? "user" : "users"}`;

  list.innerHTML = "";

  if (!state.users.length) {
    empty.classList.remove("hidden");
    return;
  }

  empty.classList.add("hidden");

  state.users.forEach((user) => {
    const card = document.createElement("div");

    card.className =
      "rounded-xl border border-slate-200 bg-white p-4 shadow-sm";

    const fullName =
      user.personal?.full_name || "Unnamed User";

    const email =
      user.personal?.email || "";

    const available =
      user.balance?.available;

    const currency =
      user.balance?.currency || "MYR";

    const kycStatus =
      user.kyc?.status || "";

    const loanStatus =
      user.loan?.status || "";

    card.innerHTML = `
      <div class="flex items-start justify-between gap-3">

        <div class="min-w-0">
          <h3 class="truncate font-semibold">
            ${safeText(fullName)}
          </h3>

          <p class="mt-1 text-sm text-slate-500">
            ${safeText(user.phone)}
          </p>

          <p class="truncate text-sm text-slate-500">
            ${safeText(email)}
          </p>
        </div>

        <span
          class="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700"
        >
          ${safeText(user.status)}
        </span>

      </div>


      <div class="mt-4 grid grid-cols-2 gap-2">

        <div class="rounded-lg bg-slate-50 p-3">
          <p class="text-[11px] uppercase tracking-wide text-slate-400">
            Role
          </p>

          <p class="mt-1 text-sm font-medium">
            ${safeText(user.role)}
          </p>
        </div>


        <div class="rounded-lg bg-slate-50 p-3">
          <p class="text-[11px] uppercase tracking-wide text-slate-400">
            Balance
          </p>

          <p class="mt-1 text-sm font-medium">
            ${displayMoney(available, currency)}
          </p>
        </div>


        <div class="rounded-lg bg-slate-50 p-3">
          <p class="text-[11px] uppercase tracking-wide text-slate-400">
            KYC
          </p>

          <p class="mt-1 text-sm font-medium">
            ${safeText(kycStatus)}
          </p>
        </div>


        <div class="rounded-lg bg-slate-50 p-3">
          <p class="text-[11px] uppercase tracking-wide text-slate-400">
            Loan
          </p>

          <p class="mt-1 text-sm font-medium">
            ${safeText(loanStatus)}
          </p>
        </div>

      </div>


      <div class="mt-4 flex gap-2">

        <button
          type="button"
          data-action="view"
          data-phone="${escapeHtml(user.phone)}"
          class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          View
        </button>

        <button
          type="button"
          data-action="edit"
          data-phone="${escapeHtml(user.phone)}"
          class="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
        >
          Edit
        </button>

        <button
          type="button"
          data-action="delete"
          data-phone="${escapeHtml(user.phone)}"
          class="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          Delete
        </button>

      </div>
    `;

    list.appendChild(card);
  });
}


// ============================================================
// MODAL
// ============================================================

function openModal(title, content) {
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalContent = document.getElementById("modal-content");

  modalTitle.textContent = title;
  modalContent.innerHTML = content;

  modal.classList.remove("hidden");

  document.body.classList.add("overflow-hidden");
}


function closeModal() {
  document.getElementById("modal").classList.add("hidden");

  document.getElementById("modal-content").innerHTML = "";

  document.body.classList.remove("overflow-hidden");

  state.mode = null;
  state.selectedUser = null;
}


// ============================================================
// FORM FIELD RENDERER
// ============================================================

function renderInput(field, value, disabled = false) {
  const id = `field-${field.path.replace(/\./g, "-")}`;

  let normalizedValue = value;

  if (field.type === "datetime-local") {
    normalizedValue = isoToDatetimeLocal(value);
  }

  if (
    normalizedValue === null ||
    normalizedValue === undefined
  ) {
    normalizedValue = "";
  }

  if (field.type === "checkbox") {
    return `
      <label class="flex items-center gap-3 rounded-lg border border-slate-200 p-3">

        <input
          id="${id}"
          data-path="${escapeHtml(field.path)}"
          type="checkbox"
          ${value === true ? "checked" : ""}
          ${disabled ? "disabled" : ""}
          class="h-4 w-4 rounded border-slate-300"
        >

        <span class="text-sm font-medium">
          ${safeText(field.label)}
        </span>

      </label>
    `;
  }


  if (field.type === "select") {
    return `
      <div>

        <label
          for="${id}"
          class="mb-1.5 block text-sm font-medium text-slate-700"
        >
          ${safeText(field.label)}
        </label>

        <select
          id="${id}"
          data-path="${escapeHtml(field.path)}"
          ${disabled ? "disabled" : ""}
          class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
        >

          <option value="">
            Select ${safeText(field.label)}
          </option>

          ${field.options
            .map(
              (option) => `
                <option
                  value="${escapeHtml(option)}"
                  ${String(normalizedValue) === String(option) ? "selected" : ""}
                >
                  ${escapeHtml(option)}
                </option>
              `
            )
            .join("")}

        </select>

      </div>
    `;
  }


  return `
    <div>

      <label
        for="${id}"
        class="mb-1.5 block text-sm font-medium text-slate-700"
      >
        ${safeText(field.label)}
      </label>

      <input
        id="${id}"
        data-path="${escapeHtml(field.path)}"
        type="${escapeHtml(field.type)}"
        value="${escapeHtml(normalizedValue)}"
        ${disabled ? "disabled" : ""}
        ${field.required ? "required" : ""}
        class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
      >

    </div>
  `;
}


function renderSection(title, fields, user, disabled = false) {
  return `
    <section class="rounded-xl border border-slate-200 p-4">

      <h3 class="mb-4 text-sm font-bold">
        ${safeText(title)}
      </h3>

      <div class="space-y-4">

        ${fields
          .map((field) => {
            const value = getPath(user, field.path);

            return renderInput(
              field,
              value,
              disabled
            );
          })
          .join("")}

      </div>

    </section>
  `;
}


// ============================================================
// BILLS FORM
// ============================================================

function renderBills(bills, disabled = false) {
  const container = document.getElementById("bills-container");

  if (!container) {
    return;
  }

  const items = Array.isArray(bills)
    ? bills
    : [];

  if (!items.length) {
    container.innerHTML = `
      <div class="rounded-lg border border-dashed border-slate-300 p-4 text-center">
        <p class="text-sm text-slate-500">
          No bills
        </p>
      </div>
    `;

    return;
  }

  container.innerHTML = items
    .map(
      (bill, index) => `
        <div
          class="rounded-xl border border-slate-200 p-4"
          data-bill-index="${index}"
        >

          <div class="mb-4 flex items-center justify-between">

            <h4 class="text-sm font-semibold">
              Bill ${index + 1}
            </h4>

            ${
              disabled
                ? ""
                : `
                  <button
                    type="button"
                    data-action="remove-bill"
                    data-index="${index}"
                    class="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                `
            }

          </div>


          <div class="space-y-4">

            ${billFields
              .map((field) => {
                const value = bill[field.key];

                if (field.type === "checkbox") {
                  return `
                    <label class="flex items-center gap-3 rounded-lg border border-slate-200 p-3">

                      <input
                        type="checkbox"
                        data-bill-index="${index}"
                        data-bill-key="${escapeHtml(field.key)}"
                        ${value === true ? "checked" : ""}
                        ${disabled ? "disabled" : ""}
                        class="h-4 w-4 rounded border-slate-300"
                      >

                      <span class="text-sm font-medium">
                        ${safeText(field.label)}
                      </span>

                    </label>
                  `;
                }

                return `
                  <div>

                    <label class="mb-1.5 block text-sm font-medium text-slate-700">
                      ${safeText(field.label)}
                    </label>

                    <input
                      type="${escapeHtml(field.type)}"
                      data-bill-index="${index}"
                      data-bill-key="${escapeHtml(field.key)}"
                      value="${escapeHtml(value ?? "")}" 
                      ${disabled ? "disabled" : ""}
                      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
                    >

                  </div>
                `;
              })
              .join("")}

          </div>

        </div>
      `
    )
    .join("");
}


// ============================================================
// FORM
// ============================================================

function renderForm(user, mode) {
  const isView = mode === "view";
  const isEdit = mode === "edit";

  const normalizedUser = normalizeUser(user);

  const metadata = `
    <section class="rounded-xl border border-slate-200 p-4">

      <h3 class="mb-4 text-sm font-bold">
        Metadata
      </h3>

      <div class="space-y-4">

        <div>
          <p class="mb-1 text-sm font-medium text-slate-700">
            Created At
          </p>

          <div class="rounded-lg bg-slate-50 px-3 py-2.5 text-sm">
            ${displayDate(normalizedUser.created_at)}
          </div>
        </div>


        <div>
          <p class="mb-1 text-sm font-medium text-slate-700">
            Updated At
          </p>

          <div class="rounded-lg bg-slate-50 px-3 py-2.5 text-sm">
            ${displayDate(normalizedUser.updated_at)}
          </div>
        </div>

      </div>

    </section>
  `;


  if (isView) {
    return `
      <div class="space-y-4">

        ${renderSection(
          "Basic",
          fieldDefinitions.basic.filter(
            (field) => field.path !== "password"
          ),
          normalizedUser,
          true
        )}

        ${renderSection(
          "Personal",
          fieldDefinitions.personal,
          normalizedUser,
          true
        )}

        ${renderSection(
          "Address",
          fieldDefinitions.address,
          normalizedUser,
          true
        )}

        ${renderSection(
          "Balance",
          fieldDefinitions.balance,
          normalizedUser,
          true
        )}

        ${renderSection(
          "KYC",
          fieldDefinitions.kyc,
          normalizedUser,
          true
        )}

        ${renderSection(
          "Bank",
          fieldDefinitions.bank,
          normalizedUser,
          true
        )}

        ${renderSection(
          "Loan",
          fieldDefinitions.loan,
          normalizedUser,
          true
        )}

        <section class="rounded-xl border border-slate-200 p-4">

          <h3 class="mb-4 text-sm font-bold">
            Bills
          </h3>

          <div
            id="bills-container"
            class="space-y-3"
          ></div>

        </section>

        ${metadata}

      </div>
    `;
  }


  return `
    <form
      id="user-form"
      class="space-y-4"
      novalidate
    >

      ${renderSection(
        "Basic",
        fieldDefinitions.basic,
        normalizedUser
      )}

      ${renderSection(
        "Personal",
        fieldDefinitions.personal,
        normalizedUser
      )}

      ${renderSection(
        "Address",
        fieldDefinitions.address,
        normalizedUser
      )}

      ${renderSection(
        "Balance",
        fieldDefinitions.balance,
        normalizedUser
      )}

      ${renderSection(
        "KYC",
        fieldDefinitions.kyc,
        normalizedUser
      )}

      ${renderSection(
        "Bank",
        fieldDefinitions.bank,
        normalizedUser
      )}

      ${renderSection(
        "Loan",
        fieldDefinitions.loan,
        normalizedUser
      )}


      <section class="rounded-xl border border-slate-200 p-4">

        <div class="mb-4 flex items-center justify-between">

          <h3 class="text-sm font-bold">
            Bills
          </h3>

          <button
            type="button"
            id="add-bill-btn"
            class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50"
          >
            Add Bill
          </button>

        </div>

        <div
          id="bills-container"
          class="space-y-3"
        ></div>

      </section>


      ${metadata}


      <div class="sticky bottom-0 -mx-4 mt-2 border-t border-slate-200 bg-white p-4">

        <div class="flex gap-2">

          <button
            type="button"
            id="cancel-form-btn"
            class="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-semibold"
          >
            Cancel
          </button>

          <button
            type="submit"
            id="save-form-btn"
            class="flex-1 rounded-lg bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white"
          >
            ${isEdit ? "Save Changes" : "Create User"}
          </button>

        </div>

        ${
          isEdit
            ? `
              <button
                type="button"
                id="patch-form-btn"
                class="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-semibold"
              >
                Save with PATCH
              </button>
            `
            : ""
        }

      </div>

    </form>
  `;
}


// ============================================================
// COLLECT FORM
// ============================================================

function convertInputValue(element, field) {
  if (field.type === "checkbox") {
    return element.checked;
  }

  if (field.type === "number") {
    if (element.value === "") {
      return null;
    }

    const number = Number(element.value);

    return Number.isNaN(number)
      ? null
      : number;
  }

  if (field.type === "datetime-local") {
    return datetimeLocalToIso(element.value);
  }

  return element.value;
}


function collectForm() {
  const form = document.getElementById("user-form");

  if (!form) {
    return null;
  }

  const result = deepClone(
    state.selectedUser || formDefaults
  );

  fieldDefinitions.basic.forEach((field) => {
    const element = form.querySelector(
      `[data-path="${CSS.escape(field.path)}"]`
    );

    if (!element) {
      return;
    }

    /*
     * During edit, an empty password means:
     * keep the existing password unchanged.
     */
    if (
      field.path === "password" &&
      state.mode === "edit" &&
      element.value === ""
    ) {
      return;
    }

    setPath(
      result,
      field.path,
      convertInputValue(element, field)
    );
  });


  [
    ...fieldDefinitions.personal,
    ...fieldDefinitions.address,
    ...fieldDefinitions.balance,
    ...fieldDefinitions.kyc,
    ...fieldDefinitions.bank,
    ...fieldDefinitions.loan
  ].forEach((field) => {
    const element = form.querySelector(
      `[data-path="${CSS.escape(field.path)}"]`
    );

    if (!element) {
      return;
    }

    setPath(
      result,
      field.path,
      convertInputValue(element, field)
    );
  });


  result.bills = collectBills();

  return result;
}


function collectBills() {
  const container = document.getElementById("bills-container");

  if (!container) {
    return [];
  }

  const billElements = [
    ...container.querySelectorAll("[data-bill-index]")
  ];

  const bills = [];

  billElements.forEach((element) => {
    const index = Number(
      element.dataset.billIndex
    );

    if (Number.isNaN(index)) {
      return;
    }

    if (!bills[index]) {
      bills[index] = {};
    }

    const key = element.dataset.billKey;

    if (!key) {
      return;
    }

    if (element.type === "checkbox") {
      bills[index][key] = element.checked;
      return;
    }

    if (element.type === "number") {
      bills[index][key] =
        element.value === ""
          ? null
          : Number(element.value);

      return;
    }

    bills[index][key] = element.value;
  });

  return bills.filter(Boolean);
}


// ============================================================
// API PAYLOAD
// ============================================================

function buildCreatePayload(user) {
  const payload = deepClone(user);

  return payload;
}


function buildUpdatePayload(user) {
  const payload = deepClone(user);

  /*
   * Phone is the immutable primary key and is sent
   * through ?phone=PHONE, not as an update field.
   */
  delete payload.phone;

  /*
   * created_at is not accepted by the update cleaner.
   */
  delete payload.created_at;

  /*
   * Empty password during edit means no password update.
   */
  if (!payload.password) {
    delete payload.password;
  }

  return payload;
}


function diffTopLevel(originalUser, currentPayload) {
  const changed = {};

  const updateKeys = [
    "balance",
    "personal",
    "loan",
    "kyc",
    "bank",
    "password",
    "role",
    "status",
    "bills",
    "updated_at"
  ];

  updateKeys.forEach((key) => {
    const originalValue = originalUser?.[key];
    const currentValue = currentPayload?.[key];

    if (
      JSON.stringify(originalValue) !==
      JSON.stringify(currentValue)
    ) {
      changed[key] = currentValue;
    }
  });

  return changed;
}


// ============================================================
// CREATE
// ============================================================

async function createUser() {
  const form = document.getElementById("user-form");

  if (!form.reportValidity()) {
    return;
  }

  const user = collectForm();

  if (!user?.phone) {
    showToast(
      "Phone is required.",
      "error"
    );

    return;
  }

  setFormButtonsLoading(true);

  try {
    const payload = buildCreatePayload(user);

    await apiRequest("POST", {
      body: payload
    });

    closeModal();

    showToast(
      "User created successfully.",
      "success"
    );

    await loadUsers();
  } catch (error) {
    showToast(
      error.message,
      "error"
    );
  } finally {
    setFormButtonsLoading(false);
  }
}


// ============================================================
// UPDATE - PUT
// ============================================================

async function updateUser() {
  const form = document.getElementById("user-form");

  if (!form.reportValidity()) {
    return;
  }

  const user = collectForm();

  const phone =
    state.selectedUser?.phone ||
    user?.phone;

  if (!phone) {
    showToast(
      "Phone is required.",
      "error"
    );

    return;
  }

  setFormButtonsLoading(true);

  try {
    const payload = buildUpdatePayload(user);

    await apiRequest("PUT", {
      phone,
      body: payload
    });

    closeModal();

    showToast(
      "User updated successfully.",
      "success"
    );

    await loadUsers();
  } catch (error) {
    showToast(
      error.message,
      "error"
    );
  } finally {
    setFormButtonsLoading(false);
  }
}


// ============================================================
// UPDATE - PATCH
// ============================================================

async function patchUser() {
  const form = document.getElementById("user-form");

  if (!form.reportValidity()) {
    return;
  }

  const currentUser = collectForm();

  const phone =
    state.selectedUser?.phone ||
    currentUser?.phone;

  if (!phone) {
    showToast(
      "Phone is required.",
      "error"
    );

    return;
  }

  const updatePayload =
    buildUpdatePayload(currentUser);

  const originalUser =
    normalizeUser(state.selectedUser);

  const changedPayload =
    diffTopLevel(
      originalUser,
      updatePayload
    );

  if (!Object.keys(changedPayload).length) {
    showToast(
      "No changes detected.",
      "info"
    );

    return;
  }

  setFormButtonsLoading(true);

  try {
    await apiRequest("PATCH", {
      phone,
      body: changedPayload
    });

    closeModal();

    showToast(
      "User patched successfully.",
      "success"
    );

    await loadUsers();
  } catch (error) {
    showToast(
      error.message,
      "error"
    );
  } finally {
    setFormButtonsLoading(false);
  }
}


// ============================================================
// DELETE
// ============================================================

async function deleteUser(phone) {
  if (!phone) {
    return;
  }

  const user = state.users.find(
    (item) => item.phone === phone
  );

  const name =
    user?.personal?.full_name ||
    phone;

  const confirmed = window.confirm(
    `Delete user "${name}"?\n\nThis action cannot be undone.`
  );

  if (!confirmed) {
    return;
  }

  try {
    setLoading(true);

    await apiRequest("DELETE", {
      phone
    });

    showToast(
      "User deleted successfully.",
      "success"
    );

    await loadUsers();
  } catch (error) {
    showToast(
      error.message,
      "error"
    );
  } finally {
    setLoading(false);
  }
}


// ============================================================
// OPEN CREATE
// ============================================================

function openCreate() {
  state.mode = "create";
  state.selectedUser = deepClone(formDefaults);

  openModal(
    "Create User",
    renderForm(
      state.selectedUser,
      "create"
    )
  );

  renderBills(
    state.selectedUser.bills,
    false
  );
}


// ============================================================
// OPEN EDIT
// ============================================================

function openEdit(phone) {
  const user = state.users.find(
    (item) => item.phone === phone
  );

  if (!user) {
    showToast(
      "User not found.",
      "error"
    );

    return;
  }

  state.mode = "edit";
  state.selectedUser = normalizeUser(user);

  openModal(
    "Edit User",
    renderForm(
      state.selectedUser,
      "edit"
    )
  );

  renderBills(
    state.selectedUser.bills,
    false
  );
}


// ============================================================
// OPEN VIEW
// ============================================================

function openView(phone) {
  const user = state.users.find(
    (item) => item.phone === phone
  );

  if (!user) {
    showToast(
      "User not found.",
      "error"
    );

    return;
  }

  state.mode = "view";
  state.selectedUser = normalizeUser(user);

  openModal(
    "User Details",
    renderForm(
      state.selectedUser,
      "view"
    )
  );

  renderBills(
    state.selectedUser.bills,
    true
  );
}


// ============================================================
// BILL MANAGEMENT
// ============================================================

function addBill() {
  const form = document.getElementById("user-form");

  if (!form) {
    return;
  }

  const currentBills = collectBills();

  currentBills.push({
    id: "",
    fee: null,
    name: "",
    amount: null,
    method_qr: false,
    method_bank: false,
    method_qr_url: "",
    bill_is_active: true,
    method_bank_name: "",
    method_bank_number: ""
  });

  renderBills(
    currentBills,
    false
  );
}


function removeBill(index) {
  const currentBills = collectBills();

  if (
    index < 0 ||
    index >= currentBills.length
  ) {
    return;
  }

  currentBills.splice(index, 1);

  renderBills(
    currentBills,
    false
  );
}


// ============================================================
// FORM BUTTON LOADING
// ============================================================

function setFormButtonsLoading(loading) {
  const saveButton =
    document.getElementById("save-form-btn");

  const patchButton =
    document.getElementById("patch-form-btn");

  const cancelButton =
    document.getElementById("cancel-form-btn");

  if (saveButton) {
    saveButton.disabled = loading;
    saveButton.textContent =
      loading
        ? "Saving..."
        : state.mode === "edit"
          ? "Save Changes"
          : "Create User";
  }

  if (patchButton) {
    patchButton.disabled = loading;
    patchButton.textContent =
      loading
        ? "Saving..."
        : "Save with PATCH";
  }

  if (cancelButton) {
    cancelButton.disabled = loading;
  }
}


// ============================================================
// UI STATES
// ============================================================

function setLoading(loading) {
  const loadingState =
    document.getElementById("loading-state");

  const list =
    document.getElementById("user-list");

  if (loading) {
    loadingState.classList.remove("hidden");
    list.classList.add("opacity-50");
  } else {
    loadingState.classList.add("hidden");
    list.classList.remove("opacity-50");
  }
}


function showError(message) {
  const errorState =
    document.getElementById("error-state");

  const errorMessage =
    document.getElementById("error-message");

  errorMessage.textContent =
    message || "An unexpected error occurred.";

  errorState.classList.remove("hidden");
}


function hideError() {
  document
    .getElementById("error-state")
    .classList.add("hidden");
}


// ============================================================
// TOAST
// ============================================================

function showToast(message, type = "info") {
  const toast =
    document.getElementById("toast");

  const content =
    document.getElementById("toast-content");

  clearTimeout(state.toastTimer);

  content.textContent = message;

  content.className =
    "rounded-xl px-4 py-3 text-sm font-medium shadow-lg";

  if (type === "success") {
    content.classList.add(
      "bg-emerald-600",
      "text-white"
    );
  } else if (type === "error") {
    content.classList.add(
      "bg-red-600",
      "text-white"
    );
  } else {
    content.classList.add(
      "bg-slate-900",
      "text-white"
    );
  }

  toast.classList.remove("hidden");

  state.toastTimer = setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}


// ============================================================
// EVENT HANDLERS
// ============================================================

function bindEvents() {
  document
    .getElementById("add-user-btn")
    .addEventListener("click", openCreate);


  document
    .getElementById("retry-btn")
    .addEventListener("click", loadUsers);


  document
    .getElementById("close-modal-btn")
    .addEventListener("click", closeModal);


  document
    .getElementById("modal-backdrop")
    .addEventListener("click", closeModal);


  document
    .getElementById("user-list")
    .addEventListener("click", (event) => {
      const button =
        event.target.closest("[data-action]");

      if (!button) {
        return;
      }

      const action =
        button.dataset.action;

      const phone =
        button.dataset.phone;

      if (action === "view") {
        openView(phone);
      }

      if (action === "edit") {
        openEdit(phone);
      }

      if (action === "delete") {
        deleteUser(phone);
      }
    });


  document
    .getElementById("modal-content")
    .addEventListener("click", (event) => {
      const button =
        event.target.closest("[data-action]");

      if (
        button &&
        button.dataset.action === "remove-bill"
      ) {
        removeBill(
          Number(button.dataset.index)
        );

        return;
      }


      if (
        event.target.id === "add-bill-btn"
      ) {
        addBill();

        return;
      }


      if (
        event.target.id === "cancel-form-btn"
      ) {
        closeModal();

        return;
      }


      if (
        event.target.id === "patch-form-btn"
      ) {
        patchUser();

        return;
      }
    });


  document
    .getElementById("modal-content")
    .addEventListener("submit", (event) => {
      if (
        event.target.id !== "user-form"
      ) {
        return;
      }

      event.preventDefault();

      if (state.mode === "create") {
        createUser();
      }

      if (state.mode === "edit") {
        updateUser();
      }
    });
}


// ============================================================
// INITIALIZE
// ============================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {
    bindEvents();
    loadUsers();
  }
);
