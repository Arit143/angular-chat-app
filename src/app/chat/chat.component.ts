import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ChatService } from './../chat.service';

@Component({
    selector: 'chat-panel',
    templateUrl: './chat.component.html'
})

export class ChatComponent {
    /**
     * Private variable `allMessages`
     * Array[{
     *  user: ""
     *  message: ""
     *  room: ""
     * }]
     */
    allMessages: Array<{ user: string, message: string, room: string }> = []; 
    /**
     * Private variable `messageArray`
     * Array[{
     *  user: ""
     *  message: ""
     *  room: ""
     * }]
     * Used for filtering messages for a particular room
     */
    messageArray: Array<{ user: string, message: string, room: string }> = []; 
    /**
     * has user joined a chat
     */
    chatJoined: boolean = false;
    /**
     * String of all the chat rooms
     */
    allChatRooms: Array<string> = [];
    /**
     * Active user connected to the socket
     */
    user: string;
    /**
     * Current room in which user is chatting
     */
    currentRoom: string;

    constructor(private chatService: ChatService) {
        /**
         * Subscribe to the socket observable when new user joined
         */
        this.chatService.newUserJoined()
            .subscribe(data => {
                this.allMessages.push(data);
                this.messageArray = this.allMessages.filter(message => message.room === this.chatService.getRoom());
                this.allChatRooms = data.allChatRooms.filter(room => room.includes(this.user) || room === 'group-chat');
                this.currentRoom = this.chatService.getRoom();
            });
        /**
         * Subscribe to the socket observable when new message is received
         */
        this.chatService.newMessageReceived()
            .subscribe(data => {
                this.allMessages.push(data);
                this.messageArray = this.allMessages.filter(message => message.room === this.chatService.getRoom());
                this.currentRoom = this.chatService.getRoom();
            });
        /**
         * Subscribe to the socket observable when user is inactive
         */
        this.chatService.userInactive()
            .subscribe(data => {
                this.allMessages.push(data);
                this.messageArray = this.allMessages.filter(message => message.room === this.chatService.getRoom());
                this.allChatRooms = data.allChatRooms.filter(room => room.includes(this.user) || room === 'group-chat');
                this.currentRoom = this.chatService.getRoom();
            });
        /**
         * Subscribe to the socket observable when user joins a single chat
         */
        this.chatService.newSingleChat()
            .subscribe(data => {
                this.allChatRooms = data.allChatRooms.filter(room => room.includes(this.user) || room === 'group-chat');;
                this.messageArray = this.allMessages.filter(message => message.room === this.chatService.getRoom());
                this.currentRoom = this.chatService.getRoom();
            })
    }
    /**
     * Reactive form for name of the user and the message sent in the room
     */
    chatDetails = new FormGroup({
        name: new FormControl(''),
        message: new FormControl('')
    });

    /**
     * Function when user joins a group chat
     */
    join() {
        this.chatService.joinRoom({ user: this.chatDetails.value.name, room: 'group-chat' });
        this.chatJoined = true;
        this.user = this.chatDetails.value.name;
        this.chatService.setRoom('group-chat');
    }

    /**
     * Send message in a particular room
     */
    send() {
        this.chatService.sendMessage({ 
            user: this.chatDetails.value.name, 
            message: this.chatDetails.value.message,
            room: this.chatService.getRoom()
        });
    }

    /**
     * 
     * @param chatRoom 
     * When user clicks on the other user tab to chat
     */
    onTabClick(chatRoom: string) {
        this.chatService.setRoom(chatRoom);
        this.currentRoom = chatRoom;
        this.chatService.joinSingleRoom({ room: chatRoom });
        this.messageArray = this.allMessages.filter(message => message.room === chatRoom);
    }
}