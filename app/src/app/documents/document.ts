import { Participant } from "../participants/participant";
import { AppConstants } from '../app.constants';

export class Document {

    constructor(values: Object = {}) {
        Object.assign(this, values);

        if (this.date) {
            this.date = new Date(this.date);
        }

        if (this.owner) {
            this.owner = new Participant(this.owner);
        }

    }

    public _id: string;
    public owner: Participant;
    public date: Date;
    public name: string;
    public position: string;
    public type: string;
    public url: string;

    isValid(): boolean {

        return this.owner != undefined &&
            this.date != undefined &&
            this.name != undefined &&
            this.position != undefined &&
            this.type != undefined;
    };

    getDocumentTypes(): string[] {
        return AppConstants.DOCUMENT_TYPES;
    };

    isNew(): boolean {
        return this._id === undefined;
    };
};