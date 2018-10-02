import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchService } from './search.service';
import { ComponentBase } from '../common/component.base';
import { SearchResult } from './search.result';
import _ from "lodash";
import { ActivatedRoute, Router } from '@angular/router';
import { AppConstants } from '../app.constants';
import { UserService } from '../login/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-lookup',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class LookupComponent extends ComponentBase implements OnInit {

  public isLoading: boolean;
  public searchResults: SearchResult[] = [];
  private searchTerm: string;

  constructor(
    private searchService: SearchService, 
    translateService: TranslateService,
    userService: UserService,
    router: Router, 
    private route: ActivatedRoute) {
    super(router, translateService, userService);

    this.searchTerm = this.route.snapshot.queryParamMap.get('term');
  }

  public onResultRowClick = (cell: any) => {

    var result = new SearchResult(cell.data);

    var params = { queryParams: {id: result._id  }};

    switch (result.type) {
      case (AppConstants.PARTICIPANT):
        this.router.navigate(['/participants'],params);
        break;
      case (AppConstants.DOCUMENT):
        this.router.navigate(['/documents'],params);
        break;
      case (AppConstants.INTERVENTION):
        this.router.navigate(['/interventions'],params);
        break;
      default:
    }

  };

  ngOnInit() {

    if (!this.searchTerm) {
      return;
    }
    this.isLoading = true;

    this.searchService
      .search(this.searchTerm)
      .then((results) => {
        this.searchResults = results;
       
      })
      .catch(this.showFailure);

    this.isLoading = false;

  }

}
