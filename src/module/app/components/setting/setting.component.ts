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

declare var $ : any;

@Component({
    moduleId: module.id,
    selector: 'ax-setting',
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
export class SettingComponent extends OnInit{
    _settingEle: HTMLElement;
    x: number;
    y: number;
    settingFlag: boolean =true;

    constructor(private renderer: Renderer){
        super();
    }

    ngOnInit(){
        this._settingEle = <HTMLElement>document.getElementById('test');
        $('.ui.dropdown').dropdown({on:'dblclick'});
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
        console.log('db ---sdf');

        this.settingFlag = !this.settingFlag;
    }

    // 隐藏setting 到左侧, Y是要隐藏时的高度
    hidden(){
        this._settingEle.style.left = '-1000';
    }

    onTagClick(tag: string){
        switch (tag){
            case 'tag':
                break;
            default :
                break;
        }
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