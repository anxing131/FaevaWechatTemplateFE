import {Base, MyProxyHander} from "./base";
/**
 * Created by Administrator on 2016/10/10.
 */

declare var Proxy: any;

// export class Template extends Base{
export class Template{
    id: string;
    name: string;
    createDate: number;
    background: string;
    preview: string;
    qrCodeWidth: number;
    tags: string[];
    positionConfig: any;

    constructor(obj?: any){
        this.id   = obj && obj.id     || '';
        this.name = obj && obj.name   || '';
        this.createDate = obj && obj.createDate || -1;
        this.background = obj && obj.background || 's';
        this.preview = obj && obj.preview || '';
        this.qrCodeWidth = obj && obj.qrCodeWidth || 240;
        this.positionConfig = obj && obj.positionConfig || new Object();
        this.tags = obj && obj.tags || [];
    }
}