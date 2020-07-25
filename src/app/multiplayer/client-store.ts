import {Client} from 'colyseus.js';

export default class ClientStore {
    static client: Client;

    static getClient(): Client
    {
        if (this.client === undefined) {
            this.client = new Client(process.env.VUE_APP_SERVER_URL);
        }

        return this.client;
    }
}
