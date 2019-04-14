import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ChatService } from './../chat.service';

@Component({
    selector: 'chat-panel',
    templateUrl: './chat.component.html'
})

export class ChatComponent {
    messageArray: Array<{ user: string, message: string}> = []; 
    constructor(private chatService: ChatService) {
        this.chatService.newUserJoined()
            .subscribe(data => {
                this.messageArray.push(data)
            });
        this.chatService.newMessageReceived()
            .subscribe(data => {
                this.messageArray.push(data)
            });
        this.chatService.userInactive()
            .subscribe(data => {
                this.messageArray.push(data)
            });
    }

    chatDetails = new FormGroup({
        name: new FormControl(''),
        message: new FormControl('')
    });

    join() {
        this.chatService.joinRoom({ user: this.chatDetails.value.name, room: 'group-chat' });
    }

    send() {
        this.chatService.sendMessage({ 
            user: this.chatDetails.value.name, 
            message: this.chatDetails.value.message,
            room: 'group-chat'
        });
    }
}