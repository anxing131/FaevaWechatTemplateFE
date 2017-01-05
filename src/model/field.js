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
//暂时不要, 好像是多余不需要的
var Field = (function () {
    function Field(obj) {
        this.id = obj && obj.id || undefined;
        this.name = obj && obj.name || '';
        this.createDate = obj && obj.createDate || -1;
        this.type = obj && obj.type || fieldType.OptionKey;
        this.optionType = obj && obj.optionType || 'text';
    }
    return Field;
}());
exports.Field = Field;
//# sourceMappingURL=field.js.map