/**
 * Created by Administrator on 2016/10/26.
 */
import {
    Component, OnInit, trigger,
    state,
    style,
    transition,
    animate,
    Input,
    Output,
    Renderer, EventEmitter
} from '@angular/core';
import {TemplateService} from "../../../../services/template.service";

declare var $ : any;

@Component({
    moduleId: module.id,
    selector: 'ax-border-dimmer',
    templateUrl: 'index.html',
    styleUrls: ['style.css'],
})
export class BorderDimmerComponent extends OnInit{
    // @Input() ele: any;
    @Output() changeEmit: EventEmitter<any> = new EventEmitter();

    constructor(
        private renderer: Renderer,
        private templateService: TemplateService
    ){
        super();
    }

    ngOnInit(){
        $('.ax-custom-popup').popup({
            on:'hover',
        });
    }

    show(){
        $('.ax-border-modal-flags').modal("setting", {
            closable: true,
            onApprove: function () {
                console.log('onApprove');
                return true;
            },
            onHidden: (function (obj) {
                return function(){
                    for(let index in obj.templateService.elements){
                        let tempEle = obj.templateService.elements[index];
                        if(obj.templateService.currentElement._id == tempEle._id){
                            obj.templateService.elements[index] = obj.templateService.currentElement;
                            break;
                        }
                    }
                }
            })(this)
        }).modal('show');
    }
}