/**
 * Created by Administrator on 2016/10/10.
 */
"use strict";
var Hero = (function () {
    function Hero(obj) {
        this.id = obj && obj.id || '';
        this.name = obj && obj.name || '';
        this.createDate = obj && obj.createDate || -1;
    }
    return Hero;
}());
exports.Hero = Hero;
//# sourceMappingURL=hero.js.map