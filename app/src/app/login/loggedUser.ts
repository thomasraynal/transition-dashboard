import { Participant } from '../participants/participant';

export class LoggedUser {

  constructor(values: Object = {}) {

    Object.assign(this, values);

    if (this.expiration) {
      this.expiration = new Date(this.expiration);
    }

    if (this.user) {
      this.user = new Participant(this.user);
    }

  }

  expiration: Date
  token: string
  user: Participant

  toCookie(): any {
    return {
      expiration: this.expiration,
      token: this.token,
    };
  }

};