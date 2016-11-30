"use strict";
// export class Template extends Base{
var Template = (function () {
    function Template(obj) {
        this.id = obj && obj.id || '';
        this.name = obj && obj.name || '';
        this.createDate = obj && obj.createDate || -1;
        this.background = obj && obj.background || 's';
        this.preview = obj && obj.preview || '';
        this.qrCodeWidth = obj && obj.qrCodeWidth || 240;
        this.positionConfig = obj && obj.positionConfig || new Object();
        this.tags = obj && obj.tags || [];
    }
    return Template;
}());
exports.Template = Template;
//# sourceMappingURL=template.js.map