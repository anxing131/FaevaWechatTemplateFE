/**
 * Created by Administrator on 2016/10/10.
 */

import {Component, OnInit} from "@angular/core";
import {Hero} from "../../../../model/hero";
import {Router} from "@angular/router";
import {BeApiService} from "../../../../services/beapi.service";
import {TemplateService} from "../../../../services/template.service";
import setTimeout = core.setTimeout;


@Component({
    moduleId: module.id,
    templateUrl: 'dashboard.html',
    styleUrls: ['dashboard.css'],
})
export class DashboardComponent extends OnInit{
    imgSrc: string = '';
    fields: any = [
        {name: 'anxing', type: 'image'}
    ];

    constructor(
        private router: Router,
        private beApiService: BeApiService,
        private templateService: TemplateService
    ) {
        super();
    }

    ngOnInit(): void{
    }

    test(){
        console.log('test');
        let img = <HTMLElement>document.getElementById('background-content-div');

    }

    addField(field: any){
        console.log('field in : ' + JSON.stringify(field));
    }

}