import { Injectable } from '@angular/core';
import { ServiceBase } from '../common/service.base';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import _ from "lodash";
import { UserService } from '../login/user.service';
import { SearchResult } from './search.result';
import { HttpParams } from '@angular/common/http';
import { AppConstants } from '../app.constants';

@Injectable({
    providedIn: 'root'
})
export class SearchService extends ServiceBase {

    private searchServiceUrl: string;

    constructor(private http: Http, userService: UserService) {
        super('SearchService', userService);
        this.searchServiceUrl = `${environment.apiUrl}/search`
    }

    search(term: string): Promise<SearchResult[]> {

        const headers = this.createAuthorizationHeader();

        return this.http
            .get(this.searchServiceUrl, { headers: headers, params: { "term": term } }).toPromise()
            .then((response) => {
                let searchResults = response.json();
                searchResults = searchResults.map((searchResult) => new SearchResult(searchResult));
                return _.orderBy(searchResults, (result) => {
                    if (result.type == AppConstants.PARTICIPANT) return 0;
                    if (result.type == AppConstants.DOCUMENT) return 1;
                    if (result.type == AppConstants.INTERVENTION) return 2;
                    return 3;
                });
            });
    };
}
