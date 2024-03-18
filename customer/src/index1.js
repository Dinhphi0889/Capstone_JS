const api = new Api();
let cart = [];

getLocalStorage();

function getListProduct() {
    const promise = api.fetchApi();
    document.getElementById("loader").style.display = "block";

    promise
        .then(function (result) {
            document.getElementById("loader").style.display = "none";
            renderUI(result.data);
        })
        .catch(function (error) {
            document.getElementById("loader").style.display = "none";
            console.log(error);
        })
}
getListProduct();

function renderUI(data) {
    let content = "";

    data.forEach(function (product) {
        content += `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card cardPhone">
                <img src="${product.img}" class="card-img-top" alt="...">
                <div class="card-body">
                    <div>
                        <h3 class="cardPhone__title">${product.name}</h3>
                        <p class="cardPhone__text">Thương hiệu: ${product.type}</p>
                        <p class="cardPhone__text">Mô tả: ${product.desc}</p>
                        <p class="cardPhone__text">Màn hình: ${product.screen}</p>
                        <p class="cardPhone__text">Camera sau: ${product.backCamera}</p>
                        <p class="cardPhone__text">Camera trước: ${product.frontCamera}</p>
                    </div>
                    <div>
                        <h3 class="cardPhone__title">$${product.price}</h3>
                    </div>
                    <div class="d-flex justify-content-between">
                        <div class="cardPhone__rating">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-regular fa-star"></i>
                            <i class="fa-regular fa-star"></i>
                        </div>
                        <div>
                            <button  class="btnPhone-shadow btn-cart" data-product-id="${product.id}" onclick="addCart(${product.id})">
                                <div class="d-flex align-items-center">
                                    <i class="fa fa-shopping-cart" style="color: black; font-size: 25px;"></i>
                                    <span style="color: black; font-weight: bold; font-size: 16px"> BUY NOW </span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    });
    document.getElementById("products__content__main").innerHTML = content;
}

document.getElementById("selloai").addEventListener("change", () => {
    const type = document.getElementById("selloai").value;
    const promise = api.fetchApi();
    promise
        .then(function (result) {
            const listItem = result.data;
            let listFiler = [];

            if (type === "all") {
                listFiler = listItem;
            } else {
                listFiler = listItem.filter(function (product) {
                    return product.type.toLowerCase() === type.toLowerCase();
                })
            }

            renderUI(listFiler);
        })
        .catch(function (error) {
            console.log(error);
        })
})

function addCart(id) {
    const promise = api.fetchApi();
    promise
        .then(function (result) {
            const selectedProduct = result.data.find(product => product.id === id);
            if (selectedProduct) {
                const existingCartItem = cart.find(item => item.id === id);
                if (existingCartItem) {
                    existingCartItem.quantity++;
                } else {
                    cart.push({...selectedProduct, quantity: 1});
                }
                setLocalStorage();
                renderCart();
            }
        })
        .catch(function (error) {
            console.log(error);
        })
}

function setLocalStorage() {
    let cartString = JSON.stringify(cart);
    localStorage.setItem("cart", cartString);
}

function getLocalStorage() {
    if (!localStorage.getItem("cart")) return;
    const cartString = localStorage.getItem("cart");
    cart = JSON.parse(cartString);
    renderCart();
}

function renderCart() {
    let cartContent = "";

    cart.forEach((item) => {
        cartContent += `
        <tr>
            <td>${item.name}</td>
            <td><img src="${item.img}" alt="..."></td>
            <td>$${item.price.toLocaleString()}</td>
            <td>${item.quantity}</td>
            <td>$${(item.price * item.quantity).toLocaleString()}</td>
        </tr>
        `;
    });
    document.getElementById("tbody-cart").innerHTML = cartContent;
}