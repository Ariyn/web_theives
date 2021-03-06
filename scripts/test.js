
/*
http://hondoom.com/zbxe/
똥똥배 게임대회 출품 예정작
*/

/*
맵을 우선적으로 그려주고 나서, 그 상태를 save, restore해준다.
그리고 맵상태
*/

var canvas, ctx;
var canvasStat = {width:900,height:1024};
var screenStat = {x:0,y:0};
var start = true;
var tileSize = 20;

var characters = [{x:50,y:50,color:"red",xMov:0,yMov:0,lookAt:0,walkSpeed:3,runSpeed:4,isRun:false,fireGun:null,money:0,gun:{item:null,type:"pistol",leftClip:8}},{x:250,y:140,color:"blue",xMov:0,yMov:0,lookAt:0,movSpeed:5}];
var pointer = {x:0,y:0,size:20,color:"red",thick:3};
var map = null;
var effect = []; //such as broken glass, blood, etc...
/*
location, color, size
이걸 나중에 save, restore해주면 어떨까?
*/
var items = []; // just items

var bullets = [];
/*
start Location, target Location, dMovement, type, hit
*/
var fps = 60;

var gl;
var mapData = [	[100,	100,	0,		500, 	5,		'wall'],
				[100,	600,	500,	0,		5,		'wall'],
				[600,	600,	0,		-500,	5,		'wall'],
				[600,	100,	-500,	0,		5,		'wall'],
				[350,	100,	0,		500,	5,		'wall'],
				[350,	300,	null,	null,	null,	'door']];

function reload(character){
	character.gun.leftClip = 8;
	$("#infoPanel #bullet .info").html(character.gun.leftClip);
}

function fireGun(character,speed){

	if((character.gun.leftClip--)<=0){
		return 0;
	}
	$("#infoPanel #bullet .info").html(character.gun.leftClip);

	var a = (pointer.y - character.y)/(pointer.x - character.x);
	var theta = Math.atan(a);

	if(pointer.x <= character.x) {
		var dx = Math.cos(theta) * -speed;
		var dy = Math.sin(theta) * -speed;
	} else {
		var dx = Math.cos(theta) * speed;
		var dy = Math.sin(theta) * speed;
	}

	var locDs = {x:pointer.x,y:pointer.y};

	//hitscan
	var b = pointer.y - a * pointer.x;
	for(var list in characters){
		var chars = characters[list];
		if(chars == character){
			continue;
		}

		var isHit = checkHit(chars.x,chars.y,tileSize,a,b);
		if(isHit){
			locDs.x = chars.x;
			locDs.y = chars.y;
		} else {
			
		}
	}

	for(var list in map.mapData){
		var chars = map.mapData[list];
		if(chars == character){
			continue;
		}

		var isHit = checkHit(chars.x,chars.y,tileSize,a,b);
		if(isHit){
			locDs.x = chars.x;
			locDs.y = chars.y;
		} else {
			
		}
	}


	bullets.push({locS:{x:character.x,y:character.y},
				locD:locDs,
				movD:{x:dx, y:dy},
				locP:{x:character.x,y:character.y},
				hit:isHit,
				hitTimes:{calc:Math.floor((locDs.x-character.x)/dx),p:0}}
				);
}

function checkHit(x, y, size, a, b){
	var checkY = a*x+b;
	var checkX = (y-b)/a;

	if((y-size <= checkY && checkY <= y+size)||(x-size <= checkX && checkX <= x+size)){
		return true;
	} else {
		return false;
	}
}

function startFunc(){
	map = new Map(600,1);
	for(var list in mapData){
		var tempMap = mapData[list];
		map.makeMap(null,tempMap[0],tempMap[1],tempMap[2],tempMap[3],tempMap[4],tempMap[5]);
	}

	var sin = Math.sin(Math.PI / 4);
	var cos = Math.cos(Math.PI / 4);
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	gl = new MinLiteGraphic(ctx);

	canvas.addEventListener("mousemove",function(evt){
		var pos = getMousePos(canvas, evt);
		pointer.x = pos.x;
		pointer.y = pos.y;
	},false);

	canvas.addEventListener("mousedown",function(evt){
		fireGun(characters[0],100);

		characters[0].fireGun = setInterval(function(){
			fireGun(characters[0],50);
		},200);//character.gunType.timer
	},false);

	canvas.addEventListener("mouseup",function(evt){
		clearInterval(characters[0].fireGun);
	},false);

	window.addEventListener("keydown",function(evt){
		var speed = 0;
		if(characters[0].isRun){
			speed = characters[0].runSpeed;
		} else {
			speed = characters[0].walkSpeed;
		}

		switch(evt.keyCode){
			case 16:
				characters[0].isRun=true;
				if(characters[0].yMov < 0)
					characters[0].yMov = -characters[0].runSpeed;
				else if(characters[0].yMov > 0)
					characters[0].yMov = characters[0].runSpeed;

				if(characters[0].xMov < 0)
					characters[0].xMov = -characters[0].runSpeed;
				else if(characters[0].xMov > 0)
					characters[0].xMov = characters[0].runSpeed;
				break;
			case 87 :
				characters[0].yMov = -speed;
				break;
			case 83 : 
				characters[0].yMov = speed;
				break;
			case 65 : 
				characters[0].xMov = -speed;
				break;
			case 68	 : 
				characters[0].xMov = speed;
				break;

			case 114:
			case 82:
				reload(characters[0]);
				break;
			}
	},false);

	window.addEventListener("keyup",function(evt){
		switch(evt.keyCode){
			case 16://shift
				characters[0].isRun=false;
				if(characters[0].yMov < 0)
					characters[0].yMov = -characters[0].walkSpeed;
				else if(characters[0].yMov > 0)
					characters[0].yMov = characters[0].walkSpeed;

				if(characters[0].xMov < 0)
					characters[0].xMov = -characters[0].walkSpeed;
				else if(characters[0].xMov > 0)
					characters[0].xMov = characters[0].walkSpeed;
				break;
			case 87 ://'w'
				if(characters[0].yMov<0){
					characters[0].yMov = 0;
				}
				break;
			case 83 ://'s'
				if(characters[0].yMov>0){
					characters[0].yMov = 0;
				}
				break;

			case 65 ://'a'
				if(characters[0].xMov<0){
					characters[0].xMov = 0;
				}
				break;
			case 68 ://'d'
				if(characters[0].xMov>0){
					characters[0].xMov = 0;
				}
				break;
			}
	},false);

	setInterval(function(){
		mainLoop(ctx);
	},1000/fps);
	
}

function mainLoop(ctx){
	canvas.width = canvas.width;
	//strokeTiles(-500,-350,canvasStat.width,canvasStat.height,tileSize,"black");

	drawMap(ctx);
	drawEffect();
	physicsCalc(characters);
	drawCharacter(characters);
	drawPointer();

}

function drawMap(ctx){
	ctx.beginPath();

	for(var list in map.mapData){
		var tempMap = map.mapData[list];
		switch(tempMap.type){
			case 'door':
				ctx.stroke();
				ctx.lineWidth = 2;
				ctx.moveTo(tempMap.x - 10,tempMap.y - 10);
				ctx.lineTo(tempMap.x + 10,tempMap.y - 10);
				ctx.lineTo(tempMap.x + 10,tempMap.y + 10);
				ctx.lineTo(tempMap.x - 10,tempMap.y + 10);
				ctx.lineTo(tempMap.x - 10,tempMap.y - 10);
				break;
			case 'wall':
				ctx.stroke();
				
				ctx.lineWidth = tempMap.thickness;
				ctx.strokeStyle ="black";

				ctx.moveTo(tempMap.x,tempMap.y);
				ctx.lineTo(tempMap.x + tempMap.width,tempMap.y + tempMap.height);
				break;
		}
	}
	ctx.stroke();
}

function drawEffect(){
	for(var list in bullets){
		var bul = bullets[list];
		ctx.fillStyle = "red";
		
		ctx.fillRect(bul.locP.x,bul.locP.y,5,5);
	}

	for(var list in effect){
		var eff = effect[list];
		ctx.fillStyle = eff.color;
		
		ctx.fillRect(eff.x,eff.y,eff.size,eff.size);
	}

	for(var list in items){

	}
}

function addEffect(loc,type){
	switch(type){
		case "blood":
			effect.push({x:loc.x-20,y:loc.y+20,color:"red",size:5});
			effect.push({x:loc.x-20,y:loc.y-20,color:"red",size:5});
			effect.push({x:loc.x+20,y:loc.y+20,color:"red",size:5});
			effect.push({x:loc.x+20,y:loc.y-20,color:"red",size:5});
		break;
	}
}

function drawPointer(){
	ctx.beginPath();
	ctx.arc(pointer.x, pointer.y , pointer.size, 0, 2 * Math.PI, false);
	ctx.strokeStyle = pointer.color;
	ctx.lineWidth = pointer.thick;
	
	ctx.moveTo(pointer.x, pointer.y+pointer.size);
	ctx.lineTo(pointer.x, pointer.y-pointer.size);
	ctx.moveTo(pointer.x+pointer.size, pointer.y);
	ctx.lineTo(pointer.x-pointer.size, pointer.y);

	ctx.stroke();
	ctx.lineWidth = 1;
}

function coliCheck(object){
	return false;
	for(var list in map.mapData){
		var tempMap = map.mapData[list];
		var tks = tempMap.thickness/2;
	}
	
	return {x:false,y:false};
}

function physicsCalc(characters){
	characters[0].x += characters[0].xMov;
	characters[0].y += characters[0].yMov;
	coliCheck(characters[0]);
	for(var list in bullets){
		var bul = bullets[list];
		bul.locP.x += bul.movD.x;
		bul.locP.y += bul.movD.y;
		bul.hitTimes.p++;

		
		if(bul.locP.x <= 0 || canvasStat.width <= bul.locP.x || bul.locP.y <= 0 || canvasStat.height <= bul.locP.y ){
				var temp = bullets.indexOf(bul);
				bullets.splice(temp,1);
		} else if(bul.hit){
			if(bul.hitTimes.p > bul.hitTimes.calc){
				var temp = bullets.indexOf(bul);
				bullets.splice(temp,1);

				addEffect(bul.locD,"blood");
			}
		}
	}
}

function strokeTiles(x,y,width,height,size,color){
	/* this function will change to map drawing which draw map from map data */
	if(start){
		ctx.strokeStyle = color;
		for(var i=x;i<width;i+=size)
			for(var e=y;e<height;e+=size){
				ctx.strokeRect(i,e,size,size);
			}
		ctx.save();
		start = false;
	} else {
		ctx.restore();
		ctx.save();
	}
}

function drawCharacter(characters){
	for(var list in characters){
		var chars = characters[list];
		gl.drawSquareRect(chars.x,chars.y,tileSize,chars.color);
	}
}

function getMousePos(canvas, evt){
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}



function MinLiteGraphic(ctx,bufferCtx){
	this.ctx = ctx;
	this.bufCtx = bufferCtx;

	this.drawSquareRect = function(x,y,size,style){
		var loc = size/2;
		this.ctx.fillStyle = style;
		this.ctx.fillRect(x-loc,y-loc,size,size);
	};
}

function Map(size,type){
	this.size = size;
	this.type = type;
	this.mapData = [];
	
	/*
	map data will hold the data about map
	such as walls, interactive objects, etc
	
	x,y,width,height,thickness,objectType

	if there is no x or y or both, it means last element's finish point.
	if it is not wall but items or something doesn't need thickness, width and height it holds null;
	*/

	this.createMap = function(array){
		this.mapData = array;
	}

	this.makeMap = function(data, x, y, width, height, tks, type){
		var tempData = null;
		var tempType = type;
		
		if(!type)
			tempType = 'normal';
		tempData = {x:x,y:y,width:width,height:height,thickness:tks,type:tempType,data:data};

		console.log("tet");
		this.mapData.push(tempData);
	}
}

/*
map examples

{0,		0,		0,		500, 	2,		'wall'},
{null,	null,	500,	0,		2,		'wall'},
{null,	null,	0,		-500,	2,		'wall'},
{null,	null,	500,	0,		2,		'wall'},
{250,	0,		0,		500,	2,		'wall'},
{250,	250,	null,	null,	null,	'door'}

*/