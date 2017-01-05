/**
 * Created by Administrator on 2016/10/11.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var heroes_service_1 = require("../../../../services/heroes.service");
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var HeroesComponent = (function (_super) {
    __extends(HeroesComponent, _super);
    function HeroesComponent(heroesService, router, location) {
        var _this = _super.call(this) || this;
        _this.heroesService = heroesService;
        _this.router = router;
        _this.location = location;
        return _this;
    }
    HeroesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.heroesService.getHeroes().then(function (heroes) {
            _this.heroes = heroes;
        });
    };
    HeroesComponent.prototype.onSelect = function (hero) {
        this.selectHero = hero;
    };
    HeroesComponent.prototype.onBlur = function (hero) {
        this.blurHero = hero;
    };
    HeroesComponent.prototype.viewHeroDetail = function () {
        var link = ['hero-detail', this.selectHero.id];
        this.router.navigate(link);
    };
    HeroesComponent.prototype.delHero = function (hero) {
        var _this = this;
        this.heroesService.delHero(hero.id).then(function (heroes) { _this.heroes = heroes; });
    };
    return HeroesComponent;
}(core_1.OnInit));
HeroesComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'heroes, [heroes]',
        templateUrl: 'heroes.html',
        styleUrls: ['heroes.css']
    }),
    __metadata("design:paramtypes", [heroes_service_1.HeroesService,
        router_1.Router,
        common_1.Location])
], HeroesComponent);
exports.HeroesComponent = HeroesComponent;
//# sourceMappingURL=heroes.component.js.map