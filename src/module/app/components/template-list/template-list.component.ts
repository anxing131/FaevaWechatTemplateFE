import { User } from './../../../../model/user';
import { UserService } from './../../../../services/user.service';
import { Template } from './../../../../model/template';
import { Http } from '@angular/http';
import { FaevaBeApiService } from './../../../../services/faeva-beapi.service';
import { BeApiService } from './../../../../services/beapi.service';
import { Component } from '@angular/core';
/**
 * Created by Administrator on 2016/10/11.
 */


import {Input, OnInit, ViewChild, TemplateRef} from "@angular/core";
import {Hero} from "../../../../model/hero";
import {HeroesService} from "../../../../services/heroes.service";
import {Params, ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import { WherePipe } from 'angular-pipes/src/array/where.pipe';
// import { FieldsPipe } from './Fields.pipes';

declare var $ : any;

@Component({
    moduleId: module.id,
    selector: 'ax-template-list, [ax-template-list]',
    templateUrl: 'index.html',
    // styleUrls: ['index.css', 'material.css', 'datatable.css']
    styleUrls: ['index.css'],
})
export class TemplateListComponent implements OnInit {
    filterFieldsKey = '';
    globalFilterKey = '';

    searchToggleBEFlag: boolean = false;

    //第一次search flag
    searchToggleBEFirst: boolean = false;

    externalPaging: boolean = false;

    //正在加载数据？loading Article (样式好丑, 目前好像不能自定义样式设计)
    loaddingFlag: boolean = false;
    
    deletingFlag: boolean = false; 

    //每页大小/数量
    pageSize: number = 10;

    //服务端数量 datatable 在使用服务端分页时有一个问题, 就是一定要加载完所有的数据才能显示滑动条
    total: number = 0; 

    rows = [];
    //当前获取的数量
    count: number = 0; //total
    offset: number = 0; //index
    index: number = 1; //服务器index
    limit: number = 10;
    defaultLimit: number = 10;
    templateList = [];
    scrollbarV: boolean = true;
    scrollbarH: boolean = true;

    @ViewChild('editTmpl') editTmpl: TemplateRef<any>;
    @ViewChild('hdrTpl') hdrTpl: TemplateRef<any>;
    @ViewChild('preview') preview: TemplateRef<any>;
    @ViewChild('tags') tags: TemplateRef<any>;

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
    allColumns: any = [
        // {
        //     name:'eventId', 
        //     maxWidth: 200,
        //     checked: false,
        // },
        {
            name:'name',
            checked: true,
        },
        {
            name:'createDate',
            checked: true,
        },
    ];

    selectColumns: any = [];/**/

    //需要进行全table的字段
    filterColumns: any[] = [];

    @ViewChild('datatable') datatable;

    isChecked(field){
        for(let column of this.selectColumns){
            if(column.name == field.name){
                return true;
            }
        }

        return false;
    }

    onFieldSelect(event, field){
        if(event.target.checked){
            //还是原来的数组引用, 可能不符合angular2的数据变更机制, 采用下面这种方式可以
            // this.selectColumns.push({name: field});
            let fieldConfig: any = null;
            for(let fieldSetting of this.allColumns){
                if(fieldSetting.name == field){
                    fieldConfig = fieldSetting;
                    break;
                }
            }
            if(fieldConfig == null){
                fieldConfig = {name: field};
            }
           console.log('fieldConfig', fieldConfig);
            this.selectColumns = [...this.selectColumns, fieldConfig];
        }else{
            console.log('remove field : '+field);
            this.selectColumns = this.selectColumns.filter(c => {
                return c.name != field;
            });

            this.selectColumns = [...this.selectColumns];
        }
    }

    searchToggleBE(event){
        if(!this.searchToggleBEFlag){
            this.globalFilterKey = event.target.value.trim();
            return;
        }
        let keyword: string = event.target.value.trim();
        if(this.globalFilterKey.trim() == keyword){
            return;
        }
    
        this.searchToggleBEFirst = true;
        this.globalFilterKey = keyword;
        this.offset = 0;
        this.index = 0;
        this.fetch();
    }

    updateFilter(event: any){
        let keyword = event.target.value.trim().toLowerCase();
        if(this.searchToggleBEFlag){
            return;
        }

        let newResults =  this.templateList.map((item) => {
            let tempContentXdfdsasdf: string = "";
            let newItem = JSON.parse(JSON.stringify(item));;

            for(let key in newItem){
                tempContentXdfdsasdf += (newItem[key] + ' ');
            }

            newItem.tempContentXdfdsasdf = tempContentXdfdsasdf;
            return newItem;
        });

        newResults = newResults.filter((item) => {
            let flag = (item.tempContentXdfdsasdf.toLowerCase().indexOf(keyword) != -1);
            if(!flag){
                return false;
            }

            return true;
        });

        newResults = newResults.map((item) => {
            delete item.tempContentXdfdsasdf;

            return item;
        });

        this.rows = [...newResults];
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
    }

    constructor(
        private beApiService: BeApiService,
        private faevaBeApiService: FaevaBeApiService,
        private userService: UserService,
        private http: Http,
        private router: Router
    ){
        
    }

    getTemplateList(index: number, limit: number, keyword?: string){
        this.loaddingFlag = true;
        let url = this.faevaBeApiService.getUrl('getAgentProductTemplateList');

        let userId = this.userService.loginUser.id;
        let token = this.userService.loginUser.token;

        let body = {
            ws:{
                platformType: 'Builder',
                userType: 'admin',
                token: token
            },
            data:{
                userId: userId,
                index: index,
                limit: limit,
                keyword: ''
            }
        };

        if(this.searchToggleBEFlag){
            if(this.searchToggleBEFirst){
                    body.data.limit = 20;
            }
            if(this.globalFilterKey != ''){
                body.data.keyword = this.globalFilterKey;
            }else{
                delete body.data.keyword;
            }
        }else{
            delete body.data.keyword;
        }

        // console.log('data : ', body);
        this.beApiService.commonReqByFaeva(url, body, null, (result: any) =>{
            this.loaddingFlag = false;
            if(result.code == 200){
                return this.handleSuccess(result);
            }else{
                console.log('error : ', result);
            }
        });
    }

    handleSuccess(result){
        this.count = result.msg.size;
        let templateList = result.msg.tempList.map((item) => {
            let newItem = {
                _id : item.id,
                name: item.name,
                createDate: item.createDate,
                preview: item.priview,
                qrCodeWidth: item.qrCodeWidth,
                tags: item.tags,
                positionConfig: item.positionConfig
            };

            let createDate = new Date();
            createDate.setTime(item.createDate * 1000);
    
            newItem.createDate = createDate.toLocaleString("en-US", 
                {timeZone: "Asia/Shanghai",timeZoneName: "short"});
            return newItem;
        });
// console.log('templateList : ', templateList);
        if(this.searchToggleBEFlag){
            if(this.searchToggleBEFirst){
                this.templateList = [...templateList];
                this.searchToggleBEFirst = false;
            }else{
                this.templateList = [...this.templateList, ...templateList];
            }
        }else{
            this.templateList = [...this.templateList, ...templateList];
        }
        
        this.rows = [...this.templateList];
        this.offset += Math.floor(templateList.length / this.limit);
        
        // this.offset = 1;
        let tempNum = templateList.length / this.limit;
        if(tempNum < 1 || (Math.floor(tempNum) - 1) == 0){
            this.index += 1;
        }else{
            
             this.index += Math.floor(tempNum) -1 ;
        }
       

        //解决chrome浏览器不支持外部分页时的滚动条问题
        setTimeout(() => {
            this.externalPaging = false;
        }, 50);
        setTimeout(() => {
            this.externalPaging = true;
        }, 100);
    }

    ngOnInit(){
        // this.page(this.offset, this.limit);

        $('.menu .browse')
            .popup({
                inline     : true,
                hoverable  : true,
                position   : 'bottom left',
                delay: {
                    show: 400,
                    hide: 800
                },
                onHidden: (context) => {
                    this.filterFieldsKey = '';
                }
            }) ;

        $('.ui.dropdown')
            .dropdown();

        
        setTimeout(() => {
            this.selectColumns = [
                {
                    name: 'name',
                },{
                    name:'preview', 
                    maxWidth:200,
                    cellTemplate: this.preview,
                },{
                    name:'tags', 
                    maxWidth: 150,
                    cellTemplate: this.tags,
                },{
                    name:'createDate', 
                },{
                    name:'', 
                    maxWidth:200,
                    // frozenRight: true,
                    cellTemplate: this.editTmpl,
                    // headerTemplate: this.hdrTpl,
                },
            
            ];

            this.allColumns.push({
                name:'tags',
                checked: false,
                maxWidth: 150,
                cellTemplate: this.tags,
            });

            this.allColumns = [...this.allColumns];
            this.fetch(1, 20); 
        }, 500);

        let columns = [
            {
                name:'preview', 
                maxWidth: 200,
                cellTemplate: this.preview,
                checked: true
            },
        ];
        this.allColumns = this.allColumns.concat(columns);
    }

    delete(event, row){
        if(this.deletingFlag){
            return;
        }

        this.deletingFlag = true;
        let url = this.faevaBeApiService.getUrl('delAgentProductTemplate');
        let userId = this.userService.loginUser.id;
        let token = this.userService.loginUser.token;
        let body = {
            ws:{
                token: token,
                 platformType: "Builder",
                 userType:"admin",
            },
            data:{
                tempId:row._id,
                userId: userId
            }
        };

        this.beApiService.commonReqByFaeva(url, body, null, (result: any) =>{
            this.deletingFlag = false;
            if(result.code == 200){
                this.templateList = this.templateList.filter((item) => {
                    return row._id != item._id;
                });

                this.count -= 1;
                this.rows = [...this.templateList];
            }else{
                console.log('delete template error : ', result);
            }
        });
    }

    edit(event, row){
        // let link = ['dashboard', row._id];
        let link = ['dashboard', row._id];
        this.router.navigate(link);
    }

    get getFilterFieldsKey(){
        return this.filterFieldsKey;
    }

    filterFields(field: any, ...params: any[]){
        let filterFieldsKey = params[0][0];
        if(filterFieldsKey == ''){
            return true;
        }
        
        let name: string = <string>field.name;
        return name.toLowerCase().indexOf(filterFieldsKey.toLowerCase()) != -1;
    }

    onFilterFieldsKeyChange(event: any){
        this.filterFieldsKey = event.target.value;
        this.allColumns = [...this.allColumns];
    }

    fetch(index?: number, limit ?: number): any{
        index = index || (this.index + 1);
        limit = limit || this.defaultLimit;
        if(this.loaddingFlag) return;

        this.getTemplateList(index, limit);
    }

    scroll(event){
        if(typeof event == 'Object'){
            console.log('scroll event : ' + event);
        }
    }

    test(event){
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
    }

    onPageChange(data){
        
        setTimeout(() => {
            this.externalPaging = false;
        }, 50);
        setTimeout(() => {
            this.externalPaging = true;
        }, 100);
        if(this.loaddingFlag) return;
        if(this.templateList.length >= this.count) return;

        let flag = this.templateList.length % this.pageSize;
        let totalPageSize = 0;
        if(flag == 0){
            totalPageSize = this.templateList.length / this.pageSize;
        }else{
            totalPageSize = <number>(Math.floor(this.templateList.length / this.pageSize) + 1);
        }
// console.log('data.offset : '+ data.offset);
        if((data.offset + 2) == totalPageSize){
            if(this.offset <= <number>(Math.floor(this.count / this.defaultLimit))){
                this.fetch();
            }
        }
    
        // console.log('totalPageSize : ', totalPageSize);
        // console.log('length : ', this.templateList.length);
        // console.log('this.pageSize : ', this.pageSize);
        // console.log('param1e : ', data);
    }

    page(offset, limit) {
        let results = this.templateList;

        // this.fetch((results) => {
            this.count = results.length;

            const start = offset * limit;
            const end = start + limit;
            let rows = [...this.rows];

            for (let i = start; i < end; i++) {
                rows[i] = results[i];
            }

            this.rows = rows;
            this.rows = [...this.rows.slice(0, 20)];
            console.log('Page Results', start, end, rows);
        // });
    }
}