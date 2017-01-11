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
var border2_component_1 = require("./../../border2.component");
/**
 * Created by Administrator on 2016/10/26.
 */
var core_1 = require("@angular/core");
var template_service_1 = require("../../../../services/template.service");
var forms_1 = require("@angular/forms");
var Rx_1 = require("rxjs/Rx");
var ElementComponent = ElementComponent_1 = (function () {
    function ElementComponent(renderer, templateService) {
        this.renderer = renderer;
        this.templateService = templateService;
        this.contentEditableFlag = false;
        // super();
        // console.log('subscribe - ' + templateService.changeStream.subscribe((param) => ));
        // templateService.changeStream.subscribe((param): any => {console.log('yser' + param); return true});
        // let Observer  = Observer.subscribe();
    }
    ElementComponent.prototype.ngOnChanges = function (changes) {
    };
    ElementComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!ElementComponent_1.changeSubscription) {
            ElementComponent_1.changeSubscription = ElementComponent_1.changeSubject.subscribe({
                next: function (data) {
                    console.log('element change : ', data);
                    switch (data.event) {
                        case 'moveUpOne':
                            _this.moveUpOne(data);
                            break;
                        case 'moveDownOne':
                            _this.moveDownOne(data);
                            break;
                        case 'moveToTop':
                            _this.moveToTop(data);
                            break;
                        case 'moveToBottom':
                            _this.moveToBottom(data);
                            break;
                    }
                }
            });
        }
        if (this.ele.type == 'text') {
            setTimeout(function () {
                var hasFlag = false;
                ElementComponent_1.textInit.forEach(function (item) {
                    if (item == _this.ele._id) {
                        hasFlag = true;
                    }
                });
                if (!hasFlag) {
                    ElementComponent_1.textInit.push(_this.ele._id);
                    var textLableEle_1 = _this.textLabel.nativeElement;
                    _this.templateService.elements.forEach(function (item, index, elements) {
                        if (_this.ele._id == item._id) {
                            var text = textLableEle_1.innerText;
                            var textSize = text.replace(/[\u0391-\uFFE5]/g, "aa").length;
                            // item.height = textLableEle.offsetHeight;
                            item.height = item.fontSize;
                            item.width = (textSize * item.fontSize) / 2 + item.fontSize / 4;
                            if (_this.templateService.currentElement._id == _this.ele._id) {
                                _this.templateService.currentElement = item;
                            }
                            return item;
                        }
                    });
                }
            }, 20);
            this.textSubscription = this.templateService.changeTextSubject.subscribe({
                next: function (eleId) {
                    if (_this.ele._id === eleId) {
                        var textLableEle = _this.textLabel.nativeElement;
                        // this.templateService.currentElement.width = textLableEle.offsetWidth;
                        // this.templateService.currentElement.height = textLableEle.offsetHeight;
                        _this.templateService.currentElement.name = textLableEle.innerText;
                        for (var index in _this.templateService.elements) {
                            var tempEle = _this.templateService.elements[index];
                            if (eleId == tempEle._id) {
                                _this.templateService.elements[index] = _this.templateService.currentElement;
                                break;
                            }
                        }
                    }
                }
            });
            this.borderSubscription = border2_component_1.Border2Component.changeSubject.subscribe({
                next: function (data) {
                    if (_this.ele._id != data.id) {
                        return;
                    }
                    _this.contentEditableFlag = true;
                    var textLabel = _this.textLabel.nativeElement;
                    textLabel.focus();
                    _this.collapseToEnd(textLabel);
                }
            });
        }
    };
    //上移一层
    ElementComponent.prototype.moveUpOne = function (data) {
        this.templateService.elements.forEach(function (item, index, elements) {
            if (item._id == ElementComponent_1.currentRightMenuId && item.zIndex < (template_service_1.TemplateService.minZIndex + elements.length)) {
                elements[index].zIndex += 1;
            }
        });
    };
    //下移一层
    ElementComponent.prototype.moveDownOne = function (data) {
        this.templateService.elements.forEach(function (item, index, elements) {
            console.log('item : ', item);
            if (item._id == ElementComponent_1.currentRightMenuId && item.zIndex > template_service_1.TemplateService.minZIndex) {
                elements[index].zIndex -= 1;
                console.log('yes down one ');
            }
        });
    };
    //移至底层
    ElementComponent.prototype.moveToBottom = function (data) {
        this.templateService.elements.forEach(function (item, index, elements) {
            if (item._id == ElementComponent_1.currentRightMenuId) {
                elements[index].zIndex = template_service_1.TemplateService.minZIndex;
            }
        });
    };
    ElementComponent.prototype.moveToTop = function (data) {
        this.templateService.elements.forEach(function (item, index, elements) {
            if (item._id == ElementComponent_1.currentRightMenuId) {
                elements[index].zIndex = template_service_1.TemplateService.minZIndex + elements.length;
            }
        });
    };
    ElementComponent.prototype.collapseToCusotom = function (data) {
        var target = this.textLabel.nativeElement;
        var range = document.createRange();
        var sel = window.getSelection();
        range.setStart(target, 0);
        range.setEnd(target, 5);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    };
    //将光标定位到最后
    ElementComponent.prototype.collapseToEnd = function (obj) {
        if (window.getSelection) {
            obj.focus(); //解决ff不获取焦点无法定位问题
            var range = window.getSelection(); //创建range
            range.selectAllChildren(obj); //range 选择obj下所有子内容
            range.collapseToEnd(); //光标移至最后
        }
        //放弃IE
        // else if (document.selection) {//ie10 9 8 7 6 5
        //     var range = document.selection.createRange();//创建选择对象
        //     //var range = document.body.createTextRange();
        //     range.moveToElementText(obj);//range定位到obj
        //     range.collapse(false);//光标移至最后
        //     range.select();
        // }
    };
    ElementComponent.prototype.ngOnDestroy = function () {
        if (this.textSubscription) {
            this.textSubscription.unsubscribe();
            this.borderSubscription.unsubscribe();
        }
        // if(ElementComponent.changeSubscription){
        //     ElementComponent.changeSubscription.unsubscribe();
        // }
    };
    ElementComponent.prototype.resize = function (event) {
        if (this.ele.type == 'text') {
            var textLableEle = this.textLabel.nativeElement;
            if (this.ele.clamp != -1) {
                var height = this.ele.fontSize * this.ele.clamp;
                if (height > textLableEle.offsetHeight) {
                    this.templateService.currentElement.height = textLableEle.offsetHeight;
                }
                else {
                    this.templateService.currentElement.height = height;
                }
            }
            else {
                if (textLableEle.offsetHeight > this.templateService.currentElement.height) {
                    this.templateService.currentElement.height = textLableEle.offsetHeight;
                }
            }
        }
    };
    ElementComponent.prototype.contextmenu = function (event) {
        border2_component_1.Border2Component.changeSubject.next({ event: 'showRightClickMenu', eleId: this.ele._id, eventObj: event });
        event.stopImmediatePropagation();
        return false;
    };
    ElementComponent.prototype.onclick = function (event) {
        //close right menu 
        border2_component_1.Border2Component.changeSubject.next({ event: 'closeRightMenu' });
        border2_component_1.Border2Component.changeSubject.next({ event: 'elementClict' });
        var currentElement = this.ele;
        this.templateService.currentElement = this.ele;
        this.templateService.showFlag = true;
        //超出高度解决方案
        if (currentElement.type == 'text') {
            if (currentElement.clamp != -1) {
                //借用其他工具来解决高度问题
                $clamp(this.textLabel.nativeElement, { clamp: 3 });
            }
        }
        console.log('onclick ele : ' + JSON.stringify(this.ele));
        event.stopImmediatePropagation();
        return false;
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
    return ElementComponent;
}());
ElementComponent.changeSubject = new Rx_1.Subject();
ElementComponent.textInit = [];
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ElementComponent.prototype, "ele", void 0);
__decorate([
    core_1.ViewChild('elementDiv'),
    __metadata("design:type", Object)
], ElementComponent.prototype, "elementDiv", void 0);
__decorate([
    core_1.ViewChild('testt'),
    __metadata("design:type", Object)
], ElementComponent.prototype, "testt", void 0);
__decorate([
    core_1.ViewChild('textLabel'),
    __metadata("design:type", Object)
], ElementComponent.prototype, "textLabel", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], ElementComponent.prototype, "index", void 0);
ElementComponent = ElementComponent_1 = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'ax-element, [ax-element]',
        templateUrl: 'element.html',
        styleUrls: ['element.css'],
    }),
    __metadata("design:paramtypes", [core_1.Renderer,
        template_service_1.TemplateService])
], ElementComponent);
exports.ElementComponent = ElementComponent;
var ElementComponent_1;
//# sourceMappingURL=element.component.js.map