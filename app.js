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
