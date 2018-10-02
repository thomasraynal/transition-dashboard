import { Injectable } from '@angular/core';
import { ServiceBase } from '../common/service.base';
import { Intervention } from './intervention';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import _ from "lodash";
import { UserService } from '../login/user.service';
import { Position } from './position';

@Injectable({
  providedIn: 'root'
})
export class InterventionService extends ServiceBase {

  private interventionsServiceUrl: string;
  private positionsServiceUrl: string;

  constructor(private http: Http, userService: UserService) {
    super('InterventionsService', userService);
    this.interventionsServiceUrl = `${environment.apiUrl}/interventions`
    this.positionsServiceUrl = `${environment.apiUrl}/positions`
  }

  getInterventions(): Promise<Intervention[]> {
    const headers = this.createAuthorizationHeader();
    return this.http
      .get(this.interventionsServiceUrl, { headers: headers }).toPromise()
      .then((response) => {
        let interventions = response.json();
        interventions = interventions.map((intervention) => new Intervention(intervention));
        return _.orderBy(interventions, ['date'], ['desc'])
      });
  };

  getPositions(): Promise<Position[]> {
    const headers = this.createAuthorizationHeader();
    return this.http
      .get(this.positionsServiceUrl, { headers: headers }).toPromise()
      .then(response => {
        let positions = response.json();
        positions = positions.map((intervention) => new Position(intervention));
        return _.orderBy(positions, ['name'])
      });
  };

  createOrUpdateIntervention(intervention: Intervention): Promise<Intervention> {
    const headers = this.createAuthorizationHeader();
    var query = (intervention.isNew()) ?
      this.http.put(this.interventionsServiceUrl, intervention, { headers: headers }).toPromise() :
      this.http.patch(`${this.interventionsServiceUrl}/${intervention._id}`, intervention, { headers: headers }).toPromise();

    return query
      .then((intervention) => {
        return new Intervention(intervention.json());
      })
  }

  deleteIntervention(id: string): Promise<Intervention> {
    const headers = this.createAuthorizationHeader();
    return this.http
      .delete(`${this.interventionsServiceUrl}/${id}`, { headers: headers }).toPromise()
      .then((intervention) => {
        return new Intervention(intervention.json());
      });
  }
}
