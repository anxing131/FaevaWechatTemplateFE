/**
 * Created by Administrator on 2016/10/10.
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var mock_heroes_1 = require('./mock-heroes');
var http_1 = require("@angular/http");
var beapi_service_1 = require("./beapi.service");
var Rx_1 = require("rxjs/Rx");
var HeroesService = (function () {
    function HeroesService(http, beApiService, jsonp) {
        this.http = http;
        this.beApiService = beApiService;
        this.jsonp = jsonp;
        this.heroes = mock_heroes_1.heroes;
    }
    HeroesService.prototype.getHeroes = function (index, limit) {
        if (index === void 0) { index = 1; }
        if (limit === void 0) { limit = 20; }
        return Promise.resolve(this.heroes);
    };
    HeroesService.prototype.getHero = function (id) {
        return this.getHeroes().then(function (heroes) {
            return heroes.find(function (hero) { return hero.id === id; });
        });
    };
    HeroesService.prototype.delHero = function (id) {
        var _this = this;
        return this.getHeroes().then(function (heroes) {
            var tempHeroes = heroes.filter(function (hero) { return hero.id !== id; });
            _this.heroes = tempHeroes;
            return tempHeroes;
        });
    };
    HeroesService.prototype.addHero = function (hero) {
        delete (hero.id);
        var reqData = {
            'ws': {},
            'data': {
                'heroes': [{
                        'name': hero.name
                    }]
            }
        };
        var body = JSON.stringify(reqData);
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        var options = new http_1.RequestOptions({ headers: headers });
        var url = this.beApiService.getUrl('addHeroes');
        this.heroes.push(hero);
        // this.http.post(url, body, options).subscribe((resp: Response) => {
        //     let result = resp.json();
        //     console.log('result : ' + JSON.stringify(result));
        // });
        this.http.post(url, body, options).subscribe(function (resp) {
            // let result = resp.json();
            console.log('result text: ' + JSON.stringify(resp.json()));
        });
    };
    HeroesService.prototype.getHeroesBeRemote = function (index, limit) {
        if (index === void 0) { index = 1; }
        if (limit === void 0) { limit = 20; }
        var reqData = {
            'ws': {},
            'data': {
                'conditions': {}
            }
        };
        this.post(reqData, 'searchHeroes').subscribe(function (resp) {
            console.log('ok');
            var status = resp.status;
            var localeString = resp.toLocaleString();
            var string = resp.toString();
            var text = resp.text();
            var statusText = resp.statusText;
            var response = JSON.stringify(resp);
            var header = JSON.stringify(resp.headers);
            console.log('header : ' + header);
            console.log('response: ' + response);
            console.log('status : ' + string);
            console.log('localeString : ' + localeString);
            console.log('string : ' + string);
            console.log('text : ' + text);
            console.log('statusText : ' + statusText);
            // let result = resp.json();
            // let heroes: Hero[] = result.msg.heroes;
        }, function (resp) {
            var status = resp.status;
            var localeString = resp.toLocaleString();
            var string = resp.toString();
            var text = resp.text();
            var statusText = resp.statusText;
            var response = JSON.stringify(resp);
            var header = JSON.stringify(resp.headers);
            var type = resp.type;
            console.log('type : ' + type);
            console.log('header : ' + header);
            console.log('response: ' + response);
            console.log('status : ' + string);
            console.log('localeString : ' + localeString);
            console.log('string : ' + string);
            console.log('text : ' + text);
            console.log('statusText : ' + statusText);
        });
    };
    HeroesService.prototype.post = function (reqData, url) {
        var body = JSON.stringify(reqData);
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        var options = new http_1.RequestOptions({ headers: headers });
        url = this.beApiService.getUrl(url);
        return this.http.post(url, body, options);
    };
    HeroesService.prototype.handleError = function (error) {
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console instead
        return Rx_1.Observable.throw(errMsg);
    };
    HeroesService.prototype.exData = function (resp) {
        var body = resp.json();
        console.log('response1 : ' + body);
        console.log('response : ' + JSON.stringify(body));
        return body.data || {};
    };
    HeroesService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, beapi_service_1.BeApiService, http_1.Jsonp])
    ], HeroesService);
    return HeroesService;
}());
exports.HeroesService = HeroesService;
//# sourceMappingURL=heroes.service.js.map