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
var http_1 = require("@angular/http");
var urls = {
    login: 'user/user/login',
    getEventTemplateList: 'dm/wechatDm/listWxEvent',
    getEventTemplateListByPagination: 'dm/wechatDm/listWxEventByPagination',
    deleteTemplate: 'admin/eventmgt/deleteEvent',
    uploadTemporaryImgByAdmin: 'dm/assets/uploadTemporaryImgByAdmin'
};
var FaevaBeApiService = (function () {
    function FaevaBeApiService(http) {
        this.http = http;
        this.urls = urls;
        this.beDomain = 'http://54.223.38.102:3000/development/';
    }
    FaevaBeApiService.prototype.getUrl = function (url) {
        return this.beDomain + this.urls[url];
    };
    return FaevaBeApiService;
}());
FaevaBeApiService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], FaevaBeApiService);
exports.FaevaBeApiService = FaevaBeApiService;
//# sourceMappingURL=faeva-beapi.service.js.map