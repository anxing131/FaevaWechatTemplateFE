/**
 * Created by Administrator on 2016/10/10.
 */

import {Injectable} from "@angular/core";
import {Hero} from "../model/hero";
import {heroes} from  './mock-heroes';
import {Headers, RequestOptions, Http} from "@angular/http";


let urls = {
    login: 'user/user/login',
    getEventTemplateList: 'dm/wechatDm/listWxEvent',
    getEventTemplateListByPagination: 'dm/wechatDm/listWxEventByPagination',
    deleteTemplate: 'admin/eventmgt/deleteEvent',
    uploadTemporaryImgByAdmin: 'dm/assets/uploadTemporaryImgByAdmin',
    getAgentProductTemplateList: 'dm/accountProductAgent/getTemplateList',
    delAgentProductTemplate: 'dm/accountProductAgent/delTemplate',
    updateAgentProductTemplate: 'dm/accountProductAgent/updateTemplate',
    createAgentProductTemplate: 'dm/accountProductAgent/createTemplate'
};

@Injectable()
export class FaevaBeApiService{
    urls: any = urls;
    private beDomain: string = 'http://54.223.38.102:3000/development/';

    constructor(private  http: Http){
    }

    getUrl(url: string): string{
        return this.beDomain + this.urls[url];
    }
}