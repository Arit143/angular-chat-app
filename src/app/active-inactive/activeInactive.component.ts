import { Component, OnInit } from '@angular/core';
import { ChatService } from './../chat.service';
import { timer, Observable } from 'rxjs';
import { USER_INACTIVITY_TIMEOUT } from './../app.constants';

@Component({
    selector: 'active-inactive',
    templateUrl: './activeInactive.component.html'
})
export class ActiveInactiveComponent implements OnInit {
    private timer: Observable<number>;
    allChatRooms: Array<string> = [];
    activeUsers: Array<{ user: string; room: string; timeJoined?: Date; timeMessaged?: Date }>  = []; 

    constructor(private chatService: ChatService) {
        this.chatService.newUserJoined()
            .subscribe(data => {
                this.activeUsers = data.allUsers;
                this.allChatRooms = data.allChatRooms;
            });
        this.chatService.newMessageReceived()
            .subscribe(data => {
                this.activeUsers = data.allUsers;
            });
        this.chatService.userInactive()
            .subscribe(data => {
                this.activeUsers = data.allUsers;
            });
        this.chatService.newSingleChat()
            .subscribe(data => {
                this.allChatRooms = data.allChatRooms
            })
    }

    ngOnInit() {
        this.timer = timer(0, 10000);
        this.timer.subscribe((t) => this.onTimeOut());
    }

    onTimeOut() {
        if (this.activeUsers.length === 0) {
            return;
        }
        /**
         * We should keep track of when the user joined and when the user messaged last
         */
        const inactiveUsers = this.activeUsers.filter((value) => {
            if (!value.timeMessaged) {
                return (new Date().getTime() - new Date(value.timeJoined).getTime()) > USER_INACTIVITY_TIMEOUT;
            } else {
                return (new Date(value.timeJoined).getTime() - new Date(value.timeMessaged).getTime()) > USER_INACTIVITY_TIMEOUT;
            }
        });

        if (inactiveUsers.length > 0) {
            this.chatService.userInactiveEmit(inactiveUsers[0]);
        }
    };

    joinRoom(user: string) {
        if (user !== this.chatService.getUser()) {
            let arrayIndex = undefined;
            let room = '';
            const presentUserWithOtherUser = `${this.chatService.getUser()}${user}`;
            const otherUserWithPresentUser = `${user}${this.chatService.getUser()}`;

            if (this.allChatRooms.includes(presentUserWithOtherUser) || this.allChatRooms.includes(otherUserWithPresentUser)) {
                const userIndex1 = this.allChatRooms.findIndex(elem => elem === presentUserWithOtherUser);
                const userIndex2 = this.allChatRooms.findIndex(elem => elem === otherUserWithPresentUser);
                arrayIndex = userIndex1 > -1 ? userIndex1 : userIndex2;
            }

            if (arrayIndex !== undefined) {
                room = this.allChatRooms[arrayIndex]
            } else {
                room = presentUserWithOtherUser;
            }

            this.chatService.setRoom(room);
            this.chatService.joinSingleRoom({ room });
        }
    }
}