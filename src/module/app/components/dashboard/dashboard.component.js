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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var app_component_1 = require("./../../app.component");
// import { IsObjectPipe } from './../../../../assets/angular-pipes/src/boolean/types.pipe';
var user_service_1 = require("./../../../../services/user.service");
var faeva_beapi_service_1 = require("./../../../../services/faeva-beapi.service");
var border2_component_1 = require("./../../border2.component");
/**
 * Created by Administrator on 2016/10/10.
 */
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var beapi_service_1 = require("../../../../services/beapi.service");
var template_service_1 = require("../../../../services/template.service");
var setTimeout = core.setTimeout;
var Rx_1 = require("rxjs/Rx");
var DashboardComponent = DashboardComponent_1 = (function () {
    function DashboardComponent(router, renderer, beApiService, templateService, faevaBeApiService, userService, appComponent) {
        this.router = router;
        this.renderer = renderer;
        this.beApiService = beApiService;
        this.templateService = templateService;
        this.faevaBeApiService = faevaBeApiService;
        this.userService = userService;
        this.imgSrc = '';
        this.fields = [
            { name: 'QrCode', type: 'image', icon: 'image' },
            { name: 'ProductImg', type: 'productImg', icon: 'image' },
            { name: 'ProductName', type: 'field', icon: 'Code' },
            { name: 'xxxxx', type: 'custom', icon: 'Add User' },
        ];
        //背景图
        this.bottomBackground = 'green';
        this.color = '#ff0000';
        this.cpToggle = false;
        this.cpType = 'fixed';
        this.tempHeight = 0;
        this.tempWidth = 0;
        //变更背景时的Modal临时数据
        this.changeBGModalConf = {
            index: 1,
            type: 'none',
            width: 800,
            height: 600,
            loaddingFlag: false,
            errInfo: [] //错误信息
        };
        this.inputCustomFieldFlag = false;
        appComponent.addSettingComponent();
        this.appComponent = appComponent;
    }
    DashboardComponent.prototype.input = function (event, type) {
        if (type != 'blur') {
            this.cpToggle = true;
        }
    };
    DashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        //reset body heigh/width
        $(window).resize(function () {
            console.log('resize ---');
            var body = $('body')[0];
            if (_this.templateService.height > body.clientHeight ||
                _this.templateService.width > body.clientWidth) {
                if (_this.templateService.height > body.clientHeight) {
                    $('body').height(_this.templateService.height);
                }
                else {
                    $('body').height('100%');
                }
                if (_this.templateService.width > body.clientWidth) {
                    $('body').width(_this.templateService.width);
                }
                else {
                    $('body').width('100%');
                }
            }
            else {
                $('body').width('100%').height('100%');
            }
        });
        this.changeSubjection = DashboardComponent_1.changeSubject.subscribe({
            next: function (p) {
                switch (p.event) {
                    case 'closeInputCustomField':
                        _this.closeInputCustomField();
                        break;
                    case 'closeRightMenu':
                        _this.renderer.setElementClass(_this.rightClickMenu.nativeElement, 'menu-hide', true);
                }
            }
        });
        $("#backgroundInput").change((function (context) {
            return function (event) {
                context.fileChange(event);
            };
        })(this));
        setTimeout(function () {
            _this.reflashUI();
        }, 500);
    };
    DashboardComponent.prototype.ngOnDestroy = function () {
        this.changeSubjection.unsubscribe();
        this.appComponent.destroySettingComponent();
    };
    DashboardComponent.prototype.closeInputCustomField = function () {
        this.inputCustomFieldFlag = false;
    };
    DashboardComponent.prototype.test = function () {
        console.log('test');
        var img = document.getElementById('background-content-div');
    };
    DashboardComponent.prototype.addField = function (field) {
        console.log('field in : ' + JSON.stringify(field));
    };
    DashboardComponent.prototype.dblclick = function (event, type) {
        switch (type) {
            case 'changeTemplateBG':
                var ele = this.templateBGInput.nativeElement;
                ele.click();
                break;
        }
    };
    DashboardComponent.prototype.rightBarDbclick = function (type) {
        switch (type) {
            case 'addCustomFieldFlag':
                this.inputCustomFieldFlag = !this.inputCustomFieldFlag;
                break;
        }
        console.log('rightBarDbclick -----------------');
    };
    DashboardComponent.prototype.rightMenuItemClick = function (event, type) {
        switch (type) {
            case 'changeBG':
                $('.changeBGModal').modal({
                    closable: false
                }).modal('show');
                console.log('changeBE click');
                break;
            case 'repeatBG':
                if (this.bottomBackground.indexOf('no-repeat') > 0) {
                    this.bottomBackground = this.bottomBackground.replace(/no-repeat/, 'repeat');
                }
                else {
                    this.bottomBackground = this.bottomBackground.replace(/repeat/, 'no-repeat');
                }
                // BackgroundComponent.changeSubject.next({event: 'changeBGRepeat'});
                break;
        }
    };
    DashboardComponent.prototype.contextmenu = function (event) {
        var pagey = event.pageY - 40;
        var pagex = event.pageX + 30;
        pagey -= window.scrollY;
        pagex -= window.scrollX;
        event.stopImmediatePropagation();
        console.log('rightClickMenu : ', this.rightClickMenu);
        var rightClickMenuEle = this.rightClickMenu.nativeElement;
        this.renderer.setElementStyle(rightClickMenuEle, 'top', pagey + '');
        this.renderer.setElementStyle(rightClickMenuEle, 'left', pagex + '');
        this.renderer.setElementClass(rightClickMenuEle, 'menu-hide', false);
        return false;
    };
    DashboardComponent.prototype.onclick = function (event) {
        this.renderer.setElementClass(this.rightClickMenu.nativeElement, 'menu-hide', true);
        border2_component_1.Border2Component.changeSubject.next({ event: 'closeRightMenu' });
        border2_component_1.Border2Component.changeSubject.next({ event: 'closeBorder' });
    };
    DashboardComponent.prototype.click = function (event, type) {
        switch (type) {
            case 'onBgChange_img_save_external':
                var url = this.bgChangModelImgInput.nativeElement.value;
                console.log('nativeElement : ', this.bgChangModelImgInput.nativeElement);
                this.bottomBackground = "url(" + url + ") center";
                break;
            case 'saveBGChange_colors':
                this.changeBGModalConf.errInfo = [];
                this.bottomBackground = this.color;
                this.closeChangeBGModal();
                break;
            case 'bgModalMenuBack':
                switch (this.changeBGModalConf.index) {
                    case 2:
                        this.changeBGModalConf.type = 'none';
                        this.changeBGModalConf.index = 1;
                        break;
                }
                break;
            case 'closeBGModalMenu':
                this.closeChangeBGModal();
                break;
            case 'changeModal_selectColor':
                this.changeBGModalConf.type = 'color';
                this.changeBGModalConf.index = 2;
                break;
            case 'changeModal_selectImage':
                this.changeBGModalConf.type = 'image';
                this.changeBGModalConf.index = 2;
                break;
        }
    };
    DashboardComponent.prototype.change = function (event, type) {
        switch (type) {
            case 'onBgChange_img_select':
                var ele = this.backgroundInput.nativeElement;
                if (event.target.value == 'local') {
                    ele.focus();
                    ele.click();
                }
                break;
            case 'onBgChange_img_change':
                //目前这个事件响应失效, 采用jq.change 来替代(上次在其他地方是可以的, 暂时搁浅)
                this.fileChange(event);
                break;
        }
    };
    DashboardComponent.prototype.fileChange = function (event, type) {
        var img = null;
        if (event.target.files && event.target.files[0]) {
            switch (type) {
                case 'templateBGInput':
                    var files = event.target.files;
                    var file = files[0];
                    var imageType = /^image\//;
                    if (!imageType.test(file.type)) {
                        return;
                    }
                    img = document.getElementById('preview_img2');
                    var reader = new FileReader();
                    reader.onload = (function (aImg, context) {
                        return function (e) {
                            aImg.src = e.target.result;
                            context.tempHeight = aImg.naturalHeight;
                            context.tempWidth = aImg.naturalWidth;
                            console.log('event : ', e);
                        };
                    })(img, this);
                    reader.addEventListener('load', function (obj) {
                        var img = document.getElementById('preview_img2');
                        img.click();
                    });
                    reader.readAsDataURL(file);
                    break;
                default:
                    // var preview = document.getElementById('preview');
                    var files = event.target.files;
                    var file = files[0];
                    var imageType = /^image\//;
                    if (!imageType.test(file.type)) {
                        return;
                    }
                    // var img = document.createElement("img");
                    // img.classList.add("obj");
                    // img.id = 'temp-bg-img';
                    // img.width = 0.001;
                    // img.height = 0.001;
                    // img.onclick(this.cl)
                    // preview.appendChild(img); // Assuming that "preview" is the div output where the content will be displayed.
                    img = document.getElementById('changeBGModalConf_preview_img');
                    var reader = new FileReader();
                    reader.onload = (function (aImg) {
                        return function (e) {
                            aImg.src = e.target.result;
                            console.log('event : ', e);
                        };
                    })(img);
                    reader.addEventListener('load', function (obj) {
                        var img = document.getElementById('changeBGModalConf_preview_img');
                        img.click();
                    });
                    reader.readAsDataURL(file);
                    break;
            }
        }
    };
    DashboardComponent.prototype.imgChange = function (type) {
        var _this = this;
        var img = null;
        switch (type) {
            case 'preview_img2':
                img = document.getElementById('preview_img2');
                this.uploadImgToS3(img.src, function (result) {
                    if (result.code == 200) {
                        var url = result.msg.link;
                        _this.templateService.bg = url;
                        _this.templateService.height = _this.tempHeight;
                        _this.templateService.width = _this.tempWidth;
                        console.log('upload success : ' + url);
                    }
                    else {
                        console.log('upload Image to S3 Error : ', result);
                    }
                });
                break;
            default:
                img = document.getElementById('changeBGModalConf_preview_img');
                this.uploadImgToS3(img.src, function (result) {
                    _this.changeBGModalConf.loaddingFlag = false;
                    _this.closeChangeBGModal();
                    if (result.code == 200) {
                        _this.bottomBackground = "url(" + result.msg.link + ") center no-repeat";
                        _this.reflashUI();
                        console.log('upload success...  rze');
                    }
                    else {
                        console.log('upload Image to S3 Error : ', result);
                    }
                });
        }
        // localStorage.setItem('templateData', JSON.stringify(this.templateService));
        img.src = '';
        this.renderer.setElementStyle(img, 'display', 'none');
    };
    //通过trigger resize 事件进行重新设置body的高度, 实现整个界面的大小进行调整适应
    DashboardComponent.prototype.reflashUI = function () {
        setTimeout(function () {
            var event = document.createEvent('HTMLEvents');
            var body = $('body')[0];
            // Define that the event name is 'build'.
            event.initEvent('resize', true, true);
            // target can be any Element or other EventTarget.
            window.dispatchEvent(event);
        }, 1000);
    };
    DashboardComponent.prototype.uploadImgToS3 = function (content, cb) {
        this.changeBGModalConf.loaddingFlag = true;
        var url = this.faevaBeApiService.getUrl('uploadTemporaryImgByAdmin');
        var userId = this.userService.loginUser.id;
        var token = this.userService.loginUser.token;
        var body = {
            ws: {
                token: token,
                platformType: "Builder",
                userType: "admin",
            },
            data: {
                content: content,
                userId: userId
            }
        };
        this.beApiService.commonReqByFaeva(url, body, null, function (result) {
            cb(result);
        });
    };
    DashboardComponent.prototype.closeChangeBGModal = function () {
        $('.changeBGModal').modal('hide');
    };
    return DashboardComponent;
}());
DashboardComponent.changeSubject = new Rx_1.Subject();
__decorate([
    core_1.ViewChild('rightClickMenu'),
    __metadata("design:type", Object)
], DashboardComponent.prototype, "rightClickMenu", void 0);
__decorate([
    core_1.ViewChild('backgroundInput'),
    __metadata("design:type", Object)
], DashboardComponent.prototype, "backgroundInput", void 0);
__decorate([
    core_1.ViewChild('bgChangModelImgInput'),
    __metadata("design:type", Object)
], DashboardComponent.prototype, "bgChangModelImgInput", void 0);
__decorate([
    core_1.ViewChild('templateBGInput'),
    __metadata("design:type", Object)
], DashboardComponent.prototype, "templateBGInput", void 0);
DashboardComponent = DashboardComponent_1 = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'dashboard.html',
        styleUrls: ['dashboard.css'],
    }),
    __param(6, core_1.Host()), __param(6, core_1.Inject(core_1.forwardRef(function () { return app_component_1.AppComponent; }))),
    __metadata("design:paramtypes", [router_1.Router,
        core_1.Renderer,
        beapi_service_1.BeApiService,
        template_service_1.TemplateService,
        faeva_beapi_service_1.FaevaBeApiService,
        user_service_1.UserService,
        app_component_1.AppComponent])
], DashboardComponent);
exports.DashboardComponent = DashboardComponent;
var DashboardComponent_1;
//# sourceMappingURL=dashboard.component.js.map