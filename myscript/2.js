const SHEET_API = "https://api.apico.dev/v1/OEKmRt/1XSvYd-t98BwhZg5hE8llZNw3t1xBRYXAGYsEPz2kWEA/values/Sheet1";
const BEARER_TOKEN = "9aed1af912ad0243c06f8a73173efb7ea0cf57be8d9c5ddb414dfaa433b86963";

form.onsubmit = async function(e) {
  e.preventDefault();
  errorMsg.style.display = "none";
  submitBtn.disabled = true;
  submitBtn.textContent = "Logging in...";

  const userInput = form.user.value.trim();
  const passInput = form.pass.value;

  try {
    const res = await fetch(SHEET_API, {
      headers: {
        "Authorization": `Bearer ${BEARER_TOKEN}`
      }
    });
    const data = await res.json();

    // lanjutkan seperti biasa...
  } catch (err) {
    // error handling
  }
  // reset button
};
