
/**
 * Created by Administrator on 2016/10/9.
 */
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import {router} from "./app.routing";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {HeroesService} from "../../services/heroes.service";
import {HeroDetailComponent} from "./components/hero-detail/hero-detail.component";
import {FormsModule} from "@angular/forms";
import {HeroesComponent} from "./components/heroes/heroes.component";
import {HeroCreateComponent} from "./components/hero-create/hero-create.component";
import {BeApiService} from "../../services/beapi.service";
import {HttpModule, JsonpModule} from "@angular/http";
import {TemplateModule} from "../template/template.module";
import {TemplateService} from "../../services/template.service";
import {SettingComponent} from "./components/setting/setting.component";
import {RightSideComponent} from "./components/right-side/right-side.component";
import {BackgroundComponent} from "./components/background/background.component";
import {ElementComponent} from "./components/background/element.component";
import {ElementBorderComponent} from "./components/background/element-border.component";
import {BorderComponent} from "./border.component";
import {Border2Component} from "./border2.component";
import {BorderDimmerComponent} from "./dimmer/border-dimmer/border-dimmer.component";
import {TestComponent} from "./components/test/test.component";
import {UserService} from "../../services/user.service";
import {LoginDimmerComponent} from "./dimmer/login/login-dimmer.component";
import {FaevaBeApiService} from "../../services/faeva-beapi.service";
import {ConfigureService} from "../../services/configure.service";
import {LoginErrorDimmerComponent} from "./dimmer/login/login-error-dimmer.component";
import {InternalErrorDimmerComponent} from "./dimmer/internal-error-dimmer/internal-error-dimmer.component";
import {InitDir} from "./test-directive";

@NgModule({
    imports:      [ TemplateModule, BrowserModule, router, FormsModule, HttpModule, JsonpModule],
    providers:[
        HeroesService,
        BeApiService,
        UserService,
        TemplateService,
        FaevaBeApiService,
        {provide:'config', useClass: ConfigureService}
    ],
    declarations: [
        AppComponent,
        DashboardComponent,
        HeroDetailComponent,
        HeroesComponent,
        HeroCreateComponent,
        RightSideComponent,
        SettingComponent,
        ElementComponent,
        ElementBorderComponent,
        BorderComponent,
        Border2Component,
        BorderDimmerComponent,
        TestComponent,
        LoginDimmerComponent,
        LoginErrorDimmerComponent,
        InternalErrorDimmerComponent,
        BackgroundComponent,
        InitDir
    ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
