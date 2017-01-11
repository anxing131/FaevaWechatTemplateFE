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
            { name: 'QrCode', type: 'image', fType: 'image', icon: 'image', id: Date.now() },
            { name: 'ProductImg', type: 'image', fType: 'image', icon: 'image', id: Date.now() },
            { name: 'productName', type: 'field', fType: 'text', icon: 'Code', id: Date.now() },
            { name: 'actualPrice', type: 'field', fType: 'text', icon: 'Code', id: Date.now() },
            { name: 'originalPrice', type: 'field', fType: 'text', icon: 'Code', id: Date.now() },
            { name: 'catalogs', type: 'field', fType: 'text', icon: 'Code', id: Date.now() },
            { name: 'xxxxx', type: 'custom', fType: 'text', icon: 'Add User', id: Date.now() },
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
        console.log('dashboard component constructor ... ');
    }
    DashboardComponent.prototype.input = function (event, type) {
        if (type != 'blur') {
            this.cpToggle = true;
        }
    };
    DashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.routerSubjection = this.router.params.subscribe({
            next: function (params) {
                _this.getTemplateById(params['id']);
            }
        });
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
                        break;
                    case 'saveTemplate':
                        _this.saveCurrentEditTemplate();
                        break;
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
        this.routerSubjection.unsubscribe();
    };
    DashboardComponent.prototype.closeInputCustomField = function () {
        this.inputCustomFieldFlag = false;
    };
    DashboardComponent.prototype.test = function () {
        console.log('test');
        var img = document.getElementById('background-content-div');
    };
    DashboardComponent.prototype.addField = function (name, type) {
        console.log('name : ' + name);
        console.log('type : ' + type);
        var field;
        switch (type) {
            case 'custom':
                field = {
                    type: 'custom',
                    fType: 'text',
                    name: name,
                    icon: 'Add User'
                };
                break;
            case 'image':
                field = {
                    type: 'image',
                    fType: 'image',
                    name: name,
                    icon: 'image'
                };
                break;
            case 'field':
                field = {
                    type: 'field',
                    fType: 'text',
                    name: name,
                    icon: 'code'
                };
                break;
        }
        if (field) {
            field.id = Date.now();
            this.fields.push(field);
        }
    };
    DashboardComponent.prototype.contentmenuField = function (event, field) {
        console.log('contextmenu field : ', field);
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
    DashboardComponent.prototype.rightSidebarClick = function ($event, field) {
        var tWidth = parseInt(this.templateService.width);
        var tHeight = parseInt(this.templateService.height);
        var newElement = null;
        if (field.type == 'image' && field.name == 'QrCode') {
            newElement = {
                _id: Date.now(),
                name: "qrCode",
                type: 'img',
                url: '/src/assets/img/qrCode.jpg',
                fType: 'qrCode',
                width: tWidth * 0.08,
                height: tHeight * 0.08,
                px: tWidth * 0.1,
                py: tHeight * 0.1,
                angle: 0,
                borderRadius: '0%',
                opacity: 1,
                zIndex: template_service_1.TemplateService.minZIndex
            };
        }
        else if (field.type == 'image' && field.name == 'ProductImg') {
            newElement = {
                _id: Date.now(),
                name: "productImg",
                type: 'img',
                fType: 'productImg',
                url: '/src/assets/img/product.jpg',
                width: tWidth * 0.08,
                height: tHeight * 0.08,
                px: tWidth * 0.1,
                py: tHeight * 0.1,
                angle: 0,
                borderRadius: '0%',
                opacity: 1,
                zIndex: template_service_1.TemplateService.minZIndex
            };
        }
        else if (field.type == 'field') {
            newElement = {
                _id: Date.now(),
                name: field.name,
                fType: field.name,
                type: 'text',
                textAlign: 'left',
                width: tWidth * 0.08,
                height: tHeight * 0.08,
                px: tWidth * 0.1,
                py: tHeight * 0.1,
                angle: 0,
                borderRadius: '0%',
                opacity: 1,
                zIndex: template_service_1.TemplateService.minZIndex,
                clamp: -1,
                fontSize: 55,
                fontWeight: 15,
                color: 'rgb(0, 0, 0)',
            };
        }
        else if (field.type == 'custom') {
            newElement = {
                _id: Date.now(),
                name: field.name,
                fType: 'custom',
                type: 'text',
                textAlign: 'left',
                width: tWidth * 0.08,
                height: tHeight * 0.08,
                px: tWidth * 0.1,
                py: tHeight * 0.1,
                angle: 0,
                borderRadius: '0%',
                opacity: 1,
                zIndex: template_service_1.TemplateService.minZIndex,
                clamp: -1,
                fontSize: 55,
                fontWeight: 15,
                color: 'rgb(0, 0, 0)',
            };
        }
        newElement.zIndex += this.templateService.elements.length;
        this.templateService.elements.push(newElement);
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
                console.log('default .... ');
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
        var _this = this;
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
            _this.changeBGModalConf.loaddingFlag = false;
        });
    };
    DashboardComponent.prototype.closeChangeBGModal = function () {
        $('.changeBGModal').modal('hide');
    };
    DashboardComponent.prototype.getTemplateById = function (tempId) {
        var _this = this;
        var url = this.faevaBeApiService.getUrl('getAgentProductTemplateList');
        var userId = this.userService.loginUser.id;
        var token = this.userService.loginUser.token;
        var body = {
            ws: {
                "platformType": "Builder",
                userType: 'admin',
                token: token
            },
            data: {
                userId: userId,
                conditions: {
                    tempId: tempId
                }
            }
        };
        // console.log('data : ', body);
        this.beApiService.commonReqByFaeva(url, body, null, function (result) {
            if (result.code == 200) {
                if (result.msg.tempList.length > 0) {
                    var templateData = result.msg.tempList[0];
                    _this.transformToTemplateService(templateData);
                }
                else {
                    console.log('System server has not any template!');
                }
            }
            else {
                console.log('error : ', result);
            }
        });
    };
    DashboardComponent.prototype.saveCurrentEditTemplate = function () {
        var _this = this;
        var isNewFlag = false;
        if (!this.templateService.originData) {
            isNewFlag = true;
        }
        var tempData = this.transformToRemoteApiFormat();
        var url = null;
        if (isNewFlag) {
            url = this.faevaBeApiService.getUrl('createAgentProductTemplate');
        }
        else {
            url = this.faevaBeApiService.getUrl('updateAgentProductTemplate');
            tempData['tempId'] = this.templateService.originData.id;
        }
        var userId = this.userService.loginUser.id;
        var token = this.userService.loginUser.token;
        tempData['userId'] = userId;
        var body = {
            ws: {
                "platformType": "Builder",
                userType: 'admin',
                token: token
            },
            data: tempData
        };
        console.log('body : ', body);
        this.beApiService.commonReqByFaeva(url, body, null, function (result) {
            if (result.code == 200) {
                _this.cleanTemplateService();
                if (tempData['tempId']) {
                    _this.getTemplateById(tempData['tempId']);
                }
                else {
                    _this.getTemplateById(result.msg.id);
                }
            }
            else {
                console.log('update template error : ', result);
            }
        });
    };
    DashboardComponent.prototype.cleanTemplateService = function () {
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
        this.templateService.currentElement = [];
    };
    DashboardComponent.prototype.transformToTemplateService = function (originData) {
        this.templateService.originData = originData;
        this.templateService.bg = originData.backgroup;
        this.templateService.preview = originData.priview;
        this.templateService.name = originData.name;
        this.templateService.tags = originData.tags;
        this.templateService.height = originData.height;
        this.templateService.width = originData.width;
        var positionConfig = originData.positionConfig;
        console.log('positionConfig : ', positionConfig);
        if (positionConfig.qrCode) {
            var qrCode = positionConfig.qrCode;
            var element = {
                _id: Date.now() + Math.random(),
                name: "qrCode",
                type: 'img',
                fType: 'qrCode',
                url: '/src/assets/img/qrCode.jpg',
                width: originData.qrCodeWidth,
                height: originData.qrCodeWidth,
                px: qrCode.px,
                py: qrCode.py,
                angle: 0,
                borderRadius: '0%',
                opacity: 1,
                zIndex: template_service_1.TemplateService.minZIndex
            };
            this.addElementToTemplateService(element);
        }
        if (positionConfig.productImg) {
            var productImg = positionConfig.productImg;
            var element = {
                _id: Date.now() + Math.random(),
                name: "productImg",
                type: 'img',
                fType: 'productImg',
                url: '/src/assets/img/product.jpg',
                width: productImg.width,
                height: productImg.height,
                px: productImg.px,
                py: productImg.py,
                angle: 0,
                borderRadius: '0%',
                opacity: 1,
                zIndex: template_service_1.TemplateService.minZIndex
            };
            this.addElementToTemplateService(element);
        }
        if (positionConfig.productName) {
            var productName = positionConfig.productName;
            var element2 = {
                _id: Date.now() + Math.random(),
                name: "{productName}",
                fType: 'productName',
                type: 'text',
                textAlign: 'left',
                width: 300,
                height: 200,
                px: productName.px,
                py: productName.py,
                angle: 0,
                borderRadius: '0%',
                opacity: 1,
                clamp: -1,
                fontSize: productName.fontSize,
                color: this.colorHex("RGB(" + productName.rgb[0] + ", " + productName.rgb[1] + ", " + productName.rgb[2] + ")"),
                zIndex: template_service_1.TemplateService.minZIndex
            };
            this.addElementToTemplateService(element2);
        }
        if (positionConfig.actualPrice) {
            var actualPrice = positionConfig.actualPrice;
            var element3 = {
                _id: Date.now() + Math.random(),
                name: "{9999.99}",
                type: 'text',
                textAlign: 'left',
                width: 600,
                height: 100,
                fType: 'actualPrice',
                px: actualPrice.px,
                py: actualPrice.py,
                angle: 0,
                borderRadius: '0%',
                opacity: 1,
                clamp: -1,
                fontSize: actualPrice.fontSize,
                color: this.colorHex("RGB(" + actualPrice.rgb[0] + ", " + actualPrice.rgb[1] + ", " + actualPrice.rgb[2] + ")"),
                zIndex: template_service_1.TemplateService.minZIndex
            };
            this.addElementToTemplateService(element3);
        }
        if (positionConfig.originalPrice) {
            var originalPrice = positionConfig.originalPrice;
            var element3 = {
                _id: Date.now() + Math.random(),
                name: "{9999.99}",
                type: 'text',
                textAlign: 'left',
                width: 600,
                height: 100,
                fType: 'originalPrice',
                px: originalPrice.px,
                py: originalPrice.py,
                angle: 0,
                borderRadius: '0%',
                opacity: 1,
                clamp: -1,
                fontSize: originalPrice.fontSize,
                color: this.colorHex("RGB(" + originalPrice.rgb[0] + ", " + originalPrice.rgb[1] + ", " + originalPrice.rgb[2] + ")"),
                zIndex: template_service_1.TemplateService.minZIndex
            };
            this.addElementToTemplateService(element3);
        }
        if (positionConfig.catalogs) {
            var catalogs = positionConfig.catalogs;
            var element3 = {
                _id: Date.now() + Math.random(),
                name: "{catalogs}",
                type: 'text',
                fType: 'catalogs',
                textAlign: 'left',
                width: 600,
                height: 100,
                px: catalogs.px,
                py: catalogs.py,
                angle: 0,
                borderRadius: '0%',
                opacity: 1,
                clamp: -1,
                fontSize: catalogs.fontSize,
                color: this.colorHex("RGB(" + catalogs.rgb[0] + ", " + catalogs.rgb[1] + ", " + catalogs.rgb[2] + ")"),
                zIndex: template_service_1.TemplateService.minZIndex
            };
            this.addElementToTemplateService(element3);
        }
        if (positionConfig.optionKeys) {
            var optionKeys = positionConfig.optionKeys;
            var optionEle = null;
            for (var i = 0; i < optionKeys.length; i++) {
                var option = optionKeys[i];
                switch (option.type) {
                    case 'text':
                        optionEle = {
                            _id: Date.now() + Math.random(),
                            name: option.value,
                            type: 'text',
                            fType: 'custom',
                            width: 300,
                            height: 200,
                            px: option.px,
                            py: option.py,
                            angle: 0,
                            textAlign: 'left',
                            borderRadius: '0%',
                            opacity: 1,
                            clamp: -1,
                            fontSize: option.fontSize,
                            color: this.colorHex("RGB(" + option.rgb[0] + ", " + option.rgb[1] + ", " + option.rgb[2] + ")"),
                            zIndex: template_service_1.TemplateService.minZIndex
                        };
                        break;
                    case 'img':
                        var element = {
                            _id: Date.now() + Math.random(),
                            name: option.name,
                            type: 'img',
                            fType: 'custom',
                            url: option.url,
                            width: option.width,
                            height: option.height,
                            px: option.px,
                            py: option.py,
                            angle: 0,
                            borderRadius: '0%',
                            opacity: 1,
                            zIndex: template_service_1.TemplateService.minZIndex
                        };
                        break;
                    default:
                        throw new Error("option.type(" + option.type + ") unsupport!");
                }
                this.addElementToTemplateService(optionEle);
            }
        }
    };
    //转换成远程服务器格式
    DashboardComponent.prototype.transformToRemoteApiFormat = function () {
        var _this = this;
        var elements = this.templateService.elements;
        var templateService = this.templateService;
        var originData = templateService.originData;
        var data = {};
        if (originData && originData.backgroup != templateService.bg) {
            data['backgroup'] = templateService.bg.split('/be-temp/')[1];
        }
        if (originData && originData.priview != templateService.preview) {
            data['priview'] = templateService.preview.split('/be-temp/')[1];
        }
        if (!templateService.originData) {
            if (templateService.bg) {
                data['backgroup'] = templateService.bg.split('/be-temp/')[1];
            }
            if (templateService.preview) {
                data['priview'] = templateService.preview.split('/be-temp/')[1];
            }
        }
        data['name'] = templateService.name;
        data['height'] = templateService.height;
        data['width'] = templateService.width;
        if (!templateService.tags) {
            data['tags'] = [];
        }
        else {
            data['tags'] = templateService.tags;
        }
        data['positionConfig'] = {};
        console.log('elements : ', elements);
        elements.forEach(function (ele) {
            switch (ele.fType) {
                case 'custom':
                    var customEle = [];
                    switch (ele.type) {
                        case 'text':
                            customEle = {
                                type: 'text',
                                value: ele.name,
                                px: ele.px,
                                py: ele.py,
                                fontSize: ele.fontSize,
                                rgb: _this.colorRgbArr(ele.color),
                                circleSize: ele.angle,
                                roughness: ele.fontWeight / 100
                            };
                            break;
                        case 'img':
                            customEle = {
                                type: 'img',
                                value: ele.name,
                                px: ele.px,
                                py: ele.py,
                                width: ele.width,
                                height: ele.height,
                            };
                            break;
                        default:
                            throw Error("custom ele.type(" + ele.type + ") error!");
                    }
                    if (!data['positionConfig']['optionKeys']) {
                        data['positionConfig']['optionKeys'] = [];
                    }
                    data['positionConfig']['optionKeys'].push(customEle);
                    break;
                case 'actualPrice':
                case 'catalogs':
                case 'productName':
                case 'originalPrice':
                    var tempEle = {
                        type: 'text',
                        value: ele.name,
                        px: ele.px,
                        py: ele.py,
                        fontSize: ele.fontSize,
                        rgb: _this.colorRgbArr(ele.color),
                        circleSize: ele.angle,
                        roughness: ele.fontWeight / 100
                    };
                    data['positionConfig'][ele.fType] = tempEle;
                    // data[ele.fType] = tempEle;
                    break;
                case 'qrCode':
                    var qrCode = {
                        px: ele.px,
                        py: ele.py
                    };
                    data['positionConfig']['qrCode'] = qrCode;
                    data['qrCodeWidth'] = ele.width;
                    break;
                case 'productImg':
                    var productImg = {
                        px: ele.px,
                        py: ele.py,
                        width: ele.width,
                        height: ele.height
                    };
                    data['positionConfig']['productImg'] = productImg;
                    break;
            }
        });
        // console.log('transform data : ', data);
        return data;
    };
    DashboardComponent.prototype.colorHex = function (that) {
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        if (/^(rgb|RGB)/.test(that)) {
            var aColor = that.replace(/(?:||rgb|RGB)*/g, "").split(",");
            var strHex = "#";
            for (var i = 0; i < aColor.length; i++) {
                var hex = Number(aColor[i]).toString(16);
                if (hex === "0") {
                    hex += hex;
                }
                strHex += hex;
            }
            if (strHex.length !== 7) {
                strHex = that;
            }
            return strHex;
        }
        else if (reg.test(that)) {
            var aNum = that.replace(/#/, "").split("");
            if (aNum.length === 6) {
                return that;
            }
            else if (aNum.length === 3) {
                var numHex = "#";
                for (var i = 0; i < aNum.length; i += 1) {
                    numHex += (aNum[i] + aNum[i]);
                }
                return numHex;
            }
        }
        else {
            return that;
        }
    };
    DashboardComponent.prototype.colorRgb = function (data) {
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        var sColor = data.toLowerCase();
        if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
                var sColorNew = "#";
                for (var i = 1; i < 4; i += 1) {
                    sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                }
                sColor = sColorNew;
            }
            //处理六位的颜色值  
            var sColorChange = [];
            for (var i = 1; i < 7; i += 2) {
                sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
            }
            return "RGB(" + sColorChange.join(",") + ")";
        }
        else {
            return sColor;
        }
    };
    DashboardComponent.prototype.colorRgbArr = function (data) {
        var strs1 = data.split('(');
        var strs2 = strs1[1].split(')');
        var finals = strs2[0].split(',');
        return [parseInt(finals[0]), parseInt(finals[1]), parseInt(finals[2])];
    };
    DashboardComponent.prototype.addElementToTemplateService = function (element) {
        element.zIndex += this.templateService.elements.length;
        this.templateService.elements.push(element);
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
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
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