import { Pipe, PipeTransform  } from '@angular/core';

@Pipe({
    name: 'axwhere'
})
export class FieldsPipe implements PipeTransform {
    
    
    /** 
     * Support a function or a value or the shorthand ['key', value] like the lodash shorthand.
     */
    transform (input: any, cb, ...params: any[]): any {
        return input.filter(((cb, params) => {
            return (item) => {
                return cb(item, params);
            }
        })(cb, params));
    }
}