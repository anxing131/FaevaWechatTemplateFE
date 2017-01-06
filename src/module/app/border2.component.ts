import { ElementComponent } from './components/background/element.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
/**
 * Created by AnXing on 2016/10/26.
 *
 *  使用mouse event 系列来实现,
 *
 *  还有一个是使用DragDrop event系列来实现的, 不过中间出现一个小小的问题(有时拖下拖下边框就变成屏幕的高度, 或者变成0, 不是想要的效果, 暂时没有解决这个问题),
 *  便采用用mouse event 来实现, 效果还不错, 没有上面所说的问题
 *
 *  @notice 这个版本存在一个旋转后, 拖动UI走位的问题, 下次有时间再来解决 
 *  @notice 截止(20161223), 已解决UI走位问题
 */
import {
    Component, OnInit,OnDestroy,
    ViewChild,
    Renderer, Input, Output, Host, forwardRef, Inject, EventEmitter
} from '@angular/core';
import {TemplateService} from "../../services/template.service";
import {Subject, Subscription} from "rxjs/Rx";

declare var $ : any;
@Component({
    moduleId: module.id,
    selector: 'my-border2, [my-border2]',
    templateUrl: 'border2.html',
    styleUrls: ['border2.css'],
})
export class Border2Component implements OnInit, OnDestroy{

    tempZIndex = 0;
    static changeSubject:Subject<any> = new Subject();
    changeSubjection :Subscription;
    changeSubjection2 :Subscription;

    ele: any = {
        angle: 0,
        px: 200,
        py: 200,
        width: 300,
        height: 300
    };

    //以底图居中放置, 相对界面的偏移量
    offsetWidth: number = 0;
    offsetHeight: number = 0; 

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

    diffX: any;
    diffY: any;

    //整个element是否可以拖动
    elementDraggable: boolean = true;

    /*
        当前拖动的按钮/角标类型
        left-top | top | right-top | right | right-bottom | left-bottom | left
     */
    dragButType: string;

    //用来标记是否正在伸缩中（按怅色）
    scalingFlag: boolean = false;

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

    changeEvent: EventEmitter<any> = new EventEmitter();

    @ViewChild('tempDiv') tempDiv: any;
    @ViewChild('myBorder') myBorder: any;
    @ViewChild('dimmer') dimmer: any;
    @ViewChild('rightClickMenu') rightClickMenu: any;

    constructor(
        private renderer: Renderer,
        public templateService: TemplateService
    ){
    }

    ngOnInit(){
        this.templateService.currentElement = this.templateService.currentElement;
        this.changeSubjection =  Border2Component.changeSubject.filter(data => data.event == 'closeRightMenu' || data.event == 'closeBorder').subscribe(data => {
            if(data.event == 'closeRightMenu'){
                this.closeRightMenu();
            }else{
                this.closeBorder();
            }
        });    

        this.changeSubjection2 =  Border2Component.changeSubject.subscribe(data => {
            switch(data.event){
                case 'elementClict':
                    setTimeout(() => {
                        this.tempZIndex = this.templateService.currentElement.zIndex;
                    }, 20);
                    break;

                case 'showRightClickMenu' :
                    this.showRightClickMenuEle(data.eventObj, data.eleId);
                    break;
            }
         
        });

        console.log('boder init ....................  ');
    }

    closeBorder(){
        console.log('closeBorder ... ');
        this.templateService.showFlag = false;
    }

    ngOnDestroy(){
        this.changeSubjection.unsubscribe();
        this.changeSubjection2.unsubscribe();
        console.log('boder destroy ....................  ');
    }

    getAngle(start,end){
        var diff_x = end.x - start.x,
            diff_y = end.y - start.y;
        //返回角度,不是弧度
        return 360*Math.atan(diff_y/diff_x)/(2*Math.PI);
    }

    ondblclick(event: MouseEvent){
        if(this.dragButType == 'element'){
            this.dimmer.show();
        }
    }

    click(event: MouseEvent, type ?: string){
        switch(type){
            case 'moveUpOne':
            case 'moveDownOne':
            case 'moveToBottom':
            case 'moveToTop':
                ElementComponent.changeSubject.next({
                    event: type
                });

                let rightClickMenuEle:HTMLElement = <HTMLElement>this.rightClickMenu.nativeElement;
                this.renderer.setElementClass(rightClickMenuEle, 'menu-hide', true);
                break;
            default: 
                if(this.templateService.currentElement.type == 'text'){
                    let data = {
                        id: this.templateService.currentElement._id,
                        event: 'TextClick',
                        mouseEvent: event,
                    }
                    Border2Component.changeSubject.next(data);
                }
        }
        

        event.stopImmediatePropagation();
        return false;
    }


    contextmenu(event){
        this.showRightClickMenuEle(event, this.templateService.currentElement._id);
        event.stopImmediatePropagation();
        return false;
    }

    showRightClickMenuEle(event, eleId){
        let tempBGDiv =  $('#background-content-div');
        this.offsetHeight = tempBGDiv.offset().top;
        this.offsetWidth = tempBGDiv.offset().left;

        let pagey:number = <number>event.pageY - 84 - this.offsetHeight;
        let pagex: number = <number>event.pageX + 30 - this.offsetWidth;
        let rightClickMenuEle:HTMLElement = <HTMLElement>this.rightClickMenu.nativeElement;
        this.renderer.setElementStyle(rightClickMenuEle, 'top', pagey + '');
        this.renderer.setElementStyle(rightClickMenuEle, 'left', pagex + '');
        this.renderer.setElementClass(rightClickMenuEle, 'menu-hide', false);

        ElementComponent.currentRightMenuId = eleId;
    }

    closeRightMenu(){
        this.renderer.setElementClass(this.rightClickMenu.nativeElement, 'menu-hide', true);
    }
    mouseup(event: MouseEvent){
        console.log('mouseup .... ');
    }
    mousedown(event: MouseEvent, type: string){

        let tempBGDiv =  $('#background-content-div');
        this.offsetHeight = tempBGDiv.offset().top;
        this.offsetWidth = tempBGDiv.offset().left;

        //close right menu
        this.closeRightMenu();
        DashboardComponent.changeSubject.next({event: 'closeRightMenu'});
        

        this.scalingFlag = true;
        this.templateService.currentElement.height = parseInt(this.templateService.currentElement.height);
        this.templateService.currentElement.py = parseInt(this.templateService.currentElement.py);
        this.templateService.currentElement.px = parseInt(this.templateService.currentElement.px);
        this.dragViewData = JSON.parse(JSON.stringify(this.templateService.currentElement));
        
        this.renderer.setElementStyle(this.tempDiv.nativeElement, 'display', 'block');

        if(type == 'element'){
        }else{
            this.elementDraggable = false;
            this.dragViewData.display = 'block';

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
            // this.renderer.setElementStyle(this.myBorder.nativeElement, 'cursor', 'crosshair');
        }

        this.dragButType = type;
        let x = event.pageX - this.dragViewData.px;
        let y = event.pageY - this.dragViewData.py;
        this.diffX = x;
        this.diffY = y;
        // this.dragViewData.px -= (event.pageX - this.dragViewData.px);
        // this.dragViewData.py -= (event.pageY - this.dragViewData.py);
        if(type == 'rotating'){

        }

        //因为rotating 在border里面, angle 是相对的, 这里要注意
        // this.dragViewData.angle = 0;

        this.leftTopPoint = {
            x: this.templateService.currentElement.px,
            y: this.templateService.currentElement.py
        };

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
        this.tempZIndex = this.templateService.currentElement.zIndex;

        this.scalingFlag = false;
        this.dragViewData.height = parseInt(this.dragViewData.height);
        this.dragViewData.py = parseInt(this.dragViewData.py);
        this.dragViewData.px = parseInt(this.dragViewData.px);

        this.renderer.setElementStyle(this.tempDiv.nativeElement, 'display', 'none');

        if(this.dragButType != 'element'){
            this.renderer.setElementStyle(this.myBorder.nativeElement, 'cursor', 'all-scroll');
        }

        if(this.dragButType == 'rotating'){

        }

        this.templateService.currentElement = null;
        this.templateService.currentElement = JSON.parse(JSON.stringify(this.dragViewData));
        delete this.templateService.currentElement.display;
        this.dragViewData.display = 'none';

        this.elementDraggable = true;

        for(let index in this.templateService.elements){
            let tempEle = this.templateService.elements[index];
            if(this.templateService.currentElement._id == tempEle._id){
                this.templateService.elements[index] = this.templateService.currentElement;
                break;
            }
        }

        //获取四点坐标
        let rightBottomPoint = this.getRotatingAfterPoint('rightBottom');
        let leftBottomPoint = this.getRotatingAfterPoint('leftBottom');
        let leftTopPoint = this.getRotatingAfterPoint('leftTop');
        let rightTopPoint = this.getRotatingAfterPoint('rightTop');
        let key = 0;
        switch (this.dragButType){
            case 'left-top':
            case 'right-top':
                //判断点在直线的那一侧
                 key = (rightBottomPoint.y - leftBottomPoint.y) * event.pageX + 
                        (leftBottomPoint.x - rightBottomPoint.x) * event.pageY + 
                        rightBottomPoint.x * leftBottomPoint.y - leftBottomPoint.x * rightBottomPoint.y;

                if(key < 0){ //右侧
                    this.templateService.currentElement.angle += 180; //倒立
                }
                break;

            case 'right-bottom':
            case 'left-bottom':
                key = (rightTopPoint.y - leftTopPoint.y) * event.pageX + 
                        (leftTopPoint.x - rightTopPoint.x) * event.pageY + 
                        rightTopPoint.x * leftTopPoint.y - leftTopPoint.x * rightTopPoint.y;

                if(key > 0){ //右侧
                    this.templateService.currentElement.angle += 180; //倒立
                }
                break;
            default:
                break;
        }

        console.log('change Ele : ', this.templateService.currentElement);
        console.log('height : ' +   this.templateService.currentElement.height);
        let tempEles = this.templateService.elements;
        this.templateService.elements = null;
        this.templateService.elements = [...tempEles];
        console.log('height2 : ' + this.templateService.elements[0].height);
        console.log('list : ', this.templateService.elements);
        this.templateService.changeTextSubject.next(this.templateService.currentElement._id);
        event.stopImmediatePropagation();
    }

    mousemove(event: any){
        this.tempZIndex = 2000;
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

    getABC(p1, p2){
        let a = p1.y - p2.y;
        let b = p2.x - p1.x;
        let c = p1.x * p2.y - p1.y * p2.x;

        return {a:a, b:b, c:c};
    }

    //获取点到直线的距离
    getDis(l, p){
        return Math.abs((l.a*p.x+l.b*p.y+l.c)/Math.sqrt(l.a*l.a+l.b*l.b));
    }

    onLeftTop(event: DragEvent){
        /*
            1、获取角坐标
            2、用点到直线的距离公式求得width、height
            3、求变化后的中点坐标
            4、有中点坐标、width、height 得出变动后的左上角坐标
        */
        let pagex = event.pageX - this.offsetWidth;
        let pagey = event.pageY - this.offsetHeight;

        //获取角坐标
        let rightBottomPoint = this.getRotatingAfterPoint('rightBottom');
        let leftBottomPoint = this.getRotatingAfterPoint('leftBottom');
        let leftTopPoint = this.getRotatingAfterPoint('leftTop');
        let rightTopPoint = this.getRotatingAfterPoint('rightTop');

        //获取直线方程的abc
        let rightLine = this.getABC(rightBottomPoint, rightTopPoint);
        let bottomLine = this.getABC(rightBottomPoint, leftBottomPoint);

        let width = 0;
        let height = 0;
        if(this.templateService.currentElement.angle % 90 == 0){
            width = Math.abs(rightBottomPoint.x - pagex);
            height = Math.abs(rightBottomPoint.y - pagey);
        }else{
            width = this.getDis(rightLine, {x:pagex, y:pagey});
            height = this.getDis(bottomLine, {x:pagex, y:pagey});
        }
        
        //当前四个点的位置
        let currentLefTopPoint = {x: pagex, y: pagey};
        let currentRightBottomPoint = rightBottomPoint;

        //由上两点得中点坐标
        let centerPoint = {
            x: Math.abs(currentRightBottomPoint.x - currentLefTopPoint.x) / 2,
            y: Math.abs(currentRightBottomPoint.y - currentLefTopPoint.y) / 2,
        };      

        if(currentRightBottomPoint.x > currentLefTopPoint.x){
            centerPoint.x += currentLefTopPoint.x;
        }else{
            centerPoint.x += currentRightBottomPoint.x;
        }

        if(currentRightBottomPoint.y > currentLefTopPoint.y){
            centerPoint.y += currentLefTopPoint.y;
        }else{
            centerPoint.y += currentRightBottomPoint.y;
        }

        //变化后的左上角原来坐标
        let changeOriginLeftTopPoint = {x: 0, y:0};
        changeOriginLeftTopPoint.x = centerPoint.x - width/2;
        changeOriginLeftTopPoint.y = centerPoint.y - height/2;

        this.dragViewData.py = changeOriginLeftTopPoint.y;
        this.dragViewData.px = changeOriginLeftTopPoint.x;
        this.dragViewData.width = width;
        this.dragViewData.height = height;
    }

    pointMousemove(event){
        if(this.scalingFlag){
            return this.mousemove(event);
        }
    }

    getWH(pA, pB, angle){
        let cosV = Math.cos(angle);
        let sinV = Math.sin(angle);
        let width = Math.abs(cosV * pB.x - pB.y - cosV * pA.x + pA.y) / Math.sqrt(1 + Math.pow(cosV, 2));
        let height = Math.abs(sinV * pB.x - pB.y - sinV * pA.x + pA.y) / Math.sqrt(1 + Math.pow(sinV, 2));

        return {
            width: width,
            height: height
        };
    }

    onLeft(event: DragEvent){
        let pagex = event.pageX - this.offsetWidth;
        let pagey = event.pageY - this.offsetHeight;

        //获取角坐标
        let rightBottomPoint = this.getRotatingAfterPoint('rightBottom');
        let leftBottomPoint = this.getRotatingAfterPoint('leftBottom');
        let leftTopPoint = this.getRotatingAfterPoint('leftTop');
        let rightTopPoint = this.getRotatingAfterPoint('rightTop');

        //获取直线方程的abc
        let rightLine = this.getABC(rightBottomPoint, rightTopPoint);

        let width = 0;
        if(this.templateService.currentElement.angle % 90 == 0){
            width = Math.abs(rightBottomPoint.x - pagex);
        }else{
            width = this.getDis(rightLine, {x:pagex, y:pagey});
        }
        
        let diff = width - this.templateService.currentElement.width;
        
        this.dragViewData.width = width;
        this.dragViewData.px  = this.templateService.currentElement.px - diff;

        //上面得出的结果与实际有点出入, width 是正确的, 但是坐标有点偏差
        //想不出是什么问题/导致的, 继续尝试使用其他方式(中点), 如下

        let jiaoDian = this.getJiaoDianPoint(leftTopPoint, rightTopPoint, {x:pagex, y: pagey});
        
        let centerPoint = {
            x: Math.abs(jiaoDian.x - rightBottomPoint.x) / 2,
            y: Math.abs(jiaoDian.y - rightBottomPoint.y) / 2
        }

        if(jiaoDian.x > rightBottomPoint.x){
            centerPoint.x += rightBottomPoint.x;
        }else{
            centerPoint.x += jiaoDian.x;
        }

        if(jiaoDian.y > rightBottomPoint.y){
            centerPoint.y += rightBottomPoint.y;
        }else{
            centerPoint.y += jiaoDian.y;
        }

        
        this.dragViewData.px = centerPoint.x - width/2;
        this.dragViewData.py = centerPoint.y - this.dragViewData.height/2;
    }

    //点p3到l(p1, p2) 的竖直交点坐标
    getJiaoDianPoint(p1, p2, p3){
        // qreal A = (pt1.y()-pt2.y())/(pt1.x()- pt2.x()); 
        // qreal B = (pt1.y()-A*pt1.y()); 
        // /// > 0 = ax +b -y; 对应垂线方程为 -x -ay + m = 0;(mm为系数) 
        // /// > A = a; B = b; 
        // qreal m = pt3.x() + A*pt3.y(); 
        // /// 求两直线交点坐标 
        // QPointF ptCross; 
        // ptCross.setX((m-A*B)/(A*A + 1)); 
        // ptCross.setY(A*ptCross.x()+B); 
        // return ptCross; 

        let  A = (p1.y-p2.y)/(p1.x- p2.x);  
        let  B = (p1.y-A*p1.x);  
        let m = p3.x + A*p3.y;  
    
        /// 求两直线交点坐标  
        let jiaoDian = {
            x: 0,
            y: 0
        };
        jiaoDian.x = (m-A*B)/(A*A + 1);
        jiaoDian.y = A*jiaoDian.x+B;
        return jiaoDian;  
    }

    onTop(event: DragEvent){
        let pagex = event.pageX - this.offsetWidth;
        let pagey = event.pageY - this.offsetHeight;

        //获取角坐标
        let rightBottomPoint = this.getRotatingAfterPoint('rightBottom');
        let leftBottomPoint = this.getRotatingAfterPoint('leftBottom');
        let leftTopPoint = this.getRotatingAfterPoint('leftTop');
        let rightTopPoint = this.getRotatingAfterPoint('rightTop');

        console.log('rightBottomPoint : ', rightBottomPoint);
        console.log('leftBottomPoint : ', leftBottomPoint);
        console.log('leftTopPoint : ', leftTopPoint);
        console.log('rightTopPoint : ', rightTopPoint);
        //获取直线方程的abc
        let bottomLine = this.getABC(rightBottomPoint, leftBottomPoint);

        let height = 0;
        if(this.templateService.currentElement.angle % 90 == 0){
            height = Math.abs(leftBottomPoint.y - pagey);
        }else{
            height = this.getDis(bottomLine, {x:pagex, y:pagey});
        }
        
        let diff = height - this.templateService.currentElement.height;
        
        this.dragViewData.height = height;
        this.dragViewData.py  = this.templateService.currentElement.py - diff;

        //上面得出的结果与实际有点出入, width 是正确的, 但是坐标有点偏差
        //想不出是什么问题/导致的, 继续尝试使用其他方式(中点), 如下

        let jiaoDian = this.getJiaoDianPoint(rightTopPoint, rightBottomPoint, {x:pagex, y: pagey});
        
        //判断点在直线的那一侧
        let key = (rightBottomPoint.y - leftBottomPoint.y) * event.pageX + 
                (leftBottomPoint.x - rightBottomPoint.x) * event.pageY + 
                rightBottomPoint.x * leftBottomPoint.y - leftBottomPoint.x * rightBottomPoint.y;

        if(key < 0){ //右侧
            this.dragViewData.angle = this.templateService.currentElement.angle + 180; //倒立    
        }else{
            this.dragViewData.angle = this.templateService.currentElement.angle;
        }

        this.dragViewData.angle = this.dragViewData.angle % 360;

        if(this.dragViewData.angle == 0){
            this.dragViewData.py = leftBottomPoint.y - height;
            console.log('this.dragViewData.py1 : '+ this.dragViewData.py);
            return;
        }else if(this.dragViewData.angle == 180){
            this.dragViewData.py = leftBottomPoint.y;
            console.log('this.dragViewData.py2 : '+ this.dragViewData.py);
            return;
        }

        let centerPoint = {
            x: Math.abs(jiaoDian.x - leftBottomPoint.x) / 2,
            y: Math.abs(jiaoDian.y - leftBottomPoint.y) / 2
        }

        if(jiaoDian.x > leftBottomPoint.x){
            centerPoint.x += leftBottomPoint.x;
        }else{
            centerPoint.x += jiaoDian.x;
        }

        if(jiaoDian.y > leftBottomPoint.y){
            centerPoint.y += leftBottomPoint.y;
        }else{
            centerPoint.y += jiaoDian.y;
        }
        
        this.dragViewData.py = centerPoint.y - height/2;
        this.dragViewData.px = centerPoint.x - this.dragViewData.width/2;
    }

    onRightTop(event: DragEvent){
        /*
            1、获取角坐标
            2、用点到直线的距离公式求得width、height
            3、求变化后的中点坐标
            4、有中点坐标、width、height 得出变动后的左上角坐标
        */
        let pagex = event.pageX - this.offsetWidth;
        let pagey = event.pageY - this.offsetHeight;

        //获取角坐标
        let rightBottomPoint = this.getRotatingAfterPoint('rightBottom');
        let leftBottomPoint = this.getRotatingAfterPoint('leftBottom');
        let leftTopPoint = this.getRotatingAfterPoint('leftTop');
        let rightTopPoint = this.getRotatingAfterPoint('rightTop');

        //获取直线方程的abc
        let leftLine = this.getABC(leftBottomPoint, leftTopPoint);
        let bottomLine = this.getABC(rightBottomPoint, leftBottomPoint);

        let width = 0;
        let height = 0;
        if(this.templateService.currentElement.angle % 90 == 0){
            width = Math.abs(leftBottomPoint.x - pagex);
            height = Math.abs(leftBottomPoint.y - pagey);
        }else{
            width = this.getDis(leftLine, {x:pagex, y:pagey});
            height = this.getDis(bottomLine, {x:pagex, y:pagey});
        }
        
        let currentLefTopPoint = {x: pagex, y: pagey};
        let currentLeftBottomPoint = leftBottomPoint;

        //由上两点得中点坐标
        let centerPoint = {
            x: Math.abs(currentLeftBottomPoint.x - currentLefTopPoint.x) / 2,
            y: Math.abs(currentLeftBottomPoint.y - currentLefTopPoint.y) / 2,
        };      

        if(currentLeftBottomPoint.x > currentLefTopPoint.x){
            centerPoint.x += currentLefTopPoint.x;
        }else{
            centerPoint.x += currentLeftBottomPoint.x;
        }

        if(currentLeftBottomPoint.y > currentLefTopPoint.y){
            centerPoint.y += currentLefTopPoint.y;
        }else{
            centerPoint.y += currentLeftBottomPoint.y;
        }

        //变化后的左上角原来坐标
        let changeOriginLeftTopPoint = {x: 0, y:0};
        changeOriginLeftTopPoint.x = centerPoint.x - width/2;
        changeOriginLeftTopPoint.y = centerPoint.y - height/2;

        this.dragViewData.py = changeOriginLeftTopPoint.y;
        this.dragViewData.px = changeOriginLeftTopPoint.x;
        this.dragViewData.width = width;
        this.dragViewData.height = height;
    }

    onRightBottom(event: DragEvent){
        /*
            1、获取角坐标
            2、用点到直线的距离公式求得width、height
            3、求变化后的中点坐标
            4、有中点坐标、width、height 得出变动后的左上角坐标
        */
        let pagex = event.pageX - this.offsetWidth;
        let pagey = event.pageY - this.offsetHeight;

        //获取角坐标
        let rightBottomPoint = this.getRotatingAfterPoint('rightBottom');
        let leftBottomPoint = this.getRotatingAfterPoint('leftBottom');
        let leftTopPoint = this.getRotatingAfterPoint('leftTop');
        let rightTopPoint = this.getRotatingAfterPoint('rightTop');

        //获取直线方程的abc
        let topLine = this.getABC(leftTopPoint, rightTopPoint);
        let leftLine = this.getABC(leftTopPoint, leftBottomPoint);

        let width = 0;
        let height = 0;
        if(this.templateService.currentElement.angle % 90 == 0){
            width = Math.abs(leftTopPoint.x - pagex);
            height = Math.abs(leftTopPoint.y - pagey);
        }else{
            width = this.getDis(leftLine, {x:pagex, y:pagey});
            height = this.getDis(topLine, {x:pagex, y:pagey});
        }
        
        let currentRightBottomPoint = {x: pagex, y: pagey};
        let currentLeftTopPoint = leftTopPoint;

        //由上两点得中点坐标
        let centerPoint = {
            x: Math.abs(currentRightBottomPoint.x - currentLeftTopPoint.x) / 2,
            y: Math.abs(currentRightBottomPoint.y - currentLeftTopPoint.y) / 2,
        };      

        if(currentRightBottomPoint.x > currentLeftTopPoint.x){
            centerPoint.x += currentLeftTopPoint.x;
        }else{
            centerPoint.x += currentRightBottomPoint.x;
        }

        if(currentRightBottomPoint.y > currentLeftTopPoint.y){
            centerPoint.y += currentLeftTopPoint.y;
        }else{
            centerPoint.y += currentRightBottomPoint.y;
        }

        //变化后的左上角原来坐标
        let changeOriginLeftTopPoint = {x: 0, y:0};
        changeOriginLeftTopPoint.x = centerPoint.x - width/2;
        changeOriginLeftTopPoint.y = centerPoint.y - height/2;

        this.dragViewData.py = changeOriginLeftTopPoint.y;
        this.dragViewData.px = changeOriginLeftTopPoint.x;
        this.dragViewData.width = width;
        this.dragViewData.height = height;
    }

    onBottom(event: DragEvent){
        let pagex = event.pageX - this.offsetWidth;
        let pagey = event.pageY - this.offsetHeight;

        //获取角坐标
        let rightBottomPoint = this.getRotatingAfterPoint('rightBottom');
        let leftBottomPoint = this.getRotatingAfterPoint('leftBottom');
        let leftTopPoint = this.getRotatingAfterPoint('leftTop');
        let rightTopPoint = this.getRotatingAfterPoint('rightTop');

        //获取直线方程的abc
        let topLine = this.getABC(rightTopPoint, leftTopPoint);

        let height = 0;
        if(this.templateService.currentElement.angle % 90 == 0){
            height = Math.abs(leftTopPoint.y - pagey);
        }else{
            height = this.getDis(topLine, {x:pagex, y:pagey});
        }
        
        let diff = height - this.templateService.currentElement.height;
        
        this.dragViewData.height = height;
        // this.dragViewData.py  = this.templateService.currentElement.py - diff;

        //上面得出的结果与实际有点出入, width 是正确的, 但是坐标有点偏差
        //想不出是什么问题/导致的, 继续尝试使用其他方式(中点), 如下

        
        
        //判断点在直线的那一侧
        let key = (rightTopPoint.y - leftTopPoint.y) * event.pageX + 
                (leftTopPoint.x - rightTopPoint.x) * event.pageY + 
                rightTopPoint.x * leftTopPoint.y - leftTopPoint.x * rightTopPoint.y;
        
        if(this.templateService.currentElement.angle == 0){
            if(key < 0){ //右侧
                this.dragViewData.angle = this.templateService.currentElement.angle; 
            }else{
                this.dragViewData.angle = this.templateService.currentElement.angle + 180;//倒立 
            }

            if(this.dragViewData.angle == 0){
                this.dragViewData.py = this.templateService.currentElement.py;
                return;
            }else if(this.dragViewData.angle == 180){
                this.dragViewData.py = this.templateService.currentElement.py - height;
                return;
            }
        }else if(this.templateService.currentElement.angle == 180){
            if(key < 0){ //右侧
                this.dragViewData.angle = this.templateService.currentElement.angle + 180; 
            }else{
                this.dragViewData.angle = this.templateService.currentElement.angle;//倒立 
            }

            this.dragViewData.angle = this.dragViewData.angle % 360;
            if(this.dragViewData.angle == 180){
                this.dragViewData.py = this.templateService.currentElement.py + this.templateService.currentElement.height;
            }else if(this.dragViewData.angle == 0){
                this.dragViewData.py = this.templateService.currentElement.py - diff;
            }

            this.dragViewData.angle += 180;
            this.dragViewData.angle = this.dragViewData.angle % 360;
            return;
        }
       
        this.dragViewData.angle = this.dragViewData.angle % 360;

        let jiaoDian = this.getJiaoDianPoint(rightTopPoint, rightBottomPoint, {x:pagex, y: pagey});
        let centerPoint = {
            x: Math.abs(jiaoDian.x - leftTopPoint.x) / 2,
            y: Math.abs(jiaoDian.y - leftTopPoint.y) / 2
        }

        if(jiaoDian.x > leftTopPoint.x){
            centerPoint.x += leftTopPoint.x;
        }else{
            centerPoint.x += jiaoDian.x;
        }

        if(jiaoDian.y > leftTopPoint.y){
            centerPoint.y += leftTopPoint.y;
        }else{
            centerPoint.y += jiaoDian.y;
        }
        
        this.dragViewData.py = centerPoint.y - height/2;
        this.dragViewData.px = centerPoint.x - this.dragViewData.width/2;
    }

    onRight(event: DragEvent){
        let pagex = event.pageX - this.offsetWidth;
        let pagey = event.pageY - this.offsetHeight;

        //获取角坐标
        let rightBottomPoint = this.getRotatingAfterPoint('rightBottom');
        let leftBottomPoint = this.getRotatingAfterPoint('leftBottom');
        let leftTopPoint = this.getRotatingAfterPoint('leftTop');
        let rightTopPoint = this.getRotatingAfterPoint('rightTop');

        //获取直线方程的abc
        let leftLine = this.getABC(leftBottomPoint, leftTopPoint);

        let width = 0;
        if(this.templateService.currentElement.angle % 90 == 0){
            width = Math.abs(leftTopPoint.x - pagex);
        }else{
            width = this.getDis(leftLine, {x:pagex, y:pagey});
        }
        
        let diff = width - this.templateService.currentElement.width;
        
        this.dragViewData.width = width;
        this.dragViewData.px  = this.templateService.currentElement.px - diff;

        //上面得出的结果与实际有点出入, width 是正确的, 但是坐标有点偏差
        //想不出是什么问题/导致的, 继续尝试使用其他方式(中点), 如下

        let jiaoDian = this.getJiaoDianPoint(leftTopPoint, rightTopPoint, {x:pagex, y: pagey});
        
        let centerPoint = {
            x: Math.abs(jiaoDian.x - leftBottomPoint.x) / 2,
            y: Math.abs(jiaoDian.y - leftBottomPoint.y) / 2
        }

        if(jiaoDian.x > leftBottomPoint.x){
            centerPoint.x += leftBottomPoint.x;
        }else{
            centerPoint.x += jiaoDian.x;
        }

        if(jiaoDian.y > leftBottomPoint.y){
            centerPoint.y += leftBottomPoint.y;
        }else{
            centerPoint.y += jiaoDian.y;
        }

        this.dragViewData.px = centerPoint.x - width/2;
        this.dragViewData.py = centerPoint.y - this.dragViewData.height/2;
    }

    onLeftBottom(event: DragEvent){
        /*
            1、获取角坐标
            2、用点到直线的距离公式求得width、height
            3、求变化后的中点坐标
            4、有中点坐标、width、height 得出变动后的左上角坐标
        */
        let pagex = event.pageX - this.offsetWidth;
        let pagey = event.pageY - this.offsetHeight;

        //获取角坐标
        let rightBottomPoint = this.getRotatingAfterPoint('rightBottom');
        let leftBottomPoint = this.getRotatingAfterPoint('leftBottom');
        let leftTopPoint = this.getRotatingAfterPoint('leftTop');
        let rightTopPoint = this.getRotatingAfterPoint('rightTop');

        //获取直线方程的abc
        let topLine = this.getABC(rightTopPoint, leftTopPoint);
        let rightLine = this.getABC(rightTopPoint, rightBottomPoint);

        let width = 0;
        let height = 0;
        if(this.templateService.currentElement.angle % 90 == 0){
            width = Math.abs(rightTopPoint.x - pagex);
            height = Math.abs(rightTopPoint.y - pagey);
        }else{
            width = this.getDis(rightLine, {x:pagex, y:pagey});
            height = this.getDis(topLine, {x:pagex, y:pagey});
        }
 
        let currentLeftBottomPoint = {x: pagex, y: pagey};
        let currentRightTopPoint = rightTopPoint;

        //由上两点得中点坐标
        let centerPoint = {
            x: Math.abs(currentRightTopPoint.x - currentLeftBottomPoint.x) / 2,
            y: Math.abs(currentRightTopPoint.y - currentLeftBottomPoint.y) / 2,
        };      

        if(currentRightTopPoint.x > currentLeftBottomPoint.x){
            centerPoint.x += currentLeftBottomPoint.x;
        }else{
            centerPoint.x += currentRightTopPoint.x;
        }

        if(currentRightTopPoint.y > currentLeftBottomPoint.y){
            centerPoint.y += currentLeftBottomPoint.y;
        }else{
            centerPoint.y += currentRightTopPoint.y;
        }

        //变化后的左上角原来坐标
        let changeOriginLeftTopPoint = {x: 0, y:0};
        changeOriginLeftTopPoint.x = centerPoint.x - width/2;
        changeOriginLeftTopPoint.y = centerPoint.y - height/2;

        this.dragViewData.py = changeOriginLeftTopPoint.y;
        this.dragViewData.px = changeOriginLeftTopPoint.x;
        this.dragViewData.width = width;
        this.dragViewData.height = height;
    }

    onElement(event: DragEvent){
        let pagex = event.pageX - this.diffX;
        let pagey = event.pageY - this.diffY;

        //origin


        let x = pagex;
        let y = pagey;

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

        let pageX = this.originEle.px + this.originEle.width/2 + this.offsetWidth;
        let pageY = this.originEle.py + this.originEle.height/2 + this.offsetHeight;

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

        this.dragViewData.angle = angle;
    }

    getRotatingAfterPoint(type: string): any{
        if(type == 'leftTop'){
            return this.getRotatingPoint(this.centerPoint, this.leftTopPoint, this.templateService.currentElement.angle);
        }else if(type == 'rightBottom'){
            return this.getRotatingPoint(this.centerPoint, this.rightBottomPoint, this.templateService.currentElement.angle);
        }else if(type == 'leftBottom'){
            return this.getRotatingPoint(this.centerPoint, {x: this.leftTopPoint.x, y: this.rightBottomPoint.y}, this.templateService.currentElement.angle);
        }else if(type == 'rightTop'){
            return this.getRotatingPoint(this.centerPoint, {x: this.rightBottomPoint.x, y: this.leftTopPoint.y}, this.templateService.currentElement.angle);
        }else{
            throw new TypeError("Unsupported type! -> " + type);
        }
    }

    //获取点point 以center为圆心旋转angle度后的坐标
    getRotatingPoint(center:any, point: any, angle: number): any{
        let hudu = (2 * Math.PI / 360) * angle; //2*PI/360*角度

        let x1 = (point.x - center.x) * Math.cos(hudu) - (point.y - center.y) * Math.sin(hudu) + center.x;
        let y1 = (point.y - center.y) * Math.cos(hudu) + (point.x - center.x) * Math.sin(hudu) + center.y;

        return {x: x1, y: y1};
    }
}