
/**
 * Created by Administrator on 2016/10/9.
 */
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {router} from "./template.routing";
import {FormsModule} from "@angular/forms";
import {HttpModule, JsonpModule} from "@angular/http";
import {TemplateComponent} from "./template.component";

@NgModule({
    imports:[BrowserModule,FormsModule, HttpModule,  router],
    declarations: [
        TemplateComponent,
    ],
    exports:[TemplateComponent]
})
export class TemplateModule { }
