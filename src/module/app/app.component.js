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
var beapi_service_1 = require("./../../services/beapi.service");
var faeva_beapi_service_1 = require("./../../services/faeva-beapi.service");
var setting_component_1 = require("./components/setting/setting.component");
/**
 * Created by Administrator on 2016/10/9.
 */
var core_1 = require("@angular/core");
var Rx_1 = require("rxjs/Rx");
var user_service_1 = require("../../services/user.service");
var user_1 = require("../../model/user");
var AppComponent = AppComponent_1 = (function () {
    function AppComponent(userService, resolver, faevaBeApiService, beApiService, config) {
        var _this = this;
        this.userService = userService;
        this.resolver = resolver;
        this.faevaBeApiService = faevaBeApiService;
        this.beApiService = beApiService;
        this.config = config;
        this.name = 'ax';
        this.testFlag = false;
        this.changeSubject = new Rx_1.Subject();
        this.changeSubject.subscribe({
            next: function (p) { console.log('p : ' + _this.name); }
        });
        console.log('changeStream1 : ' + this.changeStream);
        this.initAppData();
        setTimeout(function () {
        }, 5000);
        this.changeSubjection = AppComponent_1.changeSubject.subscribe({
            next: function (data) {
                switch (data.event) {
                    case 'inputFiles':
                        _this.inputFiles();
                        _this.tempInputFilesOriginData = data.originData;
                        console.log('inputfiles .... ');
                        break;
                }
            }
        });
    }
    AppComponent.prototype.ngOnInit = function () {
    };
    AppComponent.prototype.ngOnDestroy = function () {
        if (this.changeSubjection) {
            this.changeSubjection.unsubscribe();
        }
    };
    AppComponent.prototype.inputFiles = function () {
        var input = this.tempGlobalInputFiles.nativeElement;
        input.click();
    };
    AppComponent.prototype.fileChange = function (event) {
        var files = event.target.files;
        var file = files[0];
        var imageType = /^image\//;
        if (!imageType.test(file.type)) {
            return;
        }
        var img = document.getElementById('globalInputFilesPreviewImg');
        var reader = new FileReader();
        reader.onload = (function (aImg, context) {
            return function (e) {
                aImg.src = e.target.result;
                var resource = {
                    event: 'globalInputFilesFinished',
                    data: aImg.src,
                    height: aImg.naturalHeight,
                    width: aImg.naturalWidth,
                    fileSize: e.total,
                    originData: context.tempInputFilesOriginData
                };
                AppComponent_1.changeSubject.next(resource);
                if (context.tempInputFilesOriginData.config) {
                    var config_1 = context.tempInputFilesOriginData.config;
                    if (config_1.uploadToS3Flag && config_1.uploadToS3Flag == true) {
                        context.uploadImgFileToS3Temp(resource);
                    }
                }
                // console.log('e : ', e);
            };
        })(img, this);
        // reader.addEventListener('load', function (obj: any) {
        //     let img = document.getElementById('globalInputFilesPreviewImg');
        //     img.click();
        // });
        reader.readAsDataURL(file);
    };
    //上传文件到s3 临时路径
    AppComponent.prototype.uploadImgFileToS3Temp = function (data) {
        var _this = this;
        AppComponent_1.changeSubject.next({
            event: 'startUploadToS3',
            originData: this.tempInputFilesOriginData
        });
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
                content: data.data,
                userId: userId
            }
        };
        this.beApiService.commonReqByFaeva(url, body, null, function (result) {
            // cb(result);
            // console.log('upload to s3 result : ', result);
            AppComponent_1.changeSubject.next({
                event: 'finishedUploadToS3',
                originData: _this.tempInputFilesOriginData,
                result: result
            });
        }, function (e) {
            console.log('upload to s3 error : ', e);
            AppComponent_1.changeSubject.next({
                event: 'errorUploadToS3',
                originData: _this.tempInputFilesOriginData,
                err: e
            });
        });
    };
    AppComponent.prototype.addSettingComponent = function () {
        if (this.axSettingComponentRef) {
            console.log('yes axSettingComponentRef : ', this.axSettingComponentRef);
            return;
        }
        var componentFactory = this.resolver.resolveComponentFactory(setting_component_1.SettingComponent);
        this.axSettingComponentRef = this.axSetting.createComponent(componentFactory);
    };
    AppComponent.prototype.destroySettingComponent = function () {
        if (this.axSettingComponentRef) {
            console.log('destroy axSettingComponentRef ... ');
            this.axSettingComponentRef.destroy();
            this.axSettingComponentRef = null;
        }
    };
    AppComponent.prototype.allowDrop = function (event) {
        event.preventDefault();
    };
    AppComponent.prototype.pageX = function (elem) {
        return elem.offsetParent ? (elem.offsetLeft + this.pageX(elem.offsetParent)) : elem.offsetLeft;
    };
    AppComponent.prototype.example = function () {
        return ['anxing', 2, 3];
    };
    /**
     * 初始化应用数据
     *
     *     1、用户数据
     */
    AppComponent.prototype.initAppData = function () {
        var _this = this;
        var userInfo = localStorage.getItem('loginUserInfo');
        setTimeout(function () {
            _this.userService.loginDimmer = _this.loginDimmer;
        }, 1000);
        if (userInfo) {
            var user = new user_1.User(JSON.parse(userInfo));
            this.userService.loginUser = user;
        }
        else {
            setTimeout(function () {
                _this.userService.internalErrorDimmer = _this.internalErrorDimmer;
                _this.loginDimmer.show();
            }, 1000);
        }
    };
    return AppComponent;
}());
AppComponent.changeSubject = new Rx_1.Subject();
__decorate([
    core_1.ViewChild('loginDimmer'),
    __metadata("design:type", Object)
], AppComponent.prototype, "loginDimmer", void 0);
__decorate([
    core_1.ViewChild('internalErrorDimmer'),
    __metadata("design:type", Object)
], AppComponent.prototype, "internalErrorDimmer", void 0);
__decorate([
    core_1.ViewChild('tempGlobalInputFiles'),
    __metadata("design:type", Object)
], AppComponent.prototype, "tempGlobalInputFiles", void 0);
__decorate([
    core_1.ViewChild('axSetting', { read: core_1.ViewContainerRef }),
    __metadata("design:type", Object)
], AppComponent.prototype, "axSetting", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], AppComponent.prototype, "data", void 0);
AppComponent = AppComponent_1 = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'my-app, [my-app]',
        templateUrl: 'app.html',
        styleUrls: ['app.css']
    }),
    __param(4, core_1.Inject('config')),
    __metadata("design:paramtypes", [user_service_1.UserService,
        core_1.ComponentFactoryResolver,
        faeva_beapi_service_1.FaevaBeApiService,
        beapi_service_1.BeApiService, Object])
], AppComponent);
exports.AppComponent = AppComponent;
var AppComponent_1;
//# sourceMappingURL=app.component.js.map