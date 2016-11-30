/**
 * Created by Administrator on 2016/10/10.
 */
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
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var beapi_service_1 = require("../../../../services/beapi.service");
var template_service_1 = require("../../../../services/template.service");
var DashboardComponent = (function (_super) {
    __extends(DashboardComponent, _super);
    function DashboardComponent(router, beApiService, templateService) {
        _super.call(this);
        this.router = router;
        this.beApiService = beApiService;
        this.templateService = templateService;
        this.imgSrc = '';
        this.fields = [
            { name: 'anxing', type: 'image' }
        ];
    }
    DashboardComponent.prototype.ngOnInit = function () {
    };
    DashboardComponent.prototype.test = function () {
        console.log('test');
        var img = document.getElementById('background-content-div');
    };
    DashboardComponent.prototype.addField = function (field) {
        console.log('field in : ' + JSON.stringify(field));
    };
    DashboardComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: 'dashboard.html',
            styleUrls: ['dashboard.css'],
        }), 
        __metadata('design:paramtypes', [router_1.Router, beapi_service_1.BeApiService, template_service_1.TemplateService])
    ], DashboardComponent);
    return DashboardComponent;
}(core_1.OnInit));
exports.DashboardComponent = DashboardComponent;
//# sourceMappingURL=dashboard.component.js.map