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
var core_1 = require('@angular/core');
var template_service_1 = require("../../../../services/template.service");
var element_component_1 = require("./element.component");
var ElementBorderComponent = (function (_super) {
    __extends(ElementBorderComponent, _super);
    function ElementBorderComponent(app, renderer, templateService) {
        _super.call(this);
        this.renderer = renderer;
        this.templateService = templateService;
        this.prop = {};
        this.tempEle = {}; //用来保存拖动组件时的组件属性数据
        this.app = app;
    }
    ElementBorderComponent.prototype.ngOnInit = function () {
        this.border = this.border.nativeElement;
        this.tempEle = this.app.ele;
        this.ele = JSON.parse(JSON.stringify(this.app.ele));
    };
    ElementBorderComponent.prototype.onclick = function (event) {
        console.log('border click event');
        event.stopImmediatePropagation();
        return false;
    };
    ElementBorderComponent.prototype.changeEleEvent = function () {
    };
    ElementBorderComponent.prototype.onEleDblclick = function (event) {
    };
    ElementBorderComponent.prototype.onEleDragstart = function (event) {
        this.tempEle = this.app.ele;
        var ele = this.app.ele;
        var borderEle = this.border;
        var showAreaEle = borderEle.getElementsByClassName('element-area')[0];
        this.renderer.setElementStyle(showAreaEle, 'display', 'block');
        this.renderer.setElementStyle(showAreaEle, 'width', ele.width + 'px');
        this.renderer.setElementStyle(showAreaEle, 'height', ele.height + 'px');
        // let clientX = event.clientY;
        // let clientY = event.clientY;
        // let x = event.x;
        // let y = event.y;
        // let pageX = event.pageX;
        // let pageY = event.pageY;
        // let screenX = event.screenX;
        // let screenY = event.screenY;
        // let offsetX = event.offsetX;
        // let offsetY = event.offsetY
        /*console.log('clientX : ' + clientX);
        console.log('clientY : ' + clientY);
        console.log('x : ' + x);
        console.log('y : ' + y);
        console.log('pageX : ' + pageX);
        console.log('pageY : ' + pageY);
        console.log('screenX : ' + screenX);
        console.log('offsetY : ' + offsetY);
*/
        event.stopImmediatePropagation();
    };
    ElementBorderComponent.prototype.onEleDragend = function (event) {
        var borderEle = this.border;
        var showAreaEle = borderEle.getElementsByClassName('element-area')[0];
        this.renderer.setElementStyle(showAreaEle, 'display', 'none');
        event.stopImmediatePropagation();
    };
    ElementBorderComponent.prototype.onEleDragover = function (event) {
        console.log('over -----------------');
        event.stopImmediatePropagation();
    };
    ElementBorderComponent.prototype.onDrag = function (event) {
        var x = event.x;
        var y = event.y;
        var pageX = event.pageX;
        var pageY = event.pageY;
        var cha = pageX - this.app.ele.px;
        var width = (this.app.ele.width + (-cha));
        // this.ele.width = width;
        var borderEle = this.border;
        var showAreaEle = borderEle.getElementsByClassName('element-area')[0];
        this.renderer.setElementStyle(showAreaEle, 'display', 'block');
        this.renderer.setElementStyle(showAreaEle, 'width', width + 'px');
        this.renderer.setElementStyle(showAreaEle, 'height', width + 'px');
        console.log(this.app.ele.width);
        // console.log('cha : ' + cha);
        // console.log('width : ' + width);
        // console.log('clientX : ' + clientX);
        // console.log('clientY : ' + clientY);
        // console.log('x : ' + x);
        // console.log('y : ' + y);
        // console.log('pageX : ' + pageX);
        // console.log('pageY : ' + pageY);
        // console.log('screenX : ' + screenX);
        // console.log('offsetY : ' + offsetY);
        // let obj3 = <HTMLElement>event.target;
        // let obj3 = <HTMLElement>event.currentTarget;
        /*
                console.log('top : ' + obj3.style.top);
                console.log('left : ' + obj3.style.left);
                console.log('clientX : ' + obj3.clientLeft);
                console.log('clientY : ' + obj3.clientTop);
                console.log('offsetX : ' + obj3.offsetLeft);
                console.log('offsetY : ' + obj3.offsetTop);
                console.log('style : ' + JSON.stringify(obj3.style));
        
        
        
                console.log('className : ' +  obj3.className);
                // console.log('targe : ' + obj2);
        
                event.stopImmediatePropagation();*/
        event.stopImmediatePropagation();
    };
    __decorate([
        core_1.ViewChild('eleDragBorder'), 
        __metadata('design:type', Object)
    ], ElementBorderComponent.prototype, "border", void 0);
    ElementBorderComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'ax-element-border',
            templateUrl: 'element-border.html',
            styleUrls: ['element-border.css'],
        }),
        __param(0, core_1.Host()),
        __param(0, core_1.Inject(core_1.forwardRef(function () { return element_component_1.ElementComponent; }))), 
        __metadata('design:paramtypes', [element_component_1.ElementComponent, core_1.Renderer, template_service_1.TemplateService])
    ], ElementBorderComponent);
    return ElementBorderComponent;
}(core_1.OnInit));
exports.ElementBorderComponent = ElementBorderComponent;
//# sourceMappingURL=element-border.component.js.map