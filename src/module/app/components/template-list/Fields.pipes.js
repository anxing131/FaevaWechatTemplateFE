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
var FieldsPipe = (function () {
    function FieldsPipe() {
    }
    /**
     * Support a function or a value or the shorthand ['key', value] like the lodash shorthand.
     */
    FieldsPipe.prototype.transform = function (input, cb) {
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
        return input.filter((function (cb, params) {
            return function (item) {
                return cb(item, params);
            };
        })(cb, params));
    };
    return FieldsPipe;
}());
FieldsPipe = __decorate([
    core_1.Pipe({
        name: 'axwhere'
    }),
    __metadata("design:paramtypes", [])
], FieldsPipe);
exports.FieldsPipe = FieldsPipe;
//# sourceMappingURL=Fields.pipes.js.map