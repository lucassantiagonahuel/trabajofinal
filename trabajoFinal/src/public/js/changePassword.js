document
  .getElementById("changePasswordForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const newPasswordValue = document.getElementById("newPasswordInput").value;
    const confirmPasswordValue = document.getElementById(
      "confirmPasswordInput"
    ).value;
    const token = document.getElementById("tokenInput").value;

    if (newPasswordValue !== confirmPasswordValue) {
      alert("Las contraseñas no coinciden. Por favor, inténtelo de nuevo.");
      return;
    }

    try {
      const response = await fetch("/api/users/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword: newPasswordValue, token }),
      });
      console.log(response);
      if (response.ok) {
        console.log("Contraseña cambiada con éxito");
        alert(
          "Contraseña cambiada con éxito. Redirigiendo al inicio de sesión."
        );

        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        const errorText = await response.text();
        console.error("Error al cambiar la contraseña:", errorText);
        alert("Error al cambiar la contraseña: " + errorText);
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      alert("Error inesperado. Por favor, inténtelo de nuevo.");
    }
  });
