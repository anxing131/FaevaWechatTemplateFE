import { SettingComponent } from './components/setting/setting.component';
/**
 * Created by Administrator on 2016/10/9.
 */
import { Component, Inject,OnInit,ComponentRef, ViewChild, Input, ComponentFactoryResolver, ViewContainerRef} from '@angular/core';

import * as Rx from "rxjs/Rx";
import {UserService} from "../../services/user.service";
import {User} from "../../model/user";

declare var $ : any;

@Component({
    moduleId: module.id,
    selector: 'my-app, [my-app]',
    templateUrl: 'app.html',
    styleUrls: ['app.css']
})
export class AppComponent implements OnInit{
    name:string = 'ax';
    @ViewChild('loginDimmer') loginDimmer: any;
    @ViewChild('internalErrorDimmer') internalErrorDimmer: any;

    @ViewChild('axSetting', { read: ViewContainerRef })
    private axSetting: any;
    private axSettingComponentRef: ComponentRef<SettingComponent>;

    @Input() data: any;

    constructor(
        private userService: UserService,
        private resolver: ComponentFactoryResolver,
        @Inject('config') private config: any
    ){
        this.changeSubject.subscribe({
            next: (p) => {console.log('p : ' + this.name);}
        });
        console.log('changeStream1 : ' + this.changeStream);

        this.initAppData();

        setTimeout(function() {
            
        }, 5000);
    }

    ngOnInit(){ 
    }

    addSettingComponent(){
        if(this.axSettingComponentRef){
            return;
        }
        let componentFactory = this.resolver.resolveComponentFactory(SettingComponent);
        this.axSettingComponentRef = this.axSetting.createComponent(componentFactory);
    }

    destroySettingComponent(){
        if(this.axSettingComponentRef){
            this.axSettingComponentRef.destroy();
        }
    }

    allowDrop(event: any) {
        event.preventDefault();
    }

    pageX(elem) { 
        return elem.offsetParent?(elem.offsetLeft+this.pageX(elem.offsetParent)):elem.offsetLeft; 
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
        setTimeout(() => {
            this.userService.loginDimmer = this.loginDimmer;
        }, 1000);
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
