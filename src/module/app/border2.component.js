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
/**
 * Created by AnXing on 2016/10/26.
 *
 *  使用mouse event 系列来实现,
 *
 *  还有一个是使用DragDrop event系列来实现的, 不过中间出现一个小小的问题(有时拖下拖下边框就变成屏幕的高度, 或者变成0, 不是想要的效果, 暂时没有解决这个问题),
 *  便采用用mouse event 来实现, 效果还不错, 没有上面所说的问题
 *
 *  @notice 这个版本存在一个旋转后, 拖动UI走位的问题, 下次有时间再来解决
 */
var core_1 = require('@angular/core');
var template_service_1 = require("../../services/template.service");
var Border2Component = (function (_super) {
    __extends(Border2Component, _super);
    function Border2Component(renderer, templateService) {
        _super.call(this);
        this.renderer = renderer;
        this.templateService = templateService;
        this.ele = {
            angle: 0,
            px: 200,
            py: 200,
            width: 300,
            height: 300
        };
        //尝试使用renderer.setElelmentStyle 去控制display, 不知为什么导致其他拖动的图标没有显示,
        //发现在Html 上使用angular2 的ngStyle 可以解决这个问题
        this.rotatingDisplay = 'none';
        //拖动时的临时数据
        this.dragViewData = {
            angle: 0,
            px: 0,
            py: 0,
            width: 0,
            height: 0,
            display: 'none'
        };
        //整个element是否可以拖动
        this.elementDraggable = true;
        /*
            元素右下角的坐标
        */
        this.rightBottomPoint = {
            x: 0,
            y: 0
        };
        /*
            元素左上角的坐标
         */
        this.leftTopPoint = {
            x: 0,
            y: 0
        };
        //元素拖动时发生改变的属性
        this.changeAttr = {};
        this.changeEvent = new core_1.EventEmitter();
    }
    Border2Component.prototype.ngOnInit = function () {
        this.templateService.currentElement = this.templateService.currentElement;
    };
    Border2Component.prototype.test = function () {
        console.log(' test this ele : ' + JSON.stringify(this.templateService.currentElement));
    };
    Border2Component.prototype.getAngle = function (start, end) {
        var diff_x = end.x - start.x, diff_y = end.y - start.y;
        //返回角度,不是弧度
        return 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
    };
    Border2Component.prototype.getAngle_bk = function (start, end) {
        var x = Math.abs(start.x - end.x);
        var y = Math.abs(start.y - end.y);
        var z = Math.sqrt(x * x + y * y);
        return Math.round((Math.asin(y / z) / Math.PI * 180));
    };
    Border2Component.prototype.ondblclick = function (event) {
        if (this.dragButType == 'element') {
            this.dimmer.show();
        }
    };
    Border2Component.prototype.mousedown = function (event, type) {
        // this.originEle = JSON.parse(JSON.stringify(this.templateService.currentElement));
        this.dragViewData = JSON.parse(JSON.stringify(this.templateService.currentElement));
        this.renderer.setElementStyle(this.tempDiv.nativeElement, 'display', 'block');
        if (type == 'element') {
            this.dragViewData.display2 = 'block';
            this.oldPx = event.pageX;
            this.oldPy = event.pageY;
        }
        else {
            this.elementDraggable = false;
            this.dragViewData.display = 'block';
            this.renderer.setElementStyle(this.tempDiv.nativeElement, 'display', 'block');
            var cursor = 'default';
            switch (type) {
                case 'left-top':
                    cursor = 'nw-resiz';
                    break;
                case 'top':
                    cursor = 'n-resize';
                    break;
                case 'right-top':
                    cursor = 'ne-resize';
                    break;
                case 'right':
                    cursor = 'e-resize';
                    break;
                case 'right-bottom':
                    cursor = 'se-resize';
                    break;
                case 'bottom':
                    cursor = 's-resize';
                    break;
                case 'left-bottom':
                    cursor = 'sw-resize';
                    break;
                case 'left':
                    cursor = 'w-resize';
                    break;
                default:
            }
            this.renderer.setElementStyle(this.myBorder.nativeElement, 'cursor', cursor);
        }
        this.dragButType = type;
        this.dragViewData.px = 0;
        this.dragViewData.py = 0;
        if (type == 'rotating') {
        }
        //因为rotating 在border里面, angle 是相对的, 这里要注意
        this.dragViewData.angle = 0;
        var cY = this.templateService.currentElement.py + this.templateService.currentElement.height / 2;
        var cX = this.templateService.currentElement.px + this.templateService.currentElement.width / 2;
        this.centerPoint = {
            x: cX,
            y: cY
        };
        var rbY = this.templateService.currentElement.height + this.templateService.currentElement.py;
        var rbX = this.templateService.currentElement.width + this.templateService.currentElement.px;
        this.rightBottomPoint = {
            x: rbX,
            y: rbY
        };
        this.originEle = JSON.parse(JSON.stringify(this.templateService.currentElement));
        event.preventDefault();
        event.stopImmediatePropagation();
    };
    /**
     *  element 拖动结束
     */
    Border2Component.prototype.mouseupForEnd = function (event) {
        this.renderer.setElementStyle(this.tempDiv.nativeElement, 'display', 'none');
        if (this.dragButType != 'element') {
            this.renderer.setElementStyle(this.myBorder.nativeElement, 'cursor', 'all-scroll');
        }
        if (this.dragButType == 'rotating') {
        }
        this.dragViewData.angle += this.templateService.currentElement.angle;
        this.dragViewData.px += this.templateService.currentElement.px;
        this.dragViewData.py += this.templateService.currentElement.py;
        this.templateService.currentElement = JSON.parse(JSON.stringify(this.dragViewData));
        delete this.templateService.currentElement.display;
        delete this.templateService.currentElement.display2;
        this.dragViewData.display2 = 'none';
        this.dragViewData.display = 'none';
        this.elementDraggable = true;
        for (var index in this.templateService.elements) {
            var tempEle = this.templateService.elements[index];
            if (this.templateService.currentElement._id == tempEle._id) {
                this.templateService.elements[index] = this.templateService.currentElement;
                break;
            }
        }
        console.log('change Ele : ' + JSON.stringify(this.templateService.currentElement));
        this.templateService.changeTextSubject.next(this.templateService.currentElement._id);
        event.stopImmediatePropagation();
    };
    Border2Component.prototype.mousemove = function (event) {
        switch (this.dragButType) {
            case 'left-top':
                this.onLeftTop(event);
                break;
            case 'top':
                this.onTop(event);
                break;
            case 'right-top':
                this.onRightTop(event);
                break;
            case 'right':
                this.onRight(event);
                break;
            case 'right-bottom':
                this.onRightBottom(event);
                break;
            case 'bottom':
                this.onBottom(event);
                break;
            case 'left-bottom':
                this.onLeftBottom(event);
                break;
            case 'left':
                this.onLeft(event);
                break;
            case 'element':
                this.onElement(event);
                break;
            case 'rotating':
                console.log('rotating move ');
                this.onRotating(event);
                break;
            default:
                console.error("Drag type(" + this.dragButType + ") un-support!");
        }
        event.stopImmediatePropagation();
    };
    Border2Component.prototype.mousemoveOfRotating = function (event) {
        if (!this.dragButType) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    };
    Border2Component.prototype.mouseoverOfBorder = function (event) {
        this.rotatingDisplay = 'block';
        event.preventDefault();
        event.stopImmediatePropagation();
    };
    Border2Component.prototype.mouseleaveOfBorder = function (event) {
        this.rotatingDisplay = 'none';
        event.preventDefault();
        event.stopPropagation();
    };
    Border2Component.prototype.changeEleEvent = function () {
    };
    Border2Component.prototype.onLeftTop = function (event) {
        var pagex = event.pageX;
        var pagey = event.pageY;
        //获取右下角坐标
        // let rY = this.originEle.height + this.originEle.py;
        // let rX = this.originEle.width + this.originEle.px;
        var rotatingPoint = this.getRotatingAfterPoint('rightBottom');
        var rX = rotatingPoint.x;
        var rY = rotatingPoint.y;
        var newHeight = Math.abs(pagey - rY);
        var newWidth = Math.abs(pagex - rX);
        if (pagex > rX) {
            this.dragViewData.px = rX - this.templateService.currentElement.px;
            this.dragViewData.width = 0;
        }
        else {
            this.dragViewData.px = pagex - this.templateService.currentElement.px;
            this.dragViewData.width = Math.abs(newWidth);
        }
        if (pagey > rY) {
            this.dragViewData.py = rY - this.templateService.currentElement.py;
            this.dragViewData.height = 0;
        }
        else {
            this.dragViewData.py = pagey - this.templateService.currentElement.py;
            this.dragViewData.height = Math.abs(newHeight);
        }
    };
    Border2Component.prototype.onTop = function (event) {
        var pagey = event.pageY;
        //获取右下角坐标
        var rY = this.originEle.height + this.originEle.py;
        var newHeight = Math.abs(pagey - rY);
        if (pagey > rY) {
            this.dragViewData.py = rY - this.templateService.currentElement.py;
            this.dragViewData.height = 0;
        }
        else {
            this.dragViewData.py = pagey - this.templateService.currentElement.py;
            this.dragViewData.height = Math.abs(newHeight);
        }
    };
    Border2Component.prototype.onRightTop = function (event) {
        var pagex = event.pageX;
        var pagey = event.pageY;
        //获取左下角坐标
        var rY = this.originEle.height + this.originEle.py;
        var rX = this.originEle.px;
        var newHeight = Math.abs(pagey - rY);
        var newWidth = Math.abs(pagex - rX);
        if (pagex > rX) {
            this.dragViewData.width = Math.abs(newWidth);
        }
        else {
            this.dragViewData.width = 0;
        }
        if (pagey > rY) {
            this.dragViewData.py = rY - this.templateService.currentElement.py;
            this.dragViewData.height = 0;
        }
        else {
            this.dragViewData.py = pagey - this.templateService.currentElement.py;
            this.dragViewData.height = Math.abs(newHeight);
        }
    };
    Border2Component.prototype.onRight = function (event) {
        var pagex = event.pageX;
        //获取右下角坐标
        var rX = this.originEle.px;
        var newWidth = Math.abs(pagex - rX);
        if (pagex < rX) {
            this.dragViewData.width = 0;
        }
        else {
            this.dragViewData.width = Math.abs(newWidth);
        }
    };
    Border2Component.prototype.onRightBottom = function (event) {
        var pagex = event.pageX;
        var pagey = event.pageY;
        //获取左上角坐标
        var rY = this.originEle.py;
        var rX = this.originEle.px;
        var newHeight = Math.abs(pagey - rY);
        var newWidth = Math.abs(pagex - rX);
        if (pagex < rX) {
            this.dragViewData.width = 0;
        }
        else {
            this.dragViewData.width = Math.abs(newWidth);
        }
        if (pagey < rY) {
            this.dragViewData.height = 0;
        }
        else {
            this.dragViewData.height = Math.abs(newHeight);
        }
    };
    Border2Component.prototype.onBottom = function (event) {
        var pagey = event.pageY;
        //获取右下角坐标
        var rY = this.originEle.py;
        var newHeight = Math.abs(pagey - rY);
        if (pagey < rY) {
            this.dragViewData.height = 0;
        }
        else {
            this.dragViewData.height = Math.abs(newHeight);
        }
    };
    Border2Component.prototype.onLeftBottom = function (event) {
        var pagey = event.pageY;
        var pagex = event.pageX;
        //获取右上角坐标
        var rY = this.originEle.py;
        var rX = this.originEle.width + this.originEle.px;
        var newHeight = Math.abs(pagey - rY);
        var newWidth = Math.abs(pagex - rX);
        if (pagex > rX) {
            this.dragViewData.px = rX - this.templateService.currentElement.px;
            this.dragViewData.width = 0;
        }
        else {
            this.dragViewData.px = pagex - this.templateService.currentElement.px;
            this.dragViewData.width = Math.abs(newWidth);
        }
        if (pagey < rY) {
            this.dragViewData.py = rY - this.templateService.currentElement.py;
            this.dragViewData.height = 0;
        }
        else {
            this.dragViewData.py = pagey - newHeight - this.templateService.currentElement.py;
            this.dragViewData.height = Math.abs(newHeight);
        }
    };
    Border2Component.prototype.onLeft = function (event) {
        var pagex = event.pageX;
        //获取右上角坐标
        var rX = this.originEle.px + this.originEle.width;
        var newWidth = Math.abs(pagex - rX);
        if (pagex > rX) {
            this.dragViewData.width = 0;
        }
        else {
            this.dragViewData.px = pagex - this.templateService.currentElement.px;
            this.dragViewData.width = Math.abs(newWidth);
        }
    };
    Border2Component.prototype.onElement = function (event) {
        var pagex = event.pageX;
        var pagey = event.pageY;
        //origin
        var x = pagex - this.oldPx;
        var y = pagey - this.oldPy;
        //元素旋转后再去拖动的算法好复杂, 暂时不去解决旋转后再拖动的UI走位问题
        // let y = -(pagex - this.oldPx);
        // let x = (pagey - this.oldPy);
        // console.log('x : ' + x);
        // console.log('y : ' + y);
        // let point = this.getRotatingPoint(this.centerPoint, {x: x, y: y}, this.templateService.currentElement.angle);
        // console.log('point : ' + JSON.stringify(point));
        this.dragViewData.px = x;
        this.dragViewData.py = y;
    };
    Border2Component.prototype.getPageX = function (ele) {
        return ele.offsetParent ? (ele.offsetLeft + this.getPageX(ele.offsetParent)) : ele.offsetLeft;
    };
    Border2Component.prototype.getPageY = function (ele) {
        return ele.offsetParent ? (ele.offsetTop + this.getPageY(ele.offsetParent)) : ele.offsetTop;
    };
    Border2Component.prototype.onRotating = function (event) {
        var target = event.target;
        // let rotating = <HTMLElement>target.parentElement.getElementsByClassName('border-rotating')[0].getElementsByClassName('rotating')[0];
        var rotating = target.parentElement.getElementsByClassName('top')[0];
        var pageX = this.originEle.px + this.originEle.width / 2;
        var pageY = this.originEle.py + this.originEle.height / 2;
        var start = {
            x: pageX,
            y: pageY
        };
        var end = {
            x: event.pageX,
            y: event.pageY
        };
        var angle = this.getAngle(start, end);
        if (event.pageX >= pageX) {
            angle += 90;
        }
        else {
            angle += 270;
        }
        this.dragViewData.angle = angle - this.templateService.currentElement.angle;
    };
    Border2Component.prototype.getRotatingAfterPoint = function (type) {
        if (type == 'leftTop') {
            return this.getRotatingPoint(this.centerPoint, this.leftTopPoint, this.templateService.currentElement.angle);
        }
        else if (type == 'rightBottom') {
            return this.getRotatingPoint(this.centerPoint, this.rightBottomPoint, this.templateService.currentElement.angle);
        }
        else {
            throw new TypeError("Unsupported type! -> " + type);
        }
    };
    //获取点point 以center为圆心旋转angle度后的坐标
    Border2Component.prototype.getRotatingPoint = function (center, point, angle) {
        var hudu = (2 * Math.PI / 360) * angle; //2*PI/360*角度
        var x1 = (point.x - center.x) * Math.cos(hudu) - (point.y - center.y) * Math.sin(hudu) + center.x;
        var y1 = (point.y - center.y) * Math.cos(hudu) + (point.x - center.x) * Math.sin(hudu) + center.y;
        // console.log('x1 : ' + x1);
        // console.log('y1 : ' + y1);
        return { x: x1, y: y1 };
    };
    __decorate([
        core_1.ViewChild('tempDiv'), 
        __metadata('design:type', Object)
    ], Border2Component.prototype, "tempDiv", void 0);
    __decorate([
        core_1.ViewChild('myBorder'), 
        __metadata('design:type', Object)
    ], Border2Component.prototype, "myBorder", void 0);
    __decorate([
        core_1.ViewChild('dimmer'), 
        __metadata('design:type', Object)
    ], Border2Component.prototype, "dimmer", void 0);
    Border2Component = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-border2',
            templateUrl: 'border2.html',
            styleUrls: ['border2.css'],
        }), 
        __metadata('design:paramtypes', [core_1.Renderer, template_service_1.TemplateService])
    ], Border2Component);
    return Border2Component;
}(core_1.OnInit));
exports.Border2Component = Border2Component;
//# sourceMappingURL=border2.component.js.map