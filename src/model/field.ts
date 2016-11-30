/**
 * Created by Administrator on 2016/10/10.
 */

export enum fieldType {
    QrCode,
    ProductImage,
    OptionKey,
    ActualPrice,
    ProductName,
    OriginalPrice,
    Catalogs
}


//暂时不要, 好像是多余不需要的
export class Field{
    id: string;
    name: string;       //名称
    createDate: number;  //创建时间
    type: fieldType;    //属性类型
    optionType: string;  //optionKeys 里面的type
    px: number;     //x 坐标
    py: number;    //y 坐标
    width: number; //宽度
    height: number; //高度
    font: string; //字体
    roughness: number; //字体粗度
    fontSize: number; //字体大小
    circleSize: number;  //旋转角度
    rgb: any; //字体颜色

    constructor(obj?: any){
        this.id   = obj && obj.id     || undefined;
        this.name = obj && obj.name   || '';
        this.createDate = obj && obj.createDate || -1;
        this.type = obj && obj.type || fieldType.OptionKey;
        this.optionType = obj && obj.optionType || 'text';
    }
}

