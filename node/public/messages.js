function showMessage(mes, name)
{
	var lastName = $(".message-li").last().find(".message-name").html();

	var elem = $("");
	if(lastName != undefined && lastName == name)
	{
		elem = $("<span class='message-text'>" + mes + "</span>");

		$(".message-li").last().find(".message-body").append(elem);
	}
	else
	{
		var elem = $("<li class='message-li message-loading'>" +
        			"<div class='message-wrapper'>" +
                			"<div class='message-profile'>" +
                        			"<img class='message-img' src='http://az616578.vo.msecnd.net/files/2016/07/23/6360489455192162291563850737_Trump.jpg'></img>" +
                        		"</div>" +
                        		"<div class='message-body'>" +
                        			"<span class='message-name'>" + name + "</span>" +
                        			"<span class='message-text'>" + mes + "</span>" +
        				"</div>" +
        			"</div>" +
			"</li>");

		$(".messages-list").append(elem);

		var e = elem;
		setTimeout(function() { e.removeClass("message-loading"); }, 10);
	
		elem = elem.find(".message-text");
	}

	return elem;
}

function sendMessage(mes, name, socket)
{
	var e = showMessage(mes, name);
	e[0].id = ++sendMessage.tid + "ms";
	e.addClass("message-text-sending");

	socket.emit("message", { text: mes, tid: sendMessage.tid });	

	$(".message-list-wrap").perfectScrollbar("update");

        autoScroll();
}

function getLastMessages(n, socket)
{
	socket.emit("getmessages", n);

	socket.on("getmessages", function(data)
	{
		if(data.success)
		{
			var array = JSON.parse(data.result);

			for(var i = array.length-1; i >= 0; i--)
				showMessage(array[i]["text"], array[i]["name"]);

			
			setTimeout(function()
			{
				$(".message-list-wrap").perfectScrollbar("update");

				autoScroll();

				setTimeout(function()
				{
					$(".message-loader").removeClass("message-loader-e");
                                        $(".message-list-wrap").removeClass("message-list-disabled");
				}, 100);
			}, 10);
		}
	});
}

function autoScroll()
{
	$(".message-list-scroll").scrollTop($(".message-list-scroll")[0].scrollHeight);
}

function canScroll()
{
	var e = $(".message-list-scroll");
	var diff = e[0].scrollHeight - e.scrollTop() - e.outerHeight();

	return (diff < 20);
}

function initMessages(name, socket)
{
	$(".message-loader").addClass("message-loader-e");

	sendMessage.tid = 0;
	sendMessage.scrollLock = false;

	$(".messages-input").keypress(function(e)
	{
		if(e.which == 13 && $(this).val() !== "" && $(this).val().length < 2000)
                {
                        e.preventDefault();

			sendMessage($(this).val(), name, socket);
			$(this).val("");

			socket.emit("typing", 0);
		}
		else
			socket.emit("typing", 1);
	});

	socket.on("message", function(data) {
		var s = canScroll();
		showMessage(data.text, data.name);
		if(s)
			autoScroll();
	});

	socket.on("messagesent", function(tid) {
		$("#" + tid + "ms").removeClass("message-text-sending");
		$("#" + tid + "ms").removeAttr("id");
	});

	socket.on("typing", function(data) {
		
	});

	getLastMessages(50, socket);

//	$(".scrollbox").scrollbox();
}
