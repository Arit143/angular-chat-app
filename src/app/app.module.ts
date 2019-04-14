
import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { ProfileComponent } from './profile/profile.component';
import { ActiveInactiveComponent } from './active-inactive/activeInactive.component';

import { ProfileService } from './profile.service'; 
import { ChatService } from './chat.service';

@NgModule({
    declarations: [
        AppComponent,
        ChatComponent,
        ProfileComponent,
        ActiveInactiveComponent
    ], 
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatSidenavModule,
        HttpModule,
        //AppRoutingModule
    ],
    providers: [ProfileService, ChatService],
    bootstrap: [
        AppComponent
    ]
})

export class AppModule {}