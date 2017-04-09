const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');

//Create Redis Client
let client = redis.createClient();

client.on('connect', function(){
    console.log('connected to redis...');
});

// Set Port
const port = 3000;

// init app
const app = express();

// View Engine
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//methodOverride
app.use(methodOverride('_method'));

//The Search Page
app.get('/', function(req, res, next){
    res.render('searchusers');
});

//Proccessing A Search
app.post('/user/search', function(req, res, next){
    let id = req.body.id;

    client.hgetall(id, function(err, obj){
        if(!obj){
            res.render('searchusers', {
               error: 'user does not exist'
            });
        } else {
            obj.id = id;
            res.render('details', {
                user: obj
            });
        }
    });
});

app.listen(port, function(){
    console.log("server started on port " + port);
});