/**
 *  用户授权检测
 *
 * Created by Administrator on 2016/11/28.
 */

import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {

    // constructor(private authService: AuthService) {}

    canActivate() {
        return  true;
    }
}