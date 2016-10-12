var app = require("express")();
app.use(express.cookieParser());
app.use(express.session({secret: "a8yvna9dytvnaio"}));

var http = require("http").Server(app);

var io = require("socket.io")(http);

var mysql = require("mysql");
var dbconn = mysql.createConnection({
	host	: "localhost",
	user	: "root",
	password: "root"
});
connection.connect();


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

	socket.on("checkmesreq", function(mes) {
		io.emit("checkmesres", (mes == "hello"));
	});

	socket.on("disconnect", function() {
    		console.log('user disconnected');
  	});
});
