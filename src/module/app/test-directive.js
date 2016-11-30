/**
 * Created by Administrator on 2016/11/29.
 */
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
var core_1 = require("@angular/core");
var InitDir = (function () {
    function InitDir() {
    }
    InitDir.prototype.ngOnChanges = function () {
        console.log('ngOnChanges-------');
        console.log('this.init : ' + this.init);
        // console.log('this.init : ' + JSON.stringify(this.init));
        if (this.init) {
            var iife = function (str) { return eval(str); }.call(this.init[0], this.init[1]);
            console.log('this.iife : ' + iife);
            console.log('iife : ' + JSON.stringify(iife));
        }
    };
    InitDir = __decorate([
        core_1.Directive({
            selector: '[init]',
            inputs: ['init']
        }), 
        __metadata('design:paramtypes', [])
    ], InitDir);
    return InitDir;
}());
exports.InitDir = InitDir;
//# sourceMappingURL=test-directive.js.map