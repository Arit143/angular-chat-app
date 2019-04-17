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
    
    /**
     * Connect to the serer socket
     */
    socket = io(WS_URL);

    /**
     * Get current user
     */
    getUser() {
        return this.presentUser;
    }

    /**
     * 
     * @param room 
     * Set the current room to chat
     */
    setRoom(room: string) {
        this.room = room;
    }

    /**
     * Get the current room
     */
    getRoom() {
        return this.room;
    }

    /**
     * 
     * @param data 
     * Join group-chat room
     * client emits and server listens to this message
     */
    joinRoom(data: Data) {
        this.presentUser = data.user;
        this.socket.emit('join', data);
    }

    /**
     * 
     * @param data 
     * Join single chat room
     */
    joinSingleRoom(data: { room: string }) {
        this.socket.emit('join single chat', data);
    }

    /**
     * When user joins the chat application on app load
     * Returns observable
     * server replies to the client
     */
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

    /**
     * When user initiates a single chat
     * Return observable
     * server replies to the client
     */
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

    /**
     * 
     * @param data 
     * When user posts data in the client and the server listens to the message
     */
    sendMessage(data: SendMessage) {
        this.socket.emit('new message', data);
    }

    /**
     * When user posts a new message
     * Returns observable
     * server replies to the client
     */
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

    /**
     * 
     * @param data 
     * When user is inactive
     * returns observable. server listens to the client emit
     */
    userInactiveEmit(data: Data) {
        this.socket.emit('user inactivity', data);
    }

    /**
     * When user is inactive
     * server replies to the client
     */
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