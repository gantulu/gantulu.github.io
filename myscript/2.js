  const SHEET_API = "https://api.apico.dev/v1/OEKmRt/1XSvYd-t98BwhZg5hE8llZNw3t1xBRYXAGYsEPz2kWEA/values/Sheet1";
  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("errorMsg");
  const submitBtn = document.getElementById("submitBtn");

  form.onsubmit = async function(e) {
    e.preventDefault();
    errorMsg.style.display = "none";
    submitBtn.disabled = true;
    submitBtn.textContent = "Logging in...";

    const userInput = form.user.value.trim();
    const passInput = form.pass.value;

    try {
      const res = await fetch(SHEET_API);
      const data = await res.json();
      const headers = data.values[0];
      const userIdx = headers.indexOf("userID");
      const emailIdx = headers.indexOf("email");
      const passIdx = headers.indexOf("pass");
      const nameIdx = headers.indexOf("name");

      const userRow = data.values.find((row, i) =>
        i > 0 &&
        ((row[userIdx] === userInput || row[emailIdx] === userInput) && row[passIdx] === passInput)
      );

      if (userRow) {
        alert("Login success!\nWelcome, " + userRow[nameIdx]);
        form.reset();
      } else {
        errorMsg.textContent = "UserID/email atau password salah.";
        errorMsg.style.display = "block";
      }
    } catch (err) {
      errorMsg.textContent = "Gagal terhubung ke API.";
      errorMsg.style.display = "block";
    }
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
  };
