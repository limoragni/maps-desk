Array.prototype.mix = function () {
    var n = this.length;
    while (n--) {
            var i = Math.floor(n * Math.random());
            var tmp = this[i];
            this[i] = this[n];
            this[n] = tmp;
    }
    return this;
}
