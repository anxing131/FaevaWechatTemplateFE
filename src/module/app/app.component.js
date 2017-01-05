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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var setting_component_1 = require("./components/setting/setting.component");
/**
 * Created by Administrator on 2016/10/9.
 */
var core_1 = require("@angular/core");
var Rx = require("rxjs/Rx");
var user_service_1 = require("../../services/user.service");
var user_1 = require("../../model/user");
var AppComponent = (function () {
    function AppComponent(userService, resolver, config) {
        var _this = this;
        this.userService = userService;
        this.resolver = resolver;
        this.config = config;
        this.name = 'ax';
        this.testFlag = false;
        this.changeSubject = new Rx.Subject();
        this.changeSubject.subscribe({
            next: function (p) { console.log('p : ' + _this.name); }
        });
        console.log('changeStream1 : ' + this.changeStream);
        this.initAppData();
        setTimeout(function () {
        }, 5000);
    }
    AppComponent.prototype.ngOnInit = function () {
    };
    AppComponent.prototype.addSettingComponent = function () {
        if (this.axSettingComponentRef) {
            return;
        }
        var componentFactory = this.resolver.resolveComponentFactory(setting_component_1.SettingComponent);
        this.axSettingComponentRef = this.axSetting.createComponent(componentFactory);
    };
    AppComponent.prototype.destroySettingComponent = function () {
        if (this.axSettingComponentRef) {
            this.axSettingComponentRef.destroy();
        }
    };
    AppComponent.prototype.allowDrop = function (event) {
        event.preventDefault();
    };
    AppComponent.prototype.pageX = function (elem) {
        return elem.offsetParent ? (elem.offsetLeft + this.pageX(elem.offsetParent)) : elem.offsetLeft;
    };
    AppComponent.prototype.example = function () {
        return ['anxing', 2, 3];
    };
    /**
     * 初始化应用数据
     *
     *     1、用户数据
     */
    AppComponent.prototype.initAppData = function () {
        var _this = this;
        var userInfo = localStorage.getItem('loginUserInfo');
        setTimeout(function () {
            _this.userService.loginDimmer = _this.loginDimmer;
        }, 1000);
        if (userInfo) {
            var user = new user_1.User(JSON.parse(userInfo));
            this.userService.loginUser = user;
        }
        else {
            setTimeout(function () {
                _this.userService.internalErrorDimmer = _this.internalErrorDimmer;
                _this.loginDimmer.show();
            }, 1000);
        }
    };
    return AppComponent;
}());
__decorate([
    core_1.ViewChild('loginDimmer'),
    __metadata("design:type", Object)
], AppComponent.prototype, "loginDimmer", void 0);
__decorate([
    core_1.ViewChild('internalErrorDimmer'),
    __metadata("design:type", Object)
], AppComponent.prototype, "internalErrorDimmer", void 0);
__decorate([
    core_1.ViewChild('axSetting', { read: core_1.ViewContainerRef }),
    __metadata("design:type", Object)
], AppComponent.prototype, "axSetting", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], AppComponent.prototype, "data", void 0);
AppComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'my-app, [my-app]',
        templateUrl: 'app.html',
        styleUrls: ['app.css']
    }),
    __param(2, core_1.Inject('config')),
    __metadata("design:paramtypes", [user_service_1.UserService,
        core_1.ComponentFactoryResolver, Object])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map