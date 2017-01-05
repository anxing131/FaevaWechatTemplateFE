/**
 * Created by Administrator on 2016/10/11.
 */


import {Component, Input, OnInit} from "@angular/core";
import {Hero} from "../../../../model/hero";
import {HeroesService} from "../../../../services/heroes.service";
import {Params, ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
@Component({
    moduleId: module.id,
    selector: 'heroes, [heroes]',
    templateUrl: 'heroes.html',
    styleUrls: ['heroes.css']
})
export class HeroesComponent extends OnInit {
    heroes: Hero[];
    selectHero: Hero;
    blurHero: Hero;

    constructor(
        private heroesService: HeroesService,
        private router: Router,
        private location: Location
    ){
        super();
    }

    ngOnInit(){
        this.heroesService.getHeroes().then(heroes =>{
            this.heroes = heroes;
        });
    }

    onSelect(hero:Hero){
        this.selectHero = hero;
    }

    onBlur(hero:Hero){
        this.blurHero = hero;
    }

    viewHeroDetail(): void{
        let link = ['hero-detail', this.selectHero.id];
        this.router.navigate(link);
    }

    delHero(hero: Hero){
        this.heroesService.delHero(hero.id).then(heroes => {this.heroes = heroes;});
    }

}