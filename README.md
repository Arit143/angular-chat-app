# angular-chat-app
An angular chat app with Socket IO and Socket IO-client

## Authors
Aritra Ghosh

## Description
Angular app for chatting using websockets from multiple web clients.

Installation

```
rm -rf node_modules
npm install

```

Fire up with `npm start` to start the server in one terminal and `npm run build:dev` to start the app in other terminanl and navigate to http://localhost:8080 to see the components in action.

## Packages

1. Angular 7.
2. RxJs 6.x
3. Socket IO
4. Socket IO-client.
5. Bootstrap CSS
6. Font Awesome
7. Express JS for server side
8. Webpack

##Features

1. User can see his/her profile. User can have the prefilled values once he/she clicks on the country dropdown. The `My Profile` link is on the top right.
2. User can do a chat session with multiple people. You can open `http://localhost:8080` in various new session browsers and try posting message in the chat.
3. For the purpose of simplicity, the app polls after every `10000 ms` to check whether the time the user logged in and the time the user last messaged is greater than 5 mins. If it is greater, the user gets inactive and it is removed from the active users list.
4. Active users are shown on the left side with green dot under `All Users`. Inactive users are removed from the active user list.
5. Once the user joins the chat room, a message is being posted. When the user becomes inactive according to above mentioned logic, a message that the user is inactive is posted.
6. User can do a chat session with single people. The chats are aligned as tabs with the names of the respective chat partners.

The screen flow are hosted below:

https://gfycat.com/ifr/WelltodoSandyHare


## Folder structure

1. `config` contains all the webpack configuration
2. `bin` contains the server side socket io code
3. `src` contains the `app`.
4. `app` is subdivided into multiple feature components of `active-inactive`, `chat` and `profile`. It also contains `services` at the folder level.

## Code Walkthrough

1. There are mainly two services which are injected. `chat.service.ts` and `profile.service.ts`
2. Each feature folder contains `component`, `scss` and `html`.
3. The app can also handle `routing`.
4. All the components, provider, directives are bootstraped in `app.component`
