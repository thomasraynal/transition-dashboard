import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import { Participant } from './participant';
import { ServiceBase } from '../common/service.base';
import _ from "lodash";
import { UserService } from '../login/user.service';

@Injectable({
  providedIn: 'root'
})

export class ParticipantService extends ServiceBase {

  private participantServiceUrl: string;

  constructor(private http: Http, userService: UserService) {
    super('ParticipantsService', userService);
    this.participantServiceUrl = `${environment.apiUrl}/participants`
  }

  deleteParticipant(id: string): Promise<Participant> {
    const headers = this.createAuthorizationHeader();
    const url = `${this.participantServiceUrl}/${id}`;
    return this.http
      .delete(url, { headers: headers }).toPromise()
      .then((participant) => {
        return new Participant(participant.json());
      })
  }

  createOrUpdateParticipant(participant: Participant): Promise<Participant> {

    const headers = this.createAuthorizationHeader();

    var query = (participant.isNew()) ?
      this.http.put(this.participantServiceUrl, participant, { headers: headers }).toPromise() :
      this.http.patch(`${this.participantServiceUrl}/${participant._id}`, participant, { headers: headers }).toPromise();

    return query
      .then((participant) => {
        return new Participant(participant.json());
      })
  }

  getParticipants(): Promise<Participant[]> {
    const headers = this.createAuthorizationHeader();
    return this.http
      .get(this.participantServiceUrl, { headers: headers }).toPromise()
      .then((participant) => {
        return participant
          .json()
          .map((participant) => new Participant(participant));
      });
  };

}
