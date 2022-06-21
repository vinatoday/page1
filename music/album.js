//==================================================================================
function strToInt(s)  {var num= parseInt(s);  return (num+''=='NaN')? 0:num;}
function strToFloat(s){var num= parseFloat(s);return (num+''=='NaN')? 0:num;}

function $(el) {
	var items= document.querySelectorAll(el); 
	var len= items.length;
	var map= function(f) {for (var i=0; i<len; i++) f(i,items[i])};
	items.map= map;
	items.addclass=  function(s) {map(function(i,el){if (!el.classList.contains(s)) el.classList.add(s)})};
	items.addclick=  function(f) {map(function(i,el){el.onclick= f})};
	items.add2click= function(f) {map(function(i,el){el.ondblclick= f})};
	return items;
}

//==================================================================================
function start_player(){
	if ($('#audio1').length>0) return alert("Loi! 2 lan khoi tao.."); 
	var items= $("#listsong i");
	var maxItem= items.length; if (maxItem<1) return alert("items=0..");
	items.map(function(i,el) {el.setAttribute('index',i); el.setAttribute("item","normal");});
	items.addclick(play_item);
	items.addclass("itemsong");
	
	var cdplayer= $("#cdplayer")[0];
	var path= cdplayer.getAttribute("path");
	var interval= null;
	var current=  null;
	//________________________________________
	
	
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
	
	//______________________________________________________________________
	function onLoaded(){ //khi tải đủ cho play
		set_max();
	}

	function onProress(){ //Định kì báo tải file
		set_max();
	}

	function onPlay(){ //khi play
		tieuDe.innerHTML= textShort(current.textContent);
		hinhCD.setAttribute('play','on');
		interval= setInterval(updateTime,1000);
	}

	function onPause(){ //khi dung
		tieuDe.innerHTML= 'PlayMusic';
		hinhCD.setAttribute('play','off');
		interval= clearInterval(interval);
	}

	function onFinish(){ //finish song
		var index= strToInt(current.getAttribute("index"))+1;
		if (index < maxItem) { // next song
			play_current(items[index]);
		} else { // ends list 
			current.setAttribute("item","normal");
			current= null;
		}
	}
	
	
	//______________________________________________________________________
	function updateTime() {
		thoiGian.innerHTML= getMinutes(audio.currentTime)+' - '+getMinutes(audio.duration);
		if(!mouse_down) progress.value= audio.currentTime;
	}
	
	function set_max(){
		var max= strToFloat(audio.duration);
		if(max >0) progress.max= max;
		
	}
	
	function play_current(item){
		if (current) current.setAttribute("item","normal");
		current= item; // new song
		var song= textShort(item.textContent);
		var url= item.getAttribute('url'); if (path) url= path+url;
		item.setAttribute("item","playing");
		document.title= song;
		tieuDe.innerHTML= song;
		audio.src= url;
		audio.play();
	}
	
	function play_item(){
		if (this != current) play_current(this);
	}
	
	function play_pause() {
		if (current) { // da co
			if (audio.paused) audio.play(); else audio.pause();
		} else { // tu dau
			play_current(items[0]);
		}
	}
	
	function addHtml(){
		var thumb= cdplayer.getAttribute('thumb'); if(!thumb) thumb= 'music/thumb.jpg';
		var cd= cdplayer.getAttribute('cd'); if(!cd) cd= 'music/cd.jpg';
		var hn= new Date(); hn= hn.getFullYear();
		cdplayer.style= "display:block;width:100%;";
	
		var html= '<audio id="audio1"></audio>';
		html+= '<div class="divPlay" id="btPlay1">';
			html+= '<div class="layerPlay hinhCD" id="hinhCD1" style="background-image:url('+cd+')"></div>';
			html+= '<div class="layerPlay bgCD"></div>';
			html+= '<div class="layerPlay thumbCD" style="background-image:url('+thumb+')"></div>';
			html+= '<div class="layerPlay thoiGian" id="thoiGian1">'+hn+'</div>';
		html+= '</div>';
		html+= '<b class="tieude" id="tieuDe1">PlayMusic</b>'; 
		html+= '<div class="tientrinh"><input type="range" id="progress1" min="0" max="10" value="3"></div>'; 
		cdplayer.innerHTML= html;
	}
	//______________________________________________________________________
	
	
	addHtml();
	var btPlay=   $('#btPlay1')[0];
	var audio=    $('#audio1')[0];
	var hinhCD=   $('#hinhCD1')[0];
	var tieuDe=   $('#tieuDe1')[0];
	var thoiGian= $('#thoiGian1')[0];
	var progress= $('#progress1')[0];
		
	var mouse_down= false;
	progress.onchange=	  function() {audio.currentTime= progress.value;}
	progress.onmousedown= function() {mouse_down= true;}
	progress.onmouseup=   function() {mouse_down= false;}
	
	audio.addEventListener('loadeddata',  onLoaded, false);
	audio.addEventListener('progress',  onProress, false);
	audio.addEventListener('play',  onPlay, false);
	audio.addEventListener('pause', onPause, false);
	audio.addEventListener('ended', onFinish,  false);
	
	tieuDe.onclick= play_pause;
	btPlay.onclick= play_pause;
}

new start_player();