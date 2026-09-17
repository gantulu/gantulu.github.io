const BSN_USER_URL = "https://oszqantvugvbvydlizix.supabase.co/functions/v1/bsn-user";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_CFjQHGQCTu-XwzQKS2YoCw_lrUkhhBK";

async function request(method = "POST", body = {}, phone = "") {
  const url = new URL(BSN_USER_URL);
  if (phone) url.searchParams.set("phone", String(phone).trim());
  const response = await fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
    },
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
  getUser: (phone) => request("GET", {}, phone),
  login: (phone, password) => request("POST", { action: "login", phone, password }),
  register: (name, phone, password) => request("POST", { action: "register", name, phone, password }),
  changePassword: (phone, currentPassword, newPassword) => request("POST", {
    action: "change_password", phone, current_password: currentPassword, new_password: newPassword,
  }),
  deleteUser: (phone, password) => request("POST", { action: "delete", phone, password }),
  updateUser: (phone, password, data, method = "PATCH") => request(method, { phone, password, ...data }, phone),
  deleteByMethod: (phone, password) => request("DELETE", { phone, password }, phone),
};

export { BSN_USER_URL };
export default bsnUser;
