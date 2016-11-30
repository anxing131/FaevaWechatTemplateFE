/**
 * Created by Administrator on 2016/10/10.
 */
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {RouterModule} from "@angular/router";
import {HeroDetailComponent} from "./components/hero-detail/hero-detail.component";
import {HeroesComponent} from "./components/heroes/heroes.component";
import {UserService} from "../../services/user.service";
let path = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },{
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [UserService]
    },{
        path: 'hero-detail/:id',
        component: HeroDetailComponent},
    {
        path: 'heroes',
        component: HeroesComponent
    }
]

export const router = RouterModule.forRoot(path);