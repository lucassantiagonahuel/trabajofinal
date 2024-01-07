const logoutBtn = document.getElementById("logoutBtn");

const addToCart = async (productId, quantity) => {
  const response = await fetch("/api/carts/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const cartData = await response.json();
  const cartId = cartData._id;
  console.log("Carrito creado con _id:", cartId);

  const addToCartButton = document.querySelector(
    "[data-product-id='" + productId + "']"
  );
  const goToCartButton = document.querySelector(".go-to-cart-button");


  goToCartButton.style.display = "block";
  goToCartButton.href = `/cart/${cartId}`;
  addToCartButton.dataset.cartId = cartId;

  const responseTwo = await fetch(`/api/carts/${cartId}/product/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(await responseTwo.json());
  if (quantity > 1) {
    const data = {
      quantity: quantity,
    };
    await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
};

if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("Logging out...");
    fetch("/api/sessions/logout", {
      method: "post",
    })
      .then((response) => {
        console.log(response.status);
        if (response.status === 200) {
          window.location.href = "/login";
        } else {
          console.error("Error al cerrar la sesión.");
        }
      })
      .catch((error) => {
        console.error("Error al cerrar la sesión:", error);
      });
  });
}
