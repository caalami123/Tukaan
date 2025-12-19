if (!localStorage.getItem("products")) {
  localStorage.setItem("products", JSON.stringify([
    {
      id: Date.now(),
      name: "Laptop",
      price: 500,
      store: "Tech Store",
      image: "https://via.placeholder.com/300"
    }
  ]));
}
