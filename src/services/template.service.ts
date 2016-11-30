/**
 * Created by Administrator on 2016/10/25.
 */
import {Injectable} from "@angular/core";

import * as Rx from "rxjs/rx";

@Injectable()
export class TemplateService{
    changeTextSubject: Rx.Subject<any> = new Rx.Subject();
    currentElement: any = {
        _id: 'id1',
        name:"tesd",
        type:'text',
        width: 80,
        height: 45,
        px: 34,
        py: 35,
        fontSize: 80,
        fontWeight:23,
        angle:0,
        borderRadius:'45%',
        color:'0905ff',
        opacity: 1
    };
    showFlag: boolean = true;

    bg: string = 'src/assets/img/drawable-xxhdpi-icon.png';
    width: string = '200';
    height: string = '200'
    elements: any = [
        {
            _id: 'id1',
            name:"tesd",
            type:'text',
            width: 80,
            height: 45,
            px: 34,
            py: 35,
            fontSize: 80,
            fontWeight:23,
            angle:0,
            borderRadius:'45%',
            color:'0905ff',
            opacity: 1
        },
        {_id: 'id2', name:"qrCode", type:'img', width: 45, height: 45, px: 54, py: 55, angle:0, borderRadius:'0%', opacity:1}
    ];

    constructor(){
        this.changeTextSubject.subscribe({
            next: (param) => {
                console.log('param : ' + param);
            }
        });
    }

    addEle(ele: any){
        this.elements.push(ele);

        console.log('addEle : ' + JSON.stringify(this.elements));
    }
}