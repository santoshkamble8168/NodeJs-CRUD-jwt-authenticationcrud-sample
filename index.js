const express = require('express');
const config = require('./settings/config');
const bodyParser = require('body-parser');
const path = require('path');

//Instance on an App
const app = express();

//Parsing incoming requests 
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: 512000, type: 'application/json'}));

//Publicly available directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/postImages',express.static('postImages'));

//routers
const router = require('./routes');
app.use('/api/user', router.user);
app.use('/api/posts', router.posts);

app.listen(config.app.port,()=> console.log(`Server is running on Port ${config.app.port}`))