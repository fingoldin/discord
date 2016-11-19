var express = require("express");
var app = express();
//app.use(express.cookieParser());
//app.use(express.session({secret: "a8yvna9dytvnaio"}));
app.use(express.static("public"));

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

var cusers = [];

io.on("connection", function(socket) {
	console.log("A user connected");

	var UID = 0;
	var name = "";

	socket.on("login", function(nickname)
	{
		dbconn.query("SELECT UID FROM ausers WHERE nickname='" + nickname + "';", function(err, result)
		{
			if(err)
			{
				console.log(err);
				socket.emit("login", 2);
			}
			else if(result.length == 0)
			{
				dbconn.query("INSERT INTO ausers SET nickname='" + nickname + "';", function(err1, result1)
				{
					if(err1)
					{
						console.log(err1);
						socket.emit("login", 2);
					}
					else
					{
						UID = result1.insertId;

						dbconn.query("INSERT INTO logins SET UID=" + UID + ", time=NOW(4);", function(err3, results3)
                                                {
                                                       	if(err3)
							{
								console.log(err3);
								socket.emit("login", 2);	
							}
							else
							{
								cusers.push(UID);
                                				socket.emit("login", 0);
                                				name = nickname;
                                				console.log("A user logged in with id = " + UID);
							}
						});
					}
				});
			}
			else
			{
				UID = result[0].UID;

				if(cusers.indexOf(UID) == -1)
				{
					dbconn.query("INSERT INTO logins SET UID=" + UID + ", time=NOW(4);", function(err3, results3)
					{
						if(err3)
						{
							console.log(err3);
							socket.emit("login", 2);
						}
						else
						{
	                                               	socket.emit("login", 0);
							name = nickname;
							console.log("A user logged in with id = " + UID);
        					}
					});
				}
				else
					socket.emit("login", 1);
			}
		});
	});

	socket.on("disconnect", function()
	{
		if(UID)
		{
			

			dbconn.query("INSERT INTO logoffs SET UID=" + UID + ", time=NOW(4);", function(err, result)
			{
				if(err)
					console.log(err);
				else
					console.log("A user logged out with id = " + UID);
			});
		}

		console.log("A user disconnected");
	});

	socket.on("message", function(data) {
		if(name !== "")
		{
			socket.broadcast.emit("message", { name: name, text: data.text });
                        socket.emit("messagesent", data.tid);

			dbconn.query("INSERT INTO messages SET UID=" + UID + ", text='" + data.text + "', time=NOW(4);", function(err, result)
			{
				if(err)
					console.log(err);
			});
		}
	});

	socket.on("getmessages", function(n) {
		dbconn.query("SELECT a.text as text, b.nickname as name FROM messages a, ausers b WHERE a.UID=b.UID ORDER BY a.time DESC LIMIT " + n + ";", function(err, result)
		{
			if(err)
			{
				console.log(err);
				socket.emit("getmessages", { success: 0, result: 0 });
			}
			else
				socket.emit("getmessages", { success: 1, result: JSON.stringify(result) });
		});
	});
});
