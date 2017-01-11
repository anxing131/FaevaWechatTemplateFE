import { OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from './../../app.component';
import { TemplateService } from './../../../../services/template.service';
/**
 * Created by Administrator on 2016/10/26.
 */
import {Component, OnInit, trigger,
    state,
    style,
    transition,
    animate,
    Renderer
} from '@angular/core';
import {UserService} from "../../../../services/user.service";
import {Subject, Subscription, Observable} from "rxjs/Rx";
import { DashboardComponent } from './../dashboard/dashboard.component';

declare var $ : any;

@Component({
    moduleId: module.id,
    selector: 'ax-setting, [ax-setting]',
    templateUrl: 'index.html',
    styleUrls: ['style.css'],
    animations: [
        trigger('heroState', [
            state('inactive', style({ //离场最终效果
                backgroundColor: '#eee',
                transform: 'scale(1)'
            })),
            state('active',   style({ //进场效果
                backgroundColor: '#cfd8dc',
                transform: 'scale(1.1)',
                top: "{{x}}px"
            })),
            //转场配置
            transition('inactive => active', animate('100ms ease-in')),
            transition('active => inactive', animate('100ms ease-out'))
        ])
    ]
})
export class SettingComponent implements OnInit, OnDestroy{
    _settingEle: HTMLElement;
    x: number;
    y: number;
    settingFlag: boolean =true;
    openSettingFlag: boolean =false;

    attrSidebarOpenFlag: boolean = false;

    private settingTagsAddFlag: boolean = false;

    //临时缓存(在修改template)
    private tempTemplateService: any;
    private tempAppComponentSubjection: Subscription; 


    constructor(private renderer: Renderer,
        private userService : UserService,
        private templateService : TemplateService,
        private router : Router
    ){
    }

    ngOnInit(){
        this._settingEle = <HTMLElement>document.getElementById('test');
        $('.ui.dropdown').dropdown({on:'dblclick'});
    }

    ngOnDestroy(){
        if(this.tempAppComponentSubjection){
            this.tempAppComponentSubjection.unsubscribe();
        }

        console.log('setting component OnDestroy...');
    }

    change(event: MouseEvent, type: string){
        switch(type){
            case 'inputTagChange': 
                let target = <HTMLInputElement>event.target;
                let value = target.value;

                if(this.templateService.tags){
                    this.templateService.tags.push(value);
                }else{
                    this.templateService.tags = [value];
                }
                this.settingTagsAddFlag = false;
                break;
        }

        console.log('change ....')
    }

    settingModalClick(event: MouseEvent, type: string){
        switch(type){
            case 'addTag':
                if(this.settingTagsAddFlag){
                    this.settingTagsAddFlag = false;
                }else{
                    this.settingTagsAddFlag = true;
                }
                break;
            case 'delTag':
                let target = <HTMLElement>event.target;
                let index = <number>target.attributes['data-index'].value;
                
                this.templateService.tags.splice(index, 1);
                break;
            
            case 'cancel':
                 this.templateService = this.tempTemplateService;
                 $('.templateSettingModal').modal('hide');
                break;
            
            case 'save':
                $('.templateSettingModal').modal('hide');
                break;
            case 'editPreview': 
                let ts = Date.now();
                AppComponent.changeSubject.next({
                    event: 'inputFiles',
                    originData: {
                        ts: ts, 
                        config:  {
                            uploadToS3Flag: true
                        }
                    },
                    
                });

                if(this.tempAppComponentSubjection){
                    this.tempAppComponentSubjection.unsubscribe();
                }

                this.tempAppComponentSubjection = AppComponent.changeSubject
                    .filter((data) => {return data.originData.ts && data.event == 'finishedUploadToS3' && data.originData.ts == ts})
                    .subscribe({
                        next: data => {
                            if(data.result.code == 200){
                                let link = data.result.msg.link;
                                this.templateService.preview = link;
                            }else{
                                console.log('setting component upload img to s3 fail!', data.result);
                            }
                        }
                    });

                break;
        }

        event.stopImmediatePropagation();
        return false;
    }

    onMouseover(event: MouseEvent){
        if((<number><any>this._settingEle.offsetLeft) < 0){
            this._settingEle.style.left = '1px';
        }

        if((<number><any>this._settingEle.offsetTop) < 0){
            this._settingEle.style.top = '1px';
        }
    }

    onSidebarMouseleave(event: MouseEvent){
        let clientY = event.clientY;
        let eClientY = this._settingEle.offsetTop;
        let eClientX = this._settingEle.offsetLeft;
        let size = <number><any> this._settingEle.style.width;
        let y:number = clientY - eClientY;


        if(y > 0){
            y = y - size;
        }else{
            y = y + size;
        }

       if(eClientX == 1){
           setTimeout(() => {
               let top = <number><any>this._settingEle.offsetTop;
               let newTop:any = 0;
               if(y < 0){
                   y = Math.abs(y);
                    newTop = top - y;
               }else{
                    newTop = top + y;
               }

               newTop = <string><any>(newTop);
               console.log('newTosp : ' + newTop);
               this.renderer.setElementStyle(this._settingEle, 'top', newTop);
           }, 1000);

            this.renderer.invokeElementMethod(
                this._settingEle,
                'animate',
                [
                    [
                        //这里至少需要两个单元, 代表开始和结束
                        {transform: 'translateY(0)'},
                        {transform: 'translateY('+y+'px)'}
                    ],
                    1000
                ]
            );


       }

    }

    ondblclick(event: MouseEvent){
        // this.settingFlag = !this.settingFlag;
        console.log('db --------------------');
    }

    contextmenu(event: MouseEvent){
        console.log('contextmenu -----------------');
        return false;
    }


    // 隐藏setting 到左侧, Y是要隐藏时的高度
    hidden(){
        this._settingEle.style.left = '-1000';
    }

    onTagClick(tag: string){
        switch (tag){
            case 'tag':
                break;
            case 'LoginOut':
                this.userService.logout();
                break;
            case 'OpenAttributesSidebar': 
                this.toggleAttributesSidebar();
                break;
            case 'new-template': 
                this.newTemplate();
                break;
            case 'setting':
                $('.templateSettingModal').modal({
                    closable: false,
                    onHidden: () => {
                        this.tempTemplateService = null;
                        this.openSettingFlag = false;
                    },
                    onShow: () => {
                        this.openSettingFlag = true;
                        this.tempTemplateService = Object.assign({}, this.templateService);
                    }
                }).modal('show');
                break;
            case 'SaveToRemote':
                DashboardComponent.changeSubject.next({event: 'saveTemplate'});
                break;
            case 'Exit':
                let link = ['template-list'];
                this.router.navigate(link);
                break;
            default :
                break;
        }
    }

    newTemplate(){
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



        console.log('newTemplate');
    }

    toggleAttributesSidebar(){
        $('#dashboard-content .ui.sidebar')
            .sidebar({
                context: $('#dashboard-content'),
                dimPage: false,
                transition: 'overlay',
                onVisible: () => {
                    this.attrSidebarOpenFlag = true;
                },

                onHidden: () => {
                    this.attrSidebarOpenFlag = false;
                    DashboardComponent.changeSubject.next({event: 'closeInputCustomField'});
                    // DashboardComponent.inputCustomFieldFlag = false;
                    console.log('toggleAttributesSidebar onHidden');
                }
            })
            .sidebar('toggle');
    }

    onDragend(event: DragEvent){
        let clientX = event.clientX;
        let clientY = event.clientY;
        let x = (clientX - this.x);
        let y = (clientY - this.y);
        this._settingEle.style.top = y + '';
        this._settingEle.style.left = x + '';

        if(x <= 0){
            this.hidden();
        }

        console.log('onDragend');

    }

    onDragstart(event: DragEvent){
        //鼠标刚开始拖动的图标
        let clientX = event.clientX;
        let clientY = event.clientY;

        //默认configure 配置是一个圆
        let size = <number><any>(this._settingEle.style.width);
        let eClientX = this._settingEle.offsetLeft - size/2;
        let eClientY = this._settingEle.offsetTop - size/2;

        //斗正位移
        this.x = clientX - eClientX;
        this.y = clientY - eClientY;
        console.log('onDragstart');
    }
}