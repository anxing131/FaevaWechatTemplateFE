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
        _super.call(this);
        this._attrs = [
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
        this.id = obj && obj.id || '';
        this.name = obj && obj.name || '';
        this.createDate = obj && obj.createDate || -1;
        this.background = obj && obj.background || 's';
        this.preview = obj && obj.preview || '';
        this.qrCodeWidth = obj && obj.qrCodeWidth || 240;
        this.positionConfig = obj && obj.positionConfig || new Object();
        this.tags = obj && obj.tags || [];
        this.age = obj && obj.age || 7;
        // this.postConstructor();
    }
    return Template2;
}(template_1.Template));
exports.Template2 = Template2;
//# sourceMappingURL=template2.js.map