var express = require('express');
var morgan = require('morgan');
var path = require('path');
var app = express();
var Pool=require('pg').Pool;
var crypto=require('crypto');
var bodyParser=require('body-parser');
var session=require('express-session')
var config={
	user:'postgres',
	database:'dbms',
	host:'localhost',
	port:'5432',
	password:'0000'
};

var pool=new Pool(config);
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
	secret:'somerandomvalue',
	cookie: {maxAge:(1000*60*24*30)}
}));


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/logo.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'logo.png'));
});

app.get('/ui/background.png', function(req, res){
	res.sendFile(path.join(__dirname, 'ui', 'background.png'));
});

//For sign-up
app.get('/ui/create-user.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'create-user.js'));
});
app.get('/sign-up',function(req,res){
res.sendFile(path.join(__dirname, 'ui', 'sign-up.html'));
});

//Home page
app.get('/home',function(req,res){
res.sendFile(path.join(__dirname, 'ui', 'home.html'));
});

//New Message
app.get('/ui/new-message.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'new-message.js'));
});
app.get('/new-message',function(req,res){
res.sendFile(path.join(__dirname, 'ui', 'new-message.html'));
});



function hash(input,salt){
	var hashed=crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
	return ['pbkdf2',10000,salt,hashed.toString('hex')].join('$');
}

app.post('/create-user',function(req,res){
	var username=req.body.username;
	var password=req.body.password;

	var salt=crypto.randomBytes(128).toString('hex');
	var dbString=hash(password,salt);
	pool.query('Insert into "user" (username,password) values ($1,$2)',[username,dbString],function(err,result){
		
		if(err)
		{
			if(err.toString()==='error: duplicate key value violates unique constraint "user_username"')
			{
				res.status(403).send(err.toString());
			}
			else
			{
				res.status(500).send(err.toString());
			}
		}
		else
		{
			res.send("User successfully created"+username);
		}
	});
});

app.post('/login', function(req,res){
	var username=req.body.username;
	var password=req.body.password;

	pool.query('select * from "user" where username=$1', [username],function(err,result){
		if(err)
		{
			console.log("error: we're here.");
			console.log(err.toString());
			res.status(500).send(err.toString());
		}
		else
		{
			if(result.rows.length===0)
				{
					res.status(403).send("Username/password is invalid");
				}
			else		
			{
				var dbString=result.rows[0].password;
				console.log(dbString);
				var salt=dbString.split('$')[2];
				var hashedPassword=hash(password,salt);
				if(hashedPassword===dbString)
				{
					req.session.auth={username:result.rows[0].username};
					res.send("User successfully logged in");
				}
				else
				{
					res.status(403).send("Username/password is invalid");
				}

			}
		}
	});
});


app.get('/check-login', function(req, res){
	if(req.session && req.session.auth && req.session.auth.username)
	{
		res.send('You are logged in as '+req.session.auth.username.toString());
	}
	else
	{
		res.send('You are not logged in');
	}
});

app.get('/logout',function(req,res){
	delete req.session.auth;
	res.send('you are logged out');
});

//new message
app.post('/new-message',function(req,res){
	var receiver=req.body.receiver;
	var content=req.body.content;
	var sender=req.session.auth.username.toString();

	console.log(sender);
	console.log(receiver);
	console.log(content);

	pool.query('Insert into "message" (sender,receiver,content) values ($1,$2,$3)',[sender,receiver,content],function(err,result){
		
		if(err)
		{
			if(err.toString()==='error: insert or update on table "message" violates foreign key constraint "message_receiver_fkey"')
			{
				res.status(403).send(err.toString());
			}
			else
			{
				res.status(500).send(err.toString());
			}
		}
		else
		{
			res.send("Message Sent");
		}
	});
});

var port = 1111;
app.listen(port, function () {
  console.log(`MESSENGER app listening on port ${port}!`);
});