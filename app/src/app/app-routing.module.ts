import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParticipantsComponent } from './participants/participants.component';
import { InterventionsComponent } from './interventions/interventions.component';
import { RouterGuardService } from './router-guard.service';
import { LoginComponent } from './login/login.component';
import { DocumentsComponent } from './documents/documents.component';
import { LookupComponent } from './search/search.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: '', component: InterventionsComponent, canActivate: [RouterGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'search', component: LookupComponent, canActivate: [RouterGuardService] },
  { path: 'participants', component: ParticipantsComponent, canActivate: [RouterGuardService] },
  { path: 'interventions', component: InterventionsComponent, canActivate: [RouterGuardService] },
  { path: 'documents', component: DocumentsComponent, canActivate: [RouterGuardService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
