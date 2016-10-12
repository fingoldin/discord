var app = require("express")();
//app.use(express.cookieParser());
//app.use(express.session({secret: "a8yvna9dytvnaio"}));

var http = require("http").Server(app);

var io = require("socket.io")(http);

var mysql = require("mysql");
var dbconn = mysql.createConnection({
	host	: "localhost",
	user	: "root",
	password: "root",
	database: "discord"
});
dbconn.connect();


var lPort = 2000;

app.get("/", function(req, res)
{
	res.sendFile(__dirname + "/index.html");
});

http.listen(lPort, function()
{
	console.log("Listening on port: " + lPort);
});

io.on("connection", function(socket) {
	console.log("A user connected");

	var UID = 0;

	socket.on("login", function(nickname)
	{
		dbconn.query("SELECT UID FROM ausers WHERE nickname='" + nickname + "';", function(err, result)
		{
			if(err) throw err;

			if(result.length == 0)
			{
				dbconn.query("INSERT INTO ausers SET nickname='" + nickname + "';", function(err1, result1)
				{
					if(err1) throw err1;

					UID = result1.insertId;

					dbconn.query("INSERT INTO cusers SET UID=" + UID + ";", function(err2, result2)
					{
						if(err2) throw err2;

						dbconn.query("INSERT INTO logins SET UID=" + UID + ", time=NOW(4);", function(err3, results3)
                                                {
                                                        if(err3) throw err3;

                                                	io.emit("login", true);
							console.log("A user logged in with id = " + UID);
                                                });
					});
				});
			}
			else
			{
				UID = result[0].UID;

				dbconn.query("SELECT COUNT(*) AS res FROM cusers WHERE UID=" + UID + ";", function(err1, result1)
				{
					if(err1) throw err1;

					if(result1[0].res == 0)
					{
						dbconn.query("INSERT INTO cusers SET UID=" + UID + ";", function(err2, result2)
                                        	{
                                                	if(err2) throw err2;

							dbconn.query("INSERT INTO logins SET UID=" + UID + ", time=NOW(4);", function(err3, results3)
							{
								if(err3) throw err3;

	                                                	io.emit("login", true);
								console.log("A user logged in with id = " + UID);
        						});
	                                	});
					}
					else
						io.emit("login", false);	
				});
			}
		});
	});

	socket.on("disconnect", function()
	{
		if(UID)
		{
			dbconn.query("DELETE FROM cusers WHERE UID=" + UID + ";", function(err, result)
			{
				if(err) throw err;

				dbconn.query("INSERT INTO logoffs SET UID=" + UID + ", time=NOW(4);", function(err1, result1)
				{
					if(err1) throw err1;

					console.log("A user logged out with id = " + UID);
				});
			});
		}

		console.log("A user disconnected");
	});
});
