document
  .getElementById("resetPasswordForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("emailInput").value;

    try {
      const response = await fetch(`/api/users/${email}`);

      if (response.ok) {
        const user = await response.json();

        if (user) {
          const sendEmailRecovery = await fetch(`/api/users/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          });
          if (sendEmailRecovery.ok) {
            alert("Por favor revise su casilla de correo");
          } else {
            console.error(
              `Error al actualizar el usuario: ${sendEmailRecovery.statusText}`
            );
            alert(
              "Error al actualizar el usuario. Por favor, inténtelo de nuevo."
            );
          }
        } else {
          alert("Usuario no registrado");
        }
      } else {
        console.error(`Error al obtener el usuario: ${response.statusText}`);
        alert("Error al obtener el usuario. Por favor, inténtelo de nuevo.");
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      alert("Error inesperado. Por favor, inténtelo de nuevo.");
    }
  });
