import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ParticipantService } from './participant.service';
import DataSource from 'devextreme/data/data_source';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../login/user.service';
import { Participant } from './participant';
import { DxFormComponent } from 'devextreme-angular';
import _ from "lodash";
import { ComponentBase } from '../common/component.base';
import { DxDatagridExtensions } from '../common/dx.datagrid.extensions';
import CustomStore from "devextreme/data/custom_store";
import { EventService } from '../common/application.event.service';
import { Subscription } from 'rxjs';
import ValidationEngine from 'devextreme/ui/validation_engine';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-participants',
    templateUrl: './participants.component.html',
    styleUrls: ['./participants.component.css']
})
export class ParticipantsComponent extends ComponentBase implements OnInit, OnDestroy {

    @ViewChild('form') form: DxFormComponent;

    public selectedParticipant: Participant;
    public doShowEditParticipantPopup: boolean;
    public dataSource: DataSource;

    private store: CustomStore;
    private participantPasswordEditorMode: any;
    private cleanup: Subscription;

    ngOnInit(): void {

        this.store = new CustomStore({
            key: "_id",
            load: () => {
                return this.participantService
                    .getParticipants()
                    .then(result => {

                        setTimeout(() => {
                            const queryParticipantId = this.route.snapshot.queryParamMap.get('id');
                            if (queryParticipantId) {

                                const filter = ["_id", "=", queryParticipantId];
                                this.dataSource.filter(filter);
                                this.dataSource.load();
                            }
                        }, 500);

                        return result;
                    })
                    .catch(this.handleFailure);
            },
            insert: (participant) => {
                return this.participantService
                    .createOrUpdateParticipant(participant)
                    .then((inserted) => {
                        this.eventEmitter.created(inserted);
                        return inserted;
                    })
                    .catch(this.handleFailure);
            },
            update: (id, participant) => {
                return this.participantService
                    .createOrUpdateParticipant(participant)
                    .then((updated) => {
                        this.eventEmitter.updated(updated);
                        return updated;
                    })
                    .catch(this.handleFailure);
            },
            remove: (id) => {
                return this.participantService
                    .deleteParticipant(id)
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
                { selector: "lastName", desc: false }
            ])
        });

    }

    ngOnDestroy() {
        this.cleanup.unsubscribe();
    }

    constructor(
        private participantService: ParticipantService,
        private route: ActivatedRoute,
        router: Router,
        translateService: TranslateService,
        userService: UserService,
        private dxDataGridExt: DxDatagridExtensions,
        private eventEmitter: EventService<Participant>) {

        super(router, translateService, userService);

        this.cleanup = eventEmitter
            .onChanged()
            .subscribe(change => {
                this.handleSuccess(`Participant ${change.subject.username()} has been ${change.reason}`);
                this.dataSource.reload();
            });
    }

    public onCreateNewParticipantClick = (e) => {
        this.selectedParticipant = new Participant();
        this.participantPasswordEditorMode = { mode: 'password', disabled: false }
        this.doShowEditParticipantPopup = true;

        setTimeout(() => {
            this.form.instance.resetValues();
        }, 100);

    }

    public onParticipantRowClick = (cell: any) => {
        this.dxDataGridExt.onDoubleClick(cell, () => {
            this.selectedParticipant = new Participant(cell.data);
            this.participantPasswordEditorMode = { mode: 'password', disabled: true }
            this.doShowEditParticipantPopup = true;
        });
    };

    private onParticipantCreateOrUpdate = (e) => {

        if (this.selectedParticipant._id) {
            this.store.update(this.selectedParticipant._id, this.selectedParticipant);
        } else {
            this.store.insert(this.selectedParticipant);
        }

        e.preventDefault();
    };

    private onParticipantDelete = (e) => {
        this.store.remove(this.selectedParticipant._id);
    };

    private handleSuccess = (msg) => {

        this.showSuccess(msg);

        this.doShowEditParticipantPopup = false;
    };

    private handleFailure = (err) => {

        this.showFailure(err);

    };
}
