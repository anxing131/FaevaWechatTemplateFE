/**
 * Created by Administrator on 2016/10/10.
 */

import {Injectable} from "@angular/core";
import {Hero} from "../model/hero";
import {heroes} from  './mock-heroes';
import {Headers, RequestOptions, Http} from "@angular/http";
import {config} from '../config/application';

@Injectable()
export class ConfigureService{
    private _separated = ':';

    constructor(){
    }

    get(keyStr: string){
        let keys: string[] = keyStr.split(this._separated);
        let result: any = config;

        for(let key in keys){
            result = result[keys[key]];
            if(result == null){
                break;
            }
        }
        return result;
    }

    setSeparated(sp: string){
        this._separated = sp;
    }

    all(): any{
    }
}