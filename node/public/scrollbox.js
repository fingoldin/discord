function getT()
{
	var d = new Date();

	return d.getTime();
}

(function($)
{
	$.fn.scrollbox = function()
	{
		/*function scrollfunc(event, wrap)
        	{
   			var delta = 0;

			var e = window.event || e;
			//delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

			if(e.wheelDelta)
				delta = e.wheelDelta / 60;
			else if(e.detail)
				delta = -e.detail / 2;

			var currPos = wrap.offsetTop;
			wrap.style.top = (parseInt(currPos) + (delta*30)) + "px";
		}*/

		this.each(function()
		{
			this.style.overflow = "hidden";
			this.style.bottom = "0px";

			var contents = $(this).children();

			var wrap = document.createElement("div");
			wrap.classList.add("scrollbox-wrap");
	
			$(this).children().each(function() {
				wrap.appendChild(this);
			});

			$(this).empty();
			this.appendChild(wrap);

			wrap.scvel = 0.0;
			wrap.maxscvel = 1000.0;
			wrap.scaccel = 2000.0;
			//wrap.dPos = 0.0;
			function scrollfunc(event)
                	{
                        	var delta = 0;

                        	var e = window.event || e;
                        	delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

                        	/*if(e.wheelDelta)  
                                	delta = e.wheelDelta / 60;
                        	else if(e.detail)
                                	delta = -e.detail / 2;*/

				wrap.scvel += delta * wrap.scaccel * 0.02;
				if(wrap.scvel > wrap.maxscvel)
					wrap.scvel = wrap.maxscvel;
				else if(wrap.scvel < -wrap.maxscvel)
					wrap.scvel = -wrap.maxscvel;

				//wrap.dPos += delta * 5;
			}

			if(this.addEventListener)
                        {
                                this.addEventListener("DOMMouseScroll", scrollfunc, false);
                                this.addEventListener("mousewheel", scrollfunc, false);
                        }
                        else if(this.attachEvent)
                                this.attachEvent("onmousewheel", scrollfunc);
		
			this.onmousewheel = scrollfunc;

			var it = getT();	
			window.setInterval(function() {
				var ft = getT();
				var dt = (ft - it) / 1000;
				it = ft;
				console.log(dt);

				if(wrap.scvel)
				{
					if(Math.abs(wrap.scvel) <= wrap.scaccel * dt)
						wrap.scvel = 0;
					else
					{
						var currPos = parseInt(getComputedStyle(wrap, null).getPropertyValue("top"));
                                        	wrap.style.top = (currPos + wrap.scvel * dt) + "px";

						wrap.scvel += (wrap.scvel > 0 ? -1 : 1) * wrap.scaccel * dt;
					}
				}

				/*var currPos = parseInt(getComputedStyle(wrap, null).getPropertyValue("top"));
				var d2, d = currPos - wrap.dPos;
				if(d >= 0)
                                        d2 = Math.max(10, d);
                                else
                                        d2 = Math.min(-10, d);

				if(Math.abs(d) <= wrap.scvel * 0.02 * d2)
					wrap.style.top = wrap.dPos + "px";
				else
					wrap.style.top = (currPos - wrap.scvel * dt * d2) + "px";*/
			}, 33);
		});

		return this;
	};
}(jQuery));
