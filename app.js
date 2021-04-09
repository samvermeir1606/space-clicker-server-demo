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
				console.log("TODO: Use the 'banned since' and 'banned until' to determine if someone is still banned and set the dates in the database")

				console.log("User found")
				var lastonline = (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ');
				var previouslastonline=outcome.rows[0].lastonline;
				client.query("UPDATE userlist SET lastonline= '"+lastonline+"' WHERE username='"+username+"';", (err, outcomeupdate) => {   
					if (err) throw err;
					else {
						console.log("User updated")
						//get user info
						client.query("SELECT * FROM userlist WHERE username = '"+username+"';", (err, outcomegetinfo) => {   
							if (err) throw err;
							else {
								var output=JSON.stringify({Status:"SUCCESS",StatusDescription: "Player logged in.",lastonline:previouslastonline,BannedState: outcome.rows[0].banned});
								res.send(output)
								console.log("SUCCESS: Player logged in")
							}
						})

					}
				})
			}
		}
	})
})

app.get('/player/scorechange/:username/:newscore',function(req,res){
	res.setHeader('Content-Type', 'application/json');
	var username=req.params.username;
	var newscore=req.params.newscore;
	console.log("Score Change Request received for username: "+username)
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
				if (newscore<=outcome.rows[0].score) {
						var output=JSON.stringify({Status:"FAILED",StatusDescription: "Score not higher."});
						res.send(output)
						console.log("FAILED: Score not higher.")
				}
				else {
					client.query("UPDATE userlist SET score= '"+newscore+"' WHERE username='"+username+"';", (err, outcome) => {   
						if (err) throw err;
						else {
							var output=JSON.stringify({Status:"SUCCESS",StatusDescription: "Score updated."});
							res.send(output)
							console.log("SUCCESS: Score changed.")
						}
					})
				}
			}
		}
	})
})

app.get('/player/ban/set/:username/:banstate',function(req,res){
	res.setHeader('Content-Type', 'application/json');
	var username=req.params.username;
	var banstate=req.params.banstate;
	console.log("Ban Change Request received for username: "+username)
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
				console.log("TODO: Use the 'banned since' and 'banned until' to determine if someone is still banned and set the dates in the database")
				client.query("UPDATE userlist SET banned= '"+banstate+"' WHERE username='"+username+"';", (err, outcome) => {   
					if (err) throw err;
					else {
						var output=JSON.stringify({Status:"SUCCESS",StatusDescription: "Ban updated."});
						res.send(output)
						console.log("SUCCESS: Ban changed")
					}
				})
			}
		}
	})
})

app.get('/player/ban/info/:username',function(req,res){
	res.setHeader('Content-Type', 'application/json');
	var username=req.params.username;
	console.log("Ban Info Request received for username: "+username)
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
				var output=JSON.stringify({Status:"SUCCESS",StatusDescription: "Ban info.",BanInfo:{BanStatus:outcome.rows[0].banned,BannedSince:outcome.rows[0].bannedsince,BannedUntil:outcome.rows[0].banneduntil}});
				res.send(output)
				console.log("SUCCESS: Ban info.")
			}
		}
	})
})






// RANK ENDPOINTS
app.get('/rank/top/:amount',function(req,res){
	var amount=req.params.amount;
	console.log("Top Rank Request received for amount: "+amount)
	// check if player already exists
	client.query("SELECT * FROM userlist ORDER BY score DESC LIMIT "+amount+";", (err, outcome) => {   
		if (err) throw err;

		else {
			var localRanks=[amount];
			for (var i = 0; i < outcome.rows.length; i++) {
				console.log("retrieving profile data for "+i)
				console.log(outcome.rows[i])
				var Profile={DisplayName:outcome.rows[i].displayname,Score:outcome.rows[i].score}
				//localRanks[i]=Profile;
			}
			var ouput=JSON.stringify({Status: "FAILED",StatusDescription: "User already exists.",Ranks:localRanks})
			res.send(output)
			console.log("SUCCES: Top Rank responded")
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


