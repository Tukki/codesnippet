//把下面的数据全部作为网址内容保存到目标书签上
//联同javascipt

javascript:(function(){
	var ril_url = "https://readitlaterlist.com/save?";

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
			var content = $('p[node-type="feed_list_content"]', $(this)).text();
			content = $.trim(content);
			var toolbar = $('> .info', $this);
			var href = "http://weibo.com" + $(".date", toolbar).attr('href');
			var save_url = ril_url + "&url=" + encodeURIComponent(href) + "&title=" + encodeURIComponent(content);
			var target = $("span", toolbar);
			target.append('<i class="W_vline">|</i><a href="' + save_url + '"  target="_blank">&gt;&gt</a>');
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

