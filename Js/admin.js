const ul = document.getElementById("allProducts");
const products = JSON.parse(localStorage.getItem("products"));

products.forEach((p, i) => {
  ul.innerHTML += `
    <li>
      ${p.name} - ${p.store}
      <button onclick="remove(${i})">Delete</button>
    </li>
  `;
});

function remove(i) {
  products.splice(i, 1);
  localStorage.setItem("products", JSON.stringify(products));
  location.reload();
}
