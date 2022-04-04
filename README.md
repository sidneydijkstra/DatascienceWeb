
  
# DatascienceWeb
This is a node.js express website for managing an database contain information about movies, series, writers and more. The project is created using bootstrap and .ejs in the front-end and javascript in the back-end with express. An database is hosted on a different server containing all the data. Below here is some information about the dependencies and the setup of the database.
  
### Dependencies  
This list contains all the dependencies used by the project.
```
+-- cookie-parser@1.4.6
+-- debug@2.6.9
+-- dotenv@16.0.0
+-- ejs@3.1.6
+-- express-session@1.17.2
+-- express-validator@6.14.0
+-- express@4.16.4
+-- http-errors@1.6.3
+-- morgan@1.9.1
+-- mysql@2.18.1
`-- nodemon@2.0.15 
```  
All these dependencies can be install with one simple command:
```
npm install
```

### Env
To set up the database we will direct you to [this] python project and [\[this\]](https://github.com/Medooosa/Csharp-Parser) C# project for parsing all the data to .csv format. The connection with the database is established using the variables in the .env file. Create this file and add these parameters to connect with the database.
```
DATABASE_POOL_LIMIT=20
DATABASE_IP=
DATABASE_PORT=
DATABASE_USERNAME=
DATABASE_PASSWORD=
```

### Run
For running the project we can use two commands one for running it in developer mode and one for release mode.

Developer:
```
npm run devstart
```
Release:
```
npm run start
```
