document.addEventListener("DOMContentLoaded", function () {
  const deleteUsersButton = document.querySelector("#deleteUsersButton");

  if (deleteUsersButton) {
    deleteUsersButton.addEventListener("click", function (event) {
      event.preventDefault();
      deleteUsers();
    });
  }
});

async function deleteUsers() {
  try {
    const response = await fetch("/api/users", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar usuarios. Código: ${response.status}`);
    }

    console.log("Usuarios inactivos eliminados exitosamente");
    alert("Usuarios inactivos eliminados exitosamente");
    location.reload();
  } catch (error) {
    console.error("Error al eliminar usuarios:", error);
  }
}
