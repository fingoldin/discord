function showMessage(mes, name)
{
	var lastName = $(".message-li").last().find(".message-name").html();

	var elem = $("");
	if(lastName != undefined && lastName == name)
	{
		elem = $("<span class='message-text message-loading'>" + mes + "</span>");

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
	}

	setTimeout(function() { elem.removeClass("message-loading"); }, 10);

	return elem;
}

function sendMessage(mes, name)
{
	showMessage(mes, name);
}

function initMessages(name)
{
	$(".messages-input").keypress(function(e)
	{
		if(e.which == 13 && $(this).val() !== "" && $(this).val().length < 2000)
                {
                        e.preventDefault();

			sendMessage($(this).val(), name);
			$(this).val("");
		}
	});
}
