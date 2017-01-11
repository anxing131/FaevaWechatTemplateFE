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
var user_service_1 = require("./../../../../services/user.service");
var http_1 = require("@angular/http");
var faeva_beapi_service_1 = require("./../../../../services/faeva-beapi.service");
var beapi_service_1 = require("./../../../../services/beapi.service");
var core_1 = require("@angular/core");
/**
 * Created by Administrator on 2016/10/11.
 */
var core_2 = require("@angular/core");
var router_1 = require("@angular/router");
var TemplateListComponent = (function () {
    function TemplateListComponent(beApiService, faevaBeApiService, userService, http, router) {
        this.beApiService = beApiService;
        this.faevaBeApiService = faevaBeApiService;
        this.userService = userService;
        this.http = http;
        this.router = router;
        this.filterFieldsKey = '';
        this.globalFilterKey = '';
        this.searchToggleBEFlag = false;
        //第一次search flag
        this.searchToggleBEFirst = false;
        this.externalPaging = false;
        //正在加载数据？loading Article (样式好丑, 目前好像不能自定义样式设计)
        this.loaddingFlag = false;
        this.deletingFlag = false;
        //每页大小/数量
        this.pageSize = 10;
        //服务端数量 datatable 在使用服务端分页时有一个问题, 就是一定要加载完所有的数据才能显示滑动条
        this.total = 0;
        this.rows = [];
        //当前获取的数量
        this.count = 0; //total
        this.offset = 0; //index
        this.index = 1; //服务器index
        this.limit = 10;
        this.defaultLimit = 10;
        this.templateList = [];
        this.scrollbarV = true;
        this.scrollbarH = true;
        /*
            templateList = [
                {
                    "name": "Anthony Joyner",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "中文",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "Anthony Joyner",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "Anthony Joyner",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "Anthony Joyner",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "Anthony Joyner",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "Anthony Joyner",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "Anthony Joyner",
                    "gender": "male",
                    "company": "Senmei"
                }, {
                    "name": "Anthony Joyner",
                    "gender": "male",
                    "company": "Senmei"
                },
                {
                    "name": "Garrett Brennan",
                    "gender": "male",
                    "company": "Bluegrain"
                },
                {
                    "name": "Betsy Horton",
                    "gender": "female",
                    "company": "Zilla"
                },
                {
                    "name": "Patton Small",
                    "gender": "male",
                    "company": "Genmex"
                },
                {
                    "name": "Lakisha Huber",
                    "gender": "female",
                    "company": "Insource"
                },
                {
                    "name": "Lindsay Avery",
                    "gender": "female",
                    "company": "Unq"
                },
                {
                    "name": "Ayers Hood",
                    "gender": "male",
                    "company": "Accuprint"
                },
                {
                    "name": "Torres Durham",
                    "gender": "male",
                    "company": "Uplinx"
                },
                {
                    "name": "Vincent Hernandez",
                    "gender": "male",
                    "company": "Talendula"
                },
                {
                    "name": "Baird Ryan",
                    "gender": "male",
                    "company": "Aquasseur"
                },
                {
                    "name": "Georgia Mercer",
                    "gender": "female",
                    "company": "Skyplex"
                },
                {
                    "name": "Francesca Elliott",
                    "gender": "female",
                    "company": "Nspire"
                },
                {
                    "name": "Lyons Peters",
                    "gender": "male",
                    "company": "Quinex"
                },
                {
                    "name": "Kristi Brewer",
                    "gender": "female",
                    "company": "Oronoko"
                },
                {
                    "name": "Tonya Bray",
                    "gender": "female",
                    "company": "Insuron"
                },
                {
                    "name": "Valenzuela Huff",
                    "gender": "male",
                    "company": "Applideck"
                },
                {
                    "name": "Tiffany Anderson",
                    "gender": "female",
                    "company": "Zanymax"
                },
                {
                    "name": "Jerri King",
                    "gender": "female",
                    "company": "Eventex"
                },
                {
                    "name": "Rocha Meadows",
                    "gender": "male",
                    "company": "Goko"
                },
                {
                    "name": "Marcy Green",
                    "gender": "female",
                    "company": "Pharmex"
                },
                {
                    "name": "Kirk Cross",
                    "gender": "male",
                    "company": "Portico"
                },
                {
                    "name": "Hattie Mullen",
                    "gender": "female",
                    "company": "Zilencio"
                },
                {
                    "name": "Deann Bridges",
                    "gender": "female",
                    "company": "Equitox"
                },
                {
                    "name": "Chaney Roach",
                    "gender": "male",
                    "company": "Qualitern"
                },
                {
                    "name": "Consuelo Dickson",
                    "gender": "female",
                    "company": "Poshome"
                },
                {
                    "name": "Billie Rowe",
                    "gender": "female",
                    "company": "Cemention"
                },
                {
                    "name": "Bean Donovan",
                    "gender": "male",
                    "company": "Mantro"
                },
                {
                    "name": "Lancaster Patel",
                    "gender": "male",
                    "company": "Krog"
                },
                {
                    "name": "Rosa Dyer",
                    "gender": "female",
                    "company": "Netility"
                },
                {
                    "name": "Christine Compton",
                    "gender": "female",
                    "company": "Bleeko"
                },
                {
                    "name": "Milagros Finch",
                    "gender": "female",
                    "company": "Handshake"
                },
                {
                    "name": "Ericka Alvarado",
                    "gender": "female",
                    "company": "Lyrichord"
                },
                {
                    "name": "Sylvia Sosa",
                    "gender": "female",
                    "company": "Circum"
                },
                {
                    "name": "Humphrey Curtis",
                    "gender": "male",
                    "company": "Corepan"
                }
            ];
        /**/
        this.allColumns = [
            // {
            //     name:'eventId', 
            //     maxWidth: 200,
            //     checked: false,
            // },
            {
                name: 'name',
                checked: true,
            },
            {
                name: 'createDate',
                checked: true,
            },
        ];
        this.selectColumns = []; /**/
        //需要进行全table的字段
        this.filterColumns = [];
    }
    TemplateListComponent.prototype.isChecked = function (field) {
        for (var _i = 0, _a = this.selectColumns; _i < _a.length; _i++) {
            var column = _a[_i];
            if (column.name == field.name) {
                return true;
            }
        }
        return false;
    };
    TemplateListComponent.prototype.onFieldSelect = function (event, field) {
        if (event.target.checked) {
            //还是原来的数组引用, 可能不符合angular2的数据变更机制, 采用下面这种方式可以
            // this.selectColumns.push({name: field});
            var fieldConfig = null;
            for (var _i = 0, _a = this.allColumns; _i < _a.length; _i++) {
                var fieldSetting = _a[_i];
                if (fieldSetting.name == field) {
                    fieldConfig = fieldSetting;
                    break;
                }
            }
            if (fieldConfig == null) {
                fieldConfig = { name: field };
            }
            console.log('fieldConfig', fieldConfig);
            this.selectColumns = this.selectColumns.concat([fieldConfig]);
        }
        else {
            console.log('remove field : ' + field);
            this.selectColumns = this.selectColumns.filter(function (c) {
                return c.name != field;
            });
            this.selectColumns = this.selectColumns.slice();
        }
    };
    TemplateListComponent.prototype.searchToggleBE = function (event) {
        if (!this.searchToggleBEFlag) {
            this.globalFilterKey = event.target.value.trim();
            return;
        }
        var keyword = event.target.value.trim();
        if (this.globalFilterKey.trim() == keyword) {
            return;
        }
        this.searchToggleBEFirst = true;
        this.globalFilterKey = keyword;
        this.offset = 0;
        this.index = 0;
        this.fetch();
    };
    TemplateListComponent.prototype.updateFilter = function (event) {
        var keyword = event.target.value.trim().toLowerCase();
        if (this.searchToggleBEFlag) {
            return;
        }
        var newResults = this.templateList.map(function (item) {
            var tempContentXdfdsasdf = "";
            var newItem = JSON.parse(JSON.stringify(item));
            ;
            for (var key in newItem) {
                tempContentXdfdsasdf += (newItem[key] + ' ');
            }
            newItem.tempContentXdfdsasdf = tempContentXdfdsasdf;
            return newItem;
        });
        newResults = newResults.filter(function (item) {
            var flag = (item.tempContentXdfdsasdf.toLowerCase().indexOf(keyword) != -1);
            if (!flag) {
                return false;
            }
            return true;
        });
        newResults = newResults.map(function (item) {
            delete item.tempContentXdfdsasdf;
            return item;
        });
        this.rows = newResults.slice();
        this.count = newResults.length;
        //lunr 不支持中文分词, 网上有大神改建的是依赖nodejs服务端来实现的, 不做服务端, 使用index方式
        /*
        let lunrIntance = lunr(function () {
            this.field('name', {boost: 10});
            this.ref('name');
        });

        this.results.forEach(((lunrIntance) => {
            return (item) => {
                lunrIntance.add(item);
            }
        })(lunrIntance));
        
        let result = lunrIntance.search(keyword);
        */
    };
    TemplateListComponent.prototype.getTemplateList = function (index, limit, keyword) {
        var _this = this;
        this.loaddingFlag = true;
        var url = this.faevaBeApiService.getUrl('getAgentProductTemplateList');
        var userId = this.userService.loginUser.id;
        var token = this.userService.loginUser.token;
        var body = {
            ws: {
                platformType: 'Builder',
                userType: 'admin',
                token: token
            },
            data: {
                userId: userId,
                index: index,
                limit: limit,
                keyword: ''
            }
        };
        if (this.searchToggleBEFlag) {
            if (this.searchToggleBEFirst) {
                body.data.limit = 20;
            }
            if (this.globalFilterKey != '') {
                body.data.keyword = this.globalFilterKey;
            }
            else {
                delete body.data.keyword;
            }
        }
        else {
            delete body.data.keyword;
        }
        // console.log('data : ', body);
        this.beApiService.commonReqByFaeva(url, body, null, function (result) {
            _this.loaddingFlag = false;
            if (result.code == 200) {
                return _this.handleSuccess(result);
            }
            else {
                console.log('error : ', result);
            }
        });
    };
    TemplateListComponent.prototype.handleSuccess = function (result) {
        var _this = this;
        this.count = result.msg.size;
        var templateList = result.msg.tempList.map(function (item) {
            var newItem = {
                _id: item.id,
                name: item.name,
                createDate: item.createDate,
                preview: item.priview,
                qrCodeWidth: item.qrCodeWidth,
                tags: item.tags,
                positionConfig: item.positionConfig
            };
            var createDate = new Date();
            createDate.setTime(item.createDate * 1000);
            newItem.createDate = createDate.toLocaleString("en-US", { timeZone: "Asia/Shanghai", timeZoneName: "short" });
            return newItem;
        });
        // console.log('templateList : ', templateList);
        if (this.searchToggleBEFlag) {
            if (this.searchToggleBEFirst) {
                this.templateList = templateList.slice();
                this.searchToggleBEFirst = false;
            }
            else {
                this.templateList = this.templateList.concat(templateList);
            }
        }
        else {
            this.templateList = this.templateList.concat(templateList);
        }
        this.rows = this.templateList.slice();
        this.offset += Math.floor(templateList.length / this.limit);
        // this.offset = 1;
        var tempNum = templateList.length / this.limit;
        if (tempNum < 1 || (Math.floor(tempNum) - 1) == 0) {
            this.index += 1;
        }
        else {
            this.index += Math.floor(tempNum) - 1;
        }
        //解决chrome浏览器不支持外部分页时的滚动条问题
        setTimeout(function () {
            _this.externalPaging = false;
        }, 50);
        setTimeout(function () {
            _this.externalPaging = true;
        }, 100);
    };
    TemplateListComponent.prototype.ngOnInit = function () {
        // this.page(this.offset, this.limit);
        var _this = this;
        $('.menu .browse')
            .popup({
            inline: true,
            hoverable: true,
            position: 'bottom left',
            delay: {
                show: 400,
                hide: 800
            },
            onHidden: function (context) {
                _this.filterFieldsKey = '';
            }
        });
        $('.ui.dropdown')
            .dropdown();
        setTimeout(function () {
            _this.selectColumns = [
                {
                    name: 'name',
                }, {
                    name: 'preview',
                    maxWidth: 200,
                    cellTemplate: _this.preview,
                }, {
                    name: 'tags',
                    maxWidth: 150,
                    cellTemplate: _this.tags,
                }, {
                    name: 'createDate',
                }, {
                    name: '',
                    maxWidth: 200,
                    // frozenRight: true,
                    cellTemplate: _this.editTmpl,
                },
            ];
            _this.allColumns.push({
                name: 'tags',
                checked: false,
                maxWidth: 150,
                cellTemplate: _this.tags,
            });
            _this.allColumns = _this.allColumns.slice();
            _this.fetch(1, 20);
        }, 500);
        var columns = [
            {
                name: 'preview',
                maxWidth: 200,
                cellTemplate: this.preview,
                checked: true
            },
        ];
        this.allColumns = this.allColumns.concat(columns);
    };
    TemplateListComponent.prototype.delete = function (event, row) {
        var _this = this;
        if (this.deletingFlag) {
            return;
        }
        this.deletingFlag = true;
        var url = this.faevaBeApiService.getUrl('delAgentProductTemplate');
        var userId = this.userService.loginUser.id;
        var token = this.userService.loginUser.token;
        var body = {
            ws: {
                token: token,
                platformType: "Builder",
                userType: "admin",
            },
            data: {
                tempId: row._id,
                userId: userId
            }
        };
        this.beApiService.commonReqByFaeva(url, body, null, function (result) {
            _this.deletingFlag = false;
            if (result.code == 200) {
                _this.templateList = _this.templateList.filter(function (item) {
                    return row._id != item._id;
                });
                _this.count -= 1;
                _this.rows = _this.templateList.slice();
            }
            else {
                console.log('delete template error : ', result);
            }
        });
    };
    TemplateListComponent.prototype.edit = function (event, row) {
        // let link = ['dashboard', row._id];
        var link = ['dashboard', row._id];
        this.router.navigate(link);
    };
    Object.defineProperty(TemplateListComponent.prototype, "getFilterFieldsKey", {
        get: function () {
            return this.filterFieldsKey;
        },
        enumerable: true,
        configurable: true
    });
    TemplateListComponent.prototype.filterFields = function (field) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var filterFieldsKey = params[0][0];
        if (filterFieldsKey == '') {
            return true;
        }
        var name = field.name;
        return name.toLowerCase().indexOf(filterFieldsKey.toLowerCase()) != -1;
    };
    TemplateListComponent.prototype.onFilterFieldsKeyChange = function (event) {
        this.filterFieldsKey = event.target.value;
        this.allColumns = this.allColumns.slice();
    };
    TemplateListComponent.prototype.fetch = function (index, limit) {
        index = index || (this.index + 1);
        limit = limit || this.defaultLimit;
        if (this.loaddingFlag)
            return;
        this.getTemplateList(index, limit);
    };
    TemplateListComponent.prototype.scroll = function (event) {
        if (typeof event == 'Object') {
            console.log('scroll event : ' + event);
        }
    };
    TemplateListComponent.prototype.test = function (event) {
        // this.getTemplateList(2, 20);
        // this.count = 1000;
        // this.rows = [...this.templateList];
        // this.scrollbarV = !this.scrollbarV;
        // this.scrollbarH = !this.scrollbarH;
        console.log('preview : ', this.preview);
        console.log('this.rows.length : ' + this.rows.length);
        console.log('count : ', this.count);
        console.log('this.index : ' + this.index);
        console.log('loginUser : ', this.userService.loginUser);
        // this.externalPaging = true;
        // console.log('rows : ', this.rows);
    };
    TemplateListComponent.prototype.onPageChange = function (data) {
        var _this = this;
        setTimeout(function () {
            _this.externalPaging = false;
        }, 50);
        setTimeout(function () {
            _this.externalPaging = true;
        }, 100);
        if (this.loaddingFlag)
            return;
        if (this.templateList.length >= this.count)
            return;
        var flag = this.templateList.length % this.pageSize;
        var totalPageSize = 0;
        if (flag == 0) {
            totalPageSize = this.templateList.length / this.pageSize;
        }
        else {
            totalPageSize = (Math.floor(this.templateList.length / this.pageSize) + 1);
        }
        // console.log('data.offset : '+ data.offset);
        if ((data.offset + 2) == totalPageSize) {
            if (this.offset <= (Math.floor(this.count / this.defaultLimit))) {
                this.fetch();
            }
        }
        // console.log('totalPageSize : ', totalPageSize);
        // console.log('length : ', this.templateList.length);
        // console.log('this.pageSize : ', this.pageSize);
        // console.log('param1e : ', data);
    };
    TemplateListComponent.prototype.page = function (offset, limit) {
        var results = this.templateList;
        // this.fetch((results) => {
        this.count = results.length;
        var start = offset * limit;
        var end = start + limit;
        var rows = this.rows.slice();
        for (var i = start; i < end; i++) {
            rows[i] = results[i];
        }
        this.rows = rows;
        this.rows = this.rows.slice(0, 20).slice();
        console.log('Page Results', start, end, rows);
        // });
    };
    return TemplateListComponent;
}());
__decorate([
    core_2.ViewChild('editTmpl'),
    __metadata("design:type", core_2.TemplateRef)
], TemplateListComponent.prototype, "editTmpl", void 0);
__decorate([
    core_2.ViewChild('hdrTpl'),
    __metadata("design:type", core_2.TemplateRef)
], TemplateListComponent.prototype, "hdrTpl", void 0);
__decorate([
    core_2.ViewChild('preview'),
    __metadata("design:type", core_2.TemplateRef)
], TemplateListComponent.prototype, "preview", void 0);
__decorate([
    core_2.ViewChild('tags'),
    __metadata("design:type", core_2.TemplateRef)
], TemplateListComponent.prototype, "tags", void 0);
__decorate([
    core_2.ViewChild('datatable'),
    __metadata("design:type", Object)
], TemplateListComponent.prototype, "datatable", void 0);
TemplateListComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'ax-template-list, [ax-template-list]',
        templateUrl: 'index.html',
        // styleUrls: ['index.css', 'material.css', 'datatable.css']
        styleUrls: ['index.css'],
    }),
    __metadata("design:paramtypes", [beapi_service_1.BeApiService,
        faeva_beapi_service_1.FaevaBeApiService,
        user_service_1.UserService,
        http_1.Http,
        router_1.Router])
], TemplateListComponent);
exports.TemplateListComponent = TemplateListComponent;
//# sourceMappingURL=template-list.component.js.map