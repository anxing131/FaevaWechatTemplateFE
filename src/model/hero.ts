/**
 * Created by Administrator on 2016/10/10.
 */

export class Hero{
    id: string;
    name: string;
    createDate: number;

    constructor(obj?: any){
        this.id   = obj && obj.id     || '';
        this.name = obj && obj.name   || '';
        this.createDate = obj && obj.createDate || -1;
    }
}