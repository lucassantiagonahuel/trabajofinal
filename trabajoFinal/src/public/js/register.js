const form = document.getElementById("registerForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  fetch("api/sessions/register", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => result.json())
    .then((json) => console.log(json))
    .then((json) => {
      alert("Registro exitoso");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    })
    .catch((error) => console.error("Error al realizar el registro:", error));
});
