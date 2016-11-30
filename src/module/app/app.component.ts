/**
 * Created by Administrator on 2016/10/9.
 */
import { Component, Inject, ViewChild, Input} from '@angular/core';

import * as Rx from "rxjs/rx";
import {UserService} from "../../services/user.service";
import {User} from "../../model/user";

@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: 'app.html',
    styleUrls: ['app.css']
})
export class AppComponent {
    name:string = 'ax';
    @ViewChild('loginDimmer') loginDimmer: any;
    @ViewChild('internalErrorDimmer') internalErrorDimmer: any;

    @Input() data: any;

    constructor(
        private userService: UserService,
        @Inject('config') private config: any
    ){
        this.changeSubject.subscribe({
            next: (p) => {console.log('p : ' + this.name); }
        });
        console.log('changeStream1 : ' + this.changeStream);

        this.initAppData();
    }

    allowDrop(event: any) {
        event.preventDefault();
    }

    test(){
        var [a, b, c] = this.example();

        console.log('this.data : ' + this.data);
        console.log('a : ' + a);
    }

    example(){
        return ['anxing', 2, 3];
    }

    testFlag: boolean = false;
    changeStream: Rx.Observable<any>;
    changeSubject: Rx.Subject<any> = new Rx.Subject();


    /**
     * 初始化应用数据
     *
     *     1、用户数据
     */
    initAppData(){
        let userInfo = localStorage.getItem('loginUserInfo');
        if(userInfo){
            let user = new User(JSON.parse(userInfo));
            this.userService.loginUser = user;
        }else{
            setTimeout(() => {
                this.userService.internalErrorDimmer = this.internalErrorDimmer;
                this.loginDimmer.show();
            }, 1000);
        }
    }
}
