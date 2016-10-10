
	var faceID, skinID, eyesID, noseID, mouthID, hair_styleID, hair_colorID, shirtID;
	var loaded_images = 0;
	var c, ctx, b, btx, hair;
		
	$(document).ready(function() {
		// stick the default values in with PHP after getting it from database?
		c = document.getElementById("avatar_canvas");
		ctx = c.getContext("2d");
		b = document.createElement('canvas'); // buffer canvas
        b.width = c.width;
        b.height = c.height;
        btx = b.getContext('2d');
		
		hair_color = new Image(); hair_color.src = "Avatar Editor_files/hair_color.png"; hair_color.onload = handleLoadedImage;
		hair_line = new Image(); hair_line.src = "Avatar Editor_files/hair_line.png"; hair_line.onload = handleLoadedImage;
  		heads_color = new Image(); heads_color.src = "Avatar Editor_files/heads_color.png"; heads_color.onload = handleLoadedImage;
    	heads_line = new Image(); heads_line.src = "Avatar Editor_files/heads_line.png"; heads_line.onload = handleLoadedImage;
    	eyes = new Image(); eyes.src = "Avatar Editor_files/eyes.png"; eyes.onload = handleLoadedImage;
   		noses = new Image(); noses.src = "Avatar Editor_files/noses.png"; noses.onload = handleLoadedImage;
    	mouths = new Image(); mouths.src = "Avatar Editor_files/mouths.png"; mouths.onload = handleLoadedImage;
    	shirts = new Image(); shirts.src = "Avatar Editor_files/shirts2.png"; shirts.onload = handleLoadedImage;

		noLoadedAvatar();
	});
	
	function noLoadedAvatar() {
		// use a random avatar
		randomAvatar(true);
		handleLoadedImage();
	}

	function randomAvatar(unloaded) {
		faceID = Math.floor( Math.random() * 6 );
		skinID = Math.floor( Math.random() * 6 );
		eyesID = Math.floor( Math.random() * 12 );
		noseID = Math.floor( Math.random() * 12 );
		mouthID = Math.floor( Math.random() * 12 );
		hair_styleID = Math.floor( Math.random() * 21 );
		hair_colorID = Math.floor( Math.random() * 8 );
		shirtID = Math.floor( Math.random() * 24 );
		if (!unloaded) redraw();
	}
	
	// will call redraw() the first time as soon as all images have loaded
	function handleLoadedImage() {
		loaded_images ++;
		if (loaded_images >= 9) redraw();
	}
	
	function tab(n) {
		$("#menu_nav a").removeClass("selected");
		$("#nav_tab"+n).addClass("selected");
		$(".menu_content").css("display", "none");
		$("#content"+n).css("display","block");
	}

	function tab2(n) {
		$("#sub_nav a").removeClass("selected");
		$("#sub_tab"+n).addClass("selected");
		$(".sub_content").css("display", "none");
		$("#subcontent"+n).css("display","block");
	}
	
	// Place a new feature (eyes, etc) and replace the old one
	// Eventually make these boxes stay selected
	function set(feature, n) {
		window[feature+"ID"] = n;
		redraw();
	}

	function redraw() {
		var dx, dy, sw, sh, row, col;
		var s = 1;
		ctx.clearRect(0,0,c.width, c.height);
		
		
		/****** shirt ******/
		dx = 27; dy = 107; sw = 126; sh = 117;
		row = Math.floor(shirtID / 6);
		col = shirtID % 6;
		ctx.drawImage(shirts, sw*col, sh*row, sw, sh, dx, dy, sw*s, sh*s);
		
		/****** head ******/
		dx = 13; dy = 22;
		sw = 155; sh = 131;
		color = ['#ffd7c7','#f3bc85','#c4874e','#9f6946','#724422','#41261e'][skinID];
		drawTinted(heads_color, heads_line, sw*faceID, 0, sw, sh, dx, dy, sw*s, sh*s, color);
		
		/******* eyes ******/
		dx = 38; dy = 32; sw = 102; sh = 95;
		row = Math.floor(eyesID / 6);
		col = eyesID % 6;
		ctx.drawImage(eyes, sw*col, sh*row, sw, sh, dx, dy, sw*s, sh*s);

		/******* nose ******/
		dx = 68; dy = 70; sw = 43; sh = 40;
		row = Math.floor(noseID / 6);
		col = noseID % 6;
		ctx.drawImage(noses, sw*col, sh*row, sw, sh, dx, dy, sw*s, sh*s);

		/****** hair ******/
		dx = [-6,-6,3,-7,21,12][faceID];
		dy = [-5,-7,-8,-7,-7,-14][faceID]; // depends on face_shape
		sc = [1,1,0.9,1,0.75,0.8][faceID];
		sw = 193; sh = 170;
		var styleID = hair_styleID;
		if (faceID == 4 && styleID == 14) styleID = 0; // prevent beard on potatoface
		row = Math.floor(styleID / 7);
		col = styleID % 7;
		color = ['#14110c','#372213','#85581f','#ce591b','#f6ce60','#bbb7b1','#1584ff','#ea5a7f'][hair_colorID];
		drawTinted(hair_color, hair_line, sw*col, sh*row, sw, sh, dx, dy, sw*s*sc, sh*s, color);
		
		
		/******* mouth (above beard) ******/
		dx = 64; dy = 89; sw = 54; sh = 50;
		row = Math.floor(mouthID / 6);
		col = mouthID % 6;
		ctx.drawImage(mouths, sw*col, sh*row, sw, sh, dx, dy, sw*s, sh*s);
		
	}
	
	function drawTinted(color_image, line_image, sx, sy, sw, sh, dx, dy, dw, dh, color) {
		btx.clearRect(0,0,b.width, b.height);
        btx.drawImage(color_image, sx, sy, sw, sh, dx, dy, dw, dh);
		btx.globalCompositeOperation = "source-atop"; // draw the color in the shape of the hair
		btx.fillStyle = color;
		btx.fillRect(dx,dy,dw,dh);
        btx.globalCompositeOperation = "source-over"; // back to normal
		
		ctx.drawImage(b,0,0); // draw the color
		ctx.drawImage(line_image, sx, sy, sw, sh, dx, dy, dw, dh); // draw the line on top
	}

