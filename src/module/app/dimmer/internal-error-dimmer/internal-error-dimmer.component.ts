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
    Inject,
    Directive,
    Renderer, EventEmitter,ViewChild
} from '@angular/core';
import {UserService} from "../../../../services/user.service";
import {Headers, RequestOptions, Response, Http} from "@angular/http";
import {FaevaBeApiService} from "../../../../services/faeva-beapi.service";
import {Router} from "@angular/router";
import {User} from "../../../../model/user";

declare var $ : any;

@Component({
    moduleId: module.id,
    selector: 'ax-internal-error-dimmer, [ax-internal-error-dimmer]',
    templateUrl: 'index.html',
    styleUrls: ['style.css'],
})
export class InternalErrorDimmerComponent extends OnInit{
    private data: any;

    constructor(
        private renderer: Renderer,
        private userService: UserService,
        private faevaBeApiService: FaevaBeApiService,
        private http: Http,
        private router: Router,
        @Inject('config') private config: any
    ){
        super();
    }

    ngOnInit(){
    }

    show(showData){
        this.data = {
            title: 'Internal Server Error',
            code: 500,
            details: JSON.stringify(showData)
        };

        setTimeout((function(obj){
            return function(){
                $('.system-internal-error-dimmer').modal("setting", {
                    blurring: true,
                    allowMultiple: true,
                    onHide: function () {
                    },
                    onApprove: function(){
                    },
                    onDeny: function(){
                    }
                }).modal('show');
            };
        })(this), 10);
    }

    hide(){
        $('.system-internal-error-dimmer').modal('setting', {
            closable: true,
            allowMultiple: false
        }).modal('hide all');
    }

}