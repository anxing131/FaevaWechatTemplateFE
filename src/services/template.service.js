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
 * Created by Administrator on 2016/10/25.
 */
var core_1 = require("@angular/core");
var Rx = require("rxjs/rx");
var TemplateService = (function () {
    function TemplateService() {
        this.changeTextSubject = new Rx.Subject();
        this.currentElement = {
            _id: 'id1',
            name: "tesd",
            type: 'text',
            width: 80,
            height: 45,
            px: 34,
            py: 35,
            fontSize: 80,
            fontWeight: 23,
            angle: 0,
            borderRadius: '45%',
            color: '0905ff',
            opacity: 1
        };
        this.showFlag = true;
        this.bg = 'src/assets/img/drawable-xxhdpi-icon.png';
        this.width = '200';
        this.height = '200';
        this.elements = [
            {
                _id: 'id1',
                name: "tesd",
                type: 'text',
                width: 80,
                height: 45,
                px: 34,
                py: 35,
                fontSize: 80,
                fontWeight: 23,
                angle: 0,
                borderRadius: '45%',
                color: '0905ff',
                opacity: 1
            },
            { _id: 'id2', name: "qrCode", type: 'img', width: 45, height: 45, px: 54, py: 55, angle: 0, borderRadius: '0%', opacity: 1 }
        ];
        this.changeTextSubject.subscribe({
            next: function (param) {
                console.log('param : ' + param);
            }
        });
    }
    TemplateService.prototype.addEle = function (ele) {
        this.elements.push(ele);
        console.log('addEle : ' + JSON.stringify(this.elements));
    };
    TemplateService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], TemplateService);
    return TemplateService;
}());
exports.TemplateService = TemplateService;
//# sourceMappingURL=template.service.js.map