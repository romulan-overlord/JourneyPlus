<!-- ABOUT THE PROJECT -->
## About The Project

This is an expansive journalling web application with networking possible, allowing users to publish beautifully crafted entries as blogs easily accessible to their network.

What expansive journalling entails:
* The traditional feeling of journalling is retained with the text component.
* Add snippets of your memories not describable by words in the form of pictures, videos and audios.
* Turn your journal entry into an experience in itself with customisable background images and background audio.
* Collaborate with your friends to create journal entries together in real time.






### Built With

* [![MongoDB][MongoDB.com]][Mongo-url]
* [![Express][Express.js]][Express-url]
* [![React][React.js]][React-url]
* [![Node][Node.js]][Node-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]
* [![MUI][Material.ui]][MUI-url]
* [![JQuery][JQuery.com]][JQuery-url]
* [![NPM][NPM.com]][NPM-url]
* [![Socket][Socket.io]][Socket-url]






<!-- GETTING STARTED -->
## Getting Started

Follow these steps to have the application running on your own device

### Prerequisites

Install the following prerequisites:
* nodeJS
* mongoDB

Setup your mongoDB database by running mongod.
The project will create a database named projectDB.


### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/romulan-overlord/Project-1.git
   ```
2. Install NPM packages in backend
   ```sh
   cd ./backend
   npm install
   ```
3. Start up the backend server
   ```sh
   npm run dev
   ```
4. Start up the socket server to allow synchronised editing:
   ```sh
   npm run sync
   ```
5. Install NPM packages in frontend
   ```sh
   cd ./frontend
   npm install
   ```
6. Start up the frontend server
   ```sh
   npm start
   ```
The website will start up on port `3000`

Note: Change the url of the ExpressIP constant in `settings.js` in frontend to your backend server's url.


### System Layout

![System Layout](https://user-images.githubusercontent.com/77074247/235598941-5adca827-c1bb-441a-953b-65ac69b93b99.png)




<!-- MARKDOWN LINKS & IMAGES -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
[MongoDB.com]: https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white
[Mongo-url]: https://www.mongodb.com/
[Express.js]: https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[Material.ui]: https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=mui&logoColor=white
[MUI-url]: https://mui.com/
[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[NPM.com]: https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white
[NPM-url]: https://www.npmjs.com/
[Socket.io]: https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=Socket.io&logoColor=white
[Socket-url]: https://socket.io/
[Yarn.com]: https://img.shields.io/badge/Yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white

[CSS.3]: https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white
[HTML.5]: https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white
[Javascript]: https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E
[JSON]: https://img.shields.io/badge/json-5E5C5C?style=for-the-badge&logo=json&logoColor=white
