var ctx = null;
var cvs = null;

var sprite;
var character;

function startFunc(){
	cvs = document.getElementById("canvas");
	ctx = cvs.getContext("2d");

	sprite = {data:[],index:0,frameSpeed:8,frameData:[0,1,0,2],frameInterval:null};
	character = {isRun:false,runSpeed:3,walkSpeed:5,yMov:0,xMov:0,x:0,y:0}
//	for(var i=0;i<3;i++){
	sprite.data.push(document.getElementById("character_normal_move1"));
	sprite.data.push(document.getElementById("character_normal_move2"));
	sprite.data.push(document.getElementById("character_normal_move3"));

	//if sprite moves

	window.addEventListener("keydown",function(evt){
		var speed = 0;
		if(character.isRun){
			speed = character.runSpeed;
		} else {
			speed = character.walkSpeed;
		}

		switch(evt.keyCode){
			case 87 :
				character.yMov = -speed;
				break;
			case 83 : 
				character.yMov = speed;
				break;
			case 65 : 
				character.xMov = -speed;
				break;
			case 68	 : 
				character.xMov = speed;
				break;
			}
		switch(evt.keyCode){
				case 65:
				case 68:
				case 83:
				case 87:
					if(!sprite.frameInterval){
						sprite.index++;
						sprite.frameInterval = setInterval(function(){
							sprite.index++;
						},1000/60*sprite.frameSpeed);
					}
		}

	},false);

	window.addEventListener("keyup",function(evt){
		switch(evt.keyCode){
			case 87 ://'w'
				if(character.yMov<0){
					character.yMov = 0;
				}
				break;
			case 83 ://'s'
				if(character.yMov>0){
					character.yMov = 0;
				}
				break;

			case 65 ://'a'
				if(character.xMov<0){
					character.xMov = 0;
				}
				break;
			case 68 ://'d'
				if(character.xMov>0){
					character.xMov = 0;
				}
				break;
			}
			switch(evt.keyCode){
				case 65:
				case 68:
				case 83:
				case 87:
					clearInterval(sprite.frameInterval);
					sprite.frameInterval=null;
					sprite.index = 0;
					break;
			}
	},false);

	setInterval(function(){
		loop(ctx);
	},1000/60);
}

function move(){

}

function loop(ctx){
	cvs.width = cvs.width;

	ctx.drawImage(sprite.data[sprite.frameData[sprite.index%4]],character.x,character.y,100,100);
	
	character.y += character.yMov;
	character.x += character.xMov;

}