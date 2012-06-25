void function(win){

	var canvasclip = win.CanvasClip = function canvasclip(canvasid, thumbid, imgsrc, error){
		if(!(this instanceof canvasclip)) return new canvasclip(canvasid, thumbid, imgsrc);
		this.canvas = $('#'+canvasid);
		this.thumb = $('#'+thumbid);
		this.imgsrc = imgsrc;
		this.iMouseX = this.iMouseY = 1;
		this.selection = new Selection(200, 200, 200, 200, this.canvas.width(), this.canvas.height());
		this.error = error || function(msg){alert(msg);}
		this.intial();
	};
	canvasclip.prototype = {
	    drawScene:function(){ // main drawScene function
			var ctx = this.ctx,
				image = this.image;	

			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clear canvas
			 // draw source image
			
			ctx.drawImage(image, 0, 0, image.width, image.height);

			// and make it darker
		    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			// draw selection
	       this.selection.draw(ctx, image);
		},
		mousemove:function(e){
		var iMouseX = this.iMouseX,
			iMouseY = this.iMouseY,
			theSelection = this.selection,
		    canvasOffset = this.canvas.offset();
        iMouseX = Math.floor(e.pageX - canvasOffset.left);
        iMouseY = Math.floor(e.pageY - canvasOffset.top);

        // in case of drag of whole selector
        if (theSelection.bDragAll) {
			var selx = iMouseX - theSelection.px,
				sely = iMouseY - theSelection.py;
			if(selx>0 && selx<theSelection.sidex()) theSelection.x = selx;
            if(sely>0 && sely<theSelection.sidey()) theSelection.y = sely;
        }

        for (i = 0; i < 4; i++) {
            theSelection.bHow[i] = false;
        }
		 theSelection.iCSize[2] = theSelection.csize;

        // hovering over resize cubes
     
        if (iMouseX > theSelection.x + theSelection.w-theSelection.csizeh && iMouseX < theSelection.x + theSelection.w + theSelection.csizeh &&
            iMouseY > theSelection.y + theSelection.h-theSelection.csizeh && iMouseY < theSelection.y + theSelection.h + theSelection.csizeh) {

            theSelection.bHow[2] = true;
            theSelection.iCSize[2] = theSelection.csizeh;
        }
    
        // in case of dragging of resize cubes
        var iFW, iFH;
        if (theSelection.bDrag[2]) {
            var iFX = theSelection.x;
            var iFY = theSelection.y;
            iFW = iMouseX - theSelection.px - iFX;
            iFH = iMouseY - theSelection.py - iFY;
			if(iFW>iFH) iFW = iFH;
			else iFH = iFW
        }

        if (iFW > theSelection.csizeh * 2 && iFH > theSelection.csizeh * 2) {
            theSelection.w = iFW;
            theSelection.h = iFH;

            theSelection.x = iFX;
            theSelection.y = iFY;
        }

        this.drawScene();

		},
		mousedown:function(e){
	      var iMouseX = this.iMouseX,
			  iMouseY = this.iMouseY,
			  theSelection = this.selection,
			  canvasOffset = this.canvas.offset();
			iMouseX = Math.floor(e.pageX - canvasOffset.left);
			iMouseY = Math.floor(e.pageY - canvasOffset.top);

			theSelection.px = iMouseX - theSelection.x;
			theSelection.py = iMouseY - theSelection.y;

			if (theSelection.bHow[0]) {
				theSelection.px = iMouseX - theSelection.x;
				theSelection.py = iMouseY - theSelection.y;
			}
			if (theSelection.bHow[1]) {
				theSelection.px = iMouseX - theSelection.x - theSelection.w;
				theSelection.py = iMouseY - theSelection.y;
			}
			if (theSelection.bHow[2]) {
				theSelection.px = iMouseX - theSelection.x - theSelection.w;
				theSelection.py = iMouseY - theSelection.y - theSelection.h;
			}
			if (theSelection.bHow[3]) {
				theSelection.px = iMouseX - theSelection.x;
				theSelection.py = iMouseY - theSelection.y - theSelection.h;
			}
			

			if (iMouseX > theSelection.x + theSelection.csizeh && iMouseX < theSelection.x+theSelection.w - theSelection.csizeh &&
				iMouseY > theSelection.y + theSelection.csizeh && iMouseY < theSelection.y+theSelection.h - theSelection.csizeh) {
				theSelection.bDragAll = true;
			}

			for (i = 0; i < 4; i++) {
				if (theSelection.bHow[i]) {
					theSelection.bDrag[i] = true;
				}
			}
		},
		mouseup:function(e){
			var theSelection =  this.selection;
			theSelection.bDragAll = false;
			for (i = 0; i < 4; i++) {
				theSelection.bDrag[i] = false;
			}
			theSelection.px = 0;
			theSelection.py = 0;
			this.cutcanvas();//当放开鼠标按钮裁剪头像
		},
		intial:function(){
			var that = this;
			// loading source image
			var ctx = this.ctx = this.canvas[0].getContext('2d');
			this.image = new Image();
			this.image.src = this.imgsrc;
			this.image.onload = function (){
			if(this.width<ctx.canvas.width || this.height<ctx.canvas.height) return that.error('image must bigger than :'+ctx.canvas.width+'x'+ctx.canvas.height);


			// creating canvas and context objects
			//绑定事件
			that.canvas.mousemove(function(e) {
				that.mousemove(e);
				 e.preventDefault();
				return false;	
				});
			that.canvas.mousedown(function(e) {
				that.mousedown(e);
				 e.preventDefault();
				return false;		
				});
			that.canvas.mouseup(function(e) { 
				that.mouseup(e);
				 e.preventDefault();
				return false;		
				});
			$(document).mouseup(function(e){
				that.mouseup(e);
				e.preventDefault();
				return false;		
			})
			that.drawScene();//画出选择框
			that.mousemove({pageX:100, pageY:200})
			that.cutcanvas();
			}
			return this;
		},
		cutcanvas:function(){
			var temp_canvas = document.createElement('canvas'),
				temp_ctx = temp_canvas.getContext('2d'),
				theSelection =  this.selection;
		
			temp_canvas.width = theSelection.w;
			temp_canvas.height = theSelection.h;

			temp_ctx.drawImage(this.image, theSelection.x, theSelection.y, theSelection.w, theSelection.h, 0, 0, theSelection.w, theSelection.h);

			this.thumb.attr('src', temp_canvas.toDataURL());

		}
	};

	// define Selection constructor
	function Selection(x, y, w, h, sx, sy){
		this.x = x; // initial positions
		this.y = y;
		this.w = w; // and size
		this.h = h;

		this.px = x; // extra variables to dragging calculations
		this.py = y;

		this.csize = 5; // resize cubes size
		this.csizeh = 5; // resize cubes size (on hover)

		this.sidex = function(){return sx - this.w};
		this.sidey = function(){return sy - this.h};

		this.bHow = [false, false, false, false]; // hover statuses
		this.iCSize = [0, 0, this.csize, 0]; // resize cubes sizes
		this.bDrag = [false, false, false, false]; // drag statuses
		this.bDragAll = false; // drag whole selection
	}

	// define Selection draw method
	Selection.prototype.draw = function(ctx, image){

		ctx.strokeStyle = '#000';
		ctx.lineWidth = 1;
		ctx.strokeRect(this.x, this.y, this.w, this.h);

		// draw part of original image
		if (this.w > 0 && this.h > 0) {
			ctx.drawImage(image, this.x, this.y, this.w, this.h, this.x, this.y, this.w, this.h);
		}
		// draw resize cubes
		ctx.fillStyle = '#fff';
		ctx.fillRect(this.x - this.iCSize[0], this.y - this.iCSize[0], this.iCSize[0] * 2, this.iCSize[0] * 2);
		ctx.fillRect(this.x + this.w - this.iCSize[1], this.y - this.iCSize[1], this.iCSize[1] * 2, this.iCSize[1] * 2);
		ctx.fillRect(this.x + this.w - this.iCSize[2], this.y + this.h - this.iCSize[2], this.iCSize[2] * 2, this.iCSize[2] * 2);
		ctx.fillRect(this.x - this.iCSize[3], this.y + this.h - this.iCSize[3], this.iCSize[3] * 2, this.iCSize[3] * 2);
	}

}(window)