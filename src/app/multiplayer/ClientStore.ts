import {Client, Room} from 'colyseus.js';

export default class ClientStore {
    private static client: Client;
    private static roomPool: Map<string, Room> = new Map();

    static getClient(): Client
    {
        if (this.client === undefined) {
            this.client = new Client(process.env.VUE_APP_SERVER_URL);
        }

        return this.client;
    }

    static addRoom(room: Room): void
    {
        this.roomPool.set(room.id, room);
    }

    static getRoom(id: string): Room|undefined {
        return this.roomPool.has(id) ? this.roomPool.get(id) : undefined;
    }

    static removeRoom(room: Room): void
    {
        this.roomPool.delete(room.id);
    }
}
