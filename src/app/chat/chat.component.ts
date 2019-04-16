import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ChatService } from './../chat.service';

@Component({
    selector: 'chat-panel',
    templateUrl: './chat.component.html'
})

export class ChatComponent {
    allMessages: Array<{ user: string, message: string, room: string }> = []; 
    messageArray: Array<{ user: string, message: string, room: string }> = []; 
    chatJoined: boolean = false;
    allChatRooms: Array<string> = [];
    user: string;
    currentRoom: string;

    constructor(private chatService: ChatService) {
        this.chatService.newUserJoined()
            .subscribe(data => {
                this.allMessages.push(data);
                this.messageArray = this.allMessages.filter(message => message.room === this.chatService.getRoom());
                this.allChatRooms = data.allChatRooms.filter(room => room.includes(this.user) || room === 'group-chat');
                this.currentRoom = this.chatService.getRoom();
            });
        this.chatService.newMessageReceived()
            .subscribe(data => {
                this.allMessages.push(data);
                this.messageArray = this.allMessages.filter(message => message.room === this.chatService.getRoom());
                this.currentRoom = this.chatService.getRoom();
            });
        this.chatService.userInactive()
            .subscribe(data => {
                this.allMessages.push(data);
                this.messageArray = this.allMessages.filter(message => message.room === this.chatService.getRoom());
                this.currentRoom = this.chatService.getRoom();
            });
        this.chatService.newSingleChat()
            .subscribe(data => {
                this.allChatRooms = data.allChatRooms.filter(room => room.includes(this.user) || room === 'group-chat');;
                this.messageArray = this.allMessages.filter(message => message.room === this.chatService.getRoom());
                this.currentRoom = this.chatService.getRoom();
            })
    }

    chatDetails = new FormGroup({
        name: new FormControl(''),
        message: new FormControl('')
    });

    join() {
        this.chatService.joinRoom({ user: this.chatDetails.value.name, room: 'group-chat' });
        this.chatJoined = true;
        this.user = this.chatDetails.value.name;
        this.chatService.setRoom('group-chat');
    }

    send() {
        this.chatService.sendMessage({ 
            user: this.chatDetails.value.name, 
            message: this.chatDetails.value.message,
            room: this.chatService.getRoom()
        });
    }

    onTabClick(chatRoom: string) {
        this.chatService.setRoom(chatRoom);
        this.currentRoom = chatRoom;
        this.chatService.joinSingleRoom({ room: chatRoom });
        this.messageArray = this.allMessages.filter(message => message.room === chatRoom);
    }
}