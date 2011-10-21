//Module: 'jquery' must be loaded before DOM onLoad!
//不行
function initLoader(){
	var script = document.createElement('script');
	script.src = "https://www.google.com/jsapi?key=ABQIAAAA40XTsdIm0CP0fAFU8UA8qhSOvpf6vKFU2JjhZoX3Tf1y3lhlTBSwvcImxTMuOi86QzK9nT_RWElkAg&callback=initJquery";
	script.type = 'text/javascript';
	document.getElementsByTagName('head')[0].appendChild(script);
}

function initJquery(){
	google.load('jquery', '1.6.4', {'callback': RIL})
	//找不到$
	//google.load('jquery', '1.6.4');
	//google.setOnLoadCallback(RIL);
	
}
//============================================
//
//纯旧版能用. 但转发的存在则引用错误, 无法自动检测新load入的数据
function RIL_for_old(){
	var ril_url = "https://readitlaterlist.com/save?";
	var wblist = $('.MIB_linedot_l');
	console.log(mblist);
	wblist.each(function(index){
		var $this = $(this);
		var href = $('cite > a', $this).attr('href');
		var content = $('.sms', $this).text();
		var save_url = ril_url + "&url=" + encodeURIComponent(href) + "&title=" + encodeURIComponent(content);
		console.log(save_url);
		var target = $('.rt', $this);
		target.append('<span class="MIB_line_l">|</span><a class="ril" href="' + save_url + '"  target="_blank">&gt;&gt</a>');
	})
};


//新版微博
function RIL(){
	var ril_url = "https://readitlaterlist.com/save?";
	var wblist = $(".feed_list:not(:has([ril='true'])) > .content");
	console.log(wblist);
	wblist.each(function(index){
		var $this = $(this);
		var content = $('p[node-type="feed_list_content"]', $(this)).text();
		content = $.trim(content);
		var toolbar = $('> .info', $this);
		var href = "http://weibo.com" + $(".date", toolbar).attr('href');
		console.log(href);
		var save_url = ril_url + "&url=" + encodeURIComponent(href) + "&title=" + encodeURIComponent(content);
		var target = $("span", toolbar);
		target.append('<i class="W_vline">|</i><a href="' + save_url + '"  target="_blank">&gt;&gt</a>');
		$this.attr('ril', 'true');
	})
};




//加载jQuery后回调
//loadJQuery(RIL);
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

