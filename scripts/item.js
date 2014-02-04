function ClassItem(name, type, info, image){
	this.name = name;
	this.type = type;
	this.info = info;
	this.image = image;

	this.setInfo = function(name, value){
		switch(name){
			case 'number':
				this.number = value;
				break;

			case 'att':
				this.att = value;
				break;
			
			case 'fireSpeed': //per second
				this.fireSpeed = value;
				break;

			case 'clip':
				this.clip = value;
				break;

			case 'movement':
				this.movement = value;
				break;
		}
	};
}

var items = [];

function startFunc(){
	$('#buttons').click(function(){
		itemLoad();
	});
}

function itemLoad(){
	var json = '[{"name":"pistol MK1","type":"pistol","info":"this first pistol for prototype","att":5,"fireSpeed":1,"clip":8,"movement":"small"},{"name":"pistol MK2","type":"pistol","info":"this first pistol for prototype","att":4,"fireSpeed":1,"clip":12,"movement":"small"},{"name":"rifle MK1","type":"rifle","info":"this first rifle for prototype","att":20,"fireSpeed":1.5,"clip":30,"movement":"large"}]';
	
	var obj = $.parseJSON(json);
	for(var list in obj){
		var objTemp = obj[list];
		var item = new ClassItem(objTemp.name, objTemp.type, objTemp.info);
		item.setInfo('att',objTemp.att);
		item.setInfo('fireSpeed',objTemp.fireSpeed);
		item.setInfo('movement',objTemp.movement);
		item.setInfo('clip',objTemp.clip);

		items.push(item);
	}
}
