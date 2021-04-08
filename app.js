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
	// check if player already exists
	client.query("SELECT * FROM userlist WHERE username = '"+username+"';", (err, outcome) => {   
		if (err) throw err;
		else {
			if (outcome.rows.length>0) {
				var output=JSON.stringify({Status: "FAILED",StatusDescription: "User already exists."});
				res.send(output)
				console.log("This user already exists...")
			}
			else {
				var accountcreated = (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ');
				var lastonline = (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ');
				var highscoreposted = (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ');
			
				client.query("INSERT INTO userlist(username, displayname, accountcreated, lastonline, score, highscoreposted, banned) VALUES ('"+username+"','NoNameYet','"+accountcreated+"','"+lastonline+"', 0,'"+highscoreposted+"',0);", (err, outcome) => {   
					if (err) throw err;
					else {
						var output=JSON.stringify({Status:"SUCCESS",StatusDescription: "User created"});
						res.send(output)
						console.log("User Created in database")
					}
				})
			}
		}
	})
})

app.get('/player/delete/:username',function(req,res){
	var username=req.params.username;
	console.log("Delete Player Request received for username: "+username)
	// check if player already exists
	client.query("SELECT * FROM userlist WHERE username = '"+username+"';", (err, outcome) => {   
		if (err) throw err;
		else {
			if (outcome.rows.length==0) {
				var output=JSON.stringify({Status: "FAILED",StatusDescription: "User doesn't exist."});
				res.send(output)
				console.log("FAILED: User doesn't exist.")
			}
			else {
				client.query("DELETE FROM userlist WHERE username = '"+username+"';", (err, outcome) => {   
					if (err) throw err;
					else {
						var output=JSON.stringify({Status: "SUCCESS",StatusDescription: "User deleted."});
						res.send(output)
						console.log("SUCCESS: User deleted.")
					}
				})
			}
		}
	})
})

app.get('/player/info/:username',function(req,res){
	res.setHeader('Content-Type', 'application/json');
	var username=req.params.username;
	console.log("Info Player Request received for username: "+username)
	// check if player already exists
	client.query("SELECT * FROM userlist WHERE username = '"+username+"';", (err, outcome) => {   
		if (err) throw err;
		else {
			if (outcome.rows.length==0) {
				var output=JSON.stringify({Status: "FAILED",StatusDescription: "User doesn't exist."});
				res.send(output)
				console.log("FAILED: User doesn't exist.")
			}
			else {

				var output=JSON.stringify({Status:"SUCCESS",StatusDescription: "User found.",PlayerData: {userid: outcome.rows[0].userid,username:outcome.rows[0].username,displayname:outcome.rows[0].displayname,accountcreated:outcome.rows[0].accountcreated,lastonline:outcome.rows[0].lastonline,score:outcome.rows[0].score,highscoreposted:outcome.rows[0].highscoreposted,banned:outcome.rows[0].banned}})
				res.send(output);
				console.log("SUCCESS: User found.")
			}
		}
	})
})

app.get('/player/namechange/:username/:newdisplayname',function(req,res){
	res.setHeader('Content-Type', 'application/json');
	var username=req.params.username;
	var newdisplayname=req.params.newdisplayname;
	console.log("Name Change Request received for username: "+username)
	// check if player already exists
	client.query("SELECT * FROM userlist WHERE username = '"+username+"';", (err, outcome) => {   
		if (err) throw err;
		else {
			if (outcome.rows.length==0) {
				var output=JSON.stringify({Status: "FAILED",StatusDescription: "User doesn't exist."});
				res.send(output)
				console.log("FAILED: User doesn't exist.")
			}
			else {
				client.query("UPDATE userlist SET displayname= '"+newdisplayname+"' WHERE username='"+username+"';", (err, outcome) => {   
					if (err) throw err;
					else {
						var output=JSON.stringify({Status:"SUCCESS",StatusDescription: "Displayname updated."});
						res.send(output)
						console.log("SUCCESS: display name changed")
					}
				})
			}
		}
	})
})

app.get('/player/login/:username',function(req,res){
	res.setHeader('Content-Type', 'application/json');
	var username=req.params.username;
	console.log("Login Request received for username: "+username)
	// check if player already exists
	client.query("SELECT * FROM userlist WHERE username = '"+username+"';", (err, outcome) => {   
		if (err) throw err;
		else {
			if (outcome.rows.length==0) {
				console.log("User with username: "+username+" does not exist yet. Creating...")
				
				var accountcreated = (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ');
				var lastonline = (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ');
				var highscoreposted = (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ');
				
				//create the user
				client.query("INSERT INTO userlist(username, displayname, accountcreated, lastonline, score, highscoreposted, banned) VALUES ('"+username+"','NoNameYet','"+accountcreated+"','"+lastonline+"', 0,'"+highscoreposted+"',0);", (err, outcome) => {   
					if (err) throw err;
					else {



						var output=JSON.stringify({Status:"SUCCESS",StatusDescription: "User created", BannedState: "0"});
						res.send(output)
						console.log("User Created in database")
					}
				})

				var output=JSON.stringify({Status: "SUCCESS",StatusDescription: "User Created."});
				res.send(output)
				console.log("SUCCESS: User Created.")
			}
			else {
				var lastonline = (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ');

				client.query("UPDATE userlist SET lastonline= '"+lastonline+"' WHERE username='"+username+"';", (err, outcome) => {   
					if (err) throw err;
					else {
						//get user info
						client.query("SELECT * FROM userlist WHERE username = '"+username+"';", (err, outcome) => {   
							if (err) throw err;
							else {
								var output=JSON.stringify({Status:"SUCCESS",StatusDescription: "Player logged in.",BannedState: outcome.rows[0].banned});
								//res.send(output)
								console.log("SUCCESS: Player logged in")
							}
						})

					}
				})
			}
		}
	})
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

app.get('/database/deleteone/userid/:userid',function(req,res){
	client.query("DELETE FROM userlist WHERE userid = "+req.params.userid+";", (err, outcome) => {   
		if (err) throw err;
		else {
			res.send(outcome)
			console.log("DELETE ONE requested: responded SUCCESS")
		}
	})
})

app.get('/database/deleteone/username/:username',function(req,res){
	client.query("DELETE FROM userlist WHERE username = "+req.params.username+";", (err, outcome) => {   
		if (err) throw err;
		else {
			res.send(outcome)
			console.log("DELETE ONE requested: responded SUCCESS")
		}
	})
})


