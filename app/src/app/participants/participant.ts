import { Intervention } from "../interventions/intervention";
import { Document } from '../documents/document';
import { environment } from "../../environments/environment";
import { AppConstants } from '../app.constants';
import { Dashboard } from "../common/dashboard";

export class Participant {

	constructor(values: Object = {}) {
		Object.assign(this, values);

		if (!this.avatar) {
			this.avatar = AppConstants.DEFAULT_AVATAR;
		}
		if (!this.dashboard) {
			this.dashboard = new Dashboard(this.dashboard);
		}

	}

	_id: string;
	avatar: string;
	email: string;
	firstName: string;
	lastName: string;
	phone: string;
	position: string;
	identity: string;
	dashboard: Dashboard;

	createIntervention(): Intervention {
		let intervention = new Intervention();
		intervention.date = new Date();
		intervention.owner = this;
		return intervention;
	};

	createDocument(): Document {
		let document = new Document();
		document.url = undefined;
		document.position = this.position;
		document.date = new Date();
		document.owner = this;
		return document;
	};

	username(): string {
		return `${this.firstName} ${this.lastName}`;
	};

	isNew(): boolean {
		return this._id === undefined;
	};
};