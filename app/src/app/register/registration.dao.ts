export class RegistrationDao {

	email: string;
	firstName: string;
	lastName: string;
	phone: string;
	dashboard: string;

	constructor(values: Object = {}) {
		Object.assign(this, values);
	}

}