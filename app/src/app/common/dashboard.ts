import { Participant } from "../participants/participant";

export class Dashboard {

    constructor(private values: Object = {}) {
        Object.assign(this, values);
        
		if (this.owner) {
			this.owner = new Participant(this.owner);
		}
    }
    name: string;
    owner: Participant
}