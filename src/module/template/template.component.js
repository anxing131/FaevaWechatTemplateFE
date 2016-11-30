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
 * Created by Administrator on 2016/10/9.
 */
var core_1 = require('@angular/core');
require('./rxjs-operators');
var template_service_1 = require("../../services/template.service");
var TemplateComponent = (function () {
    function TemplateComponent(templateService) {
        this.templateService = templateService;
    }
    TemplateComponent.prototype.test = function () {
    };
    TemplateComponent.prototype.onStorage = function (event) {
        switch (event.key) {
            case 'templateData':
                var templateData = localStorage.getItem('templateData');
                this.templateService = JSON.parse(templateData);
                break;
            default:
                break;
        }
    };
    __decorate([
        core_1.HostListener('window:storage', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [StorageEvent]), 
        __metadata('design:returntype', void 0)
    ], TemplateComponent.prototype, "onStorage", null);
    TemplateComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-template',
            templateUrl: 'template.html',
            styleUrls: ['template.css'],
            encapsulation: core_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [template_service_1.TemplateService])
    ], TemplateComponent);
    return TemplateComponent;
}());
exports.TemplateComponent = TemplateComponent;
//# sourceMappingURL=template.component.js.map