export class ServiceError {

    constructor(private values: Object = {}) {
        Object.assign(this, values);
        this.raw = values;
    }

    raw: Object;
    name: string;
    message: string;

    toErrorString() {

        const name = (this.name) ? this.name : "Unexpected Error";
        const message = (this.message) ? this.message : "Check browser log";

        return `${name} - ${message}`;
    };
}