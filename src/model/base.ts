
/**
 * Created by Administrator on 2016/10/31.
 */

export const MyProxyHander = {
    get(target, key, proxy){
        return Reflect.get(target, key, proxy);
    },

    set(target, key, value, proxy){
        return Reflect.set(target, key, value, proxy);
    }
};

declare var Proxy: any;

export class Base{
    public _proxy: any;
    protected _dirtyData:Map<any, any>;
    public _cleanData:Map<any, any> = new Map();
    _attrs: any;

    constructor(){

    }

    public update(cleanData:Map<any, any>, isInit:boolean = false){
        if(isInit){
            let keys = <Iterator<any>>cleanData.keys();
            let key:any;

            while((key = keys.next().value) != undefined){
                this._cleanData.set(key, cleanData.get(key));
            }
        }
    }

    postConstructor(){
        this._proxy = new Proxy(this, MyProxyHander);

        let cleanData:Map<any, any> = new Map();
        for(let key of this._attrs){
            cleanData.set(key, this[key]);
        }

        this.update(cleanData, true);
    }
}