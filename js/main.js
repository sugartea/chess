(function(){
var chess = document.getElementById('chess');
var context = chess.getContext('2d');
var firstHand = true;//为true表示先手为黑棋
var over = false;
var arr = [];//存放棋局
for (var i = 0; i < 15; i++) {
	arr[i] = [];
	for (var j = 0; j < 15; j++) {
		arr[i][j] = 0;
	};
};
//赢法数组
var wins = [];
for (var i = 0; i < 15; i++) {
	wins[i] = [];
	for (var j = 0; j < 15; j++) {
		wins[i][j] = [];
	};
};
var count = 0;//定义赢法的种类

//所有行的赢法
for (var i = 0; i < 15; i++) {
	for (var j = 0; j < 11; j++) {
		for(var k = 0; k<5; k++){
			wins[i][j+k][count] = true;
		}
	count++;
	};
};	

//所有列的赢法
for (var i = 0; i < 15; i++) {
	for (var j = 0; j < 11; j++) {
		for(var k = 0; k<5; k++){
			wins[j+k][i][count] = true;
		}
	count++;
	};
};

//所有正斜线的赢法
for (var i = 0; i < 11; i++) {
	for (var j = 0; j < 11; j++) {
		for(var k = 0; k<5; k++){
			wins[i+k][j+k][count] = true;
		}
	count++;
	};
};

//所有反斜线的赢法
for (var i = 14; i > 3; i--) {
	for (var j = 0; j < 11; j++) {
		for(var k = 0; k<5; k++){
			wins[i-k][j+k][count] = true;
		}
	count++;
	};
};

//赢法的统计数组
var myWin = [];
var computerWin = [];
for (var i = 0; i < count; i++) {
	myWin[i] = 0;
	computerWin[i] = 0;
};


context.strokeStyle = '#BFBFBF';

var logo = new Image();
logo.src = "img/bgpic.jpeg";
logo.onload = function(){
	context.drawImage(logo, 0, 0, 450, 450);
	drawChessBoard();
}

var drawChessBoard = function(){
	for (var i = 0; i < 15; i++) {
		context.moveTo(15 + i*30, 15);
		context.lineTo(15 + i*30, 435);
		context.stroke();
		context.moveTo(15, 15 + i*30);
		context.lineTo(435, 15 + i*30);
		context.stroke();
	};
}

var step = function(X_index, Y_index, Boolean){
	context.beginPath();
	context.arc(15 + X_index*30, 15 + Y_index*30, 13, 0, 2*Math.PI);//前两个参数为圆心位置，第三个参数为半径
	context.closePath();
	var chessGradient = context.createRadialGradient(17 + X_index*30, 17 + Y_index*30, 12, 15 + X_index*30, 15 + Y_index*30, 1);
	
	if (Boolean) {
		chessGradient.addColorStop(0, "#0A0A0A");
		chessGradient.addColorStop(1, "#636766");
	}else{
		chessGradient.addColorStop(0, "#D1D1D1");
		chessGradient.addColorStop(1, "#F9F9F9");
	}

	context.fillStyle = chessGradient;
	context.fill();
}

chess.onclick = function(event){
	console.log(count);
	if (over) {
		return;
	}
	if (!firstHand) {
		return;
	};
	var x = event.offsetX;
	var y = event.offsetY;
	var X = Math.floor(x / 30);
	var Y = Math.floor(y / 30);
	if (arr[X][Y] == 0) {
		var judgeLength = Math.pow(x - X*30 -15, 2) + Math.pow(y - Y*30 - 15, 2);//优化部分区域点击不会落下棋子
		//169为棋子半径的平方
		if(judgeLength < 169){
			step(X,Y,firstHand);
			arr[X][Y] = 1;	
			for (var k = 0; k < count; k++) {
				if (wins[X][Y][k]) {
					myWin[k]++;
					computerWin[k] = 6;
					if (myWin[k] == 5) {
						window.alert("you win");
						over = true;
					}
				}
			}		
			if (!over) {
				firstHand = !firstHand;
				computerAI();
			};
		}
	}
}	

var computerAI = function(){
	var myScore = [];
	var computerScore = [];
	var max = 0;//初始化电脑的计算分值
	var u = 0, v = 0;//获取最高分的点坐标

	for (var i = 0; i < 15; i++) {
		myScore[i] = [];
		computerScore[i] = [];
		for (var j = 0; j < 15; j++) {
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {
			if (arr[i][j] == 0) {
				for (var k = 0; k < count; k++) {
					if (wins[i][j][k]) {
						if (myWin[k] == 1) {
							myScore[i][j] += 200;
						}else if(myWin[k] == 2){
							myScore[i][j] += 400;
						}else if (myWin[k] == 3) {
							myScore[i][j] += 2000;
						}else if (myWin[k] == 4) {
							myScore[i][j] += 10000;
						}
						if (computerWin[k] == 1) {
							computerScore[i][j] += 220;
						}else if(computerWin[k] == 2){
							computerScore[i][j] += 420;
						}else if (computerWin[k] == 3) {
							computerScore[i][j] += 2100;
						}else if (computerWin[k] == 4) {
							computerScore[i][j] += 20000;
						}
					}
				}
				if(myScore[i][j] > max){
					max = myScore[i][j];
					u = i;
					v = j;
				}else if(myScore[i][j] == max){
					if (computerScore[i][j] > computerScore[u][v]) {
						u = i;
						v = j;						
					}
				}
				if(computerScore[i][j] > max){
					max = computerScore[i][j];
					u = i;
					v = j;
				}else if(computerScore[i][j] == max){
					if (myScore[i][j] > myScore[u][v]) {
						u = i;
						v = j;						
					}
				}

			}
		}
	}
	step(u, v, false);
	arr[u][v] = 2;
	for (var k = 0; k < count; k++) {
	if (wins[u][v][k]) {
		computerWin[k]++;
		myWin[k] = 6;
		if (computerWin[k] == 5) {
			window.alert("computer win");
			over = true;
			}
		}
	}
	if(!over){
		firstHand = !firstHand;
	}
}

})()


