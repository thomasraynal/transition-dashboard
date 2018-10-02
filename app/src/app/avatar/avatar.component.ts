import { Component, OnInit, ViewChild, ElementRef, Inject, Input, Output, EventEmitter } from '@angular/core';
import notify from 'devextreme/ui/notify';
import { DocumentService } from '../documents/document.service';
import { ComponentBase } from '../common/component.base';
import { ServiceError } from '../common/service.error';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AppConstants } from '../app.constants';
import { UserService } from '../login/user.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent extends ComponentBase {

  public uploadWidth: string;
  public uploadWrapperUiState: string = 'avatar-upload__wrapper avatar-upload--complete';
  public isUploading: boolean;

  private defaultImage: string = AppConstants.DEFAULT_AVATAR;
  private avatarUploadUrl = `${environment.apiUrl}/upload/avatar`;
  private previousImage: String;

  @Input() currentImage: String;
  @Output() currentImageChange = new EventEmitter<String>();

  constructor(
    private documentService: DocumentService, private http: Http, userService: UserService, router: Router, translate: TranslateService) {

    super(router, translate, userService);

    if (this.currentImage) {
      this.previousImage = this.currentImage;
    } else {
      this.currentImage = this.previousImage = this.defaultImage;
      this.notify();
    }
  };

  upload(event) {
    this
      .doUpload(event)
      .then(this.success)
      .catch(this.failure);
  };

  onUploadStarted(e) {
    this.isUploading = true;
    notify("ok");
  }

  private onUploadError = (e) => {
    this.isUploading = false;
    const error = new ServiceError(JSON.parse(e.request.response));
    this.showServiceFailure(error);
  }

  private onUploaded = (e) => {
    this.isUploading = false;
  }

  private success = (url: string) => {
    this.previousImage = this.currentImage = url;
    this.currentImageChange.emit(this.currentImage);
    this.uploadWidth = null;
    this.uploadWrapperUiState = 'avatar-upload__wrapper avatar-upload--complete';
    this.notify();
  };

  private failure = (err: string) => {
    this.showFailure(err);
    this.currentImage = this.previousImage
    this.notify();
  };

  private doUpload = (event): Promise<any> => {

    this.previousImage = this.currentImage;

    const file = event.target.files[0];
    const data: FormData = new FormData();
    const headers = this.documentService.createAuthorizationHeader();

    event.target.value = null;

    data.append('avatar', file, file.name);

    return this.http
      .post(this.avatarUploadUrl, data, { headers: headers }).toPromise()
      .then((response) => {
        const document = response.json();
        return document.url;
      });
  };

  private notify = () => {
    this.currentImageChange.emit(this.currentImage);
  };

}
