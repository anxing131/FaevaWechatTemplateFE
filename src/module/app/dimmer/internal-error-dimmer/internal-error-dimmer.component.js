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
var InternalErrorDimmerComponent = (function (_super) {
    __extends(InternalErrorDimmerComponent, _super);
    function InternalErrorDimmerComponent(renderer, userService, faevaBeApiService, http, router, config) {
        var _this = _super.call(this) || this;
        _this.renderer = renderer;
        _this.userService = userService;
        _this.faevaBeApiService = faevaBeApiService;
        _this.http = http;
        _this.router = router;
        _this.config = config;
        return _this;
    }
    InternalErrorDimmerComponent.prototype.ngOnInit = function () {
    };
    InternalErrorDimmerComponent.prototype.show = function (showData) {
        this.data = {
            title: 'Internal Server Error',
            code: 500,
            details: JSON.stringify(showData)
        };
        setTimeout((function (obj) {
            return function () {
                $('.system-internal-error-dimmer').modal("setting", {
                    blurring: true,
                    allowMultiple: true,
                    onHide: function () {
                    },
                    onApprove: function () {
                    },
                    onDeny: function () {
                    }
                }).modal('show');
            };
        })(this), 10);
    };
    InternalErrorDimmerComponent.prototype.hide = function () {
        $('.system-internal-error-dimmer').modal('setting', {
            closable: true,
            allowMultiple: false
        }).modal('hide all');
    };
    return InternalErrorDimmerComponent;
}(core_1.OnInit));
InternalErrorDimmerComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'ax-internal-error-dimmer, [ax-internal-error-dimmer]',
        templateUrl: 'index.html',
        styleUrls: ['style.css'],
    }),
    __param(5, core_1.Inject('config')),
    __metadata("design:paramtypes", [core_1.Renderer,
        user_service_1.UserService,
        faeva_beapi_service_1.FaevaBeApiService,
        http_1.Http,
        router_1.Router, Object])
], InternalErrorDimmerComponent);
exports.InternalErrorDimmerComponent = InternalErrorDimmerComponent;
//# sourceMappingURL=internal-error-dimmer.component.js.map