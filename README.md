
# webapp

## Description
![image](https://user-images.githubusercontent.com/45126152/123145707-66ff8180-d45d-11eb-8c46-748723f733fd.png)

The tv show library is a website that users can view the tv shows description. They can search for different genres. Each genre contains one or more shows. Users has the abilitly to add genres and tv shows to the library.
**Link to our website:**
https://glacial-journey-47796.herokuapp.com/catalog

## Technical details

To start with we used express application generator. This helped us with creating a skeleton for our application. In the backend implementation we used node.js as a server. We used Mongoose as our database of choice. Mongoose is a MongoDB object modeling tool and acts as a frontend to MongoDB. In this application MongoDB Atlas is utilized. We managed to populate an amount of data. The data was rendered as HTML to be able to display it to the user. We worked with HTML forms using pug, for example we wrote HTML form to create tv show and genre. We used routes to support forward requests to the suitable controller function. Initially the GET routes is used to display an empty form for creating the tv show and genre, another route which is POST is used to validate the data and saving the information to the database.The functions written in the controllers can get the rquested data from the models. These are followed by creating a HTML page to display the data to the user.

![image](https://user-images.githubusercontent.com/45126152/122805864-eb210000-d2c9-11eb-897f-d81822154aea.png)

## Software and other

* Visual Studio Code
* JavaScript
* pug
* HTML
* CSS

## Dependencies

    "@hapi/joi": "^17.1.1",
    "async": "^3.2.0",
    "bcrpyt": "^2.0.0",
    "bcryptjs": "^2.4.3",
    "connect-flash": "^0.1.1",
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "dotenv": "^10.0.0",
    "express": "~4.16.1",
    "express-session": "^1.17.2",
    "express-validator": "^6.10.1",
    "http-errors": "~1.6.3",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^5.12.7",
    "morgan": "~1.9.1",
    "node-pre-gyp": "^0.17.0",
    "passport": "^0.4.1",
    "passport-local": "^1.0.0",
    "pug": "^3.0.2",
    "save": "^2.4.0",
    "touch": "^3.1.0"
