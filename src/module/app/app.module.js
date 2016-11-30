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
/**
 * Created by Administrator on 2016/10/9.
 */
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var app_component_1 = require('./app.component');
var app_routing_1 = require("./app.routing");
var dashboard_component_1 = require("./components/dashboard/dashboard.component");
var heroes_service_1 = require("../../services/heroes.service");
var hero_detail_component_1 = require("./components/hero-detail/hero-detail.component");
var forms_1 = require("@angular/forms");
var heroes_component_1 = require("./components/heroes/heroes.component");
var hero_create_component_1 = require("./components/hero-create/hero-create.component");
var beapi_service_1 = require("../../services/beapi.service");
var http_1 = require("@angular/http");
var template_module_1 = require("../template/template.module");
var template_service_1 = require("../../services/template.service");
var setting_component_1 = require("./components/setting/setting.component");
var right_side_component_1 = require("./components/right-side/right-side.component");
var background_component_1 = require("./components/background/background.component");
var element_component_1 = require("./components/background/element.component");
var element_border_component_1 = require("./components/background/element-border.component");
var border_component_1 = require("./border.component");
var border2_component_1 = require("./border2.component");
var border_dimmer_component_1 = require("./dimmer/border-dimmer/border-dimmer.component");
var test_component_1 = require("./components/test/test.component");
var user_service_1 = require("../../services/user.service");
var login_dimmer_component_1 = require("./dimmer/login/login-dimmer.component");
var faeva_beapi_service_1 = require("../../services/faeva-beapi.service");
var configure_service_1 = require("../../services/configure.service");
var login_error_dimmer_component_1 = require("./dimmer/login/login-error-dimmer.component");
var internal_error_dimmer_component_1 = require("./dimmer/internal-error-dimmer/internal-error-dimmer.component");
var test_directive_1 = require("./test-directive");
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [template_module_1.TemplateModule, platform_browser_1.BrowserModule, app_routing_1.router, forms_1.FormsModule, http_1.HttpModule, http_1.JsonpModule],
            providers: [
                heroes_service_1.HeroesService,
                beapi_service_1.BeApiService,
                user_service_1.UserService,
                template_service_1.TemplateService,
                faeva_beapi_service_1.FaevaBeApiService,
                { provide: 'config', useClass: configure_service_1.ConfigureService }
            ],
            declarations: [
                app_component_1.AppComponent,
                dashboard_component_1.DashboardComponent,
                hero_detail_component_1.HeroDetailComponent,
                heroes_component_1.HeroesComponent,
                hero_create_component_1.HeroCreateComponent,
                right_side_component_1.RightSideComponent,
                setting_component_1.SettingComponent,
                element_component_1.ElementComponent,
                element_border_component_1.ElementBorderComponent,
                border_component_1.BorderComponent,
                border2_component_1.Border2Component,
                border_dimmer_component_1.BorderDimmerComponent,
                test_component_1.TestComponent,
                login_dimmer_component_1.LoginDimmerComponent,
                login_error_dimmer_component_1.LoginErrorDimmerComponent,
                internal_error_dimmer_component_1.InternalErrorDimmerComponent,
                background_component_1.BackgroundComponent,
                test_directive_1.InitDir
            ],
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map