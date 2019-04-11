var express=require('express');
var mysql=require('mysql');
var db=require('./models/database');
var path=require('path');
var bodyParser=require('body-parser');
var expressValidator=require('express-validator');
var session=require('express-session');
var home=require('./routes/home');

var app=express();

db.connect(err=>{
  if(err){
    console.log(err);
  }
  else{
    console.log('Connected to mysql');
  }
});

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));

app.locals.errors=null;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  // cookie: { secure: true }
}));

app.use('/',home);

var port=3000;
app.listen(port,function(){
  console.log('Server is running on Port:'+port);
});