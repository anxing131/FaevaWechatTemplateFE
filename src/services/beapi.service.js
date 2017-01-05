/**
 * Created by Administrator on 2016/10/10.
 */
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require("@angular/core");
var mock_heroes_1 = require("./mock-heroes");
var http_1 = require("@angular/http");
var user_service_1 = require("./user.service");
var urls = {};
var BeApiService = (function () {
    function BeApiService(http, userService, config) {
        this.http = http;
        this.userService = userService;
        this.config = config;
        this.urls = urls;
        this.beDomain = 'http://192.168.152.128/Heroes/';
        this.heroes = mock_heroes_1.heroes;
    }
    BeApiService.prototype.getUrl = function (url) {
        return this.beDomain + this.urls[url];
    };
    /**
     *  faeva be api common request function
     *
     * @param
     */
    BeApiService.prototype.commonReqByFaeva = function (url, body, headers, successCB, errorCB, completeCB) {
        var _this = this;
        if (headers) {
            if (!headers.has('Content-Type') || headers.get('Content-Type') != 'application/json') {
                headers.append('Content-Type', 'application/json');
            }
        }
        else {
            headers = new http_1.Headers();
            headers.append('Content-Type', 'application/json');
        }
        var options = new http_1.RequestOptions({ headers: headers });
        this.http.post(url, body, options).subscribe(function (resp) {
            var result;
            try {
                result = JSON.parse(JSON.stringify(resp.json()));
            }
            catch (err) {
                var errInfo = {
                    title: 'Can parse to json format',
                    body: resp.text(),
                    errMsg: err,
                    httpStatus: resp.status
                };
                _this.sendEmailToAdmins(errInfo);
                var errorMsg = { code: 500, msg: "result JSON format!" };
                if (!_this.userService.handleCommonAuthApiRespo(errorMsg)) {
                    successCB(result);
                }
                return;
            }
            // console.log('result : ' + JSON.stringify(result));
            if (result.code == 200) {
                return successCB(result);
            }
            else {
                if (!_this.userService.handleCommonAuthApiRespo(result)) {
                    successCB(result);
                }
                return;
            }
        }, function (err) {
            // console.log('err : ' + err);
            if (errorCB) {
                errorCB(err);
            }
        }, function () {
            // console.log('complete : ');
            if (completeCB) {
                completeCB();
            }
        });
    };
    BeApiService.prototype.sendEmailToAdmins = function (content) {
        // console.error(content);
        var url = "http://" + this.config.get('emailSend:host') + ":" + this.config.get('emailSend:port') + "/" + this.config.get('emailSend:url');
        var admintors = this.config.get('admins');
        var to = '';
        admintors.forEach(function (admin, index) {
            if ((index + 1) == admintors.length) {
                to += admin.email;
            }
            else {
                to += admin.email + ', ';
            }
        });
        if (to.length == 0) {
            return;
        }
        var body = JSON.stringify({
            data: {
                to: to,
                subject: content.title,
                text: JSON.stringify(content.errMsg),
                html: JSON.stringify(content.body),
            }
        });
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        var options = new http_1.RequestOptions({ headers: headers });
        this.http.post(url, body, options).subscribe(function (resp) {
            try {
                var result = JSON.stringify(resp.json());
                console.log('result : ' + result);
            }
            catch (err) {
                var errInfo = {
                    title: 'Can parse to json format',
                    body: resp.text(),
                    errMsg: err,
                    httpStatus: resp.status
                };
                console.log('error');
                return;
            }
        }, function (err) {
            console.log('err : ' + err);
        }, function () {
            //console.log('complete : ');
        });
    };
    return BeApiService;
}());
BeApiService = __decorate([
    core_1.Injectable(),
    __param(2, core_1.Inject('config')),
    __metadata("design:paramtypes", [http_1.Http,
        user_service_1.UserService, Object])
], BeApiService);
exports.BeApiService = BeApiService;
//# sourceMappingURL=beapi.service.js.map