$(function(){
var dropbox = $('#dropbox'),
	block = '<div class="perblock" id="file$i"><img width="200" height="150" class="thumb"  src=""/>'+
			'<Br/>文件大小:<span class="size"></span>'+
			'<Br/>上传进度:<span class="progress"></span>'+
			'<Br/>上传速度:<span class="speed"></span>'+
			'<Br/>上传耗时:<span class="time"></span>'+
			'<Br/><a class="removeme" href="javascript:;">删除</a>'
			'</div>';
var dropfile =	$('#dropbox').dropfile({//dropbox
					paramname:'pic',		
					maxfiles: 5,
					maxfilesize: 1024*1024,
					url: '/dropfile/upload',	
					oninputid:'file',
					uploadFinished:function(resobj, fileobj){
						var bl = $('#file'+fileobj.index);
						bl.find('.progress').html('100%')
						  .end().find('.time').html(fileobj.timeDiff/1000+'s')
						  .end().find('.size').html(resobj.size)						
					},	
					ondrop:function(files){
						var len = files.length;
						for(var i =0; i<len; i++){
							(function(i){
							var reader=new FileReader();
								reader.readAsDataURL(files[i]);
								reader.onloadend=function(event){
										var index =  files[i].index;
										dropbox.append(block.replace('$i', index));
										$('#file'+index).find('img').attr('src', this.result);
									}
							
							}(i));						
						}
					},
					onerror: function(err, num) {
						if(num) alert(num+'个文件出错：'+err)
						else alert(err)
					},
					beforeEach:function(){},
					uploadStarted:function(fileobj){

					},	
					progressUpdated: function(fileobj) {
						var bl = $('#file'+fileobj.index);
						bl.find('.progress').html(fileobj.currentProgress+'%')
						  .end().find('.speed').html(fileobj.speed+'KB/S');						
					},
					afterAll: function(){
						alert('all is done');
					}
				});

$('#upload').click(function(){
	dropfile.upload()
})
$('.removeme').live('click', function(){
		var p = $(this).parent();
		dropfile.remove(p.prop('id').split('file')[1]);
		$(this).parent().remove();		
	})







});