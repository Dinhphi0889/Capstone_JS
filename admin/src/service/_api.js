function Api() {


    this.fetchData = () => {
        const promise = axios({
            url: "https://65d8a71ec96fbb24c1bc05a2.mockapi.io/api/CyberPhone",
            method: "GET",
        });
        return promise;
    }

    this.add = (product) => {
        const promise = axios({
            url: "https://65d8a71ec96fbb24c1bc05a2.mockapi.io/api/CyberPhone",
            method: "POST",
            data: product
        })
        return promise;
    }

    this.delete = (id) => {
        const promise = axios({
            url: `https://65d8a71ec96fbb24c1bc05a2.mockapi.io/api/CyberPhone/${id}`,
            method: "DELETE"
        })
        return promise;
    }

    this.editProduct = (id) => {
        const promise = axios({
            url: `https://65d8a71ec96fbb24c1bc05a2.mockapi.io/api/CyberPhone/${id}`,
            method: "GET",
        })
        return promise;
    }

    this.updateProduct = (product) => {
        const promise = axios({
            url: `https://65d8a71ec96fbb24c1bc05a2.mockapi.io/api/CyberPhone/${product.id}`,
            method: "PUT",
            data: product
        });
        return promise;

    }

}
