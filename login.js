const loginForm = document.getElementById("loginForm");
const errorEl = document.getElementById("error");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorEl.textContent = "";

  const email = document.getElementById("email").value; 

  try {
    const response = await fetch(
      `https://gallery-backend-app.onrender.com/users/login?email=${encodeURIComponent(email)}`
    ); 
    const data = await response.json();

    if (!response.ok) {
      errorEl.textContent = data.detail || "Login failed";
      return;
    }

    localStorage.setItem("user", JSON.stringify(data.user));

    window.location.href = "breeds.html";
  } catch (err) {
    errorEl.textContent = "Server error";
    console.error(err);
  }
});
