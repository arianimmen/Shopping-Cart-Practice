// importing Products
import { productsData } from "./products.js";

const product_container = document.querySelector(".products");
const cart_counter = document.querySelector(".cart_counter");

let carts = [];

class Data {
  // returning the products
  static getdata() {
    return productsData;
  }
}

class Ui {
  displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      const isInCart = this.inCart(product.id);
      result += `      
      <div class="products__product">
        <div class="products__product__images">
          <img
            src=${product.imageUrl}
            alt="image of shoe"
            class="products__product__picture"
          />   
          <button class="products__product__button" data-id=${product.id}>${
        isInCart ? "In Cart" : "Add to Cart"
      }</button>
        </div>
        <div class="products__product__text">
          <p class="products__product__price">$${product.price}</p>
          <p class="products__product__title">${product.title}</p>
        </div>
      </div>
      `;
    });
    product_container.innerHTML = result;

    // calling the Button Logic
    this.addToCartButtonLogic();
  }

  addToCartButtonLogic() {
    // Getting the AddToCart buttons
    const addToCartsBtns = [
      ...document.querySelectorAll(".products__product__button"),
    ];
    // Adding an Event Listener to each button
    addToCartsBtns.forEach((btn) => {
      btn.addEventListener("click", this.addToCart);
      // If product is already in cart, diable the button
      if (this.inCart(btn.dataset.id)) {
        btn.disabled = true;
      }
    });
  }

  addToCart(event) {
    const btnId = Number(event.target.dataset.id); // Getting the clicked button Id
    const allProducts = Data.getdata();
    const selectedProduct = allProducts.find((product) => product.id === btnId);

    carts = [...carts, { ...selectedProduct, quantity: 1 }]; // Updating the cart
    Storage.saveCart(carts); // Saving cart to the Local Storage
    Ui.updateCartValue(); // Updating the cart value

    event.target.textContent = "In cart";
    event.target.disabled = true;
  }

  inCart(id) {
    // Checking that the item is in cart or not
    const productStatus = carts.findIndex((cart) => cart.id == id);
    if (productStatus === -1) {
      return false;
    }
    return true;
  }

  static updateCartValue() {
    let cart_value = 0;
    cart_value = carts.reduce((acc, current) => {
      return acc + current.quantity;
    }, 0); // summing the quantity
    cart_counter.textContent = cart_value; // Updating the cart value count
  }
}

class Storage {
  static saveCart(products) {
    localStorage.setItem("carts", JSON.stringify(products));
  }
  static getCart() {
    return JSON.parse(localStorage.getItem("carts"));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const productsData = Data.getdata(); // getting the data
  carts = Storage.getCart() || []; // Updating the cart (if there is no value, it will return an empty array)

  const ui = new Ui();
  Ui.updateCartValue();
  ui.displayProducts(productsData); // adding products to ui
});
