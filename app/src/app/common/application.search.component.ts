import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-search',
    template: `<form class="form-inline"><dx-text-box class="mr-sm-2" (onInput)="onSearchInput($event)" [(value)]="term" placeholder="{{'COMMON.SEARCH' | translate}}" [showClearButton]="true"></dx-text-box><dx-button [disabled]="isSearchAllowed()" (onClick)="search()" class="btn mr-sm-1" icon="fa fa-search" text="Search" type="default"></dx-button></form>`
})

export class ApplicationSearchComponent {

    public term: string;

    constructor(private router: Router, translate: TranslateService) {
    }

    public onSearchInput = (e) => {
        this.term = e.component._options.text;
    }

    public isSearchAllowed = () => {
        return this.term == undefined || this.term == "";
    }

    public search(): void {
        this.router.navigate(["/search"], { queryParams: { term: this.term } });
    }
}