import { BackgroundComponent } from './../background/background.component';
import { AppComponent } from './../../app.component';
// import { IsObjectPipe } from './../../../../assets/angular-pipes/src/boolean/types.pipe';
import { UserService } from './../../../../services/user.service';
import { FaevaBeApiService } from './../../../../services/faeva-beapi.service';
import { Border2Component } from './../../border2.component';
/**
 * Created by Administrator on 2016/10/10.
 */

import {Component, OnInit,Host, OnDestroy,Inject, forwardRef, ViewChild, Renderer} from "@angular/core";
import {Hero} from "../../../../model/hero";
import {Router} from "@angular/router";
import {BeApiService} from "../../../../services/beapi.service";
import {TemplateService} from "../../../../services/template.service";
import setTimeout = core.setTimeout;
import {Subject, Subscription} from "rxjs/Rx";

declare var $ : any;

@Component({
    moduleId: module.id,
    templateUrl: 'dashboard.html',
    styleUrls: ['dashboard.css'],
})
export class DashboardComponent implements OnInit, OnDestroy{
    imgSrc: string = '';
    fields: any = [
        {name: 'QrCode', type: 'image', icon: 'image'},
        {name: 'ProductImg', type: 'productImg', icon: 'image'},
        {name: 'ProductName', type: 'field', icon: 'Code'},
        {name: 'xxxxx', type: 'custom', icon: 'Add User'},
    ];

    //背景图
    bottomBackground: string = 'green';

    color = '#ff0000';
    cpToggle: boolean = false;
    cpType: string = 'fixed';

    tempHeight: any = 0;
    tempWidth: any = 0;

    //变更背景时的Modal临时数据
    changeBGModalConf: any = {
        index: 1,  // 当前的处理/选择步骤 
        type: 'none', //当前选择背景类型; none/image/color
        width: 800,
        height: 600,
        loaddingFlag: false, //loadding switch
        errInfo: [
            // {field: 'width', msg: 'width is require!'},
            // {field: 'height', msg: 'height is require!'},
        ]  //错误信息
    }


    inputCustomFieldFlag: boolean = false;
    static changeSubject: Subject<any> = new Subject();
    changeSubjection: Subscription;
    
    private appComponent: any;

    @ViewChild('rightClickMenu') rightClickMenu: any;
    @ViewChild('backgroundInput') backgroundInput: any;
    @ViewChild('bgChangModelImgInput') bgChangModelImgInput: any;
    @ViewChild('templateBGInput') templateBGInput: any;
    
    input(event: any, type: string){
        if(type != 'blur'){
          this.cpToggle = true;
        }
    }

    constructor(
        private router: Router,
        private renderer: Renderer,
        private beApiService: BeApiService,
        private templateService: TemplateService,
        private faevaBeApiService: FaevaBeApiService,
        private userService: UserService,
        @Host() @Inject(forwardRef(()=> AppComponent)) appComponent:AppComponent
    ) {
        appComponent.addSettingComponent();
        this.appComponent = appComponent;
    }


    ngOnInit(): void{
        //reset body heigh/width
        $(window).resize(() => {
            console.log('resize ---');
            let body = $('body')[0];

            if(this.templateService.height > body.clientHeight || 
                this.templateService.width > body.clientWidth
            ){
                if(this.templateService.height > body.clientHeight){
                    $('body').height(this.templateService.height);
                }else{
                    $('body').height('100%');
                }

                if(this.templateService.width > body.clientWidth){
                    $('body').width(this.templateService.width);
                }else{
                    $('body').width('100%');
                }
            }else{
                $('body').width('100%').height('100%');
            }
        });

         this.changeSubjection = DashboardComponent.changeSubject.subscribe({
            next: (p) => {
                switch(p.event){
                    case 'closeInputCustomField': 
                        this.closeInputCustomField();
                        break;
                    case 'closeRightMenu': 
                        this.renderer.setElementClass(this.rightClickMenu.nativeElement, 'menu-hide', true);
                }
            }
        });

        $("#backgroundInput").change(((context) => {
            return (event) => {
                context.fileChange(event);
            }
        })(this));


        setTimeout(() => {
            this.reflashUI();
        }, 500);
    }

    ngOnDestroy(){
        this.changeSubjection.unsubscribe();
        this.appComponent.destroySettingComponent();
    }

    closeInputCustomField(){
        this.inputCustomFieldFlag = false;
    }

    test(){
        console.log('test');
        let img = <HTMLElement>document.getElementById('background-content-div');

    }

    addField(field: any){
        console.log('field in : ' + JSON.stringify(field));
    }

    dblclick(event: MouseEvent, type: string){
        switch(type){
            case 'changeTemplateBG': 
                let ele  = <HTMLElement>this.templateBGInput.nativeElement;
                ele.click();
                break;
        }
    }

    rightBarDbclick(type: any){
        switch(type){
            case 'addCustomFieldFlag': 
                this.inputCustomFieldFlag = !this.inputCustomFieldFlag;
                break;        
        }
        
        console.log('rightBarDbclick -----------------');
    }

    rightMenuItemClick(event: MouseEvent, type: string){
        switch(type){
            case 'changeBG':
                $('.changeBGModal').modal({
                    closable: false
                }).modal('show');
                console.log('changeBE click');
                break; 
            
            case 'repeatBG': 

                
                if(this.bottomBackground.indexOf('no-repeat') > 0){
                    this.bottomBackground = this.bottomBackground.replace(/no-repeat/, 'repeat');
                }else{
                    this.bottomBackground = this.bottomBackground.replace(/repeat/, 'no-repeat');
                }


                
                // BackgroundComponent.changeSubject.next({event: 'changeBGRepeat'});
                break;
        }
    }

    contextmenu(event: MouseEvent){
        let pagey:number = <number>event.pageY - 40;
        let pagex:number = <number>event.pageX + 30;

        pagey -= window.scrollY;
        pagex -= window.scrollX;

        event.stopImmediatePropagation();
        console.log('rightClickMenu : ', this.rightClickMenu);
        let rightClickMenuEle:HTMLElement = <HTMLElement>this.rightClickMenu.nativeElement;
        
        
        this.renderer.setElementStyle(rightClickMenuEle, 'top', pagey + '');
        this.renderer.setElementStyle(rightClickMenuEle, 'left', pagex + '');
        this.renderer.setElementClass(rightClickMenuEle, 'menu-hide', false);

        return false;   
    }

    onclick(event: MouseEvent){
        this.renderer.setElementClass(this.rightClickMenu.nativeElement, 'menu-hide', true);
        Border2Component.changeSubject.next({event: 'closeRightMenu'});   
        Border2Component.changeSubject.next({event: 'closeBorder'});   
    }

    click(event: MouseEvent, type: string){
        switch(type){
            case 'onBgChange_img_save_external': 
                let url = this.bgChangModelImgInput.nativeElement.value;
                console.log('nativeElement : ', this.bgChangModelImgInput.nativeElement);
                this.bottomBackground = `url(${url}) center`;
                break;
            case 'saveBGChange_colors':
                this.changeBGModalConf.errInfo = [];
                this.bottomBackground = this.color;

                this.closeChangeBGModal();
                break;
            case 'bgModalMenuBack':
                switch(this.changeBGModalConf.index){
                    case 2 : 
                        this.changeBGModalConf.type = 'none';
                        this.changeBGModalConf.index = 1;
                        break;
                }

                break;
            case 'closeBGModalMenu':
                this.closeChangeBGModal();
                break;
            
            case 'changeModal_selectColor':
                this.changeBGModalConf.type = 'color';
                this.changeBGModalConf.index = 2;
                break;
            
            case 'changeModal_selectImage': 
                this.changeBGModalConf.type = 'image';
                this.changeBGModalConf.index = 2;
                break;
        }

        
    }

    change(event: any, type ?: string){
        switch(type){
            case 'onBgChange_img_select': 
                let ele  = <HTMLElement>this.backgroundInput.nativeElement;
                
                if(event.target.value == 'local'){
                    ele.focus();
                    ele.click();
                }
                
                break;
            case 'onBgChange_img_change' :
                //目前这个事件响应失效, 采用jq.change 来替代(上次在其他地方是可以的, 暂时搁浅)
                this.fileChange(event);
                break;

        }
        
    }

    fileChange(event: any, type ?: string){
        let img = null;
        if (event.target.files && event.target.files[0]) {
            switch(type){
                case 'templateBGInput': 
                    var files = event.target.files;
                    var file = files[0];
                    var imageType = /^image\//;

                    if (!imageType.test(file.type)) {
                        return;
                    }

                    img = <HTMLImageElement>document.getElementById('preview_img2');

                    var reader = new FileReader();
                    reader.onload = (function (aImg, context) {
                        return function (e) {
                            aImg.src = e.target.result;

                            context.tempHeight = aImg.naturalHeight;
                            context.tempWidth = aImg.naturalWidth;
                            console.log('event : ', e);
                        };
                    })(img, this);

                    reader.addEventListener('load', function (obj: any) {
                        let img = document.getElementById('preview_img2');
                        img.click();
                    });

                    reader.readAsDataURL(file);
                    break;
                default: 
                    // var preview = document.getElementById('preview');
                    var files = event.target.files;
                    var file = files[0];
                    var imageType = /^image\//;

                    if (!imageType.test(file.type)) {
                        return;
                    }

                    // var img = document.createElement("img");
                    // img.classList.add("obj");
                    // img.id = 'temp-bg-img';
                    // img.width = 0.001;
                    // img.height = 0.001;
                    // img.onclick(this.cl)
                    // preview.appendChild(img); // Assuming that "preview" is the div output where the content will be displayed.
                    img = <HTMLImageElement>document.getElementById('changeBGModalConf_preview_img');

                    var reader = new FileReader();
                    reader.onload = (function (aImg) {
                        return function (e) {
                            aImg.src = e.target.result;
                            console.log('event : ', e);
                        };
                    })(img);

                    reader.addEventListener('load', function (obj: any) {
                        let img = document.getElementById('changeBGModalConf_preview_img');
                        img.click();
                    });

                    reader.readAsDataURL(file);
                    break;
            }

                    
                }
    }

    imgChange(type ?: string){
        let img  = null;
        switch(type){
            case 'preview_img2':    
                img = <HTMLImageElement>document.getElementById('preview_img2');
                this.uploadImgToS3(img.src, (result) => {
                    if(result.code == 200){
                        let url = result.msg.link;
                        this.templateService.bg = url;
                        this.templateService.height = this.tempHeight;
                        this.templateService.width = this.tempWidth;

                        console.log('upload success : ' + url);
                    }else{
                        
                        console.log('upload Image to S3 Error : ', result);
                    }
                });
                break;
            
            default:
                img = <HTMLImageElement>document.getElementById('changeBGModalConf_preview_img');
                this.uploadImgToS3(img.src, (result) => {
                    this.changeBGModalConf.loaddingFlag = false;
                    this.closeChangeBGModal();
                    if(result.code == 200){
                        this.bottomBackground = `url(${result.msg.link}) center no-repeat`;
                        this.reflashUI();
                        console.log('upload success...  rze');
                    }else{
                        
                        console.log('upload Image to S3 Error : ', result);
                    }
                });
        }

        // localStorage.setItem('templateData', JSON.stringify(this.templateService));
        img.src = '';
        this.renderer.setElementStyle(img, 'display', 'none');
    }


    //通过trigger resize 事件进行重新设置body的高度, 实现整个界面的大小进行调整适应
    reflashUI(){
        setTimeout(() => {
            var event = document.createEvent('HTMLEvents');
            let body = $('body')[0];
            // Define that the event name is 'build'.
            event.initEvent('resize', true, true);

            // target can be any Element or other EventTarget.
            window.dispatchEvent(event);
        },1000);
    }
    

    uploadImgToS3(content, cb){

        this.changeBGModalConf.loaddingFlag = true;

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
                content:content,
                userId: userId
            }
        };

        this.beApiService.commonReqByFaeva(url, body, null, (result: any) =>{
            cb(result);
        });
    }

    closeChangeBGModal(){
        $('.changeBGModal').modal('hide');
    }
}