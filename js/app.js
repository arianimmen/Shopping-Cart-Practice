// importing Products
import { productsData } from "./products.js";

// Selecting elements from Home screen
const product_container = document.querySelector(".products");
const cart_counter = document.querySelector(".cart_counter");
const cartIcon = document.querySelector(".nav__icon__shopingcart");

// Selecting the modal elements
const cartModalSection = document.querySelector(".cart__section");
const ModalBackground = document.querySelector(".cart__section__background");
const cancelModal = document.querySelector(".cart__section__info__cancel");
const cartsContainerModal = document.querySelector(".carts__container");
const totalPrice = document.querySelector(".total_price");
const clearAll = document.querySelector(".cart__section__info__clearall");

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

  addToModal(products) {
    // Adding the products in the cart, into the modal
    let result = "";
    products.forEach((product) => {
      result += `
           <div class="cart__item">
            <img
              src=${product.imageUrl}
              alt="image of a shoe"
              class="cart_main_image"
            />
            <div class="cart__item__text">
              <p class="title">${product.title}</p>
              <p class="price">$${product.price}</p>
            </div>
            <div class="right">
              <div class="quantity_section">
                <img
                  src="./assets/images/reshot-icon-arrow-chevron-down-EUCMLYADT9 (1).svg"
                  alt="arrow icon"
                  class="top_arrow"
                  data-id=${product.id}
                />
                <p class="quantity">${product.quantity}</p>
                <img
                  src="./assets/images/reshot-icon-arrow-chevron-down-EUCMLYADT9 (1).svg"
                  alt="arrow icon"
                  class="down_arrow"
                  data-id=${product.id}
                />
              </div>
              <img
                src="./assets/images/deleteIcon.svg"
                alt="delete icon"
                class="delete_icon"
                data-id=${product.id}
              />
            </div>
          </div>`;
    });
    cartsContainerModal.innerHTML = result; //Updating the modal

    const removeBtns = document.querySelectorAll(".delete_icon"); // Selecting the remove buttons (icons)
    removeBtns.forEach((btn) => {
      btn.addEventListener("click", this.removeEachItemFromCart);
    });
  }

  removeEachItemFromCart(event) {
    const ui = new Ui();
    const btnId = Number(event.target.dataset.id);

    carts = carts.filter((cart) => cart.id !== btnId); //Updating global carts

    Storage.saveCart(carts); // Updating carts in Local storage
    ui.addToModal(carts); // Updating the modal
    ui.displayProducts(Data.getdata()); // Updating the main home screen
    Ui.updateCartValue(); // Updating cart value
  }

  static removeAllItemFromCart() {
    const ui = new Ui();

    carts = [];

    Storage.saveCart(carts); // Updating carts in Local storage
    ui.addToModal(carts); // Updating the modal
    ui.displayProducts(Data.getdata()); // Updating the main home screen
    Ui.updateCartValue(); // Updating cart value
  }

  static openModal() {
    // Opening the modal
    cartModalSection.style.display = "flex";
    ModalBackground.style.display = "block";

    // Adding the items in cart into the modal
    const ui = new Ui();
    ui.addToModal(carts);
  }

  static closeModal() {
    // Closing the modal
    cartModalSection.style.display = "none";
    ModalBackground.style.display = "none";
  }

  static updateCartValue() {
    let cart_value = 0;
    let cart_price = 0;
    cart_value = carts.reduce((acc, current) => {
      cart_price += current.price * current.quantity; // Calculating the price
      return acc + current.quantity;
    }, 0); // summing the quantity

    cart_counter.textContent = cart_value; // Updating the cart value count
    totalPrice.textContent = `Total Price: $${cart_price}`; // Updating the Price
  }

  static start() {
    Ui.updateCartValue();
    cartIcon.addEventListener("click", Ui.openModal); // Adding event Listener to the cart icon top right
    ModalBackground.addEventListener("click", Ui.closeModal); // Adding event Listener to the blur modal background
    cancelModal.addEventListener("click", Ui.closeModal); // Adding event Listener to the cancel button in the modal
    clearAll.addEventListener("click", Ui.removeAllItemFromCart); //Adding event Listener to the clear All button
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
  Ui.start(); // Stating the Essential function and event Listener
  ui.displayProducts(productsData); // adding products to ui
});
