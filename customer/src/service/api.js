function Api() {
    // lấy danh sách product từ server
    this.fetchApi = function () {
        const promise = axios({
            url: "https://65d8a71ec96fbb24c1bc05a2.mockapi.io/api/CyberPhone",
            method: "GET",
        });
        
        return promise;
    }
}