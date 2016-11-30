/**
 * Created by AnXing on 2016/10/26.
 *
 *  使用mouse event 系列来实现,
 *
 *  还有一个是使用DragDrop event系列来实现的, 不过中间出现一个小小的问题(有时拖下拖下边框就变成屏幕的高度, 或者变成0, 不是想要的效果, 暂时没有解决这个问题),
 *  便采用用mouse event 来实现, 效果还不错, 没有上面所说的问题
 *
 *  @notice 这个版本存在一个旋转后, 拖动UI走位的问题, 下次有时间再来解决
 */
import {
    Component, OnInit,
    ViewChild,
    Renderer, Input, Output, Host, forwardRef, Inject, EventEmitter
} from '@angular/core';
import {TemplateService} from "../../services/template.service";

declare var $ : any;

@Component({
    moduleId: module.id,
    selector: 'my-border2',
    templateUrl: 'border2.html',
    styleUrls: ['border2.css'],
})
export class Border2Component extends OnInit{
    ele: any = {
        angle: 0,
        px: 200,
        py: 200,
        width: 300,
        height: 300
    };

    
    //尝试使用renderer.setElelmentStyle 去控制display, 不知为什么导致其他拖动的图标没有显示,
    //发现在Html 上使用angular2 的ngStyle 可以解决这个问题
    rotatingDisplay: string = 'none';

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

    /*
        元素的中心位置
    */
    centerPoint: any;

    /*
        元素右下角的坐标
    */
    rightBottomPoint: any = {
        x: 0,
        y: 0
    };

    /*
        元素左上角的坐标
     */
    leftTopPoint: any = {
        x: 0,
        y: 0
    };

    //元素拖动时发生改变的属性
    changeAttr: any = {};

    changeEvent: EventEmitter<any> = new EventEmitter();

    @ViewChild('tempDiv') tempDiv: any;
    @ViewChild('myBorder') myBorder: any;
    @ViewChild('dimmer') dimmer: any;

    constructor(
        private renderer: Renderer,
        public templateService: TemplateService
    ){
        super();
    }

    ngOnInit(){
        this.templateService.currentElement = this.templateService.currentElement;
    }

    test(){
        console.log(' test this ele : ' + JSON.stringify(this.templateService.currentElement));
    }

    getAngle(start,end){
        var diff_x = end.x - start.x,
            diff_y = end.y - start.y;
        //返回角度,不是弧度
        return 360*Math.atan(diff_y/diff_x)/(2*Math.PI);
    }

    getAngle_bk(start,  end){
        var x = Math.abs(start.x - end.x);
        var y = Math.abs(start.y - end.y);
        var z = Math.sqrt(x*x + y*y);
        return  Math.round((Math.asin(y / z) / Math.PI*180));
    }

    ondblclick(event: MouseEvent){
        if(this.dragButType == 'element'){
            this.dimmer.show();
        }
    }


    mousedown(event: MouseEvent, type: string){
        // this.originEle = JSON.parse(JSON.stringify(this.templateService.currentElement));
        this.dragViewData = JSON.parse(JSON.stringify(this.templateService.currentElement));

        this.renderer.setElementStyle(this.tempDiv.nativeElement, 'display', 'block');

        if(type == 'element'){
            this.dragViewData.display2 = 'block';
            this.oldPx = event.pageX;
            this.oldPy = event.pageY;
        }else{
            this.elementDraggable = false;
            this.dragViewData.display = 'block';
            this.renderer.setElementStyle(this.tempDiv.nativeElement, 'display', 'block');

            let cursor = 'default';
            switch (type){
                case 'left-top':
                    cursor = 'nw-resiz';
                    break;

                case 'top':
                    cursor = 'n-resize';
                    break;

                case 'right-top':
                    cursor = 'ne-resize';
                    break;

                case 'right':
                    cursor = 'e-resize';
                    break;

                case 'right-bottom':
                    cursor = 'se-resize';
                    break;

                case 'bottom':
                    cursor = 's-resize';
                    break;

                case 'left-bottom':
                    cursor = 'sw-resize';
                    break;

                case 'left':
                    cursor = 'w-resize'
                    break;

                default:
            }

            this.renderer.setElementStyle(this.myBorder.nativeElement, 'cursor', cursor);
        }

        this.dragButType = type;

        this.dragViewData.px = 0;
        this.dragViewData.py = 0;

        if(type == 'rotating'){

        }

        //因为rotating 在border里面, angle 是相对的, 这里要注意
        this.dragViewData.angle = 0;

        let cY = this.templateService.currentElement.py + this.templateService.currentElement.height/2;
        let cX = this.templateService.currentElement.px + this.templateService.currentElement.width/2;
        this.centerPoint = {
            x: cX,
            y: cY
        };

        let rbY = this.templateService.currentElement.height + this.templateService.currentElement.py;
        let rbX = this.templateService.currentElement.width + this.templateService.currentElement.px;
        this.rightBottomPoint = {
            x: rbX,
            y: rbY
        };


        this.originEle = JSON.parse(JSON.stringify(this.templateService.currentElement));
        event.preventDefault();
        event.stopImmediatePropagation();
    }

    /**
     *  element 拖动结束
     */
    mouseupForEnd(event: any){
        this.renderer.setElementStyle(this.tempDiv.nativeElement, 'display', 'none');

        if(this.dragButType != 'element'){
            this.renderer.setElementStyle(this.myBorder.nativeElement, 'cursor', 'all-scroll');
        }

        if(this.dragButType == 'rotating'){

        }

        this.dragViewData.angle += this.templateService.currentElement.angle;
        this.dragViewData.px  += this.templateService.currentElement.px;
        this.dragViewData.py += this.templateService.currentElement.py;
        this.templateService.currentElement = JSON.parse(JSON.stringify(this.dragViewData));
        delete this.templateService.currentElement.display;
        delete this.templateService.currentElement.display2;
        this.dragViewData.display2 = 'none';
        this.dragViewData.display = 'none';

        this.elementDraggable = true;

        for(let index in this.templateService.elements){
            let tempEle = this.templateService.elements[index];
            if(this.templateService.currentElement._id == tempEle._id){
                this.templateService.elements[index] = this.templateService.currentElement;
                break;
            }
        }



        console.log('change Ele : ' + JSON.stringify(this.templateService.currentElement));
        this.templateService.changeTextSubject.next(this.templateService.currentElement._id);

        event.stopImmediatePropagation();
    }

    mousemove(event: any){
        switch (this.dragButType){
            case 'left-top':
                this.onLeftTop(event);
                break;

            case 'top':
                this.onTop(event);
                break;

            case 'right-top':
                this.onRightTop(event);
                break;

            case 'right':
                this.onRight(event);
                break;

            case 'right-bottom':
                this.onRightBottom(event);
                break;

            case 'bottom':
                this.onBottom(event);
                break;

            case 'left-bottom':
                this.onLeftBottom(event);
                break;

            case 'left':
                this.onLeft(event);
                break;

            case 'element':
                this.onElement(event);
                break;

            case 'rotating':
                console.log('rotating move ');
                this.onRotating(event);
                break;

            default:
                console.error(`Drag type(${this.dragButType}) un-support!`);
        }

        event.stopImmediatePropagation();
    }

    mousemoveOfRotating(event: MouseEvent){
        if(!this.dragButType){
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }

    mouseoverOfBorder(event: MouseEvent){
        this.rotatingDisplay = 'block';

        event.preventDefault();
        event.stopImmediatePropagation();
    }

    mouseleaveOfBorder(event: MouseEvent){
        this.rotatingDisplay = 'none';

        event.preventDefault();
        event.stopPropagation()
    }

    changeEleEvent(){
    }


    onLeftTop(event: DragEvent){
        let pagex = event.pageX;
        let pagey = event.pageY;

        //获取右下角坐标
        // let rY = this.originEle.height + this.originEle.py;
        // let rX = this.originEle.width + this.originEle.px;
        let rotatingPoint = this.getRotatingAfterPoint('rightBottom');
        let rX = rotatingPoint.x;
        let rY = rotatingPoint.y;

        let newHeight = Math.abs(pagey - rY);
        let newWidth = Math.abs(pagex - rX);

        if(pagex > rX){
            this.dragViewData.px = rX - this.templateService.currentElement.px;
            this.dragViewData.width = 0;
        }else{
            this.dragViewData.px = pagex - this.templateService.currentElement.px;
            this.dragViewData.width = Math.abs(newWidth);
        }

        if(pagey > rY){
            this.dragViewData.py = rY - this.templateService.currentElement.py;
            this.dragViewData.height = 0;
        }else{
            this.dragViewData.py = pagey - this.templateService.currentElement.py;
            this.dragViewData.height = Math.abs(newHeight);
        }
    }

    onTop(event: DragEvent){
        let pagey = event.pageY;

        //获取右下角坐标
        let rY = this.originEle.height + this.originEle.py;

        let newHeight = Math.abs(pagey - rY);

        if(pagey > rY){
            this.dragViewData.py = rY - this.templateService.currentElement.py;
            this.dragViewData.height = 0;
        }else{
            this.dragViewData.py = pagey - this.templateService.currentElement.py;
            this.dragViewData.height = Math.abs(newHeight);
        }
    }

    onRightTop(event: DragEvent){
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
            this.dragViewData.py = rY - this.templateService.currentElement.py;
            this.dragViewData.height = 0;
        }else{
            this.dragViewData.py = pagey - this.templateService.currentElement.py;
            this.dragViewData.height = Math.abs(newHeight);
        }

    }

    onRight(event: DragEvent){
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

    onRightBottom(event: DragEvent){
        let pagex = event.pageX;
        let pagey = event.pageY;

        //获取左上角坐标
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

    onBottom(event: DragEvent){
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

    onLeftBottom(event: DragEvent){
        let pagey = event.pageY;
        let pagex = event.pageX;

        //获取右上角坐标
        let rY = this.originEle.py;
        let rX = this.originEle.width + this.originEle.px;

        let newHeight = Math.abs(pagey - rY);
        let newWidth = Math.abs(pagex - rX);

        if(pagex > rX){
            this.dragViewData.px = rX - this.templateService.currentElement.px;
            this.dragViewData.width = 0;
        }else{
            this.dragViewData.px = pagex - this.templateService.currentElement.px;
            this.dragViewData.width = Math.abs(newWidth);
        }

        if(pagey < rY){
            this.dragViewData.py = rY - this.templateService.currentElement.py;
            this.dragViewData.height = 0;
        }else{
            this.dragViewData.py = pagey - newHeight - this.templateService.currentElement.py;
            this.dragViewData.height = Math.abs(newHeight);
        }
    }

    onLeft(event: DragEvent){
        let pagex = event.pageX;

        //获取右上角坐标
        let rX = this.originEle.px + this.originEle.width;

        let newWidth = Math.abs(pagex - rX);

        if(pagex > rX){
            this.dragViewData.width = 0;
        }else{
            this.dragViewData.px = pagex - this.templateService.currentElement.px;
            this.dragViewData.width = Math.abs(newWidth);
        }
    }

    onElement(event: DragEvent){
        let pagex = event.pageX;
        let pagey = event.pageY;

        //origin
        let x = pagex - this.oldPx;
        let y = pagey - this.oldPy;


        //元素旋转后再去拖动的算法好复杂, 暂时不去解决旋转后再拖动的UI走位问题
        // let y = -(pagex - this.oldPx);
        // let x = (pagey - this.oldPy);

        // console.log('x : ' + x);
        // console.log('y : ' + y);
        // let point = this.getRotatingPoint(this.centerPoint, {x: x, y: y}, this.templateService.currentElement.angle);
        // console.log('point : ' + JSON.stringify(point));

        this.dragViewData.px = x;
        this.dragViewData.py = y;
    }

    getPageX(ele: HTMLElement){
       return  ele.offsetParent?(ele.offsetLeft+this.getPageX(<HTMLElement>ele.offsetParent)):ele.offsetLeft;
    }
    getPageY(ele: HTMLElement){
        return ele.offsetParent?(ele.offsetTop+this.getPageY(<HTMLElement>ele.offsetParent)):ele.offsetTop;
    }

    onRotating(event: DragEvent){
        let target = <HTMLElement>event.target;
        // let rotating = <HTMLElement>target.parentElement.getElementsByClassName('border-rotating')[0].getElementsByClassName('rotating')[0];
        let rotating = <HTMLElement>target.parentElement.getElementsByClassName('top')[0];

        let pageX = this.originEle.px + this.originEle.width/2;
        let pageY = this.originEle.py + this.originEle.height/2;

        let start:any = {
            x: pageX,
            y: pageY
        };

        let end: any = {
            x: event.pageX,
            y: event.pageY
        };

        let angle: any = this.getAngle(start, end);
        if(event.pageX >= pageX){
            angle += 90;
        }else{
            angle += 270;
        }

        this.dragViewData.angle = angle - this.templateService.currentElement.angle;
    }


    getRotatingAfterPoint(type: string): any{
        if(type == 'leftTop'){
            return this.getRotatingPoint(this.centerPoint, this.leftTopPoint, this.templateService.currentElement.angle);
        }else if(type == 'rightBottom'){
            return this.getRotatingPoint(this.centerPoint, this.rightBottomPoint, this.templateService.currentElement.angle);
        }else{
            throw new TypeError("Unsupported type! -> " + type);
        }
    }

    //获取点point 以center为圆心旋转angle度后的坐标
    getRotatingPoint(center:any, point: any, angle: number): any{
        let hudu = (2 * Math.PI / 360) * angle; //2*PI/360*角度

        let x1 = (point.x - center.x) * Math.cos(hudu) - (point.y - center.y) * Math.sin(hudu) + center.x;
        let y1 = (point.y - center.y) * Math.cos(hudu) + (point.x - center.x) * Math.sin(hudu) + center.y;

        // console.log('x1 : ' + x1);
        // console.log('y1 : ' + y1);
        return {x: x1, y: y1};
    }

}