/**
 * Created by Administrator on 2016/10/10.
 */
"use strict";
var User = (function () {
    function User(obj) {
        this.id = obj && obj.id || '';
        this.name = obj && obj.name || '';
        this.createDate = obj && obj.createDate || -1;
        this.accId = obj && obj.accId || '';
        this.avator = obj && obj.avator || '';
    }
    User.prototype.localStorage = function () {
        var userInfo = {
            id: this.id,
            name: this.name,
            accId: this.accId,
            token: this.token,
            avator: this.avator
        };
        localStorage.setItem('loginUserInfo', JSON.stringify(userInfo));
    };
    return User;
}());
exports.User = User;
//# sourceMappingURL=user.js.map