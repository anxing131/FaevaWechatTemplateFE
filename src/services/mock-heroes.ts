import {Hero} from "../model/hero";
/**
 * Created by Administrator on 2016/10/14.
 */

let id1: string = Math.random() + "";
let id2: string = Math.random() + "";

console.log('id1 : ' + id1);
console.log('id2 : ' + id2);

export var  heroes:Hero[] = [
    {id:id1, name:"风神", createDate: 1},
    {id:id2, name: "雷神", createDate: 1}
];