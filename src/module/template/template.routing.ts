/**
 * Created by Administrator on 2016/10/10.
 */
import {RouterModule, Routes} from "@angular/router";
import {TemplateComponent} from "./template.component";
let path :Routes = [
    {
        path: 'template',
        component: TemplateComponent
    }
];

export const router = RouterModule.forChild(path);