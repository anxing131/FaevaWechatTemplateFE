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
var element_component_1 = require("./components/background/element.component");
var dashboard_component_1 = require("./components/dashboard/dashboard.component");
/**
 * Created by AnXing on 2016/10/26.
 *
 *  使用mouse event 系列来实现,
 *
 *  还有一个是使用DragDrop event系列来实现的, 不过中间出现一个小小的问题(有时拖下拖下边框就变成屏幕的高度, 或者变成0, 不是想要的效果, 暂时没有解决这个问题),
 *  便采用用mouse event 来实现, 效果还不错, 没有上面所说的问题
 *
 *  @notice 这个版本存在一个旋转后, 拖动UI走位的问题, 下次有时间再来解决
 *  @notice 截止(20161223), 已解决UI走位问题
 */
var core_1 = require("@angular/core");
var template_service_1 = require("../../services/template.service");
var Rx_1 = require("rxjs/Rx");
var Border2Component = Border2Component_1 = (function () {
    function Border2Component(renderer, templateService) {
        this.renderer = renderer;
        this.templateService = templateService;
        this.tempZIndex = 0;
        this.ele = {
            angle: 0,
            px: 200,
            py: 200,
            width: 300,
            height: 300
        };
        //以底图居中放置, 相对界面的偏移量
        this.offsetWidth = 0;
        this.offsetHeight = 0;
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
        //用来标记是否正在伸缩中（按怅色）
        this.scalingFlag = false;
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
        this.changeEvent = new core_1.EventEmitter();
    }
    Border2Component.prototype.ngOnInit = function () {
        var _this = this;
        this.templateService.currentElement = this.templateService.currentElement;
        this.changeSubjection = Border2Component_1.changeSubject.filter(function (data) { return data.event == 'closeRightMenu' || data.event == 'closeBorder'; }).subscribe(function (data) {
            if (data.event == 'closeRightMenu') {
                _this.closeRightMenu();
            }
            else {
                _this.closeBorder();
            }
        });
        this.changeSubjection2 = Border2Component_1.changeSubject.subscribe(function (data) {
            switch (data.event) {
                case 'elementClict':
                    setTimeout(function () {
                        _this.tempZIndex = _this.templateService.currentElement.zIndex;
                    }, 20);
                    break;
                case 'showRightClickMenu':
                    _this.showRightClickMenuEle(data.eventObj, data.eleId);
                    break;
            }
        });
        console.log('boder init ....................  ');
    };
    Border2Component.prototype.closeBorder = function () {
        console.log('closeBorder ... ');
        this.templateService.showFlag = false;
    };
    Border2Component.prototype.ngOnDestroy = function () {
        this.changeSubjection.unsubscribe();
        this.changeSubjection2.unsubscribe();
        console.log('boder destroy ....................  ');
    };
    Border2Component.prototype.getAngle = function (start, end) {
        var diff_x = end.x - start.x, diff_y = end.y - start.y;
        //返回角度,不是弧度
        return 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
    };
    Border2Component.prototype.ondblclick = function (event) {
        if (this.dragButType == 'element') {
            this.dimmer.show();
        }
    };
    Border2Component.prototype.click = function (event, type) {
        switch (type) {
            case 'moveUpOne':
            case 'moveDownOne':
            case 'moveToBottom':
            case 'moveToTop':
                element_component_1.ElementComponent.changeSubject.next({
                    event: type
                });
                var rightClickMenuEle = this.rightClickMenu.nativeElement;
                this.renderer.setElementClass(rightClickMenuEle, 'menu-hide', true);
                break;
            default:
                if (this.templateService.currentElement.type == 'text') {
                    var data = {
                        id: this.templateService.currentElement._id,
                        event: 'TextClick',
                        mouseEvent: event,
                    };
                    Border2Component_1.changeSubject.next(data);
                }
        }
        event.stopImmediatePropagation();
        return false;
    };
    Border2Component.prototype.contextmenu = function (event) {
        this.showRightClickMenuEle(event, this.templateService.currentElement._id);
        event.stopImmediatePropagation();
        return false;
    };
    Border2Component.prototype.showRightClickMenuEle = function (event, eleId) {
        var tempBGDiv = $('#background-content-div');
        this.offsetHeight = tempBGDiv.offset().top;
        this.offsetWidth = tempBGDiv.offset().left;
        var pagey = event.pageY - 84 - this.offsetHeight;
        var pagex = event.pageX + 30 - this.offsetWidth;
        var rightClickMenuEle = this.rightClickMenu.nativeElement;
        this.renderer.setElementStyle(rightClickMenuEle, 'top', pagey + '');
        this.renderer.setElementStyle(rightClickMenuEle, 'left', pagex + '');
        this.renderer.setElementClass(rightClickMenuEle, 'menu-hide', false);
        element_component_1.ElementComponent.currentRightMenuId = eleId;
    };
    Border2Component.prototype.closeRightMenu = function () {
        this.renderer.setElementClass(this.rightClickMenu.nativeElement, 'menu-hide', true);
    };
    Border2Component.prototype.mouseup = function (event) {
        console.log('mouseup .... ');
    };
    Border2Component.prototype.mousedown = function (event, type) {
        var tempBGDiv = $('#background-content-div');
        this.offsetHeight = tempBGDiv.offset().top;
        this.offsetWidth = tempBGDiv.offset().left;
        //close right menu
        this.closeRightMenu();
        dashboard_component_1.DashboardComponent.changeSubject.next({ event: 'closeRightMenu' });
        this.scalingFlag = true;
        this.templateService.currentElement.height = parseInt(this.templateService.currentElement.height);
        this.templateService.currentElement.py = parseInt(this.templateService.currentElement.py);
        this.templateService.currentElement.px = parseInt(this.templateService.currentElement.px);
        this.dragViewData = JSON.parse(JSON.stringify(this.templateService.currentElement));
        this.renderer.setElementStyle(this.tempDiv.nativeElement, 'display', 'block');
        if (type == 'element') {
        }
        else {
            this.elementDraggable = false;
            this.dragViewData.display = 'block';
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
        var x = event.pageX - this.dragViewData.px;
        var y = event.pageY - this.dragViewData.py;
        this.diffX = x;
        this.diffY = y;
        // this.dragViewData.px -= (event.pageX - this.dragViewData.px);
        // this.dragViewData.py -= (event.pageY - this.dragViewData.py);
        if (type == 'rotating') {
        }
        //因为rotating 在border里面, angle 是相对的, 这里要注意
        // this.dragViewData.angle = 0;
        this.leftTopPoint = {
            x: this.templateService.currentElement.px,
            y: this.templateService.currentElement.py
        };
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
        this.tempZIndex = this.templateService.currentElement.zIndex;
        this.scalingFlag = false;
        this.dragViewData.height = parseInt(this.dragViewData.height);
        this.dragViewData.py = parseInt(this.dragViewData.py);
        this.dragViewData.px = parseInt(this.dragViewData.px);
        this.renderer.setElementStyle(this.tempDiv.nativeElement, 'display', 'none');
        if (this.dragButType != 'element') {
            this.renderer.setElementStyle(this.myBorder.nativeElement, 'cursor', 'all-scroll');
        }
        if (this.dragButType == 'rotating') {
        }
        this.templateService.currentElement = null;
        this.templateService.currentElement = JSON.parse(JSON.stringify(this.dragViewData));
        delete this.templateService.currentElement.display;
        this.dragViewData.display = 'none';
        this.elementDraggable = true;
        for (var index in this.templateService.elements) {
            var tempEle = this.templateService.elements[index];
            if (this.templateService.currentElement._id == tempEle._id) {
                this.templateService.elements[index] = this.templateService.currentElement;
                break;
            }
        }
        //获取四点坐标
        var rightBottomPoint = this.getRotatingAfterPoint('rightBottom');
        var leftBottomPoint = this.getRotatingAfterPoint('leftBottom');
        var leftTopPoint = this.getRotatingAfterPoint('leftTop');
        var rightTopPoint = this.getRotatingAfterPoint('rightTop');
        var key = 0;
        switch (this.dragButType) {
            case 'left-top':
            case 'right-top':
                //判断点在直线的那一侧
                key = (rightBottomPoint.y - leftBottomPoint.y) * event.pageX +
                    (leftBottomPoint.x - rightBottomPoint.x) * event.pageY +
                    rightBottomPoint.x * leftBottomPoint.y - leftBottomPoint.x * rightBottomPoint.y;
                if (key < 0) {
                    this.templateService.currentElement.angle += 180; //倒立
                }
                break;
            case 'right-bottom':
            case 'left-bottom':
                key = (rightTopPoint.y - leftTopPoint.y) * event.pageX +
                    (leftTopPoint.x - rightTopPoint.x) * event.pageY +
                    rightTopPoint.x * leftTopPoint.y - leftTopPoint.x * rightTopPoint.y;
                if (key > 0) {
                    this.templateService.currentElement.angle += 180; //倒立
                }
                break;
            default:
                break;
        }
        console.log('change Ele : ', this.templateService.currentElement);
        console.log('height : ' + this.templateService.currentElement.height);
        var tempEles = this.templateService.elements;
        this.templateService.elements = null;
        this.templateService.elements = tempEles.slice();
        console.log('height2 : ' + this.templateService.elements[0].height);
        console.log('list : ', this.templateService.elements);
        this.templateService.changeTextSubject.next(this.templateService.currentElement._id);
        event.stopImmediatePropagation();
    };
    Border2Component.prototype.mousemove = function (event) {
        this.tempZIndex = 2000;
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
    Border2Component.prototype.getABC = function (p1, p2) {
        var a = p1.y - p2.y;
        var b = p2.x - p1.x;
        var c = p1.x * p2.y - p1.y * p2.x;
        return { a: a, b: b, c: c };
    };
    //获取点到直线的距离
    Border2Component.prototype.getDis = function (l, p) {
        return Math.abs((l.a * p.x + l.b * p.y + l.c) / Math.sqrt(l.a * l.a + l.b * l.b));
    };
    Border2Component.prototype.onLeftTop = function (event) {
        /*
            1、获取角坐标
            2、用点到直线的距离公式求得width、height
            3、求变化后的中点坐标
            4、有中点坐标、width、height 得出变动后的左上角坐标
        */
        var pagex = event.pageX - this.offsetWidth;
        var pagey = event.pageY - this.offsetHeight;
        //获取角坐标
        var rightBottomPoint = this.getRotatingAfterPoint('rightBottom');
        var leftBottomPoint = this.getRotatingAfterPoint('leftBottom');
        var leftTopPoint = this.getRotatingAfterPoint('leftTop');
        var rightTopPoint = this.getRotatingAfterPoint('rightTop');
        //获取直线方程的abc
        var rightLine = this.getABC(rightBottomPoint, rightTopPoint);
        var bottomLine = this.getABC(rightBottomPoint, leftBottomPoint);
        var width = 0;
        var height = 0;
        if (this.templateService.currentElement.angle % 90 == 0) {
            width = Math.abs(rightBottomPoint.x - pagex);
            height = Math.abs(rightBottomPoint.y - pagey);
        }
        else {
            width = this.getDis(rightLine, { x: pagex, y: pagey });
            height = this.getDis(bottomLine, { x: pagex, y: pagey });
        }
        //当前四个点的位置
        var currentLefTopPoint = { x: pagex, y: pagey };
        var currentRightBottomPoint = rightBottomPoint;
        //由上两点得中点坐标
        var centerPoint = {
            x: Math.abs(currentRightBottomPoint.x - currentLefTopPoint.x) / 2,
            y: Math.abs(currentRightBottomPoint.y - currentLefTopPoint.y) / 2,
        };
        if (currentRightBottomPoint.x > currentLefTopPoint.x) {
            centerPoint.x += currentLefTopPoint.x;
        }
        else {
            centerPoint.x += currentRightBottomPoint.x;
        }
        if (currentRightBottomPoint.y > currentLefTopPoint.y) {
            centerPoint.y += currentLefTopPoint.y;
        }
        else {
            centerPoint.y += currentRightBottomPoint.y;
        }
        //变化后的左上角原来坐标
        var changeOriginLeftTopPoint = { x: 0, y: 0 };
        changeOriginLeftTopPoint.x = centerPoint.x - width / 2;
        changeOriginLeftTopPoint.y = centerPoint.y - height / 2;
        this.dragViewData.py = changeOriginLeftTopPoint.y;
        this.dragViewData.px = changeOriginLeftTopPoint.x;
        this.dragViewData.width = width;
        this.dragViewData.height = height;
    };
    Border2Component.prototype.pointMousemove = function (event) {
        if (this.scalingFlag) {
            return this.mousemove(event);
        }
    };
    Border2Component.prototype.getWH = function (pA, pB, angle) {
        var cosV = Math.cos(angle);
        var sinV = Math.sin(angle);
        var width = Math.abs(cosV * pB.x - pB.y - cosV * pA.x + pA.y) / Math.sqrt(1 + Math.pow(cosV, 2));
        var height = Math.abs(sinV * pB.x - pB.y - sinV * pA.x + pA.y) / Math.sqrt(1 + Math.pow(sinV, 2));
        return {
            width: width,
            height: height
        };
    };
    Border2Component.prototype.onLeft = function (event) {
        var pagex = event.pageX - this.offsetWidth;
        var pagey = event.pageY - this.offsetHeight;
        //获取角坐标
        var rightBottomPoint = this.getRotatingAfterPoint('rightBottom');
        var leftBottomPoint = this.getRotatingAfterPoint('leftBottom');
        var leftTopPoint = this.getRotatingAfterPoint('leftTop');
        var rightTopPoint = this.getRotatingAfterPoint('rightTop');
        //获取直线方程的abc
        var rightLine = this.getABC(rightBottomPoint, rightTopPoint);
        var width = 0;
        if (this.templateService.currentElement.angle % 90 == 0) {
            width = Math.abs(rightBottomPoint.x - pagex);
        }
        else {
            width = this.getDis(rightLine, { x: pagex, y: pagey });
        }
        var diff = width - this.templateService.currentElement.width;
        this.dragViewData.width = width;
        this.dragViewData.px = this.templateService.currentElement.px - diff;
        //上面得出的结果与实际有点出入, width 是正确的, 但是坐标有点偏差
        //想不出是什么问题/导致的, 继续尝试使用其他方式(中点), 如下
        var jiaoDian = this.getJiaoDianPoint(leftTopPoint, rightTopPoint, { x: pagex, y: pagey });
        var centerPoint = {
            x: Math.abs(jiaoDian.x - rightBottomPoint.x) / 2,
            y: Math.abs(jiaoDian.y - rightBottomPoint.y) / 2
        };
        if (jiaoDian.x > rightBottomPoint.x) {
            centerPoint.x += rightBottomPoint.x;
        }
        else {
            centerPoint.x += jiaoDian.x;
        }
        if (jiaoDian.y > rightBottomPoint.y) {
            centerPoint.y += rightBottomPoint.y;
        }
        else {
            centerPoint.y += jiaoDian.y;
        }
        this.dragViewData.px = centerPoint.x - width / 2;
        this.dragViewData.py = centerPoint.y - this.dragViewData.height / 2;
    };
    //点p3到l(p1, p2) 的竖直交点坐标
    Border2Component.prototype.getJiaoDianPoint = function (p1, p2, p3) {
        // qreal A = (pt1.y()-pt2.y())/(pt1.x()- pt2.x()); 
        // qreal B = (pt1.y()-A*pt1.y()); 
        // /// > 0 = ax +b -y; 对应垂线方程为 -x -ay + m = 0;(mm为系数) 
        // /// > A = a; B = b; 
        // qreal m = pt3.x() + A*pt3.y(); 
        // /// 求两直线交点坐标 
        // QPointF ptCross; 
        // ptCross.setX((m-A*B)/(A*A + 1)); 
        // ptCross.setY(A*ptCross.x()+B); 
        // return ptCross; 
        var A = (p1.y - p2.y) / (p1.x - p2.x);
        var B = (p1.y - A * p1.x);
        var m = p3.x + A * p3.y;
        /// 求两直线交点坐标  
        var jiaoDian = {
            x: 0,
            y: 0
        };
        jiaoDian.x = (m - A * B) / (A * A + 1);
        jiaoDian.y = A * jiaoDian.x + B;
        return jiaoDian;
    };
    Border2Component.prototype.onTop = function (event) {
        var pagex = event.pageX - this.offsetWidth;
        var pagey = event.pageY - this.offsetHeight;
        //获取角坐标
        var rightBottomPoint = this.getRotatingAfterPoint('rightBottom');
        var leftBottomPoint = this.getRotatingAfterPoint('leftBottom');
        var leftTopPoint = this.getRotatingAfterPoint('leftTop');
        var rightTopPoint = this.getRotatingAfterPoint('rightTop');
        console.log('rightBottomPoint : ', rightBottomPoint);
        console.log('leftBottomPoint : ', leftBottomPoint);
        console.log('leftTopPoint : ', leftTopPoint);
        console.log('rightTopPoint : ', rightTopPoint);
        //获取直线方程的abc
        var bottomLine = this.getABC(rightBottomPoint, leftBottomPoint);
        var height = 0;
        if (this.templateService.currentElement.angle % 90 == 0) {
            height = Math.abs(leftBottomPoint.y - pagey);
        }
        else {
            height = this.getDis(bottomLine, { x: pagex, y: pagey });
        }
        var diff = height - this.templateService.currentElement.height;
        this.dragViewData.height = height;
        this.dragViewData.py = this.templateService.currentElement.py - diff;
        //上面得出的结果与实际有点出入, width 是正确的, 但是坐标有点偏差
        //想不出是什么问题/导致的, 继续尝试使用其他方式(中点), 如下
        var jiaoDian = this.getJiaoDianPoint(rightTopPoint, rightBottomPoint, { x: pagex, y: pagey });
        //判断点在直线的那一侧
        var key = (rightBottomPoint.y - leftBottomPoint.y) * event.pageX +
            (leftBottomPoint.x - rightBottomPoint.x) * event.pageY +
            rightBottomPoint.x * leftBottomPoint.y - leftBottomPoint.x * rightBottomPoint.y;
        if (key < 0) {
            this.dragViewData.angle = this.templateService.currentElement.angle + 180; //倒立    
        }
        else {
            this.dragViewData.angle = this.templateService.currentElement.angle;
        }
        this.dragViewData.angle = this.dragViewData.angle % 360;
        if (this.dragViewData.angle == 0) {
            this.dragViewData.py = leftBottomPoint.y - height;
            console.log('this.dragViewData.py1 : ' + this.dragViewData.py);
            return;
        }
        else if (this.dragViewData.angle == 180) {
            this.dragViewData.py = leftBottomPoint.y;
            console.log('this.dragViewData.py2 : ' + this.dragViewData.py);
            return;
        }
        var centerPoint = {
            x: Math.abs(jiaoDian.x - leftBottomPoint.x) / 2,
            y: Math.abs(jiaoDian.y - leftBottomPoint.y) / 2
        };
        if (jiaoDian.x > leftBottomPoint.x) {
            centerPoint.x += leftBottomPoint.x;
        }
        else {
            centerPoint.x += jiaoDian.x;
        }
        if (jiaoDian.y > leftBottomPoint.y) {
            centerPoint.y += leftBottomPoint.y;
        }
        else {
            centerPoint.y += jiaoDian.y;
        }
        this.dragViewData.py = centerPoint.y - height / 2;
        this.dragViewData.px = centerPoint.x - this.dragViewData.width / 2;
    };
    Border2Component.prototype.onRightTop = function (event) {
        /*
            1、获取角坐标
            2、用点到直线的距离公式求得width、height
            3、求变化后的中点坐标
            4、有中点坐标、width、height 得出变动后的左上角坐标
        */
        var pagex = event.pageX - this.offsetWidth;
        var pagey = event.pageY - this.offsetHeight;
        //获取角坐标
        var rightBottomPoint = this.getRotatingAfterPoint('rightBottom');
        var leftBottomPoint = this.getRotatingAfterPoint('leftBottom');
        var leftTopPoint = this.getRotatingAfterPoint('leftTop');
        var rightTopPoint = this.getRotatingAfterPoint('rightTop');
        //获取直线方程的abc
        var leftLine = this.getABC(leftBottomPoint, leftTopPoint);
        var bottomLine = this.getABC(rightBottomPoint, leftBottomPoint);
        var width = 0;
        var height = 0;
        if (this.templateService.currentElement.angle % 90 == 0) {
            width = Math.abs(leftBottomPoint.x - pagex);
            height = Math.abs(leftBottomPoint.y - pagey);
        }
        else {
            width = this.getDis(leftLine, { x: pagex, y: pagey });
            height = this.getDis(bottomLine, { x: pagex, y: pagey });
        }
        var currentLefTopPoint = { x: pagex, y: pagey };
        var currentLeftBottomPoint = leftBottomPoint;
        //由上两点得中点坐标
        var centerPoint = {
            x: Math.abs(currentLeftBottomPoint.x - currentLefTopPoint.x) / 2,
            y: Math.abs(currentLeftBottomPoint.y - currentLefTopPoint.y) / 2,
        };
        if (currentLeftBottomPoint.x > currentLefTopPoint.x) {
            centerPoint.x += currentLefTopPoint.x;
        }
        else {
            centerPoint.x += currentLeftBottomPoint.x;
        }
        if (currentLeftBottomPoint.y > currentLefTopPoint.y) {
            centerPoint.y += currentLefTopPoint.y;
        }
        else {
            centerPoint.y += currentLeftBottomPoint.y;
        }
        //变化后的左上角原来坐标
        var changeOriginLeftTopPoint = { x: 0, y: 0 };
        changeOriginLeftTopPoint.x = centerPoint.x - width / 2;
        changeOriginLeftTopPoint.y = centerPoint.y - height / 2;
        this.dragViewData.py = changeOriginLeftTopPoint.y;
        this.dragViewData.px = changeOriginLeftTopPoint.x;
        this.dragViewData.width = width;
        this.dragViewData.height = height;
    };
    Border2Component.prototype.onRightBottom = function (event) {
        /*
            1、获取角坐标
            2、用点到直线的距离公式求得width、height
            3、求变化后的中点坐标
            4、有中点坐标、width、height 得出变动后的左上角坐标
        */
        var pagex = event.pageX - this.offsetWidth;
        var pagey = event.pageY - this.offsetHeight;
        //获取角坐标
        var rightBottomPoint = this.getRotatingAfterPoint('rightBottom');
        var leftBottomPoint = this.getRotatingAfterPoint('leftBottom');
        var leftTopPoint = this.getRotatingAfterPoint('leftTop');
        var rightTopPoint = this.getRotatingAfterPoint('rightTop');
        //获取直线方程的abc
        var topLine = this.getABC(leftTopPoint, rightTopPoint);
        var leftLine = this.getABC(leftTopPoint, leftBottomPoint);
        var width = 0;
        var height = 0;
        if (this.templateService.currentElement.angle % 90 == 0) {
            width = Math.abs(leftTopPoint.x - pagex);
            height = Math.abs(leftTopPoint.y - pagey);
        }
        else {
            width = this.getDis(leftLine, { x: pagex, y: pagey });
            height = this.getDis(topLine, { x: pagex, y: pagey });
        }
        var currentRightBottomPoint = { x: pagex, y: pagey };
        var currentLeftTopPoint = leftTopPoint;
        //由上两点得中点坐标
        var centerPoint = {
            x: Math.abs(currentRightBottomPoint.x - currentLeftTopPoint.x) / 2,
            y: Math.abs(currentRightBottomPoint.y - currentLeftTopPoint.y) / 2,
        };
        if (currentRightBottomPoint.x > currentLeftTopPoint.x) {
            centerPoint.x += currentLeftTopPoint.x;
        }
        else {
            centerPoint.x += currentRightBottomPoint.x;
        }
        if (currentRightBottomPoint.y > currentLeftTopPoint.y) {
            centerPoint.y += currentLeftTopPoint.y;
        }
        else {
            centerPoint.y += currentRightBottomPoint.y;
        }
        //变化后的左上角原来坐标
        var changeOriginLeftTopPoint = { x: 0, y: 0 };
        changeOriginLeftTopPoint.x = centerPoint.x - width / 2;
        changeOriginLeftTopPoint.y = centerPoint.y - height / 2;
        this.dragViewData.py = changeOriginLeftTopPoint.y;
        this.dragViewData.px = changeOriginLeftTopPoint.x;
        this.dragViewData.width = width;
        this.dragViewData.height = height;
    };
    Border2Component.prototype.onBottom = function (event) {
        var pagex = event.pageX - this.offsetWidth;
        var pagey = event.pageY - this.offsetHeight;
        //获取角坐标
        var rightBottomPoint = this.getRotatingAfterPoint('rightBottom');
        var leftBottomPoint = this.getRotatingAfterPoint('leftBottom');
        var leftTopPoint = this.getRotatingAfterPoint('leftTop');
        var rightTopPoint = this.getRotatingAfterPoint('rightTop');
        //获取直线方程的abc
        var topLine = this.getABC(rightTopPoint, leftTopPoint);
        var height = 0;
        if (this.templateService.currentElement.angle % 90 == 0) {
            height = Math.abs(leftTopPoint.y - pagey);
        }
        else {
            height = this.getDis(topLine, { x: pagex, y: pagey });
        }
        var diff = height - this.templateService.currentElement.height;
        this.dragViewData.height = height;
        // this.dragViewData.py  = this.templateService.currentElement.py - diff;
        //上面得出的结果与实际有点出入, width 是正确的, 但是坐标有点偏差
        //想不出是什么问题/导致的, 继续尝试使用其他方式(中点), 如下
        //判断点在直线的那一侧
        var key = (rightTopPoint.y - leftTopPoint.y) * event.pageX +
            (leftTopPoint.x - rightTopPoint.x) * event.pageY +
            rightTopPoint.x * leftTopPoint.y - leftTopPoint.x * rightTopPoint.y;
        if (this.templateService.currentElement.angle == 0) {
            if (key < 0) {
                this.dragViewData.angle = this.templateService.currentElement.angle;
            }
            else {
                this.dragViewData.angle = this.templateService.currentElement.angle + 180; //倒立 
            }
            if (this.dragViewData.angle == 0) {
                this.dragViewData.py = this.templateService.currentElement.py;
                return;
            }
            else if (this.dragViewData.angle == 180) {
                this.dragViewData.py = this.templateService.currentElement.py - height;
                return;
            }
        }
        else if (this.templateService.currentElement.angle == 180) {
            if (key < 0) {
                this.dragViewData.angle = this.templateService.currentElement.angle + 180;
            }
            else {
                this.dragViewData.angle = this.templateService.currentElement.angle; //倒立 
            }
            this.dragViewData.angle = this.dragViewData.angle % 360;
            if (this.dragViewData.angle == 180) {
                this.dragViewData.py = this.templateService.currentElement.py + this.templateService.currentElement.height;
            }
            else if (this.dragViewData.angle == 0) {
                this.dragViewData.py = this.templateService.currentElement.py - diff;
            }
            this.dragViewData.angle += 180;
            this.dragViewData.angle = this.dragViewData.angle % 360;
            return;
        }
        this.dragViewData.angle = this.dragViewData.angle % 360;
        var jiaoDian = this.getJiaoDianPoint(rightTopPoint, rightBottomPoint, { x: pagex, y: pagey });
        var centerPoint = {
            x: Math.abs(jiaoDian.x - leftTopPoint.x) / 2,
            y: Math.abs(jiaoDian.y - leftTopPoint.y) / 2
        };
        if (jiaoDian.x > leftTopPoint.x) {
            centerPoint.x += leftTopPoint.x;
        }
        else {
            centerPoint.x += jiaoDian.x;
        }
        if (jiaoDian.y > leftTopPoint.y) {
            centerPoint.y += leftTopPoint.y;
        }
        else {
            centerPoint.y += jiaoDian.y;
        }
        this.dragViewData.py = centerPoint.y - height / 2;
        this.dragViewData.px = centerPoint.x - this.dragViewData.width / 2;
    };
    Border2Component.prototype.onRight = function (event) {
        var pagex = event.pageX - this.offsetWidth;
        var pagey = event.pageY - this.offsetHeight;
        //获取角坐标
        var rightBottomPoint = this.getRotatingAfterPoint('rightBottom');
        var leftBottomPoint = this.getRotatingAfterPoint('leftBottom');
        var leftTopPoint = this.getRotatingAfterPoint('leftTop');
        var rightTopPoint = this.getRotatingAfterPoint('rightTop');
        //获取直线方程的abc
        var leftLine = this.getABC(leftBottomPoint, leftTopPoint);
        var width = 0;
        if (this.templateService.currentElement.angle % 90 == 0) {
            width = Math.abs(leftTopPoint.x - pagex);
        }
        else {
            width = this.getDis(leftLine, { x: pagex, y: pagey });
        }
        var diff = width - this.templateService.currentElement.width;
        this.dragViewData.width = width;
        this.dragViewData.px = this.templateService.currentElement.px - diff;
        //上面得出的结果与实际有点出入, width 是正确的, 但是坐标有点偏差
        //想不出是什么问题/导致的, 继续尝试使用其他方式(中点), 如下
        var jiaoDian = this.getJiaoDianPoint(leftTopPoint, rightTopPoint, { x: pagex, y: pagey });
        var centerPoint = {
            x: Math.abs(jiaoDian.x - leftBottomPoint.x) / 2,
            y: Math.abs(jiaoDian.y - leftBottomPoint.y) / 2
        };
        if (jiaoDian.x > leftBottomPoint.x) {
            centerPoint.x += leftBottomPoint.x;
        }
        else {
            centerPoint.x += jiaoDian.x;
        }
        if (jiaoDian.y > leftBottomPoint.y) {
            centerPoint.y += leftBottomPoint.y;
        }
        else {
            centerPoint.y += jiaoDian.y;
        }
        this.dragViewData.px = centerPoint.x - width / 2;
        this.dragViewData.py = centerPoint.y - this.dragViewData.height / 2;
    };
    Border2Component.prototype.onLeftBottom = function (event) {
        /*
            1、获取角坐标
            2、用点到直线的距离公式求得width、height
            3、求变化后的中点坐标
            4、有中点坐标、width、height 得出变动后的左上角坐标
        */
        var pagex = event.pageX - this.offsetWidth;
        var pagey = event.pageY - this.offsetHeight;
        //获取角坐标
        var rightBottomPoint = this.getRotatingAfterPoint('rightBottom');
        var leftBottomPoint = this.getRotatingAfterPoint('leftBottom');
        var leftTopPoint = this.getRotatingAfterPoint('leftTop');
        var rightTopPoint = this.getRotatingAfterPoint('rightTop');
        //获取直线方程的abc
        var topLine = this.getABC(rightTopPoint, leftTopPoint);
        var rightLine = this.getABC(rightTopPoint, rightBottomPoint);
        var width = 0;
        var height = 0;
        if (this.templateService.currentElement.angle % 90 == 0) {
            width = Math.abs(rightTopPoint.x - pagex);
            height = Math.abs(rightTopPoint.y - pagey);
        }
        else {
            width = this.getDis(rightLine, { x: pagex, y: pagey });
            height = this.getDis(topLine, { x: pagex, y: pagey });
        }
        var currentLeftBottomPoint = { x: pagex, y: pagey };
        var currentRightTopPoint = rightTopPoint;
        //由上两点得中点坐标
        var centerPoint = {
            x: Math.abs(currentRightTopPoint.x - currentLeftBottomPoint.x) / 2,
            y: Math.abs(currentRightTopPoint.y - currentLeftBottomPoint.y) / 2,
        };
        if (currentRightTopPoint.x > currentLeftBottomPoint.x) {
            centerPoint.x += currentLeftBottomPoint.x;
        }
        else {
            centerPoint.x += currentRightTopPoint.x;
        }
        if (currentRightTopPoint.y > currentLeftBottomPoint.y) {
            centerPoint.y += currentLeftBottomPoint.y;
        }
        else {
            centerPoint.y += currentRightTopPoint.y;
        }
        //变化后的左上角原来坐标
        var changeOriginLeftTopPoint = { x: 0, y: 0 };
        changeOriginLeftTopPoint.x = centerPoint.x - width / 2;
        changeOriginLeftTopPoint.y = centerPoint.y - height / 2;
        this.dragViewData.py = changeOriginLeftTopPoint.y;
        this.dragViewData.px = changeOriginLeftTopPoint.x;
        this.dragViewData.width = width;
        this.dragViewData.height = height;
    };
    Border2Component.prototype.onElement = function (event) {
        var pagex = event.pageX - this.diffX;
        var pagey = event.pageY - this.diffY;
        //origin
        var x = pagex;
        var y = pagey;
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
        var pageX = this.originEle.px + this.originEle.width / 2 + this.offsetWidth;
        var pageY = this.originEle.py + this.originEle.height / 2 + this.offsetHeight;
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
        this.dragViewData.angle = angle;
    };
    Border2Component.prototype.getRotatingAfterPoint = function (type) {
        if (type == 'leftTop') {
            return this.getRotatingPoint(this.centerPoint, this.leftTopPoint, this.templateService.currentElement.angle);
        }
        else if (type == 'rightBottom') {
            return this.getRotatingPoint(this.centerPoint, this.rightBottomPoint, this.templateService.currentElement.angle);
        }
        else if (type == 'leftBottom') {
            return this.getRotatingPoint(this.centerPoint, { x: this.leftTopPoint.x, y: this.rightBottomPoint.y }, this.templateService.currentElement.angle);
        }
        else if (type == 'rightTop') {
            return this.getRotatingPoint(this.centerPoint, { x: this.rightBottomPoint.x, y: this.leftTopPoint.y }, this.templateService.currentElement.angle);
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
        return { x: x1, y: y1 };
    };
    return Border2Component;
}());
Border2Component.changeSubject = new Rx_1.Subject();
__decorate([
    core_1.ViewChild('tempDiv'),
    __metadata("design:type", Object)
], Border2Component.prototype, "tempDiv", void 0);
__decorate([
    core_1.ViewChild('myBorder'),
    __metadata("design:type", Object)
], Border2Component.prototype, "myBorder", void 0);
__decorate([
    core_1.ViewChild('dimmer'),
    __metadata("design:type", Object)
], Border2Component.prototype, "dimmer", void 0);
__decorate([
    core_1.ViewChild('rightClickMenu'),
    __metadata("design:type", Object)
], Border2Component.prototype, "rightClickMenu", void 0);
Border2Component = Border2Component_1 = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'my-border2, [my-border2]',
        templateUrl: 'border2.html',
        styleUrls: ['border2.css'],
    }),
    __metadata("design:paramtypes", [core_1.Renderer,
        template_service_1.TemplateService])
], Border2Component);
exports.Border2Component = Border2Component;
var Border2Component_1;
//# sourceMappingURL=border2.component.js.map