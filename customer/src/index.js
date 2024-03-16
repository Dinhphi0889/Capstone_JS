const api = new Api();

function getListProduct() {
    const promise = api.fetchApi();
    // Pending => show loader
    document.getElementById("loader").style.display = "block";

    promise
        .then(function (result) {
            // success => hide loader
            document.getElementById("loader").style.display = "none";
            // console.log(result.data)
            renderUI(result.data);
        })
        .catch(function (error) {
            // error => hide loader
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
                                <button onclick="addCart(${product.id})" class="btnPhone-shadow">
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
let cart = [];
function addCart(id) {
    const promise = api.fetchApi();
    promise
        .then(function (result) {
            for (let i = 0; i < result.data.length; i++) {
                let item = result.data[i].id * 1;
                let cartItem = result.data[i]
                if (id === item) {
                    cart.push(cartItem);
                    console.log(cart)
                } else {
                    return null;
                }
            }
            console.log(cart)
        })
        .catch(function (error) {
            console.log(error);
        })
    console.log(cart)
}


