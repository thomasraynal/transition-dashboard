import { Participant } from "../participants/participant";

export class Intervention {

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
    public content: string;
    public date: Date;

    isNew(): boolean {
        return this._id === undefined;
    };
};