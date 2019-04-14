import { Injectable } from "@angular/core";
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

class Data {
    user: string;
    room: string;
}

class UserDetails {
    room: string;
    user: string;
    message: string;
}

@Injectable()
export class ChatService {
    socket = io('http://localhost:3000');

    joinRoom(data: Data) {
        this.socket.emit('join', data);
    }

    newUserJoined() {
        const observable = new Observable<{ user: string, message: string, room: string }>(observer => {
            this.socket.on('new user joined', (data: UserDetails) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }

    sendMessage(data: UserDetails) {
        this.socket.emit('new message', data);
    }

    newMessageReceived() {
        const observable = new Observable<{ user: string, message: string, room: string}>(observer => {
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
        const observable = new Observable<{ user: string, message: string, room: string}>(observer => {
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