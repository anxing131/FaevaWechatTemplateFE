import {Component, EventEmitter, Output} from '@angular/core';
import {Hero} from "../../../../model/hero";
import {HeroesService} from "../../../../services/heroes.service";

@Component({
    moduleId:  module.id,
    selector: 'hero-create-form, [hero-create-form]',
    templateUrl: 'hero-create.html',
    styleUrls: ['hero-create.css']
})
export class HeroCreateComponent {
    powers = ['Really Smart', 'Super Flexible', 'Weather Changer'];
    hero = new Hero();
    submitted = false;
    @Output() cancelEvent = new EventEmitter<boolean>();

    constructor(private heroService: HeroesService){

    }

    addHero() {
        this.hero = new Hero();
    }
    onSubmit(){
        this.heroService.addHero(this.hero);
        this.cancel();
    }


    cancel(){
        this.cancelEvent.emit(false);
    }
}
