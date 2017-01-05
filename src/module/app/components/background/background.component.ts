/**
 * Created by Administrator on 2016/10/26.
 */
import {Component, OnInit, trigger,
    state,
    style,
    transition,
    animate,
    Renderer,
    OnDestroy,
} from '@angular/core';
import {TemplateService} from "../../../../services/template.service";
import {Subject, Subscription} from "rxjs/Rx";

declare var $ : any;

@Component({
    moduleId: module.id,
    selector: 'ax-background, [ax-background]',
    templateUrl: 'index.html',
    styleUrls: ['style.css'],
})
export class BackgroundComponent implements OnInit, OnDestroy{
    x:number;
    static changeSubject: Subject<any> = new Subject();
    changeSubjection: Subscription;
    
    constructor(
        private renderer: Renderer,
        private templateService: TemplateService
    ){
    }

    ngOnInit(){
        this.changeSubjection = BackgroundComponent.changeSubject.subscribe({
            next: (p) => {
                switch(p.event){
                }
            }
        });

    }

    ngOnDestroy(){
        this.changeSubjection.unsubscribe();
    }


    drop(event){

    }

    onEleDblclick(event: any){

    }
    onEleDragstart(event: DragEvent){
        //鼠标刚开始拖动的图标
        let currentTarget = <HTMLElement>event.currentTarget;

        // let clientX = event.clientX;
        // let clientY = event.clientY;
        //
        // //默认configure 配置是一个圆
        // let size = <number><any>(this._settingEle.style.width);
        // let eClientX = this._settingEle.offsetLeft - size/2;
        // let eClientY = this._settingEle.offsetTop - size/2;
        //
        // //斗正位移
        // this.x = clientX - eClientX;
        // this.y = clientY - eClientY;
        console.log('onDragstart');
    }

    onEleDragend(event: DragEvent){
        let pageX = event.pageX;
        let pageY = event.pageY;


        console.log('pageX : ' + pageX);
        console.log('pageY : ' + pageY);



        //drag start xy
        let  movementX = event.movementX;
        let  movementY = event.movementY;

        //鼠标拖动时的坐标
        let  layerX = event.layerX;
        let  layerY = event.layerY;


        let currentTarget = <HTMLElement>event.currentTarget;

        let clientX = event.clientX;
        let clientY = event.clientY;
        let screenX = event.screenX;
        let screenY = event.screenY;
        console.log('screenX : ' + screenX);
        console.log('screenY : ' + screenY);
        console.log('clientX : ' + clientX);
        console.log('clientY : ' + clientY);
        console.log('movementX : ' + movementX);
        console.log('movementY : ' + movementY);

        let x = (clientX - movementX);
        let y = (clientY - movementY);
        currentTarget.style.top = y + '';
        currentTarget.style.left = x + '';


        console.log('onDragend');
    }

}