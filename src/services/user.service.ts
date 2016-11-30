/**
 * Created by Administrator on 2016/11/21.
 */
import {Injectable} from "@angular/core";

import {User} from "../model/user";
import {CanActivate, Router} from "@angular/router";

@Injectable()
export class UserService implements CanActivate {
    //当前登录的用户资料
    loginUser: User;
    loginDimmer: any;

    // 500 错误全局dimmer
    internalErrorDimmer: any;

    constructor(private router: Router){
    }

    showLoginDimmer(){
        if(!this.loginDimmer){
            throw new Error('loginDimmer not init! ');
        }
        this.loginDimmer.show();
    }

    showInternalErrorDimmer(data){
        if(!this.internalErrorDimmer){
            throw new Error('internalErrorDimmer not init! ');
        }
        this.internalErrorDimmer.show(data);
    }

    canActivate(): boolean{
        if(!this.loginUser){
            //show login dimmer
        }
        return !!this.loginUser;
    }

    login(user: User){
        this.loginUser = user;
        let userInfo = JSON.stringify(user);
        localStorage.setItem('loginUserInfo', userInfo);
    }

    loginOut(){
        this.loginUser = null;
        localStorage.removeItem('loginUserInfo');

        this.router.navigateByUrl('http://baidu.com/');
    }

    /**
     *  处理通用的API相应错误, 是内容里面的code != 200 的处理方式
     *
     *  @return boolean 这里不能匹配处理返回false, 能够处理返回true
     */
    handleCommonAuthApiRespo(res){
        switch(res.code){
            case 605:
                this.showLoginDimmer();
                return true;

            case 500:
                this.showInternalErrorDimmer(res);
                return true;

            default:
                return false;
        }
    }

}