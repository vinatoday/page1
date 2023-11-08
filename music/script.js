	var id_player= 0;
//window.onerror= function(msg,url,line) {alert('Message: '+msg+', url: ' +url+ ', Line number: ' + line);}
function ___(id) {return document.getElementById(id);}
function strToInt(s)  {var num= parseInt(s);  return (num+''=='NaN')? 0:num;}
function strToFloat(s){var num= parseFloat(s);return (num+''=='NaN')? 0:num;}


function getMinutes(seconds) {
	seconds= strToInt(seconds);
	var minute= Math.floor(seconds/60);
	var second= seconds % 60;
	return minute +':' +second;
}

function textShort(s){
	const maxword= 16;
	if ( s.length <= maxword ) return s;
	else return s.substring(0, maxword)+'..';
	}



	
//==================================================================================
function playerMusic(divPlay,list){
	id_player++;
	var divPlay= ___(divPlay);
	var items= document.getElementsByClassName(list);
	var maxItem= items.length-1; if(!divPlay || maxItem < 0) return;
	var current= -1;
	var pre= null;
	var interval= null;
	var idplay= 'player' + id_player + '_';
	var path= divPlay.getAttribute('path');
	
	
	//______________________________________________________________________
	function onLoaded(){ //khi tải đủ cho play
		viewItemPlay();
		set_max();
	}

	function onProress(){ //Định kì báo tải file
		set_max();
	}

	function onPlay(){ //khi play
		tieuDe.innerHTML= textShort(items[current].getAttribute('song'));
		hinhCD.setAttribute('play','on');
		interval= setInterval(updateMusic,1000);
	}

	function onPause(){ //khi pase
		tieuDe.innerHTML= 'PlayMusic';
		hinhCD.setAttribute('play','off');
		interval= clearInterval(interval);
	}

	function onFinish(){ //khi ket thuc
		if (current+1 <= maxItem) {
			current++;
			playCurrent();
		} else {
			current= -1;
			pre.classList.remove('item_play');
		}
	}
	
	
	//______________________________________________________________________
	function updateMusic() {
		thoiGian.innerHTML= getMinutes(audio.currentTime)+' - '+getMinutes(audio.duration);
		if(!mouse_down) progress.value= audio.currentTime;
	}
	
	function viewItemPlay(){
		if (pre != null) pre.classList.remove('item_play');
		items[current].classList.add('item_play');
		pre= items[current];
		
	}
	
	function set_max(){
		var max= strToFloat(audio.duration);
		if(max >0) progress.max= max;
		
	}
	
	function playCurrent(){
		document.title= items[current].getAttribute('song');
		var songUrl= items[current].getAttribute('url');
		audio.src= (path)? path+songUrl : songUrl;
		audio.play();
	}
	
	function playClickItem(){
		var item= strToInt(this.getAttribute('item'));
		if (item == current) return;
		current= item;
		viewItemPlay();
		playCurrent();
	}
	
	function playMusic() {
		if(current<0) {
			current= 0;
			playCurrent();
		} else {
			if (audio.paused) audio.play(); else audio.pause();
		}
	}
	
	function completeSongItems(){
		for (var i=0; i <= maxItem; i++){
			items[i].setAttribute('item',i);
			items[i].addEventListener('click', playClickItem,  false);
			items[i].classList.add('item_song');
			var song= items[i].getAttribute('song');
			items[i].innerHTML= song;
		}
		
	}	
	
	function addHtml(){
		var thumb= divPlay.getAttribute('thumb'); if(!thumb) thumb= 'music/thumb.jpg';
		var cd= divPlay.getAttribute('cd'); if(!cd) cd= 'music/cd.jpg';
		var hn= new Date(); hn= hn.getFullYear();
		divPlay.style= "display:block;width:100%;";
	
		var html= '<audio id="'+idplay+'audio"></audio>';
		html+= '<div class="divPlay" id="'+idplay+'btPlay">';
		html+= '<div class="layerPlay hinhCD" id="'+idplay+'hinhCD" style="background-image:url('+cd+')"></div>';
		html+= '<div class="layerPlay bgCD"></div>';
		html+= '<div class="layerPlay thumbCD" style="background-image:url('+thumb+')"></div>';
		html+= '<div class="layerPlay thoiGian" id="'+idplay+'thoiGian">'+hn+'</div>';
		html+= '</div>';
		html+= '<b class="tieude" id="'+idplay+'tieuDe">PlayMusic</b>'; 
		html+= '<div class="tientrinh"><input type="range" id="'+idplay+'progress" min="0" max="10" value="3"></div>'; 
		divPlay.innerHTML= html;
	}
	//______________________________________________________________________
	
	
	addHtml();
	completeSongItems();
	
	var btPlay=   ___(idplay +'btPlay');
	var audio=    ___(idplay +'audio');
	var hinhCD=   ___(idplay +'hinhCD');
	var tieuDe=   ___(idplay +'tieuDe');
	var thoiGian= ___(idplay +'thoiGian');
	var progress= ___(idplay +'progress');
	
	btPlay.onclick= playMusic;
	tieuDe.onclick= playMusic;
	
	var mouse_down= false;
	progress.onchange=	  function() {audio.currentTime= progress.value;}
	progress.onmousedown= function() {mouse_down= true;}
	progress.onmouseup=   function() {mouse_down= false;}
	
	audio.addEventListener('loadeddata',  onLoaded, false);
	audio.addEventListener('progress',  onProress, false);
	audio.addEventListener('play',  onPlay, false);
	audio.addEventListener('pause', onPause, false);
	audio.addEventListener('ended', onFinish,  false);
}
