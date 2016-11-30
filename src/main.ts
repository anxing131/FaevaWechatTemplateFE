/**
 * Created by Administrator on 2016/10/9.
 */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './module/app/app.module';


const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
