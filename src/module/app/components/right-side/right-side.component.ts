/**
 * Created by Administrator on 2016/10/26.
 */
import {
    Component, OnInit, trigger,
    state,
    style,
    transition,
    animate,
    Renderer, EventEmitter, Output
} from '@angular/core';
import {ViewChild} from "@angular/core";
import {Template} from "../../../../model/template";
import {Template2} from "../../../../model/template2";
import {TemplateService} from "../../../../services/template.service";

declare var $ : any;

@Component({
    moduleId: module.id,
    selector: 'ax-right-side',
    templateUrl: 'index.html',
    styleUrls: ['style.css'],
})
export class RightSideComponent extends OnInit{
    addCustomFieldFlag:boolean = false;
    addCustomFieldError:any = false;
    @Output() fieldSelect: EventEmitter<any> = new EventEmitter();

    itemList:any = [
        {value:"QrCode", icon:"image"},
        {value:"ProductImg", icon:"image"},
        {value:"ProductName", icon:"content"},
    ];

    @ViewChild('backgroundInput')
    backgroundInput;

    constructor(
        private renderer: Renderer,
        private templateService: TemplateService
    ){
        super();
    }

    ngOnInit(){
    }

    onFieldSelect(field: any){
        this.fieldSelect.emit(field);
    }

    imgChange(){
        let img = <HTMLImageElement>document.getElementById('temp-bg-img2');

        this.templateService.width = img.naturalWidth + '';
        this.templateService.height = img.naturalHeight + '';
        this.templateService.bg = img.src;
        console.log('width : ' + img.naturalWidth);
        console.log('height : ' + img.naturalHeight);
        localStorage.setItem('templateData', JSON.stringify(this.templateService));
        img.src = '';
        this.renderer.setElementStyle(img, 'display', 'none');
    }

    fileChangeEvent(fileInput: any) {
        if (fileInput.target.files && fileInput.target.files[0]) {
            var preview = document.getElementById('preview');
            var files = fileInput.target.files;
            var file = files[0];
            var imageType = /^image\//;

            if (!imageType.test(file.type)) {
                return;
            }

            // var img = document.createElement("img");
            // img.classList.add("obj");
            // img.id = 'temp-bg-img';
            // img.width = 0.001;
            // img.height = 0.001;
            // img.onclick(this.cl)
            // preview.appendChild(img); // Assuming that "preview" is the div output where the content will be displayed.
            let img = <HTMLImageElement>document.getElementById('temp-bg-img2');

            var reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                };
            })(img);

            reader.addEventListener('load', function (obj: any) {
                let img = document.getElementById('temp-bg-img2');
                img.click();
            });

            reader.readAsDataURL(file);
        }
    }

    onDblclick(type:string){
        switch (type){
            case '+customField' :
                this.addCustomFieldFlag = !this.addCustomFieldFlag;
                break;
            case 'onChangeBackground':
                let ele  = <HTMLElement>this.backgroundInput.nativeElement;
                ele.click();
                break;

            default:
                    break;
        }
    }

    onAddFieldInputKeyPress(nameEle: HTMLInputElement, typeEle: HTMLSelectElement, event:KeyboardEvent){
        if(event.keyCode == 13){
            this.addField(nameEle, typeEle, event);
        }
    }

    clearInputBorderWarnning(nameEle: HTMLInputElement,){
        this.renderer.setElementStyle(nameEle, 'border-color', '');
    }

    addField(nameEle: HTMLInputElement, typeEle: HTMLSelectElement, $event:KeyboardEvent):boolean{
        let name:string = nameEle.value;
        let type = typeEle.value;

        if(name.trim() == ''){
            this.addCustomFieldError = true;
            this.renderer.setElementStyle(nameEle, 'border-color', 'red');
            return false;
        }


        this.itemList.push({value: name, icon: type});
        this.addCustomFieldFlag = false;
        return true;
    }

    keydown(){
        console.log('keydown');
    }

    tests(parent: HTMLElement){
    }
}