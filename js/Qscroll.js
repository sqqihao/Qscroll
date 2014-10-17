// JavaScript Document
(function($){
	function getTopAndLeft(node, arg) {
		if( node instanceof $ )
			node = node[0];
		var result = {
			left : 0,
			top : 0	
		};
		
		while( node.tagName.toLowerCase()!="body" ) {
			result.left += node.offsetLeft;
			result.top += node.offsetTop;
			node = node.parentNode;
		};
		
		return result;
	};
	
	function Scroll( setting ) {
		this.setting = $.extend(true, {}, setting);
		var $scroll_parent = $( this.setting.el );
		var $scroll_content_wrap = $(".scroll_content_wrap", $scroll_parent);
		var $scroll_content = $(".scroll_content", $scroll_parent);
		var $scroll_bar = $(".scroll_bar", $scroll_parent);
		var $scroll_btn = $(".scroll_btn", $scroll_parent);
	
		function moveFn(){
			var percent = parseInt($scroll_btn.get(0).style.top)/($scroll_bar.height() - $scroll_btn.height());
			var percentFloat = parseFloat( percent );
			var resultHeight = ($scroll_content_wrap.height()-$scroll_content.height())*percentFloat;
			$scroll_content.css({ top: resultHeight})
		};
		
		$(".scroll_btn").mousedown(function() {
			$(document).on("mousemove", moveFn);
		}).on("mouseup",function() {
			$(document).off("mousemove", moveFn);
		});
	};
	
	$.fn.Qscroll = Scroll.instance = function() {
		var btn = this.eq(0).find(".scroll_btn");
		var wraper = this.eq(0);
		
		new Dragable({el : btn,range:{left:0,top:0,x:0,y: $(wraper).height()-btn.height()}});
		new Scroll({el : wraper});
	};
	/*
	*new Dragable()
	*{ range : { top : 100 ,left: 200, x : 0 , y : 0} }
	*{ clientScreen : true }
	*new Dragable({el : f("#div1").get(0)});
	*/
	var Dragable = function( setting ) {
		if( !(this instanceof Dragable)) {
			return new Dragable( setting );
		};
		this.defaults = {
			el : $(setting.el),
			vertical : true,
			horizon : true
		};
		$.extend( this.defaults  ,setting );
		this.init();
	};
	$.fn.Drag = Dragable.instance = function(setting) {
		setting = setting || {};
		$.each(this, function( i, e) {
			new Dragable({
				el:$(this),
				clientScreen : setting.clientScreen,
				range : setting.range
			});
		});
	};
	Dragable.prototype = {
		constructor : Dragable,
		init : function(  ) {
			this.setPosition( this.defaults.el );
			this.ev( this.defaults );
		},
		setPosition : function( el ) {
			var posStatus;
			if( el.css("position") !== "absolute" ) {
				var lt = getTopAndLeft( el[0] );
				var l = lt.left;
				var t = lt.top;
				var w = el.css("width");
				var h = el.css("height");
				
				el.css("position","absolute");
				
				el.css("top", t);
				el.css("height", h);
				el.css("left", l);
				el.css("width", w);
			};
		},
		ev : function(defaults) {
			var el = defaults.el;
			var dx , dy;
			var offset;
			var offsetP;
			
			el.on("mousedown",function( ev ) {
				var ev = ev || window.event;
				var el = defaults.el;
				offset = getTopAndLeft( el[0] );
				offsetP = getTopAndLeft( $(el[0]).parent()[0].parentNode );
				var x = ev.pageX - offset.left - offsetP.left;
				var y = ev.pageY - offset.top;
				dx = x;
				dy = y;
				$(document).on("mousemove", moveFn);
				$(document).on("mouseup",function() {
					$(document).off("mousemove", moveFn);
				});
			});
			
			var moveFn = function(ev) {
				var ev = ev || window.event;
				var x = ev.pageX - dx - offset.left - offsetP.left;
				var y = ev.pageY - dy - offsetP.top;
				if( defaults.clientScreen ) {
					var xy = {
						width : $(window).width(),
						height : $(window).height()
					},
					range = {};
					range = {
						x : Math.max.apply(Math,[ xy.width-parseInt($(el).css("width")) - parseInt($(el).css("margin-left"))-parseInt($(el).css("margin-right")) ]),
						y : Math.max.apply(Math,[ xy.height-parseInt($(el).css("height")) - parseInt($(el).css("margin-top")) - parseInt($(el).css("margin-bottom"))]),
						top : 0,
						left : 0
					};
				};
				if( defaults.range ) {
					range = defaults.range
				};
				//如果是视区内 或者 在defaults有个range
				if( defaults.clientScreen || defaults.range ) {
					//var range = defaults.range;
					if( x>range.x ) {
						x  = range.x;
					};
					if( y>range.y ) {
						y  = range.y;
					};
					if( x<range.left ) {
						x = range.left
					};
					if( y<range.top ) {
						y = range.top;
					};
				};
				x = defaults.horizon && x;
				y = defaults.vertical && y;
				el.css("left", x);
				el.css("top", y);
				ev.stopPropagation&&ev.stopPropagation();
				ev.cancelBubble = true;
	
				ev.preventDefault&&ev.preventDefault();
				ev.returnValue = false;
	
			};
			
		}
	};	
})(jQuery)