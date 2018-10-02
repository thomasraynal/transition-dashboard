import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })

export class DxDatagridExtensions {

    public onDoubleClick = (cell: any, callback: Function ) => {

        if (null == cell.key) return;

        const component = cell.component;
        const prevClickTime = component.lastClickTime;
        component.lastClickTime = new Date();

        if (prevClickTime && (component.lastClickTime - prevClickTime < 300)) {
            callback();
        }
    };


}