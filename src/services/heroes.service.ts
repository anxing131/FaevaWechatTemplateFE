/**
 * Created by Administrator on 2016/10/10.
 */

import {Injectable} from "@angular/core";
import {Hero} from "../model/hero";
import {heroes} from  './mock-heroes';
import {Headers, RequestOptions, Http, Response, Jsonp} from "@angular/http";
import {BeApiService} from "./beapi.service";
import {Observable} from "rxjs/Rx";


@Injectable()
export class HeroesService{
    heroes: Hero[];
    extractData: any;

    constructor(private  http: Http, private beApiService:BeApiService, private jsonp: Jsonp){
        this.heroes = heroes;
    }

    getHeroes(index: number=1, limit: number=20): Promise<Hero[]>{
        return Promise.resolve(this.heroes);
    }

    getHero(id: string): Promise<Hero>{
        return this.getHeroes().then(heroes => {
            return heroes.find(hero => hero.id === id)
        });
    }

    delHero(id: string): Promise<Hero[]>{
        return this.getHeroes().then(heroes => {
            let tempHeroes =  heroes.filter(hero => hero.id !== id);
            this.heroes = tempHeroes;
            return tempHeroes;
        });
    }

    addHero(hero: Hero): void{
        delete(hero.id);
        let reqData = {
            'ws':{},
            'data':{
                'heroes':[{
                    'name': hero.name
                }]
            }
        };

        let body = JSON.stringify(reqData);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        let url = this.beApiService.getUrl('addHeroes');

        this.heroes.push(hero);

        // this.http.post(url, body, options).subscribe((resp: Response) => {
        //     let result = resp.json();
        //     console.log('result : ' + JSON.stringify(result));
        // });

        this.http.post(url, body, options).subscribe((resp: Response) => {
            // let result = resp.json();

            console.log('result text: ' + JSON.stringify(resp.json()));
        });
    }

    getHeroesBeRemote(index: number=1, limit: number=20){
        let reqData = {
            'ws':{},
            'data':{
                'conditions':{}
            }
        };

        this.post(reqData, 'searchHeroes').subscribe((resp: Response) => {
            console.log('ok');
            let status = resp.status;
            let localeString = resp.toLocaleString();
            let string = resp.toString();
            let text = resp.text();
            let statusText = resp.statusText;
            let response = JSON.stringify(resp);
            let header = JSON.stringify(resp.headers);

            console.log('header : ' + header);
            console.log('response: ' + response);
            console.log('status : '+string);
            console.log('localeString : '+localeString);
            console.log('string : '+string);
            console.log('text : '+text);
            console.log('statusText : '+statusText);

            // let result = resp.json();
            // let heroes: Hero[] = result.msg.heroes;
        }, (resp: Response) => {
            let status = resp.status;
            let localeString = resp.toLocaleString();
            let string = resp.toString();
            let text = resp.text();
            let statusText = resp.statusText;
            let response = JSON.stringify(resp);
            let header = JSON.stringify(resp.headers);
            let type = resp.type;

            console.log('type : ' + type);
            console.log('header : ' + header);
            console.log('response: ' + response);
            console.log('status : '+string);
            console.log('localeString : '+localeString);
            console.log('string : '+string);
            console.log('text : '+text);
            console.log('statusText : '+statusText);

        });


    }

    post(reqData: any, url: string): Observable<Response>{
        let body = JSON.stringify(reqData);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        url = this.beApiService.getUrl(url);

        return this.http.post(url, body, options);
    }

    private handleError(error: any){
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    private exData(resp: Response){
        let body = resp.json();
        console.log('response1 : ' + body);
        console.log('response : ' + JSON.stringify(body));
        return body.data || {};
    }

}