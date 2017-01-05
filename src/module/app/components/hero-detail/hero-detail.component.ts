/**
 * Created by Administrator on 2016/10/11.
 */


import {Component, Input, OnInit} from "@angular/core";
import {Hero} from "../../../../model/hero";
import {HeroesService} from "../../../../services/heroes.service";
import {Params, ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
@Component({
    moduleId: module.id,
    selector: 'hero-detail, [hero-detail]',
    templateUrl: 'hero-detail.html',
    styleUrls: ['hero-detail.css']
})
export class HeroDetailComponent extends OnInit {
    hero: Hero;

    constructor(
        private heroesService: HeroesService,
        private router: ActivatedRoute,
        private location: Location
    ){
        super();
    }

    ngOnInit(){
        this.router.params.forEach((params: Params) => {
            let id = params['id'];
            this.heroesService.getHero(id).then(hero => { this.hero = hero});
        });
    }

    gotoBack(): void{
        this.location.back();
    }

}