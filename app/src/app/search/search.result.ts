
import { Participant } from "../participants/participant";
import { Intervention } from "../interventions/intervention";
import { Document } from '../documents/document';

export class SearchResult {

    _id: string;
     name: string;
     date: Date;
     firstName: string;
     lastName: string;
     position: string;
     avatar: string;
     type: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);

        if (this.date) {
            this.date = new Date(this.date);
        }
    }

    label(): string {
        return `${this.type} | ${this.position}  ${(this.date) ? '|' + this.date.toLocaleDateString() : ''}`;
    }

    content(): string {
        return `${this.lastName} ${this.firstName} ${(this.name) ? '|' + this.name : ''}`;
    }

};