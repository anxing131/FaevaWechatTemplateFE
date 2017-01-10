/**
 * Created by Administrator on 2016/10/10.
 */
"use strict";
var fieldType;
(function (fieldType) {
    fieldType[fieldType["QrCode"] = 0] = "QrCode";
    fieldType[fieldType["ProductImage"] = 1] = "ProductImage";
    fieldType[fieldType["OptionKey"] = 2] = "OptionKey";
    fieldType[fieldType["ActualPrice"] = 3] = "ActualPrice";
    fieldType[fieldType["ProductName"] = 4] = "ProductName";
    fieldType[fieldType["OriginalPrice"] = 5] = "OriginalPrice";
    fieldType[fieldType["Catalogs"] = 6] = "Catalogs";
})(fieldType = exports.fieldType || (exports.fieldType = {}));
var Field = (function () {
    function Field(obj) {
        this.id = obj && obj.id || undefined;
        this.name = obj && obj.name || '';
        this.createDate = obj && obj.createDate || -1;
        this.type = obj && obj.type || fieldType.OptionKey;
        this.optionType = obj && obj.optionType || 'text';
        this.px = obj && obj.px || 0;
        this.py = obj && obj.py || 0;
        this.width = obj && obj.width || 100;
        this.height = obj && obj.widht || 100;
        this.fontWeight = obj && obj.fontWeight || 400;
        this.fontSize = obj && obj.fontSize || 14;
        if (obj && obj.fontFamily) {
            this.fontFamily = obj.fontFamily;
        }
    }
    return Field;
}());
exports.Field = Field;
//# sourceMappingURL=field.js.map