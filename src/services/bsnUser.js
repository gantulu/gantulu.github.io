const BSN_USER_URL = "https://oszqantvugvbvydlizix.supabase.co/functions/v1/bsn-user";

async function request(method = "POST", body = {}, phone = "") {
  const url = new URL(BSN_USER_URL);
  if (phone) url.searchParams.set("phone", String(phone).trim());

  const response = await fetch(url.toString(), {
    method,
    headers: { "Content-Type": "application/json" },
    ...(method === "GET" || method === "DELETE" ? {} : { body: JSON.stringify(body) }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(result.error || "Request failed");
    error.status = response.status;
    error.details = result.details;
    throw error;
  }
  return result;
}

export const bsnUser = {
  // GET /functions/v1/bsn-user?phone=...
  getUser: (phone) => request("GET", {}, phone),

  // POST actions implemented by bsn-user v6
  login: (phone, password) => request("POST", { action: "login", phone, password }),
  register: (phone, password, data = {}) => request("POST", {
    action: "register",
    phone,
    password,
    ...data,
  }),
  changePassword: (phone, currentPassword, newPassword) => request("POST", {
    action: "change_password",
    phone,
    current_password: currentPassword,
    new_password: newPassword,
  }),
  deleteUser: (phone, password) => request("POST", {
    action: "delete",
    phone,
    password,
  }),

  // PATCH / PUT update only: balance, personal, loan, kyc, bank, bills
  updateUser: (phone, password, data, method = "PATCH") => request(method, {
    phone,
    password,
    ...data,
  }, phone),

  // DELETE /functions/v1/bsn-user?phone=...
  deleteByMethod: (phone, password) => request("DELETE", { phone, password }, phone),
};

export { BSN_USER_URL };
export default bsnUser;
