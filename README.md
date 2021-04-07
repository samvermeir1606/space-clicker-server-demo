# space-clicker-server-demo

##How to start a new app with Heroku
1) Make a git repository (make sure to add a readme file (if needed) and a gitignore file using the "node" template)
2) clone the repo locally
3) navigate to the folder in the terminal using "cd"
4) Execute the command ```heroku login```, and log in to heroku
5) execute the command ```heroku create```, this will create a heroku app
6) Execute the command ```npm init``` to initialize the package.json file (this is needed to push the data to heroku and to make sure heroku knows what file it needs to load first, which tests to run of you have any,...). Follow the instructions in the terminal.
7) Make an "app.js" where you will write your code (in a later step).
8) open the package .json file and under "tests" inside "scripts", add the following
```"start": "node app.js"``` (make sure after the row where the tests are described, you add a comma)
9) use the github desktop client to push your changes to the github servers
10) execute the command ```git push heroku main```, this will trigger a build on heroku with your files.
11) open a second terminal and navigate to your working directory
12) in the second terminal, execute the command ```heroku logs --trail```, to see a list of all the logs. since we added the "--trail" flag, this terminal will keep updating with logs.
13) normally, the command executed in step 10 will have triggered a build and your app is now up and running
14) execute the command ```heroku ps:scale web=1``` in the first terminal to ensure that at least one dyno is running your server.
15) to see the server running, execute the command ```heroku open```

## How to add and interact with a database
1) go to the terminal and execute following command ```heroku addons:create heroku-postgresql:hobby-dev```. This will add the postgresql database add-on to the project
2) execute the command ```npm install pg``` to install postgresql
3) Add the following code snippet to the app.js file:
```javascript
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
client.connect();
```
4) To querry the database, use the following in your code:
```javascript
client.query("SELECT * FROM scores;", (err, outcome) => {   
		if (err) throw err;
		else {
			res.send(outcome)
			console.log(outcome)
		}
	})
```
