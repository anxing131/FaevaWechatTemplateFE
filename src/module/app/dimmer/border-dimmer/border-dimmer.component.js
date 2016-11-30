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
var template_service_1 = require("../../../../services/template.service");
var BorderDimmerComponent = (function (_super) {
    __extends(BorderDimmerComponent, _super);
    function BorderDimmerComponent(renderer, templateService) {
        _super.call(this);
        this.renderer = renderer;
        this.templateService = templateService;
        // @Input() ele: any;
        this.changeEmit = new core_1.EventEmitter();
    }
    BorderDimmerComponent.prototype.ngOnInit = function () {
        $('.ax-custom-popup').popup({
            on: 'hover',
        });
    };
    BorderDimmerComponent.prototype.show = function () {
        $('.ax-border-modal-flags').modal("setting", {
            closable: true,
            onApprove: function () {
                console.log('onApprove');
                return true;
            },
            onHidden: (function (obj) {
                return function () {
                    for (var index in obj.templateService.elements) {
                        var tempEle = obj.templateService.elements[index];
                        if (obj.templateService.currentElement._id == tempEle._id) {
                            obj.templateService.elements[index] = obj.templateService.currentElement;
                            break;
                        }
                    }
                };
            })(this)
        }).modal('show');
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], BorderDimmerComponent.prototype, "changeEmit", void 0);
    BorderDimmerComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'ax-border-dimmer',
            templateUrl: 'index.html',
            styleUrls: ['style.css'],
        }), 
        __metadata('design:paramtypes', [core_1.Renderer, template_service_1.TemplateService])
    ], BorderDimmerComponent);
    return BorderDimmerComponent;
}(core_1.OnInit));
exports.BorderDimmerComponent = BorderDimmerComponent;
//# sourceMappingURL=border-dimmer.component.js.map