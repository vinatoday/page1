
	if (playList.length%2 !=0){document.write('danh sach play thieu'); exit();}
	//--------------------------------------------------------------------------------------
	
	var myhtml= '<div id="tab-noi-dung">';
	myhtml+= '<div id="tab-play-1" onclick="clickMusic()" style="width:150px;height:44px;overflow:hidden">';
	myhtml+= '<img id="image1" width="44px" height="43px"></img>';
	myhtml+= '<h2  id="tieuDe"></h2>';
	myhtml+= '<span id="thoiGian"></span>';
	myhtml+= '</div>';

	item= 0;
	myhtml+= '<div id="tab-play-2" style="position:absolute;visibility:hidden">';
	myhtml+= '<audio controls id="player1">Cannot Audio</audio>';
	myhtml+= '<div id="nut-close" onclick="show_play_2(false)">X</div>';
	myhtml+= '<div id="tab-list"><ol>';
	for (i=0; i<playList.length-1; i++) if (i%2==0){
		myhtml+= '<li onclick="goPlayList('+i+')" id="item'+i+'">'+playList[i]+'</li>';
		item++; if (item%3==0) myhtml+='<br>';
		}
	myhtml+= '</ol></div></div></div>'; //dong ol / tab-list / tab-play-2 / tab-noi-dung
	document.write(myhtml); myhtml='';
	
	

	var player1= document.getElementById('player1'),
		image1= document.getElementById('image1'),
		tieuDe= document.getElementById('tieuDe'),
		thoiGian= document.getElementById('thoiGian'),
		musicStart= -2,
		musicPre= -2,
		timeInterval='no';

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//==================================================================================
function show_play_2(ok){
	if (ok) document.getElementById('tab-play-2').style.visibility= 'visible';
	else document.getElementById('tab-play-2').style.visibility= 'hidden';
	}

function clickMusic() {if (player1.paused) player1.play(); else player1.pause();}
function goPlayList(item){
	if (item==musicStart) return; else musicStart= item;
	player1.src= playList[musicStart+1];
	player1.play();
	}




function musicLoad(){//player goi
	if (musicPre>=0) document.getElementById('item'+musicPre).style.background='#ccff66';
	document.getElementById('item'+musicStart).style.background='#00cc00';
	musicPre= musicStart;
	}

function musicPlay(){//player goi
	if (musicStart<0){ musicStart=0;  player1.src= playList[musicStart+1];  player1.play();}
	tieuDe.innerHTML= textShort(playList[musicStart]); image1.src= imageDown;
	if (timeInterval+''=='no')timeInterval= setInterval(updateMusic,1000);
	}


function musicPause(){//player goi
	tieuDe.innerHTML= 'PlayMusic'; image1.src= imageUp;
	clearInterval(timeInterval); timeInterval='no';
	}

function musicEnd(){//player goi
	if (musicStart+2 < playList.length){ 
		musicStart+= 2;
		player1.src= playList[musicStart+1];
		player1.play();
		} else {musicStart= -2;}
	}




function updateMusic() {
	thoiGian.innerHTML= getMinutes(player1.currentTime)+'-'+getMinutes(player1.duration);
	}

function getMinutes(seconds) {
	var numMinutes= Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
	var numSeconds= Math.floor((((seconds % 3153600) % 86400) % 3600) % 60);
	if (numMinutes < 10) numMinutes= '0'+numMinutes;
	if (numSeconds < 10) numSeconds= '0'+numSeconds;
	return numMinutes + ':' + numSeconds;
	}

function textShort(s){
	if (s.length<=8) return s;
	return s.substring(0, 8)+'..';
	}

//_________________________________________________________________________
//####################################################################
	player1.addEventListener('loadeddata',  musicLoad, false);
	player1.addEventListener('play',  musicPlay, false);
	player1.addEventListener('pause', musicPause, false);
	player1.addEventListener('ended', musicEnd,  false);
	//alert('ok');
	
	tieuDe.innerHTML= 'PlayMusic';
	thoiGian.innerHTML= '00:00-00:00';
	image1.src= imageUp;
