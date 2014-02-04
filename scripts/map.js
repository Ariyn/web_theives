function map(size,type){
	this.size = size;
	this.type = type;

	this.createMap = function(array){
		this.mapData = array;
	}

	this.makeMap = function(data, x, y, type){
		var tempData = data;
		if(x && y){
			var tempType = type;
			if(!type)
				tempType = 'normal';
			tempData = {x:x,y:y,type:tempType,data:data};
		}

		this.mapData.push(tempData);
	}
}