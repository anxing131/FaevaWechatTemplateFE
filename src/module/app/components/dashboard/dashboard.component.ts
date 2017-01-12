import { ElementComponent } from './../background/element.component';
import { Field } from './../../../../model/field';
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
import {Router, ActivatedRoute} from "@angular/router";
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
        {name: 'QrCode', type: 'image', fType: 'image', icon: 'image', id: Date.now()},
        {name: 'ProductImg', type: 'image', fType: 'image', icon: 'image', id: Date.now()},
        {name: 'productName', type: 'field', fType:　'text', icon: 'Code', id: Date.now()},
        {name: 'actualPrice', type: 'field', fType:　'text', icon: 'Code', id: Date.now()},
        {name: 'originalPrice', type: 'field', fType:　'text', icon: 'Code', id: Date.now()},
        {name: 'catalogs', type: 'field', fType:　'text', icon: 'Code', id: Date.now()},
        {name: 'xxxxx', type: 'custom', fType:　'text', icon: 'Add User', id: Date.now()},
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
    routerSubjection: Subscription;

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
        private router: ActivatedRoute,
        private renderer: Renderer,
        private beApiService: BeApiService,
        private templateService: TemplateService,
        private faevaBeApiService: FaevaBeApiService,
        private userService: UserService,
        @Host() @Inject(forwardRef(()=> AppComponent)) appComponent:AppComponent
    ) {
        appComponent.addSettingComponent();
        this.appComponent = appComponent;

        console.log('dashboard component constructor ... ');
    }


    ngOnInit(): void{
        let keydownListener = ((context) => {
           return (e) => {
                if(e.ctrlKey){
                    switch(e.keyCode){
                       case 67: //ctrl + C
                            break;
                       case 86: //ctrl + V
                            break;
                       case 90: //Ctrl + Z
                            context.backOneStep();
                            break;
                       case 89: //Ctrl + Y
                            context.forwardOneStep();
                            break;
                   }
               }
           }
        })(this);

        $(document).keydown(keydownListener);
        this.routerSubjection = this.router.params.subscribe({
            next: (params ) => {
                this.getTemplateById(params['id']);
            }
        });

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
                        break;
                    case 'saveTemplate':
                        this.saveCurrentEditTemplate();
                        break;        
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

    //前进一步
    forwardOneStep(){
        let oldEle = this.templateService.cancelHistorys.pop();
        if(oldEle){
            
            switch(oldEle.action){
                case 'del':
                    let tempElements =  this.templateService.elements.filter(ele => {return ele._id != oldEle.oldData._id});
                    this.templateService.elements = tempElements;
                    if(oldEle.oldData._id == this.templateService.currentElement._id){
                        this.templateService.showFlag = false;
                        this.templateService.currentElement = null;
                    }
                    
                    break;
                
                case 'add':
                    this.templateService.elements.push(oldEle.oldData);
                    break;
                
                case 'edit':
                    let elements = [...this.templateService.elements]; 
                    elements.forEach((element,index, elements) => {
                        if(element._id == oldEle.oldData._id){
                            let oldData = Object.assign({}, element);
                            if(this.templateService.currentElement._id == oldEle.oldData._id){
                                this.templateService.currentElement = oldEle.oldData;
                            }

                            elements[index] = oldEle.oldData;
                            this.templateService.elements = elements;
                            oldEle.oldData = oldData;
                        }
                    });
                    break;
                
            }

            this.templateService.historys.push(oldEle);
        }
    }

    //后退一步
    backOneStep(){
        let oldEle = this.templateService.historys.pop();
        if(oldEle){
            switch(oldEle.action){
                case 'del':
                    this.templateService.elements.push(oldEle.oldData);
                    break;
                
                case 'add':
                    let tempElements =  this.templateService.elements.filter(ele => {return ele._id != oldEle.oldData._id});
                    this.templateService.elements = tempElements;
                    break;
                
                case 'edit':
                    let elements = [...this.templateService.elements]; 
                    elements.forEach((element,index, elements) => {
                        if(element._id == oldEle.oldData._id){
                            let oldData = Object.assign({}, element);
                            if(this.templateService.currentElement._id == oldEle.oldData._id){
                                this.templateService.currentElement = oldEle.oldData;
                            }

                            elements[index] = oldEle.oldData;
                            this.templateService.elements = elements;
                            oldEle.oldData = oldData;
                         }
                    });
                    break;
                
            }

            this.templateService.cancelHistorys.push(oldEle);
        }
    }

    ngOnDestroy(){
        this.changeSubjection.unsubscribe();
        this.appComponent.destroySettingComponent();

        this.routerSubjection.unsubscribe();
    }

    closeInputCustomField(){
        this.inputCustomFieldFlag = false;
    }

    test(){
        console.log('test');
        let img = <HTMLElement>document.getElementById('background-content-div');

    }
    

    addField(name: any, type: any){
        console.log('name : ' + name);
        console.log('type : ' + type);
        
        let field: any;

        switch(type){
            case 'custom': 
                field = {
                    type: 'custom',
                    fType: 'text',
                    name: name,
                    icon: 'Add User'
                };
                break;
            case 'image': 
                field = {
                    type: 'image',
                    fType: 'image',
                    name: name,
                    icon: 'image'
                };
                break;
            case 'field': 
                field = {
                    type: 'field',
                    fType: 'text',
                    name: name,
                    icon: 'code'
                };
                break;
        }

        if(field){
            field.id = Date.now();
            this.fields.push(field);
        }
    }

    contentmenuField(event: MouseEvent, field: any){
        console.log('contextmenu field : ', field);
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

    rightSidebarClick($event, field: any){
        let tWidth  = parseInt(this.templateService.width);
        let tHeight = parseInt(this.templateService.height);
        let newElement = null;

        if(field.type == 'image' && field.name == 'QrCode'){
            newElement = {
                _id: Date.now(),
                name:"qrCode",
                type:'img',
                url: '/src/assets/img/qrCode.jpg',
                fType: 'qrCode',
                width: tWidth * 0.08,
                height: tHeight * 0.08,
                px: tWidth * 0.1, 
                py: tHeight * 0.1,  
                angle:0, 
                borderRadius:'0%', 
                opacity:1,
                zIndex: TemplateService.minZIndex
            };
        } else if(field.type == 'image' && field.name == 'ProductImg'){
            newElement = {
                _id: Date.now(),
                name:"productImg",
                type:'img',
                fType: 'productImg',
                url: '/src/assets/img/product.jpg',
                width: tWidth * 0.08,
                height: tHeight * 0.08,
                px: tWidth * 0.1, 
                py: tHeight * 0.1,  
                angle:0, 
                borderRadius:'0%', 
                opacity:1,
                zIndex: TemplateService.minZIndex
            };
        } else if(field.type == 'field'){
            newElement = {
                _id: Date.now(),
                name:field.name,
                fType: field.name,
                type:'text',
                textAlign: 'left',
                width: tWidth * 0.08,
                height: tHeight * 0.08,
                px: tWidth * 0.1, 
                py: tHeight * 0.1,  
                angle:0, 
                borderRadius:'0%', 
                opacity:1,
                zIndex: TemplateService.minZIndex,
                clamp: -1,
                fontSize: 55,
                fontWeight:15,
                color:'rgb(0, 0, 0)',
            };
        } else if (field.type == 'custom'){
            newElement = {
                _id: Date.now(),
                name:field.name,
                fType: 'custom',
                type:'text',
                textAlign: 'left',
                width: tWidth * 0.08,
                height: tHeight * 0.08,
                px: tWidth * 0.1, 
                py: tHeight * 0.1,  
                angle:0, 
                borderRadius:'0%', 
                opacity:1,
                zIndex: TemplateService.minZIndex,
                clamp: -1,
                fontSize: 55,
                fontWeight:15,
                color:'rgb(0, 0, 0)',
            };
        }

        newElement.zIndex += this.templateService.elements.length;
        this.templateService.elements.push(newElement);
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
                console.log('default .... ');
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
            this.changeBGModalConf.loaddingFlag = false;
        });
    }

    closeChangeBGModal(){
        $('.changeBGModal').modal('hide');
    }

    getTemplateById(tempId: string){
        let url = this.faevaBeApiService.getUrl('getAgentProductTemplateList');
        let userId = this.userService.loginUser.id;
        let token = this.userService.loginUser.token;

        let body = {
            ws:{
                "platformType": "Builder",
                userType: 'admin',
                token: token
            },
            data:{
                userId : userId,
                conditions:{
                    tempId: tempId
                }
            }
        };

        // console.log('data : ', body);
        this.beApiService.commonReqByFaeva(url, body, null, (result: any) =>{
            if(result.code == 200){
                if(result.msg.tempList.length > 0){
                    let templateData = result.msg.tempList[0];
                    
                    this.transformToTemplateService(templateData);
                }else{
                    console.log('System server has not any template!');
                }
            }else{
                console.log('error : ', result);
            }
        });
    }

    saveCurrentEditTemplate(){
        let isNewFlag = false;
        if(!this.templateService.originData){
            isNewFlag = true;
        }
        let tempData = this.transformToRemoteApiFormat();
        let url = null;
        if(isNewFlag){
           url = this.faevaBeApiService.getUrl('createAgentProductTemplate');
        }else{
           url = this.faevaBeApiService.getUrl('updateAgentProductTemplate');
           tempData['tempId'] = this.templateService.originData.id;
        }

        let userId = this.userService.loginUser.id;
        let token = this.userService.loginUser.token;

        tempData['userId'] = userId;
        let body = {
            ws:{
                "platformType": "Builder",
                userType: 'admin',
                token: token
            },
            data:tempData
        };
       
        console.log('body : ', body);
        this.beApiService.commonReqByFaeva(url, body, null, (result: any) =>{
            if(result.code == 200){
                this.cleanTemplateService();

                if(tempData['tempId']){
                    this.getTemplateById(tempData['tempId']);
                }else{
                    this.getTemplateById(result.msg.id);
                }
                
            }else{
                console.log('update template error : ', result);
            }
        });
    }

    cleanTemplateService(){
        this.templateService.originData = null;
        this.templateService.elements = [];
        this.templateService.currentElement = null;
        this.templateService.bg = '#f3f3f3';
        this.templateService.width = '800';
        this.templateService.height = '600';
        this.templateService.showFlag = false;
        this.templateService.name = '';
        this.templateService.preview = '';
        this.templateService.tags = null;
        this.templateService.currentElement = [];
    }

    transformToTemplateService(originData){
        this.templateService.originData = originData;
        this.templateService.bg = originData.backgroup;
        this.templateService.preview = originData.priview;
        this.templateService.name = originData.name;
        this.templateService.tags = originData.tags;
        this.templateService.height = originData.height;
        this.templateService.width = originData.width;

        let positionConfig = originData.positionConfig;
        console.log('positionConfig : ', positionConfig);
        if(positionConfig.qrCode){
            let qrCode = positionConfig.qrCode;
            let element = {
                _id: Date.now() + Math.random(),
                name:"qrCode",
                type:'img',
                fType: 'qrCode',
                url: '/src/assets/img/qrCode.jpg',
                width: originData.qrCodeWidth,
                height: originData.qrCodeWidth,
                px: qrCode.px, 
                py: qrCode.py, 
                angle:0, 
                borderRadius:'0%', 
                opacity:1,
                zIndex: TemplateService.minZIndex
            }

            this.addElementToTemplateService(element);
        }
        if(positionConfig.productImg){
            let productImg = positionConfig.productImg;
    
            let element = {
                _id: Date.now() + Math.random(),
                name:"productImg",
                type:'img',
                fType: 'productImg',
                url: '/src/assets/img/product.jpg',
                width: productImg.width,
                height: productImg.height,
                px: productImg.px, 
                py: productImg.py, 
                angle:0, 
                borderRadius:'0%', 
                opacity:1,
                zIndex: TemplateService.minZIndex
            }

            this.addElementToTemplateService(element);
        }

        if(positionConfig.productName){
            let productName = positionConfig.productName;
            let element2 = {
                _id: Date.now() + Math.random(),
                name:"{productName}",
                fType: 'productName',
                type:'text',
                textAlign: 'left',
                width: 300,
                height: 200,
                px: productName.px, 
                py: productName.py, 
                angle:0, 
                borderRadius:'0%', 
                opacity:1,
                clamp: -1,
                fontSize: productName.fontSize,
                color:this.colorHex(`RGB(${productName.rgb[0]}, ${productName.rgb[1]}, ${productName.rgb[2]})`),
                zIndex: TemplateService.minZIndex
            }
                
            this.addElementToTemplateService(element2);
        }
        if(positionConfig.actualPrice){
            let actualPrice = positionConfig.actualPrice;
            let element3 = {
                _id: Date.now() + Math.random(),
                name:"{9999.99}",
                type:'text',
                textAlign: 'left',
                width: 600,
                height: 100,
                fType: 'actualPrice',
                px: actualPrice.px, 
                py: actualPrice.py, 
                angle:0, 
                borderRadius:'0%', 
                opacity:1,
                clamp: -1,
                fontSize: actualPrice.fontSize,
                color:this.colorHex(`RGB(${actualPrice.rgb[0]}, ${actualPrice.rgb[1]}, ${actualPrice.rgb[2]})`),
                zIndex: TemplateService.minZIndex
            }
                
            this.addElementToTemplateService(element3);
        }
        if(positionConfig.originalPrice){
            let originalPrice = positionConfig.originalPrice;
            let element3 = {
                _id: Date.now() + Math.random(),
                name:"{9999.99}",
                type:'text',
                textAlign: 'left',
                width: 600,
                height: 100,
                fType: 'originalPrice',
                px: originalPrice.px, 
                py: originalPrice.py, 
                angle:0, 
                borderRadius:'0%', 
                opacity:1,
                clamp: -1,
                fontSize: originalPrice.fontSize,
                color:this.colorHex(`RGB(${originalPrice.rgb[0]}, ${originalPrice.rgb[1]}, ${originalPrice.rgb[2]})`),
                zIndex: TemplateService.minZIndex
            }
                
            this.addElementToTemplateService(element3);
        }
        if(positionConfig.catalogs){
            let catalogs = positionConfig.catalogs;
            let element3 = {
                _id: Date.now() + Math.random(),
                name:"{catalogs}",
                type:'text',
                fType: 'catalogs',
                textAlign: 'left',
                width: 600,
                height: 100,
                px: catalogs.px, 
                py: catalogs.py, 
                angle:0, 
                borderRadius:'0%', 
                opacity:1,
                clamp: -1,
                fontSize: catalogs.fontSize,
                color:this.colorHex(`RGB(${catalogs.rgb[0]}, ${catalogs.rgb[1]}, ${catalogs.rgb[2]})`),
                zIndex: TemplateService.minZIndex
            }
                
            this.addElementToTemplateService(element3);
        }

        if(positionConfig.optionKeys){
            let optionKeys = positionConfig.optionKeys;
            let optionEle = null;
            for (var i=0;i< optionKeys.length;i++){
                let option = optionKeys[i];
                switch(option.type){
                    case 'text':
                        optionEle = {
                            _id: Date.now() + Math.random(),
                            name:option.value,
                            type:'text',
                            fType: 'custom',
                            width: 300,
                            height: 200,
                            px: option.px, 
                            py: option.py, 
                            angle:0, 
                            textAlign: 'left',
                            borderRadius:'0%', 
                            opacity:1,
                            clamp: -1,
                            fontSize: option.fontSize,
                            color:this.colorHex(`RGB(${option.rgb[0]}, ${option.rgb[1]}, ${option.rgb[2]})`),
                            zIndex: TemplateService.minZIndex
                        }
                        break;

                        case 'img':
                            let element = {
                            _id: Date.now() + Math.random(),
                            name:option.name,
                            type:'img',
                            fType: 'custom',
                            url: option.url,
                            width: option.width,
                            height: option.height,
                            px: option.px, 
                            py: option.py, 
                            angle:0, 
                            borderRadius:'0%', 
                            opacity:1,
                            zIndex: TemplateService.minZIndex
                        }
                        
                        break;  

                    default:
                        throw new Error(`option.type(${option.type}) unsupport!`); 
                }

                this.addElementToTemplateService(optionEle);
            }

        }
    }

    //转换成远程服务器格式
    transformToRemoteApiFormat(): any{
        let elements = this.templateService.elements;
        let templateService = this.templateService;
        let originData = templateService.originData;
        let data: any = {};

        if(originData && originData.backgroup != templateService.bg){
            data['backgroup'] = templateService.bg.split('/be-temp/')[1];
        }
        if(originData && originData.priview != templateService.preview){
            data['priview'] = templateService.preview.split('/be-temp/')[1];
        }

        if(!templateService.originData){
            if(templateService.bg){
                data['backgroup'] = templateService.bg.split('/be-temp/')[1];
            }
            if(templateService.preview){
                data['priview'] = templateService.preview.split('/be-temp/')[1];
            }
        }

        data['name'] = templateService.name;
        data['height'] = templateService.height;
        data['width'] = templateService.width;
        if(!templateService.tags){
            data['tags'] = [];
        }else{
            data['tags'] = templateService.tags;
        }

        
        data['positionConfig'] = {};

        console.log('elements : ', elements);
        elements.forEach((ele) => {
            switch(ele.fType){
                case 'custom':
                    let customEle: any =[]; 
                    switch(ele.type){
                        case 'text':
                            customEle = {
                                 type: 'text',
                                 value: ele.name,
                                 px : ele.px,
                                 py : ele.py,
                                 fontSize : ele.fontSize,
                                 rgb: this.colorRgbArr(ele.color),
                                 circleSize: ele.angle,
                                 roughness: ele.fontWeight / 100
                            };
                            break;

                        case 'img': 
                            customEle = {
                                 type: 'img',
                                 value: ele.name,
                                 px : ele.px,
                                 py : ele.py,
                                 width : ele.width,
                                 height: ele.height,
                            };

                        break;

                        default: 
                            throw Error(`custom ele.type(${ele.type}) error!`);
                    }
                    if(!data['positionConfig']['optionKeys']){
                        data['positionConfig']['optionKeys'] = [];
                    }

                    data['positionConfig']['optionKeys'].push(customEle);
                    break;
                
                case 'actualPrice': 
                case 'catalogs': 
                case 'productName': 
                case 'originalPrice': 
                    let tempEle = {
                        type: 'text',
                        value: ele.name,
                        px : ele.px,
                        py : ele.py,
                        fontSize : ele.fontSize,
                        rgb: this.colorRgbArr(ele.color),
                        circleSize: ele.angle,
                        roughness: ele.fontWeight / 100
                    };

        
                    data['positionConfig'][ele.fType] = tempEle;
                    // data[ele.fType] = tempEle;
                    break;

                case 'qrCode':
                    let qrCode = {
                        px : ele.px,
                        py : ele.py
                    }

                    data['positionConfig']['qrCode'] = qrCode;
                    data['qrCodeWidth'] = ele.width;
                    break;
                case 'productImg':
                    let productImg = {
                        px : ele.px,
                        py : ele.py,
                        width: ele.width,
                        height: ele.height
                    }

                    data['positionConfig']['productImg'] = productImg;
                    break;
            }
        });

        // console.log('transform data : ', data);
        return data;
    }

    

    colorHex(that){
        let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        if(/^(rgb|RGB)/.test(that)){  
            var aColor = that.replace(/(?:||rgb|RGB)*/g,"").split(",");  
            var strHex = "#";  
            for(var i=0; i<aColor.length; i++){  
                var hex = Number(aColor[i]).toString(16);  
                if(hex === "0"){  
                    hex += hex;   
                }  
                strHex += hex;  
            }  
            if(strHex.length !== 7){  
                strHex = that;    
            }  
            return strHex;  
        }else if(reg.test(that)){  
            var aNum = that.replace(/#/,"").split("");  
            if(aNum.length === 6){  
                return that;      
            }else if(aNum.length === 3){  
                var numHex = "#";  
                for(var i=0; i<aNum.length; i+=1){  
                    numHex += (aNum[i]+aNum[i]);  
                }  
                return numHex;  
            }  
        }else{  
            return that;      
        }  
    }

    colorRgb(data){
        let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        let sColor = data.toLowerCase();  
        if(sColor && reg.test(sColor)){  
            if(sColor.length === 4){  
                var sColorNew = "#";  
                for(var i=1; i<4; i+=1){  
                    sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));     
                }  
                sColor = sColorNew;  
            }  
            //处理六位的颜色值  
            var sColorChange = [];  
            for(var i=1; i<7; i+=2){  
                sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));    
            }  
            return "RGB(" + sColorChange.join(",") + ")";  
        }else{  
            return sColor;    
        }  
    }

    colorRgbArr(data: string){
        let strs1 = data.split('(');
        let strs2 = strs1[1].split(')');
        let finals = strs2[0].split(',');
        
        return [parseInt(finals[0]), parseInt(finals[1]), parseInt(finals[2])];
    }

    addElementToTemplateService(element){
        element.zIndex += this.templateService.elements.length;
        this.templateService.elements.push(element);
    }
}