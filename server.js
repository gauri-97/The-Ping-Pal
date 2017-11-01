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
	password:'0000',
	dateStrings:'date'
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

//Inbox
app.get('/inbox',function(req,res){
res.sendFile(path.join(__dirname,'ui','inbox.html'));
});

app.get('/ui/inbox.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'inbox.js'));
});

//Admin Page
app.get('/admin-page',function(req,res){
res.sendFile(path.join(__dirname,'ui','admin-page.html'));
});

app.get('/ui/auth-check.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'auth-check.js'));
});

app.get('/ui/admin-page.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'admin-page.js'));
});
//Edit profile
app.get('/profile',function(req,res){
res.sendFile(path.join(__dirname,'ui','profile.html'));
});

app.get('/ui/profile.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'profile.js'));
});

function hash(input,salt){
	var hashed=crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
	return ['pbkdf2',10000,salt,hashed.toString('hex')].join('$');
}

app.post('/create-user',function(req,res){
	var username=req.body.username;
	var password=req.body.password;
	var mobile=req.body.mobile;
	var address=req.body.address;
	var age=req.body.age;
	var gender=req.body.gender;

	var salt=crypto.randomBytes(128).toString('hex');
	var dbString=hash(password,salt);
	pool.query('Insert into "user" (username,password,mobile,address,age,gender) values ($1,$2,$3,$4,$5,$6)',[username,dbString,mobile,address,age,gender],function(err,result){
		
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
	res.sendFile(path.join(__dirname, 'ui', 'index.html'));

});

//new message
app.post('/new-message',function(req,res){
	var receiver=req.body.receiver;
	var content=req.body.content;
	var sender=req.session.auth.username.toString();
	var time=new Date();
	var options = { 
	day: "numeric", year: "numeric", month: "numeric",  
    hour: "2-digit", minute: "2-digit", second: "2-digit"
	};
	time = time.toLocaleTimeString("en-in", options);  
	

	pool.query('Insert into "message" (sender,receiver,content,time) values ($1,$2,$3,$4)',[sender,receiver,content,time],function(err,result){
		
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
//INBOX
app.get('/fetch-message', function(req, res){
	if(req.session && req.session.auth && req.session.auth.username)
	{
		var receiver=req.session.auth.username.toString();
		
		pool.query('select sender,content,time from "message" where receiver=$1 order by time desc', [receiver],function(err,result){
			if(err)
			{	
				if(result.rows.length===0)
				{	
					res.status(403).send(err.toString());

				}
				else
				{	
					console.log('something went wrong');
					res.status(500).send(err.toString());
				}
			}
			else
			{
				res.send(JSON.stringify(result.rows));
			}
		});
	}
	else
	{	
		
		res.send('You are not logged in');
	}
});

//Admin-page
app.get('/admin',function(req,res){
	var user=req.session.auth.username.toString();

	pool.query('select username from "admin" where username=$1',[user],function(err,result){
		if(err)
		{
		
				res.status(500).send("Something went wrong");
		}
		else
		{
			if(result.rows.length===0)
			{
				res.status(403).send("You're not authorized as an Admin");
			}
			else
			{
				res.status(200).send("You're logged in as an Admin");
			}
		}
	});
});

//del-user
app.get('/get-user', function(req, res){
	if(req.session && req.session.auth && req.session.auth.username)
	{
		var user=req.session.auth.username.toString();		
		pool.query('select username from "user" where username!=$1 order by username asc', [user],function(err,result){
			if(err)
			{	
				if(result.rows.length===0)
				{	
					res.status(403).send(err.toString());

				}
				else
				{	
					console.log('something went wrong');
					res.status(500).send(err.toString());
				}
			}
			else
			{
				res.send(JSON.stringify(result.rows));
			}
		});
	}
	else
	{	
		
		res.send('You are not logged in');
	}
});

app.post('/del-user', function(req, res){
		var user=req.body.user;		
		pool.query('Delete from "user" where username=$1 ', [user],function(err,result){
			if(err)
			{	

					console.log('something went wrong');
					res.status(500).send(err.toString());
			}
			else
			{
				res.status(200).send('User successfully deleted');
			}
		});
});
//Del-msg
app.get('/get-msg', function(req, res){
	if(req.session && req.session.auth && req.session.auth.username)
	{		
		pool.query('select sno,sender,receiver,content,time from "message" order by time desc',function(err,result){
			if(err)
			{	
				if(result.rows.length===0)
				{	
					res.status(403).send(err.toString());

				}
				else
				{	
					console.log('something went wrong');
					res.status(500).send(err.toString());
				}
			}
			else
			{
				res.send(JSON.stringify(result.rows));
			}
		});
	}
	else
	{	
		
		res.send('You are not logged in');
	}
});
app.post('/del-msg', function(req, res){
		var sno=req.body.sno;		
		pool.query('Delete from "message" where sno=$1', [sno],function(err,result){
			if(err)
			{	

					console.log('something went wrong');
					res.status(500).send(err.toString());
			}
			else
			{
				res.status(200).send('Message successfully deleted');
			}
		});
});
//View Your profile
app.get('/fetch-details', function(req, res){
	if(req.session && req.session.auth && req.session.auth.username)
	{
		var user=req.session.auth.username.toString();
		
		pool.query('select username,mobile,address,age,gender from "user" where username=$1 ', [user],function(err,result){
			
			if(err)
			{	
				if(result.rows.length===0)
				{	
					res.status(403).send(err.toString());

				}
				else
				{	
					console.log('something went wrong');
					res.status(500).send(err.toString());
				}
			}
			else
			{
				res.send(JSON.stringify(result.rows));
			}
		});
	}
	else
	{	
		
		res.send('You are not logged in');
	}
});
var port = 1111;
app.listen(port, function () {
  console.log(`MESSENGER app listening on port ${port}!`);
});