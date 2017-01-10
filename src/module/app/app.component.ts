import { BeApiService } from './../../services/beapi.service';
import { config } from './../../config/application';
import { FaevaBeApiService } from './../../services/faeva-beapi.service';
import { OnDestroy } from '@angular/core';
import { SettingComponent } from './components/setting/setting.component';
/**
 * Created by Administrator on 2016/10/9.
 */
import { Component, Inject,OnInit,ComponentRef, ViewChild, Input, ComponentFactoryResolver, ViewContainerRef} from '@angular/core';

import {Subject, Subscription, Observable} from "rxjs/Rx";
import {UserService} from "../../services/user.service";
import {User} from "../../model/user";

declare var $ : any;

@Component({
    moduleId: module.id,
    selector: 'my-app, [my-app]',
    templateUrl: 'app.html',
    styleUrls: ['app.css']
})
export class AppComponent implements OnInit, OnDestroy{
    name:string = 'ax';
    @ViewChild('loginDimmer') loginDimmer: any;
    @ViewChild('internalErrorDimmer') internalErrorDimmer: any;
    @ViewChild('tempGlobalInputFiles') tempGlobalInputFiles: any;

    @ViewChild('axSetting', { read: ViewContainerRef })
    private axSetting: any;
    private axSettingComponentRef: ComponentRef<SettingComponent>;

    private tempGlobalInputFilesHeight: any;
    private tempGlobalInputFilesWidth: any;
    private tempInputFilesOriginData: any;

    @Input() data: any;

    static changeSubject: Subject<any> = new Subject();
    changeSubjection: Subscription;


    constructor(
        private userService: UserService,
        private resolver: ComponentFactoryResolver,
        private faevaBeApiService: FaevaBeApiService,
        private beApiService: BeApiService,
        @Inject('config') private config: any
    ){
        this.changeSubject.subscribe({
            next: (p) => {console.log('p : ' + this.name);}
        });
        console.log('changeStream1 : ' + this.changeStream);

        this.initAppData();

        setTimeout(function() {
            
        }, 5000);

        this.changeSubjection = AppComponent.changeSubject.subscribe({
            next: (data) => {
                switch(data.event){
                    case 'inputFiles' : 
                        this.inputFiles();
                        this.tempInputFilesOriginData = data.originData;
                        console.log('inputfiles .... ');
                        break;
                }
            } 
        });
    }

    ngOnInit(){ 
        
    }

    ngOnDestroy(){
        if(this.changeSubjection){
            this.changeSubjection.unsubscribe();
        }
    }

    inputFiles(){
        let input = <HTMLElement>this.tempGlobalInputFiles.nativeElement;
        input.click();
    }

    fileChange(event: any){
        var files = event.target.files;
        var file = files[0];
        var imageType = /^image\//;

        if (!imageType.test(file.type)) {
            return;
        }

        let img = <HTMLImageElement>document.getElementById('globalInputFilesPreviewImg');
        var reader = new FileReader();
        reader.onload = (function (aImg, context) {
            return function (e) {
                aImg.src = e.target.result;
                
                let resource = {
                    event: 'globalInputFilesFinished',
                    data : aImg.src,
                    height: aImg.naturalHeight,
                    width: aImg.naturalWidth,
                    fileSize : e.total,
                    originData: context.tempInputFilesOriginData
                };
                AppComponent.changeSubject.next(resource);

                if(context.tempInputFilesOriginData.config){
                    let config = context.tempInputFilesOriginData.config;
                    if(config.uploadToS3Flag && config.uploadToS3Flag == true){
                        context.uploadImgFileToS3Temp(resource);
                    }
                }
                
                // console.log('e : ', e);
            };
        })(img, this);

        // reader.addEventListener('load', function (obj: any) {
        //     let img = document.getElementById('globalInputFilesPreviewImg');
        //     img.click();
        // });

        reader.readAsDataURL(file);
    }

    //上传文件到s3 临时路径
    uploadImgFileToS3Temp(data){
        AppComponent.changeSubject.next({
            event: 'startUploadToS3',
            originData: this.tempInputFilesOriginData
        });

        let url = this.faevaBeApiService.getUrl('uploadTemporaryImgByAdmin');
        let userId = this.userService.loginUser.id;
        let token = this.userService.loginUser.token;
        let body = {
            ws:{
                 token: token,
                 platformType: "Builder",
                 userType:"admin",
            },
            data:{
                content:data.data,
                userId: userId
            }
        };

        this.beApiService.commonReqByFaeva(url, body, null, (result: any) =>{
            // cb(result);
            // console.log('upload to s3 result : ', result);
            AppComponent.changeSubject.next({
                event: 'finishedUploadToS3',
                originData: this.tempInputFilesOriginData,
                result : result
            });
        },(e) => {
            console.log('upload to s3 error : ', e);
            AppComponent.changeSubject.next({
                event: 'errorUploadToS3',
                originData: this.tempInputFilesOriginData,
                err : e
            });
        });
    }
  
    addSettingComponent(){
        if(this.axSettingComponentRef){
            console.log('yes axSettingComponentRef : ', this.axSettingComponentRef);
            return;
        }
        let componentFactory = this.resolver.resolveComponentFactory(SettingComponent);
        this.axSettingComponentRef = this.axSetting.createComponent(componentFactory);
    }

    destroySettingComponent(){
        if(this.axSettingComponentRef){
            console.log('destroy axSettingComponentRef ... ');
            this.axSettingComponentRef.destroy();
            this.axSettingComponentRef = null;
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
    changeStream: Observable<any>;
    changeSubject: Subject<any> = new Subject();


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
