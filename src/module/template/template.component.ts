/**
 * Created by Administrator on 2016/10/9.
 */
import { Component, HostListener, ViewEncapsulation} from '@angular/core';
import './rxjs-operators';
import {TemplateService} from "../../services/template.service";

@Component({
    moduleId: module.id,
    selector: 'my-template',
    templateUrl: 'template.html',
    styleUrls: ['template.css'],
    encapsulation: ViewEncapsulation.None
})
export class TemplateComponent {
    constructor(
        private templateService: TemplateService
    ){}

    test(){

    }

    @HostListener('window:storage', ['$event'])
    onStorage(event: StorageEvent){
        switch(event.key){
            case 'templateData':
                let templateData = localStorage.getItem('templateData');
                this.templateService = JSON.parse(templateData);

                break;
            default:
                break;
        }
    }
}
