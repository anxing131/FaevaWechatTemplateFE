/**
 * Created by Administrator on 2016/10/26.
 */
import {
    Component, OnInit, trigger,
    state,
    style,
    transition,
    animate,
    Input,
    Output,
    Inject,
    Directive,
    Renderer, EventEmitter,ViewChild
} from '@angular/core';
import {UserService} from "../../../../services/user.service";
import {Headers, RequestOptions, Response, Http} from "@angular/http";
import {FaevaBeApiService} from "../../../../services/faeva-beapi.service";
import {Router} from "@angular/router";
import {User} from "../../../../model/user";
import {BeApiService} from "../../../../services/beapi.service";

declare var $ : any;

@Directive({
    selector: '[testData]',
    exportAs: 'testData'
})
@Component({
    moduleId: module.id,
    selector: 'ax-login-form-dimmer, [ax-login-form-dimmer]',
    templateUrl: 'index.html',
    styleUrls: ['style.css'],
})
export class LoginDimmerComponent extends OnInit{
    // @Input() ele: any;
    private jumpLink: string = '';
    @ViewChild('errorDimmer') errorDimmer: any;
    //临时错误信息space
    private errorInfo: any ;

    @Output() changeEmit: EventEmitter<any> = new EventEmitter();
    pwdMiniLen: number = 6;

    constructor(
        private renderer: Renderer,
        private userService: UserService,
        private faevaBeApiService: FaevaBeApiService,
        private beApiService: BeApiService,
        private http: Http,
        private router: Router,
        @Inject('config') private config: any
    ){
        super();

        console.log('login dimmer construct');
    }

    ngOnInit(){
        $('.ax-login-form').form({
            fields: {
                name: {
                    identifier  : 'name',
                    rules: [
                        {
                            type   : 'empty',
                            prompt : 'Please enter your name'
                        }
                    ]
                },
                password: {
                    identifier  : 'password',
                    rules: [
                        {
                            type   : 'empty',
                            prompt : 'Please enter your password'
                        },
                        {
                            type   : 'length['+this.pwdMiniLen+']',
                            prompt : 'Your password must be at least 6 characters'
                        }
                    ]
                }
            },

            onSuccess: (function (obj) {
                return function(event, fields){
                    obj.login(fields);
                }
            })(this)
        });
    }

    show(jumpLink ?: string){
        if(!jumpLink){
            this.jumpLink = this.config.get('defaultPage');
        }else{
            this.jumpLink = jumpLink;
        }

        console.log('show jumpLink : ' + this.jumpLink);
        $('.ax-login').modal("setting", {
            closable: false,
            allowMultiple: true,
            onHide: function () {
                console.log('ax-login onHide');
                return false;
            },
            onApprove: function(){
                console.log('ax-login onApprove');
                return false;
            },
            onDeny: function(){
                console.log('ax-login onDeny');
                return false;
            }
        }).modal('show');
    }

    hide(){
        $('.ax-login').modal('setting', {
            closable: true,
            allowMultiple: false
        }).modal('hide all');
    }

    login(userInfo: any){
        // console.log('testData : ' + this.testData);
        for(let key in userInfo){
            if(typeof userInfo[key] == 'string'){
                userInfo[key] = userInfo[key].trim();
            }
        }

        let {name, password: pwd} = userInfo;
        let url: string = this.faevaBeApiService.getUrl('login');
        let body = JSON.stringify({
            ws:{
                userType:'client',
                platformType:'Builder',
                token:'token123'
            },
            data:{
                name: name,
                pwd: pwd
            }
        });

        this.controlLoginDimmer();
        this.beApiService.commonReqByFaeva(url, body, null, (result: any) =>{
            if(result.code == 200){
                return this.handleLoginSuccess(result);
            }else{
                return this.handleLoginError(result);
            }
        });
    }

    controlLoginDimmer(isOpen ?: boolean){
        if(isOpen){
            $('.ax-login-modal-dimmer').addClass('active');
        }else{
            $('.ax-login-modal-dimmer').removeClass('active');
        }
    }

    showErrorModal(){
        console.log('showErrorModal');
        this.errorDimmer.show();
        // $('.ax-login-modal-error-alert').modal('show');
    }

    handleLoginSuccess(result){
        this.controlLoginDimmer(false);

        result.msg.id = result.msg.userId;
        delete result.msg.userId;
        let user:User = new User(result.msg);
        this.userService.login(user);

        setTimeout((function(obj){
            return obj.router.navigate(['/' + obj.jumpLink]);
        })(this), 50);
        setTimeout((function(obj){
            return obj.hide();
        })(this), 50);
    }

    handleLoginError(result){
        // this.isLoginning = true;
        if(typeof result == 'string'){
            result = JSON.parse(result);
        }

        this.controlLoginDimmer(false);
        let errorInfo = {
            code:  result.code,
            title: '',
            details: JSON.stringify(result.msg) || ''
        };

        if(typeof  result.msg == 'string'){
            errorInfo.title = result.msg;
        }

        switch(result.code){
            case 500:
                errorInfo.title = '服务器内部错误';
                break;

            case 614:
                errorInfo.title = '用户名不存在';
                break;

            case 611:
                errorInfo.title = '密码错误';
                break;

            default:
                errorInfo.title = '未解决错误';
                break;
        }

        this.errorInfo = errorInfo ;
        console.log('erroInfo : ' + JSON.stringify(this.errorInfo));
        setTimeout((function(obj){
            return function(){
                obj.showErrorModal();
            };
        })(this), 50);
    }
}