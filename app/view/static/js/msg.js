function Message(){
	this.pclass = 'i_p';
	this.sendurl = '/message/send/';
	this.moreurl = '/message/more/';
	this.getcapurl = '/message/getcaptcha/';
	this.iname = $('#name');
	this.icontent = $('#content');
	this.form = $('#send');
	this.subtb = $('#ajaxsub');
	this.state = $('#state');
	this.condition = $('#condition');
	this.pid = $('#pid');
	this.po = $('#po');
	this.poid = $('#poid');
	this.captitle = $('#captitle');
	this.capimg = $('#capimg');
	this.getmorebt = $('#getmore');
	this.perpagenum = 5;//一次获取多少个
	this.ajaxing = false;
	this.intial();
}
Message.prototype.ajaxsub = function(){
	var that = this;
	if(that.ajaxing) return false;
	var data = {
	poid: that.poid.val(),//验证码ID
	pid: that.pid.val(),//是否是回复ID
	po:that.po.val(),
	name:that.iname .val(),
	content:that.icontent.val()
	}
	that.ajaxing = true;
	$.get(this.sendurl,data, function(data){
		that.ajaxing = false;
		if(data.suc ==1) location.href = '/message/'
		else{
			alert(data.fail);
			that.getcaptcha();
		}
		},'json')
	}
Message.prototype.reply = function(target){ //点击回复
	this.pid.val(target.attr('aid'));
	var val = '回复：';
	this.icontent.focus().val(val);
}
Message.prototype.getmore = function(target){
		var that = this,
		    data = that.intialmore();//为more按钮初始化做准备
		if(that.ajaxing) return false;
		that.ajaxing = true;
		$.get(that.moreurl, data, function(d){
			    that.ajaxing = false;
				if(d.suc == 0) return alert(d.fail);
				if(d.suc ==1){
					if(d.content == '')	return target.css('visibility','hidden');
					var s ='<div class="m_dm" style="display:none;">'+d.content+'</div>';
						that.state.before(s);
						$('.m_dm').last().slideDown('fast',function(){
							$(this).css('height',$("this").height()+'px');
						});
					}
				else alert(d.fail);
				})
	}

Message.prototype.intialmore = function(){
		var condition = $('.'+this.pclass).last().attr('id')||true,//获得最后一个的id
		    sname = Get_QueryString_Plus().sname||true,
		  d = {
				condition : condition,
				sname:sname,
				pagenum:this.perpagenum
			};
		return d
}

Message.prototype.getcaptcha = function(){
	var that = this;
	if(that.ajaxing) return false;
	that.ajaxing = true;
	$.get(this.getcapurl,{"a":"getcap"},function(data){
		that.ajaxing = false;
		if(data.suc != 1){
			alert(data.fail);
			return false;
		}
		that.putcaptcha(data);
	},'json')
}
Message.prototype.putcaptcha = function(data){
	var val = data.data.value,
		poid = data.data.id,
	    len = data.data.caary.length,
		htmls = '';
	this.poid.val(poid);
	this.captitle.html('请在下面图中找出 <b>'+val+'</b> 并点击它。');
	for(var i=0;i<len;i++){
		var ci = data.data.caary[i];
		htmls += '<img width="60" height="60" src="'+ci.url+'" title="图片" po="'+i+'" />';
	}
	this.capimg.html(htmls);
}
Message.prototype.isshowcap = function(){
	var v1 = $.trim(this.iname.val()),
		v2 = $.trim(this.icontent.val());
	if(v1 !== '' || v2 !== ''){
		this.iname.unbind('focus');
		this.icontent.unbind('focus');
		this.getcaptcha();
	}
}


Message.prototype.intial = function(){
	var that = this;
	
	this.iname.focus(function(){that.isshowcap()});
	this.icontent.focus(function(){that.isshowcap()});
	
	this.capimg.delegate('img', 'click', function(){
		var po = $(this).attr('po');
		that.po.val(po);
		$(this).siblings().removeClass('selimg')
		$(this).addClass('selimg');
		that.subtb.show();
	})
	
	this.getmorebt.click(function(){
		that.getmore($(this));
		})
	
	that.form.submit(function(){
		var isok = true;
		that.form.find('input').each(function(){
			console.log($(this).attr('id')+':'+$(this).val())
			if($.trim($(this).val()) === '') isok = false;
		})
		if(!isok) alert('作者、内容和验证码必填');
		else that.ajaxsub();
		return false;
		})
	that.subtb.click(function(){
		that.form.submit();
	});
	$('a[name="reply"]').live('click', function(){
		that.reply($(this));
	})

}
var msg = new Message();
