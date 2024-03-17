const api = new Api();
const validation = new Validation();

getEle = (id) => document.getElementById(id);

function getListData() {
    const promise = api.fetchData();
    promise
        .then(function (result) {
            renderUI(result.data)
            document.querySelector(".loader").style.display = 'none'
        })
        .catch(function (error) {
            console.log(error)
        })
}
getListData();

getEle("btnThemSP").onclick = function () {
    document.getElementsByClassName("modal-title")[0].innerHTML = "Add Product";
    const btnAdd = `<button class="btn btn-success" onclick ="addProduct(true)">Thêm</button>`
    document.getElementsByClassName("modal-footer")[0].innerHTML = btnAdd;
}


function renderUI(data) {
    let content = "";
    data.forEach(function (product, index) {
        content += `
        <tr id="listProduct">
            <td>${index + 1}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.screen}</td>
            <td>${product.frontCamera}</td>
            <td>${product.backCamera}</td>
            <td>
                <img src="${product.img}" width="50">
            </td>
            <td>${product.desc}</td>
            <td>${product.type}</td>
            <td>
                <button class="btn btn-info" data-toggle="modal" data-target="#myModal" onclick="editProduct(${product.id})">Edit</button>
                <button class="btn btn-danger" onclick="delProduct(${product.id})">Delete</button>
            </td>
        </tr>
        `
    })
    getEle("tblDanhSachSP").innerHTML = content;
}

function addProduct(isAdd) {
    const name = getEle("TenSP").value;
    const screen = getEle("manHinh").value;
    const backCam = getEle("camSau").value;
    const frontCam = getEle("camTruoc").value;
    const price = getEle("giaSP").value;
    const img = getEle("HinhSP").value;
    const type = getEle("loaiDT").value;
    const desc = getEle("MoTa").value;


    // Validation Giá Sp
    let isValid = true;
    if (isAdd) {
        isValid &= validation.kiemTraRong(price, "spanGiaSP", "(*) Không Được Để Trống") && validation.KiemTraSo(price, "spanGiaSP", "(*) Giá sản phẩm phải là số");
    }


    // Validation Tên SP
    isValid &= validation.kiemTraRong(name, "spanTenSP", "(*) Không Được Để Trống")


    // Validation Màn Hình
    isValid &= validation.kiemTraRong(screen, "spanManHinh", "(*) Không Được Để Trống")


    // Validation Hình ảnh
    isValid &= validation.kiemTraRong(img, "spanHinhAnh", "(*) Không Được Để Rỗng");

    // Validation BackCam
    isValid &= validation.kiemTraRong(backCam, "spanBackCam", "(*) Không Được Để Trống");


    // Validation FrontCam
    isValid &= validation.kiemTraRong(frontCam, "spanFrontCam", "(*) Không Được Để Trống");


    // Validation Loại Điện Thoại
    isValid &= validation.kiemTraRong(type, "spanLoaiDT", "(*) Không Được Để Trống");
    if (!isValid) return null;




    const product = new Product("", name, Number(price), screen, backCam, frontCam, img, desc, type);

    const promise = api.add(product)
    promise
        .then(function (result) {
            document.getElementsByClassName("close")[0].click();
            getListData();
        })
        .catch(function (err) {
            console.log(err)
        })
}


// Xóa Sản Phẩm
function delProduct(id) {
    const promise = api.delete(id);
    promise
        .then(function () {
            getListData();
        })
        .catch(function (err) {
            console.log(err)
        })
}


// Sửa Sản Phẩm
function editProduct(id) {
    document.getElementsByClassName("modal-title")[0].innerHTML = "Update Product";
    const btnUpdate = `<button class="btn btn-success" onclick="updateProduct(${id})">Update</button>`;
    document.getElementsByClassName("modal-footer")[0].innerHTML = btnUpdate;
    const promise = api.editProduct(id)
    promise
        .then((result) => {
            const product = result.data;
            getEle("TenSP").value = product.name;
            getEle("manHinh").value = product.screen;
            getEle("camTruoc").value = product.frontCamera;
            getEle("camSau").value = product.backCamera;
            getEle("giaSP").value = product.price;
            getEle("HinhSP").value = product.img;
            getEle("loaiDT").value = product.type;
            getEle("MoTa").value = product.desc;
        })
        .catch((err) => {
            console.log(err)
        })
}


// Cập nhập sản phẩm
function updateProduct(id) {
    const name = getEle("TenSP").value;
    const screen = getEle("manHinh").value;
    const frontCamera = getEle("camTruoc").value;
    const backCamera = getEle("camTruoc").value;
    const price = getEle("giaSP").value;
    const img = getEle("HinhSP").value;
    const type = getEle("loaiDT").value;
    const desc = getEle("MoTa").value;

    const product = new Product(id, name, Number(price), screen, backCamera, frontCamera, img, desc, type)

    const promise = api.updateProduct(product)
    promise
        .then(() => {
            document.getElementsByClassName("close")[0].click();
            getListData();
        })
}


// Tìm kiếm sản phẩm theo tên
async function searchProduct() {
    let search = getEle("value-search").value;
    search = search.toLowerCase();
    try {
        const product = await api.fetchData();
        const searchResult = searchProductByName(product, search);
        console.log(searchResult)
        if (searchResult.length > 0) {
            renderUI(searchResult)
            getEle("txtThongBao").style.display = 'none'
            // document.querySelector(".loader").style.display = 'none'
        }
        else {
            renderUI(searchResult)
            getEle("txtThongBao").style.display = 'block'
        }
    } catch {
        // console.log("API Error");
    }
}

//Tìm Kiếm Sản Phẩm
function searchProductByName(product, search) {

    const products = product.data;
    const newProducts = [];

    for (let i = 0; i < products.length; i++) {
        const nameProduct = products[i].name.toLowerCase()
        if (nameProduct.includes(search)) {
            console.log(`product tìm đúng là : ${products[i].name}`);
            newProducts.push(products[i]);
        }
        else {
            console.log(`product không đúng tên là :${products[i].name}`);
        }
    }
    return newProducts;

}

//Sắp xếp theo giá tiền
document.getElementById("sapXep").addEventListener('change', () => {
    let newArr = [];
    api.fetchData()
        .then((result) => {
            const data = result.data
            data.forEach((product, index) => {
                let Arr = product.price;
                Arr.sort((a, b) => a - b)
                // newArr.sort()

                // let price = product.price[index]
                // newArr.push(price)
                // newArr.sort()
                console.log(Arr)
                return Arr;
            });
        })
        .catch((err) => {
            console.log(err)
        })
})
