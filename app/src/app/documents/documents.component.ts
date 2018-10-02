import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { Router, ActivatedRoute } from '@angular/router';
import _ from "lodash";
import { AppConstants } from '../app.constants';
import { UserService } from '../login/user.service';
import { ComponentBase } from '../common/component.base';
import { DxDatagridExtensions } from '../common/dx.datagrid.extensions';
import CustomStore from "devextreme/data/custom_store";
import { EventService } from '../common/application.event.service';
import { Subscription } from 'rxjs';
import { Position } from '../interventions/position';
import { InterventionService } from '../interventions/interventions.service';
import { DocumentService } from './document.service';
import { Document } from './document';
import { environment } from '../../environments/environment';
import { ServiceError } from '../common/service.error';
import { DxFormComponent } from 'devextreme-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent extends ComponentBase implements OnInit, OnDestroy {

  @ViewChild('form') form: DxFormComponent;

  public selectedPosition: Position;
  public availablePositions: Position[];
  public isUploading: boolean;
  public dataSource: DataSource;
  public doShowEditDocumentPopup: boolean;
  public selectedDocument: Document;

  private availableDocumentPositions: Position[];
  private store: CustomStore;
  private cleanup: Subscription;
  private selectedFile: File;
  private fileUploader: any;

  ngOnInit(): void {

    this.store = new CustomStore({
      key: "_id",
      load: () => {
        return this.documentService
          .getDocuments()
          .then(result => {

            setTimeout(() => {
              const queryDocumentId = this.route.snapshot.queryParamMap.get('id');
              if (queryDocumentId) {

                const filter = ["_id", "=", queryDocumentId];
                this.dataSource.filter(filter);
                this.dataSource.load();
              }
            }, 500);

            return result;
          })
          .catch(this.handleFailure);
      },
      insert: (document) => {
        return this.documentService
          .createOrUpdateDocument(document)
          .then((inserted) => {
            this.eventEmitter.created(inserted);
            return inserted;
          })
          .catch(this.handleFailure);
      },
      update: (id, document) => {
        return this.documentService
          .createOrUpdateDocument(document)
          .then((updated) => {
            this.eventEmitter.updated(updated);
            return updated;
          })
          .catch(this.handleFailure);
      },
      remove: (id) => {
        return this.documentService
          .deleteDocument(id)
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

        this.availableDocumentPositions = positions;
        positions.push(allPositions);
        this.availablePositions = _.orderBy(positions, ["name"], ["asc"]);

        const currentPosition = (queryPosition) ? _.find(this.availablePositions, { 'name': queryPosition }) : allPositions;

        //refacto: bindings
        this.changePosition(currentPosition);

      });
  }

  constructor(
    private interventionService: InterventionService,
    private documentService: DocumentService,
    router: Router,
    translateService: TranslateService,
    userService: UserService,
    private dxDataGridExt: DxDatagridExtensions,
    private eventEmitter: EventService<Document>,
    private route: ActivatedRoute) {

    super(router, translateService, userService);

    this.cleanup = eventEmitter
      .onChanged()
      .subscribe(change => {
        this.handleSuccess(`Document ${change.subject.name} has been ${change.reason}`);
        this.dataSource.reload();
      });
  }

  public selectPosition = (e) => {
    this.changePosition(e.itemData)
  }

  public onCreateNewDocumentClick = (e) => {

    this.selectedDocument = this.loggedUser.user.createDocument()

    if (this.fileUploader) {
      this.fileUploader.reset();
    }

    this.doShowEditDocumentPopup = true;

  }

  public onDocumentRowClick = (cell: any) => {
    this.dxDataGridExt.onDoubleClick(cell, () => {
      if (this.fileUploader) this.fileUploader.reset();
      this.selectedDocument = new Document(cell.data);
      this.doShowEditDocumentPopup = true;

    });
  };

  private changePosition = (position: Position) => {

    this.selectedPosition = position;
    const filter = (this.selectedPosition.name == AppConstants.ALL) ? null : ["position", "=", this.selectedPosition.name];

    this.dataSource.filter(filter);
    this.dataSource.load();
  }

  private isSelectedDocumentValid(): boolean {
    return this.selectedDocument &&
      this.selectedDocument.isValid() &&
      ((this.selectedDocument.url !== undefined && this.selectedDocument.url !== ''));
  }

  private onUploadFileCleared = (e: any = undefined) => {
    this.fileUploader.reset();
    this.selectedFile = undefined;
    this.selectedDocument.url = undefined;
  }

  private onUploadStarted = (e) => {
    this.isUploading = true;
  }

  private onUploadError = (e) => {
    this.isUploading = false;
    const error = new ServiceError(JSON.parse(e.request.response));
    this.showServiceFailure(error);
    this.onUploadFileCleared();
  }

  private onUploaded = (e) => {
    this.isUploading = false;
    const uploadedFile = JSON.parse(e.request.response);
    this.showSuccess(`File ${this.selectedFile.name} has been uploaded`);
    this.selectedDocument.url = uploadedFile.url;
  }

  private onUploadFileSelected = (e) => {

    if (e.value.length > 0) {

      const file = e.value[0];
      const size = file.size;

      if (size > 5000000) {
        this.showFailure(`Document size is limited to 5MB (actual is ${Math.floor(size / 1000000)}MB)`);
        e.component.reset();
        return;
      }

      this.fileUploader = e.component;

      this.selectedFile = file;

      if (!this.selectedDocument.name) {
        this.selectedDocument.name = file.name;
      }

    }
  };

  private onDocumentCreateOrUpdate = (e) => {

    //refacto - check document url already exists
    if (this.selectedDocument._id) {
      this.store.update(this.selectedDocument._id, this.selectedDocument);
    } else {
      this.store.insert(this.selectedDocument);
    }

    e.preventDefault();

  };

  private onDocumentDelete = (e) => {
    this.store.remove(this.selectedDocument._id);
  };

  ngOnDestroy() {
    this.cleanup.unsubscribe();
  }

  private handleSuccess = (msg) => {
    this.showSuccess(msg);
    this.doShowEditDocumentPopup = false;
  };

  private handleFailure = (err) => {
    this.showFailure(err);
  };

}
