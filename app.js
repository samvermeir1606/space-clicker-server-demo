const express = require('express')
const app = express()
const port = 3000
const tableName="userlist"



const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
client.connect();



app.listen(process.env.PORT || port, () => {
  	console.log(`Example app listening at http://localhost:${port}`)
  	console.log("")
})


app.get('/', (req, res) => {
	res.send("OK")
	console.log("Get request for `/` received")
})


// PLAYER ENDPOINTS
app.get('/player/create/:username',function(req,res){
	var username=req.params.username;
	console.log("Create Player Request received for username: "+username)
	var UserExists=false;
	// check if player already exists
	client.query("SELECT * FROM userlist WHERE username = '"+username+"';", (err, outcome) => {   
		if (err) throw err;
		else {
			if (outcome.rows.length>0) {
				UserExists=true;
			}
		}
	})

	if (UserExists) {
		res.send("User already exists")
		console.log("This user already exists...")
	}
	else {
		var accountcreated=	var formatedMysqlString = (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ');
		var lastonline=	var formatedMysqlString = (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ');
		var highscoreposted=	var formatedMysqlString = (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ');
	
		client.query("INSERT INTO userlist(username, displayname, accountcreated, lastonline, score, highscoreposted, banned) VALUES ('"+username+"','NoNameYet',"+accountcreated+","+lastonline+", 0,"+highscoreposted+",0);", (err, outcome) => {   
			if (err) throw err;
			else {
				res.send("User Created in database")
				console.log("User Created in database")
			}
		})
	}








})








//DATABASE Endpoints
app.get('/database/showall',function(req,res){
	client.query("SELECT * FROM userlist;", (err, outcome) => {   
		if (err) throw err;
		else {
			res.send(outcome.rows)
			console.log("ShowAll requested: responded SUCCESS")
		}
	})
})

app.get('/database/deleteall',function(req,res){
	client.query("DELETE FROM userlist WHERE userid > 0;", (err, outcome) => {   
		if (err) throw err;
		else {
			res.send(outcome)
			console.log("DELETE ALL requested: responded SUCCESS")
		}
	})
})

app.get('/database/deleteone/:userid',function(req,res){
	client.query("DELETE FROM userlist WHERE userid = "+req.params.userid+";", (err, outcome) => {   
		if (err) throw err;
		else {
			res.send(outcome)
			console.log("DELETE ONE requested: responded SUCCESS")
		}
	})
})
