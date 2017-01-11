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
var router_1 = require("@angular/router");
var app_component_1 = require("./../../app.component");
var template_service_1 = require("./../../../../services/template.service");
/**
 * Created by Administrator on 2016/10/26.
 */
var core_1 = require("@angular/core");
var user_service_1 = require("../../../../services/user.service");
var dashboard_component_1 = require("./../dashboard/dashboard.component");
var SettingComponent = (function () {
    function SettingComponent(renderer, userService, templateService, router) {
        this.renderer = renderer;
        this.userService = userService;
        this.templateService = templateService;
        this.router = router;
        this.settingFlag = true;
        this.openSettingFlag = false;
        this.attrSidebarOpenFlag = false;
        this.settingTagsAddFlag = false;
    }
    SettingComponent.prototype.ngOnInit = function () {
        this._settingEle = document.getElementById('test');
        $('.ui.dropdown').dropdown({ on: 'dblclick' });
    };
    SettingComponent.prototype.ngOnDestroy = function () {
        if (this.tempAppComponentSubjection) {
            this.tempAppComponentSubjection.unsubscribe();
        }
        console.log('setting component OnDestroy...');
    };
    SettingComponent.prototype.change = function (event, type) {
        switch (type) {
            case 'inputTagChange':
                var target = event.target;
                var value = target.value;
                if (this.templateService.tags) {
                    this.templateService.tags.push(value);
                }
                else {
                    this.templateService.tags = [value];
                }
                this.settingTagsAddFlag = false;
                break;
        }
        console.log('change ....');
    };
    SettingComponent.prototype.settingModalClick = function (event, type) {
        var _this = this;
        switch (type) {
            case 'addTag':
                if (this.settingTagsAddFlag) {
                    this.settingTagsAddFlag = false;
                }
                else {
                    this.settingTagsAddFlag = true;
                }
                break;
            case 'delTag':
                var target = event.target;
                var index = target.attributes['data-index'].value;
                this.templateService.tags.splice(index, 1);
                break;
            case 'cancel':
                this.templateService = this.tempTemplateService;
                $('.templateSettingModal').modal('hide');
                break;
            case 'save':
                $('.templateSettingModal').modal('hide');
                break;
            case 'editPreview':
                var ts_1 = Date.now();
                app_component_1.AppComponent.changeSubject.next({
                    event: 'inputFiles',
                    originData: {
                        ts: ts_1,
                        config: {
                            uploadToS3Flag: true
                        }
                    },
                });
                if (this.tempAppComponentSubjection) {
                    this.tempAppComponentSubjection.unsubscribe();
                }
                this.tempAppComponentSubjection = app_component_1.AppComponent.changeSubject
                    .filter(function (data) { return data.originData.ts && data.event == 'finishedUploadToS3' && data.originData.ts == ts_1; })
                    .subscribe({
                    next: function (data) {
                        if (data.result.code == 200) {
                            var link = data.result.msg.link;
                            _this.templateService.preview = link;
                        }
                        else {
                            console.log('setting component upload img to s3 fail!', data.result);
                        }
                    }
                });
                break;
        }
        event.stopImmediatePropagation();
        return false;
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
        // this.settingFlag = !this.settingFlag;
        console.log('db --------------------');
    };
    SettingComponent.prototype.contextmenu = function (event) {
        console.log('contextmenu -----------------');
        return false;
    };
    // 隐藏setting 到左侧, Y是要隐藏时的高度
    SettingComponent.prototype.hidden = function () {
        this._settingEle.style.left = '-1000';
    };
    SettingComponent.prototype.onTagClick = function (tag) {
        var _this = this;
        switch (tag) {
            case 'tag':
                break;
            case 'LoginOut':
                this.userService.logout();
                break;
            case 'OpenAttributesSidebar':
                this.toggleAttributesSidebar();
                break;
            case 'new-template':
                this.newTemplate();
                break;
            case 'setting':
                $('.templateSettingModal').modal({
                    closable: false,
                    onHidden: function () {
                        _this.tempTemplateService = null;
                        _this.openSettingFlag = false;
                    },
                    onShow: function () {
                        _this.openSettingFlag = true;
                        _this.tempTemplateService = Object.assign({}, _this.templateService);
                    }
                }).modal('show');
                break;
            case 'SaveToRemote':
                dashboard_component_1.DashboardComponent.changeSubject.next({ event: 'saveTemplate' });
                break;
            case 'Exit':
                var link = ['template-list'];
                this.router.navigate(link);
                break;
            default:
                break;
        }
    };
    SettingComponent.prototype.newTemplate = function () {
        this.templateService.originData = null;
        this.templateService.elements = [];
        this.templateService.currentElement = null;
        this.templateService.bg = '#f3f3f3';
        this.templateService.width = '800';
        this.templateService.height = '600';
        this.templateService.showFlag = false;
        this.templateService.name = '';
        this.templateService.preview = '';
        this.templateService.tags = null;
        console.log('newTemplate');
    };
    SettingComponent.prototype.toggleAttributesSidebar = function () {
        var _this = this;
        $('#dashboard-content .ui.sidebar')
            .sidebar({
            context: $('#dashboard-content'),
            dimPage: false,
            transition: 'overlay',
            onVisible: function () {
                _this.attrSidebarOpenFlag = true;
            },
            onHidden: function () {
                _this.attrSidebarOpenFlag = false;
                dashboard_component_1.DashboardComponent.changeSubject.next({ event: 'closeInputCustomField' });
                // DashboardComponent.inputCustomFieldFlag = false;
                console.log('toggleAttributesSidebar onHidden');
            }
        })
            .sidebar('toggle');
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
    return SettingComponent;
}());
SettingComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'ax-setting, [ax-setting]',
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
    __metadata("design:paramtypes", [core_1.Renderer,
        user_service_1.UserService,
        template_service_1.TemplateService,
        router_1.Router])
], SettingComponent);
exports.SettingComponent = SettingComponent;
//# sourceMappingURL=setting.component.js.map