import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DocumentsComponent } from './documents/documents.component';
import { InterventionsComponent } from './interventions/interventions.component';
import { ParticipantsComponent } from './participants/participants.component';

import {
  DxDataGridModule,
  DxButtonModule,
  DxTextBoxModule,
  DxPopupModule,
  DxTemplateModule,
  DxMenuModule,
  DxSelectBoxModule,
  DxFormModule,
  DxAutocompleteModule,
  DxDateBoxModule,
  DxTextAreaModule,
  DxValidatorModule,
  DxFileUploaderModule,
  DxSwitchModule,
  DxTagBoxModule
} from 'devextreme-angular';

import { LoginComponent } from './login/login.component';
import { CookieModule } from 'ngx-cookie';
import { AppRoutingModule } from './/app-routing.module';
import { ApplicationSearchComponent } from './common/application.search.component';
import { ApplicationIdComponent } from './common/application.id.component';
import { ApplicationUserComponent } from './common/application.user.component';
import { ApplicationCopyrightComponent } from './common/application.copyright.component';
import { ApplicationDisconnectComponent } from './common/application.disconnect.component';
import { AvatarComponent } from './avatar/avatar.component';
import { LookupComponent } from './search/search.component';
import { RegisterComponent } from './register/register.component';

import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/langages/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    DocumentsComponent,
    InterventionsComponent,
    ParticipantsComponent,
    LoginComponent,
    ApplicationIdComponent,
    ApplicationUserComponent,
    ApplicationDisconnectComponent,
    ApplicationCopyrightComponent,
    AvatarComponent,
    LookupComponent,
    ApplicationSearchComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    DxDataGridModule,
    DxButtonModule,
    DxTextBoxModule,
    DxMenuModule,
    DxPopupModule,
    DxTemplateModule,
    DxSelectBoxModule,
    HttpModule,
    RouterModule.forRoot([]),
    CookieModule.forRoot(),
    AppRoutingModule,
    CommonModule,
    DxFormModule,
    DxAutocompleteModule,
    DxDateBoxModule,
    DxTextAreaModule,
    DxValidatorModule,
    DxFileUploaderModule,
    DxSwitchModule,
    DxTagBoxModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
