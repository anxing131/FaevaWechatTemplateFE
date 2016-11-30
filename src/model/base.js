/**
 * Created by Administrator on 2016/10/31.
 */
"use strict";
exports.MyProxyHander = {
    get: function (target, key, proxy) {
        return Reflect.get(target, key, proxy);
    },
    set: function (target, key, value, proxy) {
        return Reflect.set(target, key, value, proxy);
    }
};
var Base = (function () {
    function Base() {
        this._cleanData = new Map();
    }
    Base.prototype.update = function (cleanData, isInit) {
        if (isInit === void 0) { isInit = false; }
        if (isInit) {
            var keys = cleanData.keys();
            var key = void 0;
            while ((key = keys.next().value) != undefined) {
                this._cleanData.set(key, cleanData.get(key));
            }
        }
    };
    Base.prototype.postConstructor = function () {
        this._proxy = new Proxy(this, exports.MyProxyHander);
        var cleanData = new Map();
        for (var _i = 0, _a = this._attrs; _i < _a.length; _i++) {
            var key = _a[_i];
            cleanData.set(key, this[key]);
        }
        this.update(cleanData, true);
    };
    return Base;
}());
exports.Base = Base;
//# sourceMappingURL=base.js.map