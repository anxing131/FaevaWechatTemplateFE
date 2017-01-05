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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/**
 * Created by Administrator on 2016/10/26.
 */
var core_1 = require("@angular/core");
var user_service_1 = require("../../../../services/user.service");
var http_1 = require("@angular/http");
var faeva_beapi_service_1 = require("../../../../services/faeva-beapi.service");
var router_1 = require("@angular/router");
var user_1 = require("../../../../model/user");
var beapi_service_1 = require("../../../../services/beapi.service");
var LoginDimmerComponent = (function (_super) {
    __extends(LoginDimmerComponent, _super);
    function LoginDimmerComponent(renderer, userService, faevaBeApiService, beApiService, http, router, config) {
        var _this = _super.call(this) || this;
        _this.renderer = renderer;
        _this.userService = userService;
        _this.faevaBeApiService = faevaBeApiService;
        _this.beApiService = beApiService;
        _this.http = http;
        _this.router = router;
        _this.config = config;
        // @Input() ele: any;
        _this.jumpLink = '';
        _this.changeEmit = new core_1.EventEmitter();
        _this.pwdMiniLen = 6;
        console.log('login dimmer construct');
        return _this;
    }
    LoginDimmerComponent.prototype.ngOnInit = function () {
        $('.ax-login-form').form({
            fields: {
                name: {
                    identifier: 'name',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Please enter your name'
                        }
                    ]
                },
                password: {
                    identifier: 'password',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Please enter your password'
                        },
                        {
                            type: 'length[' + this.pwdMiniLen + ']',
                            prompt: 'Your password must be at least 6 characters'
                        }
                    ]
                }
            },
            onSuccess: (function (obj) {
                return function (event, fields) {
                    obj.login(fields);
                };
            })(this)
        });
    };
    LoginDimmerComponent.prototype.show = function (jumpLink) {
        if (!jumpLink) {
            this.jumpLink = this.config.get('defaultPage');
        }
        else {
            this.jumpLink = jumpLink;
        }
        console.log('show jumpLink : ' + this.jumpLink);
        $('.ax-login').modal("setting", {
            closable: false,
            allowMultiple: true,
            onHide: function () {
                console.log('ax-login onHide');
                return false;
            },
            onApprove: function () {
                console.log('ax-login onApprove');
                return false;
            },
            onDeny: function () {
                console.log('ax-login onDeny');
                return false;
            }
        }).modal('show');
    };
    LoginDimmerComponent.prototype.hide = function () {
        $('.ax-login').modal('setting', {
            closable: true,
            allowMultiple: false
        }).modal('hide all');
    };
    LoginDimmerComponent.prototype.login = function (userInfo) {
        var _this = this;
        // console.log('testData : ' + this.testData);
        for (var key in userInfo) {
            if (typeof userInfo[key] == 'string') {
                userInfo[key] = userInfo[key].trim();
            }
        }
        var name = userInfo.name, pwd = userInfo.password;
        var url = this.faevaBeApiService.getUrl('login');
        var body = JSON.stringify({
            ws: {
                userType: 'client',
                platformType: 'Builder',
                token: 'token123'
            },
            data: {
                name: name,
                pwd: pwd
            }
        });
        this.controlLoginDimmer();
        this.beApiService.commonReqByFaeva(url, body, null, function (result) {
            if (result.code == 200) {
                return _this.handleLoginSuccess(result);
            }
            else {
                return _this.handleLoginError(result);
            }
        });
    };
    LoginDimmerComponent.prototype.controlLoginDimmer = function (isOpen) {
        if (isOpen) {
            $('.ax-login-modal-dimmer').addClass('active');
        }
        else {
            $('.ax-login-modal-dimmer').removeClass('active');
        }
    };
    LoginDimmerComponent.prototype.showErrorModal = function () {
        console.log('showErrorModal');
        this.errorDimmer.show();
        // $('.ax-login-modal-error-alert').modal('show');
    };
    LoginDimmerComponent.prototype.handleLoginSuccess = function (result) {
        this.controlLoginDimmer(false);
        result.msg.id = result.msg.userId;
        delete result.msg.userId;
        var user = new user_1.User(result.msg);
        this.userService.login(user);
        setTimeout((function (obj) {
            return obj.router.navigate(['/' + obj.jumpLink]);
        })(this), 50);
        setTimeout((function (obj) {
            return obj.hide();
        })(this), 50);
    };
    LoginDimmerComponent.prototype.handleLoginError = function (result) {
        // this.isLoginning = true;
        if (typeof result == 'string') {
            result = JSON.parse(result);
        }
        this.controlLoginDimmer(false);
        var errorInfo = {
            code: result.code,
            title: '',
            details: JSON.stringify(result.msg) || ''
        };
        if (typeof result.msg == 'string') {
            errorInfo.title = result.msg;
        }
        switch (result.code) {
            case 500:
                errorInfo.title = '服务器内部错误';
                break;
            case 614:
                errorInfo.title = '用户名不存在';
                break;
            case 611:
                errorInfo.title = '密码错误';
                break;
            default:
                errorInfo.title = '未解决错误';
                break;
        }
        this.errorInfo = errorInfo;
        console.log('erroInfo : ' + JSON.stringify(this.errorInfo));
        setTimeout((function (obj) {
            return function () {
                obj.showErrorModal();
            };
        })(this), 50);
    };
    return LoginDimmerComponent;
}(core_1.OnInit));
__decorate([
    core_1.ViewChild('errorDimmer'),
    __metadata("design:type", Object)
], LoginDimmerComponent.prototype, "errorDimmer", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], LoginDimmerComponent.prototype, "changeEmit", void 0);
LoginDimmerComponent = __decorate([
    core_1.Directive({
        selector: '[testData]',
        exportAs: 'testData'
    }),
    core_1.Component({
        moduleId: module.id,
        selector: 'ax-login-form-dimmer, [ax-login-form-dimmer]',
        templateUrl: 'index.html',
        styleUrls: ['style.css'],
    }),
    __param(6, core_1.Inject('config')),
    __metadata("design:paramtypes", [core_1.Renderer,
        user_service_1.UserService,
        faeva_beapi_service_1.FaevaBeApiService,
        beapi_service_1.BeApiService,
        http_1.Http,
        router_1.Router, Object])
], LoginDimmerComponent);
exports.LoginDimmerComponent = LoginDimmerComponent;
//# sourceMappingURL=login-dimmer.component.js.map