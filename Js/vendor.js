function addProduct() {
  const products = JSON.parse(localStorage.getItem("products"));
  products.push({
    id: Date.now(),
    name: name.value,
    price: price.value,
    store: "My Store",
    image: "https://via.placeholder.com/300"
  });
  localStorage.setItem("products", JSON.stringify(products));
  location.reload();
}

const list = document.getElementById("vendorProducts");
JSON.parse(localStorage.getItem("products"))
  .filter(p => p.store === "My Store")
  .forEach(p => list.innerHTML += `<li>${p.name}</li>`);
