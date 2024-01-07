
finalizarCompraButton.addEventListener("click", function () {
  const cartId = this.getAttribute("data-cart-id");

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(`/api/carts/${cartId}/purchase`, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error in purchase cart");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Response:", data);
      alert("¡Compra finalizada con éxito!");
      window.location.replace('/products');
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error al finalizar la compra");
    });
});
