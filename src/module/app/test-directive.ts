/**
 * Created by Administrator on 2016/11/29.
 */

import {Directive} from "@angular/core";

@Directive({
    selector: 'init, [init]',
    inputs: ['init']
})
export class InitDir {
    init;

    ngOnChanges() {     // `ngOnInit` if you want it to run just once
        console.log('ngOnChanges-------');
        console.log('this.init : ' + this.init);
        // console.log('this.init : ' + JSON.stringify(this.init));
        if(this.init){
            let iife = function(str){ return eval(str); }.call(this.init[0], this.init[1]);
            console.log('this.iife : ' + iife);
            console.log('iife : ' + JSON.stringify(iife));
        }
    }
}