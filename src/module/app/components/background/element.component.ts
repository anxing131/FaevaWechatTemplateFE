import { DashboardComponent } from './../dashboard/dashboard.component';
import { Border2Component } from './../../border2.component';
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
import {Subscription, Subject} from "rxjs/Rx";

declare var $ : any;
declare var $clamp : any;

@Component({
    moduleId: module.id,
    selector: 'ax-element, [ax-element]',
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
    textSubscription: Subscription;
    borderSubscription: Subscription;
    static changeSubscription: Subscription;
    static changeSubject: Subject<any> = new Subject();
    contentEditableFlag: boolean = false;

    static textInit: any = [];

    //当前右击的element id
    static currentRightMenuId : any;

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
        if(!ElementComponent.changeSubscription){
            ElementComponent.changeSubscription = ElementComponent.changeSubject.subscribe({
                next: data => {
                    console.log('element change : ', data);
                    switch(data.event){
                        case 'moveUpOne':
                            this.moveUpOne(data);
                            break;
                        case 'moveDownOne': 
                            this.moveDownOne(data);
                            break;
                        case 'moveToTop':
                            this.moveToTop(data);
                            break;
                        case 'moveToBottom':
                            this.moveToBottom(data);
                            break;
                    }
                }
            });
        }
        

        if(this.ele.type == 'text'){
            setTimeout(() => {
                let hasFlag = false;
                ElementComponent.textInit.forEach((item) => {
                    if(item == this.ele._id){
                        hasFlag = true;
                    }
                });

                if(!hasFlag){
                    ElementComponent.textInit.push(this.ele._id);
                    let textLableEle: HTMLElement = <HTMLElement>this.textLabel.nativeElement;
                    this.templateService.elements.forEach((item, index, elements) => {
                        if(this.ele._id == item._id){
                            let text =  textLableEle.innerText;
                            let textSize = text.replace(/[\u0391-\uFFE5]/g,"aa").length;
                            
                            // item.height = textLableEle.offsetHeight;
                            item.height = item.fontSize;
                            item.width =  (textSize * item.fontSize) / 2 + item.fontSize / 4;
                            

                            if(this.templateService.currentElement._id == this.ele._id){
                                this.templateService.currentElement = item;
                            }

                            return item;
                        }
                    });
                }
            }, 20);

            this.textSubscription = this.templateService.changeTextSubject.subscribe({
                next: (eleId) => {
                    if(this.ele._id === eleId){
                        let textLableEle = <HTMLElement>this.textLabel.nativeElement;
                        // this.templateService.currentElement.width = textLableEle.offsetWidth;
                        // this.templateService.currentElement.height = textLableEle.offsetHeight;
                        this.templateService.currentElement.name = textLableEle.innerText; 

                        for(let index in this.templateService.elements){
                            let tempEle = this.templateService.elements[index];
                            if(eleId == tempEle._id){
                                this.templateService.elements[index] = this.templateService.currentElement;
                                break;
                            }
                        }
                    }
                }
            });

            this.borderSubscription = Border2Component.changeSubject.subscribe({
                next: (data) => {
                    if(this.ele._id != data.id){
                        return;
                    }

                    this.contentEditableFlag = true;
                    let textLabel: HTMLElement = <HTMLElement>this.textLabel.nativeElement;
                    textLabel.focus();
                    this.collapseToEnd(textLabel);
                }
            });
        }
    }

    //上移一层
    moveUpOne(data: any){
        this.templateService.elements.forEach((item, index, elements) => {
            if(item._id == ElementComponent.currentRightMenuId && item.zIndex < (TemplateService.minZIndex + elements.length)){
                elements[index].zIndex += 1;
            }
        });
    }

    //下移一层
    moveDownOne(data: any){
        this.templateService.elements.forEach((item, index, elements) => {
            console.log('item : ', item);
            if(item._id == ElementComponent.currentRightMenuId && item.zIndex > TemplateService.minZIndex){
                elements[index].zIndex -= 1;
                console.log('yes down one ');
            }
        });
    }

    //移至底层
    moveToBottom(data: any){
        this.templateService.elements.forEach((item, index, elements) => {
            if(item._id == ElementComponent.currentRightMenuId){
                elements[index].zIndex = TemplateService.minZIndex;
            }
        });
    }
    moveToTop(data: any){
        this.templateService.elements.forEach((item, index, elements) => {
            if(item._id == ElementComponent.currentRightMenuId){
                elements[index].zIndex = TemplateService.minZIndex + elements.length;
            }
        });
    }

    collapseToCusotom(data){
        var target = this.textLabel.nativeElement;
        var range = document.createRange();
        var sel = window.getSelection();
        range.setStart(target, 0);
        range.setEnd(target, 5);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    //将光标定位到最后
    collapseToEnd(obj){
        if (window.getSelection) {//ie11 10 9 ff safari
                obj.focus(); //解决ff不获取焦点无法定位问题
                var range = window.getSelection();//创建range
                range.selectAllChildren(obj);//range 选择obj下所有子内容
                range.collapseToEnd();//光标移至最后
        }
            //放弃IE
            // else if (document.selection) {//ie10 9 8 7 6 5
            //     var range = document.selection.createRange();//创建选择对象
            //     //var range = document.body.createTextRange();
            //     range.moveToElementText(obj);//range定位到obj
            //     range.collapse(false);//光标移至最后
            //     range.select();
            // }
    }

    ngOnDestroy(){
        if(this.textSubscription){
            this.textSubscription.unsubscribe();
            this.borderSubscription.unsubscribe();
        }

        // if(ElementComponent.changeSubscription){
        //     ElementComponent.changeSubscription.unsubscribe();
        // }
    }

    resize(event: any){
        if(this.ele.type == 'text'){
            let textLableEle = <HTMLElement>this.textLabel.nativeElement;

            if(this.ele.clamp != -1){
                let height = this.ele.fontSize * this.ele.clamp;
                if(height > textLableEle.offsetHeight){
                    this.templateService.currentElement.height = textLableEle.offsetHeight;
                }else{
                    this.templateService.currentElement.height = height;
                }
            }else{
                if(textLableEle.offsetHeight > this.templateService.currentElement.height){
                    this.templateService.currentElement.height = textLableEle.offsetHeight;
                }
            }
        }
    }

    contextmenu(event: MouseEvent){
        Border2Component.changeSubject.next({event: 'showRightClickMenu', eleId: this.ele._id, eventObj: event});

        event.stopImmediatePropagation();
        return false;
    }

    onclick(event){
        //close right menu 
        Border2Component.changeSubject.next({event: 'closeRightMenu'});
        Border2Component.changeSubject.next({event: 'elementClict'});

        let currentElement = this.ele;
        this.templateService.currentElement = this.ele;
        this.templateService.showFlag = true;
        
        //超出高度解决方案
        if(currentElement.type == 'text'){
            if(currentElement.clamp != -1){
                //借用其他工具来解决高度问题
                $clamp(this.textLabel.nativeElement, {clamp: 3});
            }
        }
        
        console.log('onclick ele : ' + JSON.stringify(this.ele));
        event.stopImmediatePropagation();
        return false;
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