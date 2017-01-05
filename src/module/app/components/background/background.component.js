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
 * Created by Administrator on 2016/10/26.
 */
var core_1 = require("@angular/core");
var template_service_1 = require("../../../../services/template.service");
var Rx_1 = require("rxjs/Rx");
var BackgroundComponent = BackgroundComponent_1 = (function () {
    function BackgroundComponent(renderer, templateService) {
        this.renderer = renderer;
        this.templateService = templateService;
    }
    BackgroundComponent.prototype.ngOnInit = function () {
        this.changeSubjection = BackgroundComponent_1.changeSubject.subscribe({
            next: function (p) {
                switch (p.event) {
                }
            }
        });
    };
    BackgroundComponent.prototype.ngOnDestroy = function () {
        this.changeSubjection.unsubscribe();
    };
    BackgroundComponent.prototype.drop = function (event) {
    };
    BackgroundComponent.prototype.onEleDblclick = function (event) {
    };
    BackgroundComponent.prototype.onEleDragstart = function (event) {
        //鼠标刚开始拖动的图标
        var currentTarget = event.currentTarget;
        // let clientX = event.clientX;
        // let clientY = event.clientY;
        //
        // //默认configure 配置是一个圆
        // let size = <number><any>(this._settingEle.style.width);
        // let eClientX = this._settingEle.offsetLeft - size/2;
        // let eClientY = this._settingEle.offsetTop - size/2;
        //
        // //斗正位移
        // this.x = clientX - eClientX;
        // this.y = clientY - eClientY;
        console.log('onDragstart');
    };
    BackgroundComponent.prototype.onEleDragend = function (event) {
        var pageX = event.pageX;
        var pageY = event.pageY;
        console.log('pageX : ' + pageX);
        console.log('pageY : ' + pageY);
        //drag start xy
        var movementX = event.movementX;
        var movementY = event.movementY;
        //鼠标拖动时的坐标
        var layerX = event.layerX;
        var layerY = event.layerY;
        var currentTarget = event.currentTarget;
        var clientX = event.clientX;
        var clientY = event.clientY;
        var screenX = event.screenX;
        var screenY = event.screenY;
        console.log('screenX : ' + screenX);
        console.log('screenY : ' + screenY);
        console.log('clientX : ' + clientX);
        console.log('clientY : ' + clientY);
        console.log('movementX : ' + movementX);
        console.log('movementY : ' + movementY);
        var x = (clientX - movementX);
        var y = (clientY - movementY);
        currentTarget.style.top = y + '';
        currentTarget.style.left = x + '';
        console.log('onDragend');
    };
    return BackgroundComponent;
}());
BackgroundComponent.changeSubject = new Rx_1.Subject();
BackgroundComponent = BackgroundComponent_1 = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'ax-background, [ax-background]',
        templateUrl: 'index.html',
        styleUrls: ['style.css'],
    }),
    __metadata("design:paramtypes", [core_1.Renderer,
        template_service_1.TemplateService])
], BackgroundComponent);
exports.BackgroundComponent = BackgroundComponent;
var BackgroundComponent_1;
//# sourceMappingURL=background.component.js.map