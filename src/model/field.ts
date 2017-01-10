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
    fontFamily: string; //字体
    fontWeight: number; //字体粗度
    fontSize: number; //字体大小
    circleSize: number;  //旋转角度
    rgb: any; //字体颜色 //等待替换成color字段

    //下面都是咱没有实现的
    color: any;    //通常指的是字体颜色
    bgColor: any; //背景颜色
    borderFlag: boolean; //是否展示边框
    textAlign: string; //文本内容方向 //center right left
    

    constructor(obj?: any){
        this.id   = obj && obj.id     || undefined;
        this.name = obj && obj.name   || '';
        this.createDate = obj && obj.createDate || -1;
        this.type = obj && obj.type || fieldType.OptionKey;
        this.optionType = obj && obj.optionType || 'text';
        this.px = obj && obj.px || 0;
        this.py = obj && obj.py || 0;
        this.width = obj && obj.width || 100;
        this.height = obj && obj.widht || 100;
        this.fontWeight = obj && obj.fontWeight || 400;
        this.fontSize = obj && obj.fontSize || 14;
        

        
        if(obj && obj.fontFamily){
            this.fontFamily = obj.fontFamily;
        }

        
        
    }
}

