const api = new Api();
let cart = [];

getLocalStorage();
/**
 * Lấy dữ liệu từ server
 */
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

/**
 * Hiện Sản phẩm lên UI
 */
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
                        <div class="cardPhone__rating d-flex justify-content-between">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-regular fa-star"></i>
                            <i class="fa-regular fa-star"></i>
                        </div>
                        <div>
                            <button style="background-color: #ffeb3ba3; type="button" class="btn .bg-primary btn-cart" data-product-id="${product.id}" onclick="addCart(${product.id})">
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

/**
 * Filter food
 */
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

/**
 * Add cart
 */
function addCart(id) {
    const promise = api.fetchApi();
    promise
        .then(function (result) {
            const selectedProduct = result.data.find(product => product.id * 1 === id);
            if (selectedProduct) {
                const existingCartItem = cart.find(item => item.id * 1 === id);
                if (existingCartItem) {
                    existingCartItem.quantity++;
                } else {
                    cart.push({ ...selectedProduct, quantity: 1 });
                }
                setLocalStorage();
                renderCart();
                alert("Thêm sản phẩm thành công");
            }
        })
        .catch(function (error) {
            console.log(error)
        })
}

/**
 * setLocalStorage
 */
function setLocalStorage() {
    let cartString = JSON.stringify(cart);
    localStorage.setItem("cart", cartString);
}

/**
 * getLoaclStorage
 */
function getLocalStorage() {
    if (!localStorage.getItem("cart")) return;
    const cartString = localStorage.getItem("cart");
    cart = JSON.parse(cartString);
    renderCart();
}

/**
 * Render cart
 */
function renderCart() {
    let totalAmount = 0;
    let cartContent = "";

    if (cart.length === 0) {
        document.getElementById("tbody-cart").innerHTML = `<td colspan="5"><p style="color: grey;">Không có sản phẩm nào trong giỏ hàng</p></td>`;
        document.getElementById("totalAmount").innerHTML = "$ " + 0;
        return;
    }

    cart.forEach((item) => {
        const subtotal = item.price * item.quantity;
        // console.log(subtotal)
        totalAmount += subtotal;
        // console.log(totalAmount)

        // console.log(item.name)
        cartContent += `
        <tr>
            <td class="align-middle">${item.name}</td>
            <td class="align-middle"><img class="img-fluid" src="${item.img}" alt="..."></td>
            <td class="align-middle">$${item.price.toLocaleString()}</td>
            <td class="align-middle">
                <button onclick="updateQuantity(${item.id}, 'decrease')" type="button" class="btn btn-secondary updateQuantity">-</button>
                
                <span>${item.quantity}</span>
                
                <button onclick="updateQuantity(${item.id}, 'increase')" type="button" class="btn btn-secondary updateQuantity">+</button>

            </td>
            <td class="align-middle">$${(subtotal).toLocaleString()}</td>
            <td class="align-middle">
                <button onclick="deletaItem(${item.id})" type="button" class="btn btn-danger" ">Close</button>
            </td>
        </tr>
        `
    })
    document.getElementById("tbody-cart").innerHTML = cartContent;
    document.getElementById("totalAmount").innerHTML = `$${totalAmount.toLocaleString()}`;
};

/**
 * Delete product
 */
function deletaItem(id) {
    // console.log(id)
    cart = cart.filter(item => item.id * 1 !== id);
    console.log(cart)
    renderCart();
    setLocalStorage();
}

/**
 * Mua hàng
 */
document.getElementById("btnMua").addEventListener("click", function () {
    cart = [];
    renderCart();
    setLocalStorage();
    document.getElementById("tbody-cart").innerHTML = `<td colspan="5"><p style="color: grey;">Không có sản phẩm nào trong giỏ hàng</p></td>`;
    // console.log("Không có sản phẩm nào trong giỏ hàng")
})

function updateQuantity(id, action) {
    const item = cart.find(item => item.id * 1 === id);
    if (item) {
        if (action === 'increase') {
            item.quantity++;
        } else if (action === 'decrease' && item.quantity * 1 > 1) {
            item.quantity--;
        }
        renderCart();
        setLocalStorage();
    }
}

