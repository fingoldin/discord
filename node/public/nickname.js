function initNickname()
{
        var valid = true;
        var socket = io();


        function setError(mes)
        {
                $(".nickname-error").html(mes);
                $(".nickname-error").addClass("nickname-error-e");
                setTimeout(function() { $(".nickname-error").removeClass("nickname-error-e"); }, 10000);
        }

        $(".nickname-loading").removeClass("nickname-loading");

        function checkValid()
        {
                socket.emit("checkmesreq", $(".nickname-input").val());

                socket.on("checkmesres", function(res) {
                        valid = res;
                });
        }

        $(".nickname-input").keypress(function(e)
        {
                if(e.which == 13)
                {
                        e.preventDefault();

			var name = $(this).val();

                        if(name === "")
                                setError("Please enter a nickname");
                        else if(name.length < 3)
                                setError("No less than 3 characters");
                        else if(name.length >= 16)
                        {
                                $(this).val(name.substr(0, 16));

                                setError("No greater than 16 characters");
                        }
                        else
                        {
                                $(this).addClass("nickname-input-d");
                                $(this).trigger("blur");
                                $(".nickname-error").removeClass("nickname-error-e");

                                socket.emit("login", name);

                                var self = $(this);
                                socket.on("login", function(res) {
                                        switch(res) {
                                        case 0:
                                                $("body").removeClass("body-nickname");
                                                $("body").addClass("body-transition");
						$(".messages-input").trigger("focus");
                                                setTimeout(function()
                                                {
                                                        $("body").removeClass("body-transition");
						        initMessages(name);
                                                }, 1000);
                                                break;
                                        case 1:
                                                setError("That nickname has already been taken");
                                                self.removeClass("nickname-input-d");
                                                self.trigger("focus");
                                                break;
                                        case 2:
                                                setError("Whoops! There was an error. Please try again");
                                                self.removeClass("nickname-input-d");
                                                self.trigger("focus");
                                        }
                                });
                        }
                }
                else
                {
                        if($(this).val().length >= 16)
                        {
                                e.preventDefault();

                                $(this).val($(this).val().substr(0, 16));

                                setError("No greater than 16 characters");
                        }
                        else
                                $(".nickname-error").removeClass("nickname-error-e");
                }
        });

        $(".nickname-input").blur(function()
        {
                if(!$(this).val().length)
                        $(".nickname-input-bord").addClass("nickname-input-bord-h");
        });

        $(".nickname-input").focus(function()
        {
                $(".nickname-input-bord").removeClass("nickname-input-bord-h");
        });

        $(".nickname-input").keydown(function(e)
        {
                if(e.which == 8)
                        $(".nickname-error").removeClass("nickname-error-e");
        });
}

