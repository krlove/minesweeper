import User from '@/app/multiplayer/model/user';

export default class Message {
    author: User;
    body: string;
    createdAt: Date;

    constructor(author: User, body: string, createdAt: Date) {
        this.author = author;
        this.body = body;
        this.createdAt = createdAt;
    }
}
