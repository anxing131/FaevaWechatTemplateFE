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
var HeroDetailComponent = (function (_super) {
    __extends(HeroDetailComponent, _super);
    function HeroDetailComponent(heroesService, router, location) {
        _super.call(this);
        this.heroesService = heroesService;
        this.router = router;
        this.location = location;
    }
    HeroDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.router.params.forEach(function (params) {
            var id = params['id'];
            _this.heroesService.getHero(id).then(function (hero) { _this.hero = hero; });
        });
    };
    HeroDetailComponent.prototype.gotoBack = function () {
        this.location.back();
    };
    HeroDetailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'hero-detail',
            templateUrl: 'hero-detail.html',
            styleUrls: ['hero-detail.css']
        }), 
        __metadata('design:paramtypes', [heroes_service_1.HeroesService, router_1.ActivatedRoute, common_1.Location])
    ], HeroDetailComponent);
    return HeroDetailComponent;
}(core_1.OnInit));
exports.HeroDetailComponent = HeroDetailComponent;
//# sourceMappingURL=hero-detail.component.js.map