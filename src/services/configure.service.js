/**
 * Created by Administrator on 2016/10/10.
 */
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
var core_1 = require("@angular/core");
var application_1 = require("../config/application");
var ConfigureService = (function () {
    function ConfigureService() {
        this._separated = ':';
    }
    ConfigureService.prototype.get = function (keyStr) {
        var keys = keyStr.split(this._separated);
        var result = application_1.config;
        for (var key in keys) {
            result = result[keys[key]];
            if (result == null) {
                break;
            }
        }
        return result;
    };
    ConfigureService.prototype.setSeparated = function (sp) {
        this._separated = sp;
    };
    ConfigureService.prototype.all = function () {
    };
    return ConfigureService;
}());
ConfigureService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], ConfigureService);
exports.ConfigureService = ConfigureService;
//# sourceMappingURL=configure.service.js.map