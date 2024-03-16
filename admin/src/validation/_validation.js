function Validation() {
    this.kiemTraRong = function (value, spanId, message) {
        if (value === "") {
            getEle(spanId).innerHTML = message;
            return false;
        }
        getEle(spanId).innerHTML = "";
        return true;
    };


    this.KiemTraSo = function (value, spanId, message) {
        const number = "^[0-9]+$"
        if (value.match(number)) {
            getEle(spanId).innerHTML = "";
            return true
        }
        getEle(spanId).innerHTML = message;
        return false;
    }

}