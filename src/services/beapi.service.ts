/**
 * Created by Administrator on 2016/10/10.
 */

import {Injectable, Inject} from "@angular/core";
import {Hero} from "../model/hero";
import {heroes} from  './mock-heroes';
import {Headers, RequestOptions, Http, Response} from "@angular/http";
import {UserService} from "./user.service";


let urls = {

}

@Injectable()
export class BeApiService{
    heroes: Hero[];
    urls: any = urls;
    private beDomain: string = 'http://192.168.152.128/Heroes/';

    constructor(
        private http: Http,
        private userService: UserService,
        @Inject('config') private config: any,
    ){
        this.heroes = heroes;
    }

    getUrl(url: string): string{
        return this.beDomain + this.urls[url];
    }

    /**
     *  faeva be api common request function
     *
     * @param
     */
    commonReqByFaeva(url, body, headers ?: Headers, successCB ?: any, errorCB ?: any, completeCB ?: any){
        if(headers){
            if(!headers.has('Content-Type') || headers.get('Content-Typ') != 'application/json'){
                headers.append('Content-Type', 'application/json');
            }
        }else{
            headers = new Headers();
            headers.append('Content-Type', 'application/json');
        }

        let options = new RequestOptions({ headers: headers });
        this.http.post(url, body, options).subscribe((resp: Response) => {
            let result: any;
            try {
                result = JSON.parse(JSON.stringify(resp.json()));
            }catch (err){
                let errInfo = {
                    title: 'Can parse to json format',
                    body: resp.text(),
                    errMsg: err,
                    httpStatus: resp.status
                };

                this.sendEmailToAdmins(errInfo);
                let errorMsg = {code: 500, msg:"result JSON format!"};
                if(!this.userService.handleCommonAuthApiRespo(errorMsg)){
                    successCB(result);
                }
                return;
            }

            // console.log('result : ' + JSON.stringify(result));
            if(result.code == 200){
                return successCB(result);
            }else{
                if(!this.userService.handleCommonAuthApiRespo(result)){
                    successCB(result);
                }
                return;
            }

        }, (err) => {
            // console.log('err : ' + err);
            if(errorCB){
                errorCB(err);
            }
        }, () => {
            // console.log('complete : ');
            if(completeCB){
                completeCB();
            }
        });
    }

    sendEmailToAdmins(content: any): void{
        // console.error(content);
        let url = `http://${this.config.get('emailSend:host')}:${this.config.get('emailSend:port')}/${this.config.get('emailSend:url')}`;

        let admintors: any = this.config.get('admins');
        let to: string = '';
        admintors.forEach((admin, index) => {
            if((index + 1) == admintors.length){
                to += admin.email;
            }else{
                to += admin.email + ', ';
            }
        });

        if(to.length == 0){
            return;
        }

        let body = JSON.stringify({
            data:{
                to: to,
                subject: content.title,
                text: JSON.stringify(content.errMsg),
                html: JSON.stringify(content.body),
            }
        });

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });

        this.http.post(url, body, options).subscribe((resp: Response) => {
            try {
                let result: any = JSON.stringify(resp.json());
                console.log('result : ' + result);
            }catch (err){
                let errInfo = {
                    title: 'Can parse to json format',
                    body: resp.text(),
                    errMsg: err,
                    httpStatus: resp.status
                };
                console.log('error');
                return;
            }
        }, (err) => {
            console.log('err : ' + err);
        }, () => {
            //console.log('complete : ');
        });
    }
}