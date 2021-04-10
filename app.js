const express = require('express')
const app = express()
const port = 3000
const tableName="userlist"
var cors = require('cors')



const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
client.connect();


app.use(cors())
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
						var output=JSON.stringify({Status: "SUCCESS",StatusDescription: "User Created."});
						res.send(output)
						console.log("SUCCESS: User Created.")
					}
				})
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
								var output=JSON.stringify({Status:"SUCCESS",StatusDescription: "Player logged in.",lastonline:previouslastonline,BannedState: outcomegetinfo.rows[0].banned,Score:outcomegetinfo.rows[0].score});
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
					var highscoreposted = (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ');

					client.query("UPDATE userlist SET score= '"+newscore+"', highscoreposted='"+highscoreposted+"' WHERE username='"+username+"';", (err, outcome) => {   
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
	res.setHeader('Content-Type', 'application/json');
	var amount=req.params.amount;
	console.log("Top Rank Request received for amount: "+amount)
	// check if player already exists
	client.query("SELECT * FROM userlist ORDER BY score DESC LIMIT "+amount+";", (err, outcome) => {   
		if (err) throw err;
		else {
			var localRanks=[outcome.rows.length];
			for (var i = 0; i < outcome.rows.length; i++) {
				//console.log("retrieving profile data for "+i)
				//console.log(outcome.rows[i])
				var Profile={DisplayName:outcome.rows[i].displayname,Score:outcome.rows[i].score,Rank:i+1}
				localRanks[i]=Profile;
			}
			var output=JSON.stringify({Status: "SUCCESS",StatusDescription: "Top "+amount+" rank.",Ranks:localRanks})
			res.send(output)
			console.log("SUCCES: Top Rank responded")
		}
	})
})

app.get('/rank/playerrank/:username',function(req,res){
	res.setHeader('Content-Type', 'application/json');
	var username=req.params.username;
	console.log("Player Rank Request received for username: "+username)
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
				client.query("SELECT * FROM userlist ORDER BY score DESC;", (err, outcome) => {   
					if (err) throw err;
					else {
						var localplayerrank=0;
						for (var i = 0; i < outcome.rows.length; i++) {
							localplayerrank+=1
							if (outcome.rows[i].username==username) {
								break;
							}
						}
						var localLowerPlayer=null;
						var localHigherPlayer=null;
			
						//Set the higherplayer
						if (localplayerrank-1==0) {
							localHigherPlayer=null;
						}
						else {
							localHigherPlayer={DisplayName:outcome.rows[localplayerrank-2].displayname,Score:outcome.rows[localplayerrank-2].score};
						}
			
						// Set the lowerplayer
						if (localplayerrank==outcome.rows.length) {
							localLowerPlayer=null;
						}
						else {
							localLowerPlayer={DisplayName:outcome.rows[localplayerrank].displayname,Score:outcome.rows[localplayerrank].score};
						}
						var output=JSON.stringify({Status: "SUCCESS",StatusDescription: "Player Rank.",PlayerRank:localplayerrank,HigherPlayer:localHigherPlayer,LowerPlayer:localLowerPlayer})
			
						res.send(output)
						console.log("SUCCES: Player Rank responded")
					}
	})


			}
		}
	})
	//TODO: check if player exists!!!
})

app.get('/rank/getplayer/rank/:rank',function(req,res){
	res.setHeader('Content-Type', 'application/json');
	var localrank=req.params.rank;
	console.log("Player At Rank Request received for rank: "+localrank)

	// check if player already exists
	client.query("SELECT * FROM userlist;", (err, outcome) => {   
		if (err) throw err;
		else {
			if (localrank>outcome.rows.length) {
				var output=JSON.stringify({Status: "FAILED",StatusDescription: "Rank doesn't exist."});
				res.send(output)
				console.log("FAILED: Rank doesn't exist.")
			}
			else {
				client.query("SELECT * FROM userlist ORDER BY score DESC;", (err, outcomeOrder) => {   
					if (err) throw err;
					else {

						var localplayerrank=localrank;
						var localLowerPlayer=null;
						var localHigherPlayer=null;
			
						//Set the higherplayer
						if (localplayerrank-1==0) {
							localHigherPlayer=null;
						}
						else {
							localHigherPlayer={DisplayName:outcomeOrder.rows[localplayerrank-2].displayname,Score:outcomeOrder.rows[localplayerrank-2].score};
						}
			
						// Set the lowerplayer
						if (localplayerrank==outcomeOrder.rows.length) {
							localLowerPlayer=null;
						}
						else {
							localLowerPlayer={DisplayName:outcomeOrder.rows[localplayerrank].displayname,Score:outcomeOrder.rows[localplayerrank].score};
						}

						var output=JSON.stringify({Status: "SUCCESS",StatusDescription: "Player Rank.",PlayerData:{DisplayName:outcomeOrder.rows[localplayerrank-1].displayname,Score:outcomeorder.rows[localplayerrank-1].score},PlayerRank:localplayerrank,HigherPlayer:localHigherPlayer,LowerPlayer:localLowerPlayer})
			
						res.send(output)
						console.log("SUCCES: Player Rank responded")
					}
	})


			}
		}
	})
	//TODO: check if player exists!!!
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

app.get('/database/deleteone/rank/:rank',function(req,res){
	client.query("SELECT * FROM userlist;", (err, outcome) => {   
		if (err) throw err;
		else {
			if (req.params.rank>outcome.rows.length) {
				var output=JSON.stringify({Status: "FAILED",StatusDescription: "Rank doesn't exist."});
				res.send(output)
				console.log("FAILED: Rank doesn't exist.")
			}
			else {

				client.query("SELECT * FROM userlist ORDER BY score DESC;", (err, outcomeOrder) => {   
					if (err) throw err;
					else {
						client.query("DELETE FROM userlist WHERE userid= "+outcomeOrder.rows[req.params.rank-1].userid+";", (err, outcomeDelete) => {   
							if (err) throw err;
							else {
								var output=JSON.stringify({Status: "SUCCESS",StatusDescription: "Deleted player at rank.",Data:outcomeDelete})
								res.send(output)
								console.log("SUCCES: Delete Player Rank responded")
		
							}
						})

					}
				})
			}
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

app.get('/database/showatrank/:rank',function(req,res){
	res.setHeader('Content-Type', 'application/json');
	var localrank=req.params.rank;
	console.log("SHOW Player At Rank Request received for rank: "+localrank)

	// check if player already exists
	client.query("SELECT * FROM userlist;", (err, outcome) => {   
		if (err) throw err;
		else {
			if (localrank>outcome.rows.length) {
				var output=JSON.stringify({Status: "FAILED",StatusDescription: "Rank doesn't exist."});
				res.send(output)
				console.log("FAILED: Rank doesn't exist.")
			}
			else {
				client.query("SELECT * FROM userlist ORDER BY score DESC;", (err, outcomeorder) => {   
					if (err) throw err;
					else {

						var localplayerrank=localrank;
						var localLowerPlayer=null;
						var localHigherPlayer=null;
			
						//Set the higherplayer
						if (localplayerrank-1==0) {
							localHigherPlayer=null;
						}
						else {
							localHigherPlayer={DisplayName:outcomeorder.rows[localplayerrank-2].displayname,Score:outcomeorder.rows[localplayerrank-2].score};
						}
			
						// Set the lowerplayer
						if (localplayerrank==outcomeorder.rows.length) {
							localLowerPlayer=null;
						}
						else {
							localLowerPlayer={DisplayName:outcomeorder.rows[localplayerrank].displayname,Score:outcomeorder.rows[localplayerrank].score};
						}
						var localPlayerdata=outcomeorder.rows[localplayerrank-1]
						var output=JSON.stringify({Status: "SUCCESS",StatusDescription: "Player Rank.",PlayerData:localPlayerdata,PlayerRank:localplayerrank,HigherPlayer:localHigherPlayer,LowerPlayer:localLowerPlayer})
			
						res.send(output)
						console.log("SUCCES: Show Player Rank responded")
					}
				})
			}
		}
	})
})

app.get('/database/showatuserid/:userid',function(req,res){
	res.setHeader('Content-Type', 'application/json');
	var localuserid=req.params.userid;
	console.log("SHOW Player At userid Request received for userid: "+localuserid)
	client.query("SELECT * FROM userlist WHERE userid = "+localuserid+";", (err, outcome) => {   
		if (err) throw err;
		else {
			if (outcome.rows.length==0) {
				var output=JSON.stringify({Status: "FAILED",StatusDescription: "userid doesn't exist."});
				res.send(output)
				console.log("FAILED: userid doesn't exist.")
			}
			else {
			var output=JSON.stringify({Status: "SUCCESS",StatusDescription: "Show userid.",PlayerData:outcome.rows[0]})
			res.send(output)
			console.log("SUCCES: Show userid responded")
			}

		}
	})
})


