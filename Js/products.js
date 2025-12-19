const products = JSON.parse(localStorage.getItem("products"));
const box = document.getElementById("products");

products.forEach(p => {
  box.innerHTML += `
    <div class="product">
      <img src="${p.image}">
      <h3>${p.name}</h3>
      <p>$${p.price}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    </div>
  `;
});
