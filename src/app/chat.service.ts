import { Injectable } from "@angular/core";
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { WS_URL } from './app.constants';

class Data {
    user: string;
    room: string;
}

class SendMessage {
    user: string;
    room: string;
    message: string;
}

class UserDetails extends SendMessage {
    allUsers?: Data[];
    allChatRooms: Array<string>;
}

@Injectable()
export class ChatService {
    presentUser: string;
    room: string;
    chatRooms: Array<string> = []
    
    socket = io(WS_URL);

    getUser() {
        return this.presentUser;
    }

    setRoom(room: string) {
        this.room = room;
    }

    getRoom() {
        return this.room;
    }

    joinRoom(data: Data) {
        this.presentUser = data.user;
        this.socket.emit('join', data);
    }

    joinSingleRoom(data: { room: string }) {
        this.socket.emit('join single chat', data);
    }

    newUserJoined() {
        const observable = new Observable<{ user: string, message: string, room: string, allUsers?: Data[], allChatRooms: Array<string> }>(observer => {
            this.socket.on('new user joined', (data: UserDetails) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }

    newSingleChat() {
        const observable = new Observable<{ room: string, allChatRooms: string[] }>(observer => {
            this.socket.on('single chat initiated', (data: { room: string, allChatRooms: string[] }) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }

    sendMessage(data: SendMessage) {
        this.socket.emit('new message', data);
    }

    newMessageReceived() {
        const observable = new Observable<{ user: string, message: string, room: string, allUsers?: Data[]}>(observer => {
            this.socket.on('new message received', (data: UserDetails) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }

    userInactiveEmit(data: Data) {
        this.socket.emit('user inactivity', data);
    }

    userInactive() {
        const observable = new Observable<{ user: string, message: string, room: string, allUsers?: Data[], allChatRooms: Array<string>}>(observer => {
            this.socket.on('user inactive', (data: UserDetails) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }
}