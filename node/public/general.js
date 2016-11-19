function alphaNumeric(string)
{
	return string.match(/^[0-9a-zA-Z]+$/);
}

function initScrollbars()
{
	$(".scrollbox").each(function()
        {
                var w = $(this).width();
                var h = $(this).height();

		var contents = $(this).children();
		var wrap = document.createElement("div");
		wrap.classList.add("scrollbox-wrap");

		contents.each(function() {
			wrap.appendChild(this);
		});

		$(this).empty();
		this.appendChild(wrap);

                $(wrap).width(w).height(h);
                $(wrap).perfectScrollbar();

		$(this).resize(function()
		{
			var w = $(this).width();
			var h = $(this).height();

			console.log("width: " + w + " height: " + h);

			$(wrap).width(w).height(h);
			$(wrap).perfectScrollbar("update");
		});
        });
}

function updateScrollbars()
{
	$(".scrollbox").each(function()
        {
                var w = this.parentNode.clientWidth;
                var h = this.parentNode.clientHeight;

                //$(this).width(w).height(h);
                //$(this).perfectScrollbar("update");
        });
}
