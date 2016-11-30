/**
 * Created by AnXing on 2016/10/26.
 *
 */
import {
    Component, OnInit,
    ViewChild,
    Renderer, Input, Output, Host, forwardRef, Inject, EventEmitter, ElementRef
} from '@angular/core';

declare var $ : any;

@Component({
    moduleId: module.id,
    selector: 'my-test',
    templateUrl: 'index.html',
    styleUrls: ['index.css'],
})
export class TestComponent extends OnInit{

    el: ElementRef;

    constructor(el: ElementRef){
        super();
        this.el = el;
    }

    ngOnInit(){
        console.log('innerHtml : ' + this.el.nativeElement.innerHTML);
        console.log('innerText : ' + this.el.nativeElement.innerText);
    }
}