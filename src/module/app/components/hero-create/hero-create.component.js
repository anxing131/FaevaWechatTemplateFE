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
var core_1 = require('@angular/core');
var hero_1 = require("../../../../model/hero");
var heroes_service_1 = require("../../../../services/heroes.service");
var HeroCreateComponent = (function () {
    function HeroCreateComponent(heroService) {
        this.heroService = heroService;
        this.powers = ['Really Smart', 'Super Flexible', 'Weather Changer'];
        this.hero = new hero_1.Hero();
        this.submitted = false;
        this.cancelEvent = new core_1.EventEmitter();
    }
    HeroCreateComponent.prototype.addHero = function () {
        this.hero = new hero_1.Hero();
    };
    HeroCreateComponent.prototype.onSubmit = function () {
        this.heroService.addHero(this.hero);
        this.cancel();
    };
    HeroCreateComponent.prototype.cancel = function () {
        this.cancelEvent.emit(false);
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], HeroCreateComponent.prototype, "cancelEvent", void 0);
    HeroCreateComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'hero-create-form',
            templateUrl: 'hero-create.html',
            styleUrls: ['hero-create.css']
        }), 
        __metadata('design:paramtypes', [heroes_service_1.HeroesService])
    ], HeroCreateComponent);
    return HeroCreateComponent;
}());
exports.HeroCreateComponent = HeroCreateComponent;
//# sourceMappingURL=hero-create.component.js.map