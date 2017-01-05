"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by Administrator on 2016/11/21.
 */
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var UserService = (function () {
    function UserService(router) {
        this.router = router;
    }
    UserService.prototype.showLoginDimmer = function () {
        if (!this.loginDimmer) {
            throw new Error('loginDimmer not init! ');
        }
        this.loginDimmer.show();
    };
    UserService.prototype.showInternalErrorDimmer = function (data) {
        if (!this.internalErrorDimmer) {
            console.log('error : ', data);
            throw new Error('internalErrorDimmer not init! ');
        }
        this.internalErrorDimmer.show(data);
    };
    UserService.prototype.canActivate = function () {
        if (!this.loginUser) {
        }
        return !!this.loginUser;
    };
    UserService.prototype.login = function (user) {
        this.loginUser = user;
        var userInfo = JSON.stringify(user);
        localStorage.setItem('loginUserInfo', userInfo);
    };
    UserService.prototype.logout = function () {
        this.loginUser = null;
        localStorage.removeItem('loginUserInfo');
        // this.router.navigateByUrl('http://baidu.com/');
        console.log('logout ... ');
        // this.router.navigate(['/dashboard', new Date().getTime()]);
        // this.router.navigateByUrl('/dashboard');
        location.reload();
    };
    /**
     *  处理通用的API相应错误, 是内容里面的code != 200 的处理方式
     *
     *  @return boolean 这里不能匹配处理返回false, 能够处理返回true
     */
    UserService.prototype.handleCommonAuthApiRespo = function (res) {
        switch (res.code) {
            case 605:
                this.showLoginDimmer();
                return true;
            case 500:
                this.showInternalErrorDimmer(res);
                return true;
            default:
                return false;
        }
    };
    return UserService;
}());
UserService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [router_1.Router])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map