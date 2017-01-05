/**
 * Created by Administrator on 2016/10/10.
 */

export class User{
    id: string;
    name: string;
    pwd: string;
    accId: string;
    token: string;
    createDate: number;
    avator: string;

    constructor(obj?: any){
        this.id   = obj && obj.id     || '';
        this.name = obj && obj.name   || '';
        this.createDate = obj && obj.createDate || -1;
        this.accId = obj && obj.accId || '';
        this.avator = obj && obj.avator || '';
        this.token = obj && obj.token || '';
    }

    protected localStorage(){
        let userInfo = {
            id: this.id,
            name: this.name,
            accId: this.accId,
            token: this.token,
            avator: this.avator
        };

        localStorage.setItem('loginUserInfo', JSON.stringify(userInfo));
    }
}