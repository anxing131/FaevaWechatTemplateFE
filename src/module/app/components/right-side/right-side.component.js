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
var core_2 = require("@angular/core");
var template_service_1 = require("../../../../services/template.service");
var RightSideComponent = (function (_super) {
    __extends(RightSideComponent, _super);
    function RightSideComponent(renderer, templateService) {
        _super.call(this);
        this.renderer = renderer;
        this.templateService = templateService;
        this.addCustomFieldFlag = false;
        this.addCustomFieldError = false;
        this.fieldSelect = new core_1.EventEmitter();
        this.itemList = [
            { value: "QrCode", icon: "image" },
            { value: "ProductImg", icon: "image" },
            { value: "ProductName", icon: "content" },
        ];
    }
    RightSideComponent.prototype.ngOnInit = function () {
    };
    RightSideComponent.prototype.onFieldSelect = function (field) {
        this.fieldSelect.emit(field);
    };
    RightSideComponent.prototype.imgChange = function () {
        var img = document.getElementById('temp-bg-img2');
        this.templateService.width = img.naturalWidth + '';
        this.templateService.height = img.naturalHeight + '';
        this.templateService.bg = img.src;
        console.log('width : ' + img.naturalWidth);
        console.log('height : ' + img.naturalHeight);
        localStorage.setItem('templateData', JSON.stringify(this.templateService));
        img.src = '';
        this.renderer.setElementStyle(img, 'display', 'none');
    };
    RightSideComponent.prototype.fileChangeEvent = function (fileInput) {
        if (fileInput.target.files && fileInput.target.files[0]) {
            var preview = document.getElementById('preview');
            var files = fileInput.target.files;
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
            var img = document.getElementById('temp-bg-img2');
            var reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                };
            })(img);
            reader.addEventListener('load', function (obj) {
                var img = document.getElementById('temp-bg-img2');
                img.click();
            });
            reader.readAsDataURL(file);
        }
    };
    RightSideComponent.prototype.onDblclick = function (type) {
        switch (type) {
            case '+customField':
                this.addCustomFieldFlag = !this.addCustomFieldFlag;
                break;
            case 'onChangeBackground':
                var ele = this.backgroundInput.nativeElement;
                ele.click();
                break;
            default:
                break;
        }
    };
    RightSideComponent.prototype.onAddFieldInputKeyPress = function (nameEle, typeEle, event) {
        if (event.keyCode == 13) {
            this.addField(nameEle, typeEle, event);
        }
    };
    RightSideComponent.prototype.clearInputBorderWarnning = function (nameEle) {
        this.renderer.setElementStyle(nameEle, 'border-color', '');
    };
    RightSideComponent.prototype.addField = function (nameEle, typeEle, $event) {
        var name = nameEle.value;
        var type = typeEle.value;
        if (name.trim() == '') {
            this.addCustomFieldError = true;
            this.renderer.setElementStyle(nameEle, 'border-color', 'red');
            return false;
        }
        this.itemList.push({ value: name, icon: type });
        this.addCustomFieldFlag = false;
        return true;
    };
    RightSideComponent.prototype.keydown = function () {
        console.log('keydown');
    };
    RightSideComponent.prototype.tests = function (parent) {
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], RightSideComponent.prototype, "fieldSelect", void 0);
    __decorate([
        core_2.ViewChild('backgroundInput'), 
        __metadata('design:type', Object)
    ], RightSideComponent.prototype, "backgroundInput", void 0);
    RightSideComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'ax-right-side',
            templateUrl: 'index.html',
            styleUrls: ['style.css'],
        }), 
        __metadata('design:paramtypes', [core_1.Renderer, template_service_1.TemplateService])
    ], RightSideComponent);
    return RightSideComponent;
}(core_1.OnInit));
exports.RightSideComponent = RightSideComponent;
//# sourceMappingURL=right-side.component.js.map