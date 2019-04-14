import { Component, OnInit } from '@angular/core';
import { ChatService } from './../chat.service';
import { timer, Observable, Subscription } from 'rxjs';

@Component({
    selector: 'active-inactive',
    templateUrl: './activeInactive.component.html'
})

export class ActiveInactiveComponent implements OnInit {
    private timer: Observable<number>;
    private subscription: Subscription;
    activeInactiveUsers: Array<{ room: string, user: string, isActive: boolean, timeJoined?: Date, timeMessaged?: Date}> = []; 
    constructor(private chatService: ChatService) {
        this.chatService.newUserJoined()
            .subscribe(data => {
                this.activeInactiveUsers.push({ room: data.room, user: data.user, isActive: true, timeJoined: new Date() })
            });
        this.chatService.newMessageReceived()
            .subscribe(data => {
                this.activeInactiveUsers.push({ room: data.room, user: data.user, isActive: true, timeMessaged: new Date() })
            });
        this.activeInactiveUsers.length > 0 && this.chatService.userInactive()
            .subscribe(data => {
                this.activeInactiveUsers.push({ room: data.room, user: data.user, isActive: false })
            });
    }

    ngOnInit() {
        this.timer = timer(0, 10000);
        this.subscription = this.timer.subscribe((t) => this.onTimeOut());
    }

    onTimeOut() {
        /**
         * We should keep track of when the user joined and when the user messaged last
         */
        const inactiveUsers = this.activeInactiveUsers.filter((value) => {
            if (!value.timeMessaged) {
                return new Date().getTime() - value.timeJoined.getTime() > 100000;
            } else {
                return value.timeJoined.getTime() - value.timeMessaged.getTime() > 10
            }
        });

        if (inactiveUsers.length > 0) {
            this.chatService.userInactiveEmit(inactiveUsers[0]);
            this.activeInactiveUsers = this.activeInactiveUsers.filter(value => value.user !== inactiveUsers[0].user);
        }
    };
}