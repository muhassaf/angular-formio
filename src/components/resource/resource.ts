import { OnInit } from "@angular/core";
import { BaseComponent, BaseElement, BaseOptions } from '../base';
import { FormioComponents } from '../components';
import { FormioTemplate } from '../../formio.template';
import { FormioService } from '../../formio.service';
var Formio = require('formiojs');

export interface ResourceOptions extends BaseOptions<any> {
    placeholder?: string;
    template: string;
    resource: string;
    searchFields?: Array<string> | string;
    selectFields?: Array<string> | string;
}

interface IdTextPair{
    id: string;
    text: string;
}

export class ResourceComponent extends BaseComponent<ResourceOptions> {
    allowMultiple(): boolean{
        return false;
    }
}

export class ResourceElement extends BaseElement<ResourceComponent> implements OnInit {
    private value:any = {};
    public refreshValue(value:any):void {
        this.value = value;
    }
    ngOnInit(){
        let selectItems: IdTextPair[] = [];
        let baseUrl: string = Formio.getBaseUrl() + '/' + this.component.settings.resource;
        // @Todo: Create url with select fields and search fields.
        let params:any = {};
        if (this.component.settings.selectFields) {
            params.select = this.component.settings.selectFields;
        }
        if (this.component.settings.searchFields) {
            this.component.settings.searchFields.forEach((item: any) => {
                params['field'] = item.value;
            });
        }
        (new FormioService(baseUrl)).loadSubmissions().subscribe((submission: Array<any>) => {
            for(let i=0; i < submission.length; i++){
                selectItems.push({id: JSON.stringify(submission[i].data), text: JSON.stringify(submission[i].data)});
            }
            this.component.settings.defaultValue = selectItems.slice(0);
        });
    }
}

export function Resource(template:FormioTemplate) {
    FormioComponents.register('resource', ResourceComponent, ResourceElement, {
        template: template.components.resource
    });
    return ResourceElement;
}
