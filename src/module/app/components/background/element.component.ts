/**
 * Created by Administrator on 2016/10/26.
 */
import {
    Component, OnInit, OnChanges, trigger,
    state,
    style,
    transition,
    animate,
    ViewChild,
    Renderer, Input, Output, ApplicationRef, ChangeDetectorRef, OnDestroy
} from '@angular/core';
import {TemplateService} from "../../../../services/template.service";
import {Validators} from "@angular/forms";
import * as Rx from "rxjs/rx";

declare var $ : any;

@Component({
    moduleId: module.id,
    selector: 'ax-element',
    templateUrl: 'element.html',
    styleUrls: ['element.css'],
})
export class ElementComponent implements OnInit, OnChanges, OnDestroy{
    @Input() ele: any;
    @ViewChild('elementDiv') elementDiv: any;
    @ViewChild('testt') testt: any;
    @ViewChild('textLabel') textLabel: any;
    x: number;
    y: number;
    @Input() index: number;
    textSubscription: Rx.Subscription;



    constructor(
        private renderer: Renderer,
        private templateService: TemplateService,
    ){
        // super();
        // console.log('subscribe - ' + templateService.changeStream.subscribe((param) => ));
        // templateService.changeStream.subscribe((param): any => {console.log('yser' + param); return true});
        // let Observer  = Observer.subscribe();
    }

    ngOnChanges(changes){

    }

    ngOnInit(){
        this.elementDiv = this.elementDiv.nativeElement;
        if(this.ele.type == 'text'){
            this.textSubscription = this.templateService.changeTextSubject.subscribe({
                next: (eleId) => {
                    if(this.ele._id === eleId){
                        let textLableEle = <HTMLElement>this.textLabel.nativeElement;
                        this.templateService.currentElement.width = textLableEle.offsetWidth;
                        this.templateService.currentElement.height = textLableEle.style.fontSize;
                        console.log('style : ' + textLableEle.offsetHeight);
                        console.log('style : ' + textLableEle.offsetWidth);
                        console.log('style : ' + textLableEle.style.fontSize);
                    }


                }
            });
        }
    }

    ngOnDestroy(){
        if(this.textSubscription){
            this.textSubscription.unsubscribe();
        }
    }

    resize(event: any){
        console.log('resize : ' + event);

    }

    onclick(event){
        this.templateService.currentElement = this.ele;
        this.templateService.showFlag = true;

        console.log('onclick ele : ' + JSON.stringify(this.ele));
        return true;
    }

    changeEleEvent(){
    }

    onEleDblclick(event: MouseEvent){


        // $('.ui.modal').modal('show');
        let currentTarget = <HTMLElement>event.currentTarget;
        let modal = currentTarget.getElementsByClassName('mymodal')[0];
        // $(modal).modal('toggle');

        // $('.mymodal').modal("setting", {
        //     closable: true,
        //     onApprove: function () {
        //         return true;
        //     }
        // }).modal("show");

        // $(currentTarget).on
        // console.log('modal : ' + modal);
    }
    onEleDragstart(event: DragEvent){
        /*
        *  1、获取被拖动的标签位置
        *  2、获取鼠标点击时的位置
        *  3、由上条件得出位移差
        * */

        //1
        let mouseX = event.pageX;
        let mouseY = event.pageY;

        //2
        let target = <HTMLElement>event.currentTarget;
        let top  = target.offsetTop;
        let left = target.offsetLeft;

        //3
        this.x = mouseX - left;
        this.y = mouseY - top;
    }

    onEleDragend(event: DragEvent){
        /*
        * 1、获取结束时的鼠标位置XY
        * 2、求出最后被拖动元素的最终位置xy
        * 3、改变被拖动元素的位置
        * */

        //1
        let pageX = event.pageX;
        let pageY = event.pageY;

        //2
        let left = pageX - this.x;
        let top = pageY - this.y;
        Validators;
        this.ele.px = left;
        this.ele.py = top;
        // let target = event.currentTarget;
        // this.renderer.setElementStyle(target, 'top', top + '');
        // this.renderer.setElementStyle(target, 'left', left + '');

        console.log('top : ' + top);
        console.log('left : ' + left)
    }

}