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
 * Created by Administrator on 2016/10/26.
 */
var core_1 = require('@angular/core');
var SettingComponent = (function (_super) {
    __extends(SettingComponent, _super);
    function SettingComponent(renderer) {
        _super.call(this);
        this.renderer = renderer;
        this.settingFlag = true;
    }
    SettingComponent.prototype.ngOnInit = function () {
        this._settingEle = document.getElementById('test');
        $('.ui.dropdown').dropdown({ on: 'dblclick' });
    };
    SettingComponent.prototype.onMouseover = function (event) {
        if (this._settingEle.offsetLeft < 0) {
            this._settingEle.style.left = '1px';
        }
        if (this._settingEle.offsetTop < 0) {
            this._settingEle.style.top = '1px';
        }
    };
    SettingComponent.prototype.onSidebarMouseleave = function (event) {
        var _this = this;
        var clientY = event.clientY;
        var eClientY = this._settingEle.offsetTop;
        var eClientX = this._settingEle.offsetLeft;
        var size = this._settingEle.style.width;
        var y = clientY - eClientY;
        if (y > 0) {
            y = y - size;
        }
        else {
            y = y + size;
        }
        if (eClientX == 1) {
            setTimeout(function () {
                var top = _this._settingEle.offsetTop;
                var newTop = 0;
                if (y < 0) {
                    y = Math.abs(y);
                    newTop = top - y;
                }
                else {
                    newTop = top + y;
                }
                newTop = (newTop);
                console.log('newTosp : ' + newTop);
                _this.renderer.setElementStyle(_this._settingEle, 'top', newTop);
            }, 1000);
            this.renderer.invokeElementMethod(this._settingEle, 'animate', [
                [
                    //这里至少需要两个单元, 代表开始和结束
                    { transform: 'translateY(0)' },
                    { transform: 'translateY(' + y + 'px)' }
                ],
                1000
            ]);
        }
    };
    SettingComponent.prototype.ondblclick = function (event) {
        console.log('db ---sdf');
        this.settingFlag = !this.settingFlag;
    };
    // 隐藏setting 到左侧, Y是要隐藏时的高度
    SettingComponent.prototype.hidden = function () {
        this._settingEle.style.left = '-1000';
    };
    SettingComponent.prototype.onTagClick = function (tag) {
        switch (tag) {
            case 'tag':
                break;
            default:
                break;
        }
    };
    SettingComponent.prototype.onDragend = function (event) {
        var clientX = event.clientX;
        var clientY = event.clientY;
        var x = (clientX - this.x);
        var y = (clientY - this.y);
        this._settingEle.style.top = y + '';
        this._settingEle.style.left = x + '';
        if (x <= 0) {
            this.hidden();
        }
        console.log('onDragend');
    };
    SettingComponent.prototype.onDragstart = function (event) {
        //鼠标刚开始拖动的图标
        var clientX = event.clientX;
        var clientY = event.clientY;
        //默认configure 配置是一个圆
        var size = (this._settingEle.style.width);
        var eClientX = this._settingEle.offsetLeft - size / 2;
        var eClientY = this._settingEle.offsetTop - size / 2;
        //斗正位移
        this.x = clientX - eClientX;
        this.y = clientY - eClientY;
        console.log('onDragstart');
    };
    SettingComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'ax-setting',
            templateUrl: 'index.html',
            styleUrls: ['style.css'],
            animations: [
                core_1.trigger('heroState', [
                    core_1.state('inactive', core_1.style({
                        backgroundColor: '#eee',
                        transform: 'scale(1)'
                    })),
                    core_1.state('active', core_1.style({
                        backgroundColor: '#cfd8dc',
                        transform: 'scale(1.1)',
                        top: "{{x}}px"
                    })),
                    //转场配置
                    core_1.transition('inactive => active', core_1.animate('100ms ease-in')),
                    core_1.transition('active => inactive', core_1.animate('100ms ease-out'))
                ])
            ]
        }), 
        __metadata('design:paramtypes', [core_1.Renderer])
    ], SettingComponent);
    return SettingComponent;
}(core_1.OnInit));
exports.SettingComponent = SettingComponent;
//# sourceMappingURL=setting.component.js.map