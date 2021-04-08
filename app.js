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

				var outcome=JSON.stringify({userid: outcome.rows[0].userid})
					//{
					//	Status:"SUCCESS",
					//	StatusDescription: "User found.",
					//	PlayerData: 
					//	{
					//		userid: outcome.rows[0].userid,
					//		username:outcome.rows[0].username,
					//		displayname:outcome.rows[0].displayname,
					//		accountcreated:outcome.rows[0].accountcreated,
					//		lastonline:outcome.rows[0].lastonline,
					//		score:outcome.rows[0].score,
					//		highscoreposted:outcome.rows[0].highscoreposted,
					//		banned:outcome.rows[0].banned
					//	}
					//}
				//)
				res.send(output);
				console.log("SUCCESS: User found.")
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
