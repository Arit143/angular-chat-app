# angular-chat-app
An angular chat app with web socket

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

## WIP

### What has been done?

1. User can see his/her profile. User can have the prefilled values once he/she clicks on the country dropdown. The `My Profile` link is on the top right.
2. User can do a chat session with multiple people. You can open `http://localhost:8080` in various new session browsers and try posting message in the chat.
3. User gets inactive after approx 1000 seconds. It checks when the user logged in and when the user last posted the message. Note: User has to join the chat before posting any message else socket connected can not be made. (just a mechanism to continue the session)
4. Active users are shown on the left side with green dot under `All Users`. Inactive users are removed from the active user list.
5. Once the user joins the chat room, a message is being posted. When the user becomes inactive according to above mentioned logic, a message that the user is inactive is posted.

### What has not been done?

1. User cannot do a single message chat. `Whereever the functionality to support the single message chat is present`.
2. CSS is not proper.
3. Chats can be presented in a better way.
4. When user creates a new session window, after he joins, he should be able to see the active users. Now only the person ables to see all the active users who has joined the chat before the other person joins(new user who has joined the chat room cannot see previously active users). All the users should be able to see all active and inactive users after he joins the chat room.

## Folder structure

1. `config` contains all the webpack configuration
2. `bin` contains the server side socket io code
3. `src` contains the `app`.
4. `app` is subdivided into multiple feature components of `active-inactive`, `chat` and `profile`. It also contains `services` at the folder level.

## Code Walkthrough

1. There are mainly two services which are injected. `chat.service.ts` and `profile.service.ts`
2. Each feature folder contains `component`, `scss` and `html`.
3. The app can also handle `routing`.
4. All the components, provides, directives are bootstraped in `app.component`
