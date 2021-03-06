"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var template_1 = require("./template");
var Template2 = (function (_super) {
    __extends(Template2, _super);
    function Template2(obj) {
        var _this = _super.call(this) || this;
        _this._attrs = [
            'id',
            'name',
            'createDate',
            'background',
            'preview',
            'qrCodeWidth',
            'tags',
            'positionConfig',
            'age'
        ];
        _this.id = obj && obj.id || '';
        _this.name = obj && obj.name || '';
        _this.createDate = obj && obj.createDate || -1;
        _this.background = obj && obj.background || 's';
        _this.preview = obj && obj.preview || '';
        _this.qrCodeWidth = obj && obj.qrCodeWidth || 240;
        _this.positionConfig = obj && obj.positionConfig || new Object();
        _this.tags = obj && obj.tags || [];
        _this.age = obj && obj.age || 7;
        return _this;
        // this.postConstructor();
    }
    return Template2;
}(template_1.Template));
exports.Template2 = Template2;
//# sourceMappingURL=template2.js.map