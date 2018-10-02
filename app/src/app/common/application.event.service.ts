
import { ApplicationEvent } from './application.event';
import { Participant } from '../participants/participant';
import { Intervention } from '../interventions/intervention';
import { Document } from '../documents/document';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class EventService<TSubject> {

    private change = new Subject<ApplicationEvent<TSubject>>();

    private DELETED: string = 'deleted';
    private CREATED: string = 'created';
    private UPDATED: string = 'updated';

    public created = (subject: TSubject) => {
        this.change.next(new ApplicationEvent<TSubject>(this.CREATED, subject));
    }

    public updated = (subject: TSubject) => {
        this.change.next(new ApplicationEvent<TSubject>(this.UPDATED, subject));
    }

    public deleted = (subject: TSubject) => {
        this.change.next(new ApplicationEvent<TSubject>(this.DELETED, subject));
    }

    public onChanged(): Observable<ApplicationEvent<TSubject>> {
        return this.change.asObservable();
    }


}
