$(function(){
var prog = $('#progress');
var speed = $('#speed');
var time = $('#time');
var dropfile =	$('#dropbox').dropfile({//dropbox
					paramname:'pic',		
					maxfiles: 1,
					maxfilesize: 1024*1024,
					url: '/dropfile/upload',	
					oninputid:'file',
					uploadFinished:function(resobj, fileobj){
						prog.html('100%');
						time.html(fileobj.timeDiff/1000+'s');
						$('#size').html(resobj.size)
						alert(resobj.res);
					},	
					ondrop:function(files){
						var reader=new FileReader();
						reader.readAsDataURL(files[0]);
						reader.onloadend=function(event){
							CanvasClip('dropbox', 'thumb', this.result);
							reader = null;
						}

					},
					onerror: function(err) {
						alert(err)
					},
					beforeEach:function(){},
					uploadStarted:function(fileobj){

					},	
					progressUpdated: function(fileobj) {
						prog.html(fileobj.currentProgress+'%');
						speed.html(fileobj.speed+'KB/S');						
					},
					afterAll: function(){
						alert('all is done');
					}
				});

$('#upload').click(function(){
	var base64 = $('#thumb').attr('src');
	dropfile.send(base64)
})

	







});