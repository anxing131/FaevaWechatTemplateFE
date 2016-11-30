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
 *
 *  使用 DragDrop event系列来实现的, 不过中间出现一个小小的问题(有时拖下拖下边框就变成屏幕的高度, 或者变成0, 不是想要的效果, 暂时没有解决这个问题),
 *  便采用用mouse event 来实现, 效果还不错, 没有上面所说的问题
 */
var core_1 = require('@angular/core');
var BorderComponent = (function (_super) {
    __extends(BorderComponent, _super);
    function BorderComponent() {
        _super.call(this);
        this.ele = {
            angle: 0,
            px: 200,
            py: 200,
            width: 300,
            height: 300
        };
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
        this.changeEvent = new core_1.EventEmitter();
    }
    BorderComponent.prototype.ngOnInit = function () {
    };
    BorderComponent.prototype.onclick = function (event) {
        console.log('onclick ...');
    };
    BorderComponent.prototype.changeEleEvent = function () {
    };
    BorderComponent.prototype.onEleDblclick = function (event) {
        console.log('onEleDblclick ...');
    };
    BorderComponent.prototype.onEleDragstart = function (event, type) {
        console.log('onEleDragstart');
        this.originEle = JSON.parse(JSON.stringify(this.ele));
        this.dragViewData = JSON.parse(JSON.stringify(this.ele));
        if (type == 'element') {
            this.dragViewData.display2 = 'block';
            this.oldPx = event.pageX;
            this.oldPy = event.pageY;
        }
        else {
            this.elementDraggable = false;
            this.dragViewData.display = 'block';
            console.log('in-----------------------');
        }
        this.dragButType = type;
        this.dragViewData.px = 0;
        this.dragViewData.py = 0;
        event.stopImmediatePropagation();
    };
    BorderComponent.prototype.onEleDragend = function (event) {
        this.dragViewData.px += this.ele.px;
        this.dragViewData.py += this.ele.py;
        this.ele = JSON.parse(JSON.stringify(this.dragViewData));
        delete this.ele.display;
        delete this.ele.display2;
        this.dragViewData.display2 = 'none';
        this.dragViewData.display = 'none';
        this.elementDraggable = true;
        console.log('this.dragViewData : ' + JSON.stringify(this.dragViewData));
        event.stopImmediatePropagation();
    };
    BorderComponent.prototype.onEleDragover = function (event) {
    };
    /**
     *
     *  @param event
     *  @param type  left-top | top | right-top | right | right-bottom | left-bottom | left
     */
    BorderComponent.prototype.onDrag = function (event) {
        switch (this.dragButType) {
            case 'left-top':
                this.onDragOfLeftTop(event);
                break;
            case 'top':
                this.onDragOfTop(event);
                break;
            case 'right-top':
                this.onDragOfRightTop(event);
                break;
            case 'right':
                this.onDragOfRight(event);
                break;
            case 'right-bottom':
                this.onDragOfRightBottom(event);
                break;
            case 'bottom':
                this.onDragOfBottom(event);
                break;
            case 'left-bottom':
                this.onDragOfLeftBottom(event);
                break;
            case 'left':
                this.onDragOfLeft(event);
                break;
            case 'element':
                this.onDragOfElement(event);
                break;
            default:
                console.error("Drag type(" + this.dragButType + ") un-support!");
        }
        event.stopImmediatePropagation();
    };
    BorderComponent.prototype.onDragOfLeftTop = function (event) {
        var pagex = event.pageX;
        var pagey = event.pageY;
        //获取右下角坐标
        var rY = this.originEle.height + this.originEle.py;
        var rX = this.originEle.width + this.originEle.px;
        var newHeight = Math.abs(pagey - rY);
        var newWidth = Math.abs(pagex - rX);
        if (pagex > rX) {
            this.dragViewData.px = rX - this.ele.px;
            this.dragViewData.width = 0;
        }
        else {
            this.dragViewData.px = pagex - this.ele.px;
            this.dragViewData.width = Math.abs(newWidth);
        }
        if (pagey > rY) {
            this.dragViewData.py = rY - this.ele.py;
            this.dragViewData.height = 0;
        }
        else {
            this.dragViewData.py = pagey - this.ele.py;
            this.dragViewData.height = Math.abs(newHeight);
        }
    };
    BorderComponent.prototype.onDragOfTop = function (event) {
        var pagey = event.pageY;
        //获取右下角坐标
        var rY = this.originEle.height + this.originEle.py;
        var newHeight = Math.abs(pagey - rY);
        if (pagey > rY) {
            this.dragViewData.py = rY - this.ele.py;
            this.dragViewData.height = 0;
        }
        else {
            this.dragViewData.py = pagey - this.ele.py;
            this.dragViewData.height = Math.abs(newHeight);
        }
    };
    BorderComponent.prototype.onDragOfRightTop = function (event) {
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
            this.dragViewData.py = rY - this.ele.py;
            this.dragViewData.height = 0;
        }
        else {
            this.dragViewData.py = pagey - this.ele.py;
            this.dragViewData.height = Math.abs(newHeight);
        }
    };
    BorderComponent.prototype.onDragOfRight = function (event) {
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
    BorderComponent.prototype.onDragOfRightBottom = function (event) {
        var pagex = event.pageX;
        var pagey = event.pageY;
        //获取右下角坐标
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
    BorderComponent.prototype.onDragOfBottom = function (event) {
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
    BorderComponent.prototype.onDragOfLeftBottom = function (event) {
        var pagey = event.pageY;
        var pagex = event.pageX;
        //获取右上角坐标
        var rY = this.originEle.py;
        var rX = this.originEle.width + this.originEle.px;
        var newHeight = Math.abs(pagey - rY);
        var newWidth = Math.abs(pagex - rX);
        if (pagex > rX) {
            this.dragViewData.px = rX - this.ele.px;
            this.dragViewData.width = 0;
        }
        else {
            this.dragViewData.px = pagex - this.ele.px;
            this.dragViewData.width = Math.abs(newWidth);
        }
        if (pagey < rY) {
            this.dragViewData.py = rY - this.ele.py;
            this.dragViewData.height = 0;
        }
        else {
            this.dragViewData.py = pagey - newHeight - this.ele.py;
            this.dragViewData.height = Math.abs(newHeight);
        }
    };
    BorderComponent.prototype.onDragOfLeft = function (event) {
        var pagex = event.pageX;
        //获取右上角坐标
        var rX = this.originEle.px + this.originEle.width;
        var newWidth = Math.abs(pagex - rX);
        if (pagex > rX) {
            this.dragViewData.width = 0;
        }
        else {
            this.dragViewData.px = pagex - this.ele.px;
            this.dragViewData.width = Math.abs(newWidth);
        }
    };
    BorderComponent.prototype.onDragOfElement = function (event) {
        var pagex = event.pageX;
        var pagey = event.pageY;
        var x = pagex - this.oldPx;
        var y = pagey - this.oldPy;
        this.dragViewData.px = x;
        this.dragViewData.py = y;
    };
    BorderComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-border',
            templateUrl: 'border.html',
            styleUrls: ['border.css'],
        }), 
        __metadata('design:paramtypes', [])
    ], BorderComponent);
    return BorderComponent;
}(core_1.OnInit));
exports.BorderComponent = BorderComponent;
//# sourceMappingURL=border.component.js.map