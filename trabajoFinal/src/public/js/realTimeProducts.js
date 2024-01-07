document.addEventListener("DOMContentLoaded", () => {
const socket = io();
const productForm = document.getElementById("productForm");
let productList = document.querySelector("#productList");

if (!productList) {
    productList = document.createElement("ul");
    productList.id = "productList";
    document.body.appendChild(productList);
  }


  const loadProductList = async () => {
    try {
      const data = await fetchProductData();
      socket.emit("sendData", data);
    } catch (error) {
      console.error("Error al obtener datos actualizados:", error);
    }
  };

  const fetchProductData = async () => {
    const response = await fetch("/api/products", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Error al obtener datos actualizados");
    }

    return response.json();
  };

  const deleteProduct = async (productId) => {
    try {
      await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      loadProductList();
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };


  const handleFormSubmit = (evt) => {
    evt.preventDefault();
  
    fetch("/api/products", {
      method: "POST",
      body: new FormData(productForm),
    })
      .then((response) => {
        if (response.ok) {
          return loadProductList();
        } else {
          console.error("Error al enviar el formulario");
        }
      })
      .catch((error) => {
        console.error("Error al enviar el formulario:", error);
      });
  };
  

  const handleProductListClick = (event) => {
    if (event.target.classList.contains("delete-button")) {
      const button = event.target;
      const productId = button.getAttribute("data-product-id");
      console.log("Eliminar producto con ID:", productId);
      deleteProduct(productId);
    }
  };

  socket.on("updateList", (data) => {
    updateProductList(data.docs);
  });

  const updateProductList = (data) => {
    const dataIsEmpty = data.length === 0;
    if (!dataIsEmpty) {
      productList.innerHTML = "";
      data.forEach((product) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `${product.title}
        <button class="delete-button" data-product-id="${product._id}">Eliminar</button>`;
        productList.appendChild(listItem);
      });
    } else {
      productList.innerHTML = "No hay productos cargados";
    }
  };

  productForm.addEventListener("submit", handleFormSubmit);
  productList.addEventListener("click", handleProductListClick);

  loadProductList();

});
