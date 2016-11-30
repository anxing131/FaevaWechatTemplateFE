"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
 * Created by Administrator on 2016/10/26.
 */
var core_1 = require('@angular/core');
var LoginErrorDimmerComponent = (function (_super) {
    __extends(LoginErrorDimmerComponent, _super);
    function LoginErrorDimmerComponent() {
        _super.apply(this, arguments);
    }
    LoginErrorDimmerComponent.prototype.ngOnInit = function () {
    };
    LoginErrorDimmerComponent.prototype.show = function () {
        $('.axLoginErrorDimmer').modal({
            allowMultiple: true,
            blurring: true,
            onHide: function () {
                return true;
            }
        }).modal('show');
        console.log('errorInfo : ' + JSON.stringify(this.errorInfo));
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], LoginErrorDimmerComponent.prototype, "errorInfo", void 0);
    LoginErrorDimmerComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'ax-login-error-dimmer',
            templateUrl: 'error.html',
            styleUrls: ['style.css'],
        }), 
        __metadata('design:paramtypes', [])
    ], LoginErrorDimmerComponent);
    return LoginErrorDimmerComponent;
}(core_1.OnInit));
exports.LoginErrorDimmerComponent = LoginErrorDimmerComponent;
//# sourceMappingURL=login-error-dimmer.component.js.map