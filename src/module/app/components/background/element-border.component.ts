/**
 * Created by Administrator on 2016/10/26.
 */
import {
    Component, OnInit,
    ViewChild,
    Renderer, Input, Output, Host, forwardRef,Inject
} from '@angular/core';
import {TemplateService} from "../../../../services/template.service";
import {ElementComponent} from "./element.component";

declare var $ : any;

@Component({
    moduleId: module.id,
    selector: 'ax-element-border, [ax-element-border]',
    templateUrl: 'element-border.html',
    styleUrls: ['element-border.css'],
})
export class ElementBorderComponent extends OnInit{
    @ViewChild('eleDragBorder') border: any;
    ele : any;
    app: ElementComponent;
    prop: any = {};
    tempEle: any = {};  //用来保存拖动组件时的组件属性数据
    start:any;
    end: any;

    constructor(
        @Host() @Inject(forwardRef(()=> ElementComponent)) app:ElementComponent,
        private renderer: Renderer,
        private templateService: TemplateService
    ){
        super();
        this.app = app;
    }

    ngOnInit(){
        this.border = this.border.nativeElement;
        this.tempEle = this.app.ele;
        this.ele = JSON.parse(JSON.stringify(this.app.ele));
    }


    onclick(event: MouseEvent){
        console.log('border click event');
        event.stopImmediatePropagation();
        return false;
    }

    changeEleEvent(){

    }

    onEleDblclick(event: MouseEvent){
    }
    onEleDragstart(event: DragEvent){
        this.tempEle = this.app.ele;
        let ele = this.app.ele;
        let borderEle = <HTMLElement>this.border;
        let showAreaEle =  <HTMLElement>borderEle.getElementsByClassName('element-area')[0];
        this.renderer.setElementStyle(showAreaEle, 'display', 'block');
        this.renderer.setElementStyle(showAreaEle, 'width', ele.width + 'px');
        this.renderer.setElementStyle(showAreaEle, 'height', ele.height + 'px');


        // let clientX = event.clientY;
        // let clientY = event.clientY;
        // let x = event.x;
        // let y = event.y;
        // let pageX = event.pageX;
        // let pageY = event.pageY;
        // let screenX = event.screenX;
        // let screenY = event.screenY;
        // let offsetX = event.offsetX;
        // let offsetY = event.offsetY


        /*console.log('clientX : ' + clientX);
        console.log('clientY : ' + clientY);
        console.log('x : ' + x);
        console.log('y : ' + y);
        console.log('pageX : ' + pageX);
        console.log('pageY : ' + pageY);
        console.log('screenX : ' + screenX);
        console.log('offsetY : ' + offsetY);
*/
        event.stopImmediatePropagation();
    }

    onEleDragend(event: DragEvent){
        let borderEle = <HTMLElement>this.border;
        let showAreaEle =  <HTMLElement>borderEle.getElementsByClassName('element-area')[0];
        this.renderer.setElementStyle(showAreaEle, 'display', 'none');

        event.stopImmediatePropagation();
    }

    onEleDragover(event: DragEvent){
        console.log('over -----------------');
        event.stopImmediatePropagation();
    }

    onDrag(event: DragEvent){
        let x = event.x;
        let y = event.y;
        let pageX = event.pageX;
        let pageY = event.pageY;

        let cha = pageX - this.app.ele.px;
        let width = (this.app.ele.width + (-cha));
        // this.ele.width = width;

        let borderEle = <HTMLElement>this.border;
        let showAreaEle =  <HTMLElement>borderEle.getElementsByClassName('element-area')[0];
        this.renderer.setElementStyle(showAreaEle, 'display', 'block');
        this.renderer.setElementStyle(showAreaEle, 'width', width + 'px');
        this.renderer.setElementStyle(showAreaEle, 'height', width + 'px');


        console.log(this.app.ele.width);
        // console.log('cha : ' + cha);
        // console.log('width : ' + width);

        // console.log('clientX : ' + clientX);
        // console.log('clientY : ' + clientY);
        // console.log('x : ' + x);
        // console.log('y : ' + y);
        // console.log('pageX : ' + pageX);
        // console.log('pageY : ' + pageY);
        // console.log('screenX : ' + screenX);
        // console.log('offsetY : ' + offsetY);


        // let obj3 = <HTMLElement>event.target;
        // let obj3 = <HTMLElement>event.currentTarget;

/*
        console.log('top : ' + obj3.style.top);
        console.log('left : ' + obj3.style.left);
        console.log('clientX : ' + obj3.clientLeft);
        console.log('clientY : ' + obj3.clientTop);
        console.log('offsetX : ' + obj3.offsetLeft);
        console.log('offsetY : ' + obj3.offsetTop);
        console.log('style : ' + JSON.stringify(obj3.style));



        console.log('className : ' +  obj3.className);
        // console.log('targe : ' + obj2);

        event.stopImmediatePropagation();*/
        event.stopImmediatePropagation()
    }

}