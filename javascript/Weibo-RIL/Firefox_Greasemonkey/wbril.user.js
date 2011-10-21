// ==UserScript==
// @name           Weibo Read It Later
// @namespace      http://userscripts.org/users/413684
// @description	   add Read It later links to weibo webpage
// @version        0.1
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @include        http://*weibo.com/*
//
// ==/UserScript==

(function(){
	var ril_url = "https://readitlaterlist.com/save?";

	function RIL(){
	var wblist = $(".feed_list:not(:has([ril='true'])) > .content");
//	console.log(wblist);
	wblist.each(function(index){
		var $this = $(this);
		var content = $('p[node-type="feed_list_content"]', $(this)).text();
		content = $.trim(content);
		var toolbar = $('> .info', $this);
		var href = "http://weibo.com" + $(".date", toolbar).attr('href');
		//console.log(href);
		var save_url = ril_url + "&url=" + encodeURIComponent(href) + "&title=" + encodeURIComponent(content);
		var target = $("span", toolbar);
		target.append('<i class="W_vline">|</i><a href="' + save_url + '"  target="_blank">&gt;&gt</a>');
		$this.attr('ril', 'true');
	});
	}
	
	//home feed 改变的时候再追加一次检查
	var hassetup = false;
	var $homeFeed = $('#pl_content_homeFeed');
	function changed(){
		//document.addEventListener('DOMNodeInserted', function(){
		$homeFeed.bind('DOMNodeInserted', function(){
			if (!hassetup) {
				window.setTimeout(function(){
					RIL();
					hassetup = false;
				}, 2000);
				hassetup = true;
			}
		})
	}
	setTimeout(RIL, 10000);
	setTimeout(changed, 11000);
})()
