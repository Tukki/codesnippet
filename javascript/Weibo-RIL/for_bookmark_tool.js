//把下面的数据全部作为网址内容保存到目标书签上
//联同javascipt

javascript:(function(){
        var RILBUTTONS = 0;
        function RIL_button(url, title, img, width, height)
            {
                var custom = false;
                if (!width || !height){
                    width = 85;
                    height = 16;
                }
                else
                    custom = true;	

            RILBUTTONS++;
            var iframe = '<iframe class="readitlater_button" id="readitlater_button'+
                        RILBUTTONS+
                        '" allowtransparency="true" frameborder="0" scrolling="no" width="'+width+
                        '" height="'+height+'" style="z-index: 2000; overflow: hidden;'+
                        (custom?'':'position:relative;top:3px')+'"'+
                        'src="http://readitlaterlist.com/button?url='+encodeURIComponent(url)+
                        '&title='+encodeURIComponent(title.replace(/^\s\s*/, '').replace(/\s\s*$/, ''))+
                        '&via='+encodeURIComponent(document.location.host)+
                        (img?'&img='+encodeURIComponent(img):'')+
                        '"></iframe>';

               return iframe
            }

	function loadJQuery(cbFunc){
    	if(!window.jQuery){
            var script = document.createElement('script');
            script.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js";
            script.type = 'text/javascript';
            script.onload = script.onreadystatechange = cbFunc;	
            document.getElementsByTagName('head')[0].appendChild(script);
        }else{
            cbFunc();
	    }
	};

	function RIL(){
		var wblist = $(".feed_list:not(:has([ril='true'])) > .content");
		wblist.each(function(index){
			var $this = $(this);
			var content = $.trim($('p[node-type="feed_list_content"]', $(this)).text());
			var toolbar = $('> .info', $this);
			var href = "http://weibo.com" + $(".date", toolbar).attr('href');
			var target = $("span", toolbar);
			target.append(RIL_button(href, content));
			$this.attr('ril', 'true');
			});
	};

	var hassetup = false;
	function changed(){
		var $homeFeed = $('#pl_content_homeFeed');
		$homeFeed.bind('DOMNodeInserted', function(){
				if (!hassetup) {
				window.setTimeout(function(){
					RIL();
					hassetup = false;
					}, 2000);
				hassetup = true;
				}
				})
	};
	loadJQuery(RIL);
	setTimeout(changed, 5000);
})()

