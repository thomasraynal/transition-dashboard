import { Component, OnInit, OnDestroy } from '@angular/core';
import { InterventionService } from './interventions.service';
import DataSource from 'devextreme/data/data_source';
import { Router, ActivatedRoute } from '@angular/router';
import _ from "lodash";
import { AppConstants } from '../app.constants';
import { Position } from './position';
import { UserService } from '../login/user.service';
import { Intervention } from './intervention';
import { ComponentBase } from '../common/component.base';
import { DxDatagridExtensions } from '../common/dx.datagrid.extensions';
import CustomStore from "devextreme/data/custom_store";
import { EventService } from '../common/application.event.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-interventions',
  templateUrl: './interventions.component.html',
  styleUrls: ['./interventions.component.css']
})

export class InterventionsComponent extends ComponentBase implements OnInit, OnDestroy {

  public availablePositions: Position[];
  public selectedPosition: Position;
  public dataSource: DataSource;
  public window: any;
  public doShowEditInterventionPopup: boolean;
  public selectedIntervention: Intervention;

  private store: CustomStore;
  private cleanup: Subscription;

  ngOnInit(): void {

    this.store = new CustomStore({
      key: "_id",
      load: () => {
        return this.interventionService
          .getInterventions()
          .then(result => {

            setTimeout(() => {
              const queryInterventionId = this.route.snapshot.queryParamMap.get('id');
              if (queryInterventionId) {

                const filter = ["_id", "=", queryInterventionId];
                this.dataSource.filter(filter);
                this.dataSource.load();
              }
            }, 500);

            return result;
          })
          .catch(this.handleFailure);
      },
      insert: (intervention) => {
        return this.interventionService
          .createOrUpdateIntervention(intervention)
          .then((inserted) => {
            this.eventEmitter.created(inserted);
            return inserted;
          })
          .catch(this.handleFailure);
      },
      update: (id, intervention) => {
        return this.interventionService
          .createOrUpdateIntervention(intervention)
          .then((updated) => {
            this.eventEmitter.updated(updated);
            return updated;
          })
          .catch(this.handleFailure);
      },
      remove: (id) => {
        return this.interventionService
          .deleteIntervention(id)
          .then((deleted) => {
            this.eventEmitter.deleted(deleted);
            return deleted;
          })
          .catch(this.handleFailure);
      }
    });

    this.dataSource = new DataSource({
      store: this.store,
      sort: ([
        { selector: "date", desc: true }
      ])
    });

    this.interventionService
      .getPositions()
      .then(positions => {
        const allPositions = new Position(AppConstants.ALL);
        const queryPosition = this.route.snapshot.queryParamMap.get('position');

        positions.push(allPositions);
        this.availablePositions = _.orderBy(positions, ["name"], ["asc"]);

        const currentPosition = (queryPosition) ? _.find(this.availablePositions, { 'name': queryPosition }) : allPositions;

        //refacto: bindings
        this.changePosition(currentPosition);

      });
  }

  constructor(
    private interventionService: InterventionService,
    router: Router,
    translateService: TranslateService,
    userService: UserService,
    private dxDataGridExt: DxDatagridExtensions,
    private eventEmitter: EventService<Intervention>,
    private route: ActivatedRoute) {

    super(router, translateService, userService);

    this.window = window;

    this.cleanup = eventEmitter
      .onChanged()
      .subscribe(change => {
        this.handleSuccess(`Intervention has been ${change.reason}`);
        this.dataSource.reload();
      });
  }

  public selectPosition = (e) => {
    this.changePosition(e.itemData)
  }

  public onCreateNewInterventionClick = (e) => {
    this.selectedIntervention = undefined;
    this.selectedIntervention = this.loggedUser.user.createIntervention()
    this.doShowEditInterventionPopup = true;
  }

  public onInterventionRowClick = (cell: any) => {

    this.dxDataGridExt.onDoubleClick(cell, () => {
      this.selectedIntervention = new Intervention(cell.data);
      this.doShowEditInterventionPopup = true;
    });

  };

  public onInterventionCreateOrUpdate = (e) => {

    if (this.selectedIntervention._id) {
      this.store.update(this.selectedIntervention._id, this.selectedIntervention);
    } else {
      this.store.insert(this.selectedIntervention);
    }

    e.preventDefault();

  };

  private changePosition = (position: Position) => {

    this.selectedPosition = position;
    const filter = (this.selectedPosition.name == AppConstants.ALL) ? null : ["owner.position", "=", this.selectedPosition.name];

    this.dataSource.filter(filter);
    this.dataSource.load();
  }

  private onInterventionDelete = (e) => {
    this.store.remove(this.selectedIntervention._id);
  };

  ngOnDestroy() {
    this.cleanup.unsubscribe();
  }

  private handleSuccess = (msg) => {

    this.showSuccess(msg);

    this.doShowEditInterventionPopup = false;
  };

  private handleFailure = (err) => {

    this.showFailure(err);

  };

}
