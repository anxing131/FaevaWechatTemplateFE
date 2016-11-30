"use strict";
/**
 * Created by Administrator on 2016/10/10.
 */
var dashboard_component_1 = require("./components/dashboard/dashboard.component");
var router_1 = require("@angular/router");
var hero_detail_component_1 = require("./components/hero-detail/hero-detail.component");
var heroes_component_1 = require("./components/heroes/heroes.component");
var user_service_1 = require("../../services/user.service");
var path = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    }, {
        path: 'dashboard',
        component: dashboard_component_1.DashboardComponent,
        canActivate: [user_service_1.UserService]
    }, {
        path: 'hero-detail/:id',
        component: hero_detail_component_1.HeroDetailComponent },
    {
        path: 'heroes',
        component: heroes_component_1.HeroesComponent
    }
];
exports.router = router_1.RouterModule.forRoot(path);
//# sourceMappingURL=app.routing.js.map