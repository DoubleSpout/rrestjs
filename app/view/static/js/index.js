(function(){
var GetZoom = function($that, nw, nh, speed, cb){
		this.ow = $that.width();
		this.oh = $that.height();
		this.nw = nw;
		this.nh = nh;	
		this.speed = speed;
		this.obj = $that;
		this.cb = cb||function(){};
	}
GetZoom.prototype = {
		bigger:function(){
			this._zooming();
			},
		restore:function(){
			this._zooming(true);
			},
		_zooming:function(boolean){
				var that = this,nw,nh,w,h;
				if(boolean){
						nw = that.ow;
						nh = that.oh;
						w = 0;
						h = 0;
					}
				else{
						nw = that.nw;
						nh = that.nh;
						w = '-'+((that.nw - that.ow)/2+3);
						h = '-'+((that.nh - that.oh)/2+3);	
					}
				that.obj.animate({
						width:nw,
						height:nh,
						top:h+'px',
						left:w+'px'
					},that.speed, 'swing', function(){
							that.cb($(this), boolean);
						});
			}
	}
var donenum = 8;
$.fn.getzoom = function(nw, nh, speed, cb) {
		var nw = nw || 170,
			nh = nh || 170,
			speed = speed || 50,
			parent =  this.parent(),
			hc = parent.attr('hclass'),
			sp = 150*(parent.attr('sp')-0),
			otop = parent.css('top'),
			oleft = parent.css('left'),
			cb = cb || function($that, boolean){
				if(boolean) $that.removeClass(hc);
				else $that.addClass(hc);
				},
		    gz = new GetZoom(this, nw, nh, speed, cb);
     	parent.css({top:0, left:0});
		parent.animate({top:otop, left:oleft, opacity: 'show'}, sp,  function(){
							parent.hover(function(){ gz.bigger();},function(){ gz.restore();});
							if(--donenum ===0) $('#download').fadeIn(1000);
						});
		return this;
	};
$('#i_b').slideDown(800, function(){
	$('a[name="site"]').find('img').each(function(){
		$(this).getzoom();
	});
})

}());