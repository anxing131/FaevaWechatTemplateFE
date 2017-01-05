/**
 * Created by AnXing on 2016/10/26.
 *
 *
 *  使用 DragDrop event系列来实现的, 不过中间出现一个小小的问题(有时拖下拖下边框就变成屏幕的高度, 或者变成0, 不是想要的效果, 暂时没有解决这个问题),
 *  便采用用mouse event 来实现, 效果还不错, 没有上面所说的问题
 */
import {
    Component, OnInit,
    ViewChild,
    Renderer, Input, Output, Host, forwardRef, Inject, EventEmitter
} from '@angular/core';

declare var $ : any;

@Component({
    moduleId: module.id,
    selector: 'my-border, [my-border]',
    templateUrl: 'border.html',
    styleUrls: ['border.css'],
})
export class BorderComponent extends OnInit{
    ele: any = {
        angle: 0,
        px: 200,
        py: 200,
        width: 300,
        height: 300
    };

    //拖动角标保存的拖动之前的数据
    originEle: any;

    //拖动时的临时数据
    dragViewData: any = {
        angle: 0,
        px: 0,
        py: 0,
        width: 0,
        height: 0,
        display: 'none'
    };

    //拖动整个element鼠标开始位置
    oldPx: any;
    oldPy: any;

    //整个element是否可以拖动
    elementDraggable: boolean = true;

    /*
        当前拖动的按钮/角标类型
        left-top | top | right-top | right | right-bottom | left-bottom | left
     */
    dragButType: string;

    changeEvent: EventEmitter<any> = new EventEmitter();

    constructor(){
        super();
    }

    ngOnInit(){
    }

    onclick(event: MouseEvent){
        console.log('onclick ...');
    }

    changeEleEvent(){
    }

    onEleDblclick(event: MouseEvent){
        console.log('onEleDblclick ...');
    }
    onEleDragstart(event: DragEvent, type:string){
        console.log('onEleDragstart');
        this.originEle = JSON.parse(JSON.stringify(this.ele));
        this.dragViewData = JSON.parse(JSON.stringify(this.ele));
        if(type == 'element'){
            this.dragViewData.display2 = 'block';
            this.oldPx = event.pageX;
            this.oldPy = event.pageY;
        }else{
            this.elementDraggable = false;
            this.dragViewData.display = 'block';
            console.log('in-----------------------');
        }

        this.dragButType = type;

        this.dragViewData.px = 0;
        this.dragViewData.py = 0;

        event.stopImmediatePropagation();
    }

    onEleDragend(event: DragEvent){
        this.dragViewData.px  += this.ele.px;
        this.dragViewData.py += this.ele.py;
        this.ele = JSON.parse(JSON.stringify(this.dragViewData));
        delete this.ele.display;
        delete this.ele.display2;
        this.dragViewData.display2 = 'none';
        this.dragViewData.display = 'none';

        this.elementDraggable = true;

        console.log('this.dragViewData : ' + JSON.stringify(this.dragViewData));

        event.stopImmediatePropagation();
    }

    onEleDragover(event: DragEvent){
    }

    /**
     *
     *  @param event
     *  @param type  left-top | top | right-top | right | right-bottom | left-bottom | left
     */
    onDrag(event: DragEvent){
       switch (this.dragButType){
           case 'left-top':
               this.onDragOfLeftTop(event);
               break;

           case 'top':
               this.onDragOfTop(event);
               break;

           case 'right-top':
               this.onDragOfRightTop(event);
               break;

           case 'right':
                this.onDragOfRight(event);
                break;

           case 'right-bottom':
                this.onDragOfRightBottom(event);
                break;

           case 'bottom':
                this.onDragOfBottom(event);
                break;

           case 'left-bottom':
                this.onDragOfLeftBottom(event);
                break;

           case 'left':
                this.onDragOfLeft(event);
                break;

           case 'element':
                this.onDragOfElement(event);
                break;

           default:
                console.error(`Drag type(${this.dragButType}) un-support!`);
       }

        event.stopImmediatePropagation();
    }

    onDragOfLeftTop(event: DragEvent){
        let pagex = event.pageX;
        let pagey = event.pageY;

        //获取右下角坐标
        let rY = this.originEle.height + this.originEle.py;
        let rX = this.originEle.width + this.originEle.px;

        let newHeight = Math.abs(pagey - rY);
        let newWidth = Math.abs(pagex - rX);

        if(pagex > rX){
            this.dragViewData.px = rX - this.ele.px;
            this.dragViewData.width = 0;
        }else{
            this.dragViewData.px = pagex - this.ele.px;
            this.dragViewData.width = Math.abs(newWidth);
        }

        if(pagey > rY){
            this.dragViewData.py = rY - this.ele.py;
            this.dragViewData.height = 0;
        }else{
            this.dragViewData.py = pagey - this.ele.py;
            this.dragViewData.height = Math.abs(newHeight);
        }
    }

    onDragOfTop(event: DragEvent){
        let pagey = event.pageY;

        //获取右下角坐标
        let rY = this.originEle.height + this.originEle.py;

        let newHeight = Math.abs(pagey - rY);

        if(pagey > rY){
            this.dragViewData.py = rY - this.ele.py;
            this.dragViewData.height = 0;
        }else{
            this.dragViewData.py = pagey - this.ele.py;
            this.dragViewData.height = Math.abs(newHeight);
        }
    }

    onDragOfRightTop(event: DragEvent){
        let pagex = event.pageX;
        let pagey = event.pageY;

        //获取左下角坐标
        let rY = this.originEle.height + this.originEle.py;
        let rX = this.originEle.px;

        let newHeight = Math.abs(pagey - rY);
        let newWidth = Math.abs(pagex - rX);

        if(pagex > rX){
            this.dragViewData.width = Math.abs(newWidth);
        }else{
            this.dragViewData.width = 0;
        }

        if(pagey > rY){
            this.dragViewData.py = rY - this.ele.py;
            this.dragViewData.height = 0;
        }else{
            this.dragViewData.py = pagey - this.ele.py;
            this.dragViewData.height = Math.abs(newHeight);
        }

    }

    onDragOfRight(event: DragEvent){
        let pagex = event.pageX;

        //获取右下角坐标
        let rX = this.originEle.px;

        let newWidth = Math.abs(pagex - rX);

        if(pagex < rX){
            this.dragViewData.width = 0;
        }else{
            this.dragViewData.width = Math.abs(newWidth);
        }
    }

    onDragOfRightBottom(event: DragEvent){
        let pagex = event.pageX;
        let pagey = event.pageY;

        //获取右下角坐标
        let rY = this.originEle.py;
        let rX = this.originEle.px;

        let newHeight = Math.abs(pagey - rY);
        let newWidth = Math.abs(pagex - rX);

        if(pagex < rX){
            this.dragViewData.width = 0;
        }else{
            this.dragViewData.width = Math.abs(newWidth);
        }

        if(pagey < rY){
            this.dragViewData.height = 0;
        }else{
            this.dragViewData.height = Math.abs(newHeight);
        }
    }

    onDragOfBottom(event: DragEvent){
        let pagey = event.pageY;

        //获取右下角坐标
        let rY = this.originEle.py;

        let newHeight = Math.abs(pagey - rY);

        if(pagey < rY){
            this.dragViewData.height = 0;
        }else{
            this.dragViewData.height = Math.abs(newHeight);
        }
    }

    onDragOfLeftBottom(event: DragEvent){
        let pagey = event.pageY;
        let pagex = event.pageX;

        //获取右上角坐标
        let rY = this.originEle.py;
        let rX = this.originEle.width + this.originEle.px;

        let newHeight = Math.abs(pagey - rY);
        let newWidth = Math.abs(pagex - rX);

        if(pagex > rX){
            this.dragViewData.px = rX - this.ele.px;
            this.dragViewData.width = 0;
        }else{
            this.dragViewData.px = pagex - this.ele.px;
            this.dragViewData.width = Math.abs(newWidth);
        }

        if(pagey < rY){
            this.dragViewData.py = rY - this.ele.py;
            this.dragViewData.height = 0;
        }else{
            this.dragViewData.py = pagey - newHeight - this.ele.py;
            this.dragViewData.height = Math.abs(newHeight);
        }
    }

    onDragOfLeft(event: DragEvent){
        let pagex = event.pageX;

        //获取右上角坐标
        let rX = this.originEle.px + this.originEle.width;

        let newWidth = Math.abs(pagex - rX);

        if(pagex > rX){
            this.dragViewData.width = 0;
        }else{
            this.dragViewData.px = pagex - this.ele.px;
            this.dragViewData.width = Math.abs(newWidth);
        }
    }

    onDragOfElement(event: DragEvent){
        let pagex = event.pageX;
        let pagey = event.pageY;

        let x = pagex - this.oldPx;
        let y = pagey - this.oldPy;

        this.dragViewData.px = x;
        this.dragViewData.py = y;
    }
}