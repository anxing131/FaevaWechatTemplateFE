/**
 * Created by Administrator on 2016/10/26.
 */
import {
    Component, OnInit,
    Input,
} from '@angular/core';

declare var $ : any;

@Component({
    moduleId: module.id,
    selector: 'ax-login-error-dimmer, [ax-login-error-dimmer]',
    templateUrl: 'error.html',
    styleUrls: ['style.css'],
})
export class LoginErrorDimmerComponent extends OnInit{
    @Input() errorInfo: any;


    ngOnInit(){

    }

    show(){
        $('.axLoginErrorDimmer').modal({
            allowMultiple: true,
            blurring: true,
            onHide: function () {
                return true;
            }
        }).modal('show');
        console.log('errorInfo : ' + JSON.stringify(this.errorInfo));
    }
}