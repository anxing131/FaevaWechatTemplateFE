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
var core_1 = require('@angular/core');
var template_service_1 = require("../../../../services/template.service");
var forms_1 = require("@angular/forms");
var ElementComponent = (function () {
    function ElementComponent(renderer, templateService) {
        this.renderer = renderer;
        this.templateService = templateService;
        // super();
        // console.log('subscribe - ' + templateService.changeStream.subscribe((param) => ));
        // templateService.changeStream.subscribe((param): any => {console.log('yser' + param); return true});
        // let Observer  = Observer.subscribe();
    }
    ElementComponent.prototype.ngOnChanges = function (changes) {
    };
    ElementComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.elementDiv = this.elementDiv.nativeElement;
        if (this.ele.type == 'text') {
            this.textSubscription = this.templateService.changeTextSubject.subscribe({
                next: function (eleId) {
                    if (_this.ele._id === eleId) {
                        var textLableEle = _this.textLabel.nativeElement;
                        _this.templateService.currentElement.width = textLableEle.offsetWidth;
                        _this.templateService.currentElement.height = textLableEle.style.fontSize;
                        console.log('style : ' + textLableEle.offsetHeight);
                        console.log('style : ' + textLableEle.offsetWidth);
                        console.log('style : ' + textLableEle.style.fontSize);
                    }
                }
            });
        }
    };
    ElementComponent.prototype.ngOnDestroy = function () {
        if (this.textSubscription) {
            this.textSubscription.unsubscribe();
        }
    };
    ElementComponent.prototype.resize = function (event) {
        console.log('resize : ' + event);
    };
    ElementComponent.prototype.onclick = function (event) {
        this.templateService.currentElement = this.ele;
        this.templateService.showFlag = true;
        console.log('onclick ele : ' + JSON.stringify(this.ele));
        return true;
    };
    ElementComponent.prototype.changeEleEvent = function () {
    };
    ElementComponent.prototype.onEleDblclick = function (event) {
        // $('.ui.modal').modal('show');
        var currentTarget = event.currentTarget;
        var modal = currentTarget.getElementsByClassName('mymodal')[0];
        // $(modal).modal('toggle');
        // $('.mymodal').modal("setting", {
        //     closable: true,
        //     onApprove: function () {
        //         return true;
        //     }
        // }).modal("show");
        // $(currentTarget).on
        // console.log('modal : ' + modal);
    };
    ElementComponent.prototype.onEleDragstart = function (event) {
        /*
        *  1、获取被拖动的标签位置
        *  2、获取鼠标点击时的位置
        *  3、由上条件得出位移差
        * */
        //1
        var mouseX = event.pageX;
        var mouseY = event.pageY;
        //2
        var target = event.currentTarget;
        var top = target.offsetTop;
        var left = target.offsetLeft;
        //3
        this.x = mouseX - left;
        this.y = mouseY - top;
    };
    ElementComponent.prototype.onEleDragend = function (event) {
        /*
        * 1、获取结束时的鼠标位置XY
        * 2、求出最后被拖动元素的最终位置xy
        * 3、改变被拖动元素的位置
        * */
        //1
        var pageX = event.pageX;
        var pageY = event.pageY;
        //2
        var left = pageX - this.x;
        var top = pageY - this.y;
        forms_1.Validators;
        this.ele.px = left;
        this.ele.py = top;
        // let target = event.currentTarget;
        // this.renderer.setElementStyle(target, 'top', top + '');
        // this.renderer.setElementStyle(target, 'left', left + '');
        console.log('top : ' + top);
        console.log('left : ' + left);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ElementComponent.prototype, "ele", void 0);
    __decorate([
        core_1.ViewChild('elementDiv'), 
        __metadata('design:type', Object)
    ], ElementComponent.prototype, "elementDiv", void 0);
    __decorate([
        core_1.ViewChild('testt'), 
        __metadata('design:type', Object)
    ], ElementComponent.prototype, "testt", void 0);
    __decorate([
        core_1.ViewChild('textLabel'), 
        __metadata('design:type', Object)
    ], ElementComponent.prototype, "textLabel", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ElementComponent.prototype, "index", void 0);
    ElementComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'ax-element',
            templateUrl: 'element.html',
            styleUrls: ['element.css'],
        }), 
        __metadata('design:paramtypes', [core_1.Renderer, template_service_1.TemplateService])
    ], ElementComponent);
    return ElementComponent;
}());
exports.ElementComponent = ElementComponent;
//# sourceMappingURL=element.component.js.map