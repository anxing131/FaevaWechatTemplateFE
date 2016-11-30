import {Base, MyProxyHander} from "./base";
import {Template} from "./template";
/**
 * Created by Administrator on 2016/10/10.
 */

declare var Proxy: any;

export class Template2 extends Template{
    id: string;
    name: string;
    age : number;

    _attrs: any = [
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

    constructor(obj?: any){
        super();
        this.id   = obj && obj.id     || '';
        this.name = obj && obj.name   || '';
        this.createDate = obj && obj.createDate || -1;
        this.background = obj && obj.background || 's';
        this.preview = obj && obj.preview || '';
        this.qrCodeWidth = obj && obj.qrCodeWidth || 240;
        this.positionConfig = obj && obj.positionConfig || new Object();
        this.tags = obj && obj.tags || [];
        this.age = obj && obj.age || 7;


        // this.postConstructor();
    }

}