//==================================================================================
function TPractice(owner,idpost,titlepost,userid,codesafe,calendar){
	var page= document.querySelector('#page-question');
	var items= page.querySelectorAll('.questions');
	var len= items.length;
	var xml= new TXMLhttp("blog_request.php");
	var showResult= page.querySelector('#showResult');
	var trueAnswer= 0;
	function map(f) {for (var i=0; i<len; i++) f(items[i]);};
	var self= this;
	var edit= false;
	var pc="|";
	//____________________________


map(function(item){
	item.answer= item.querySelectorAll('input');
	item.label=  item.querySelectorAll('label');
	item.answered= false; //save result.
	item.result= item.querySelector('#result'); //view result.
	
	if (!owner) return;
	var id_question= item.getAttribute('idq');
	// set for menu popup..
	item.querySelector('#btEdit').onclick= function(){
		var link= 'question/'+id_question; if (calendar) link+= '/calendar';
		document.location.href= link;
	}
	item.querySelector('#btDelete').onclick= function(){
		if (!confirm('Xóa câu hỏi?')) return;
		edit= true;
		var data= new FormData();
		data.append("xml_send","delete_question");
		data.append("id_question",id_question);
		xml.complete= function(msg){
			if (msg==='<okcomplete>') item.style.display= 'none'; else alert("msg= "+msg);
		};
		xml.send(data);
	}
});

function is_answer(answer){
	for (var i=0; i<answer.length; i++) if (answer[i].checked) return true;
	return false;	
}


function check_answer(answer){
	var ok= true;
	for (var i=0; i<answer.length; i++){
		if (answer[i].value==1 && !answer[i].checked) ok= false; else
		if (answer[i].value==0 &&  answer[i].checked) ok= false;
	}
	return ok;
}
	
function lock_items(){
	map(function(item){item.setAttribute('status','lock');});
}
	
function get_msg(){
	var msg= page.getAttribute('msg'); if (msg=="") return "";
	msg= msg.split(pc);
	var point=  page.getAttribute('be'); point= point.split(pc);
	var pointend=  page.getAttribute('en'); pointend= pointend.split(pc);
	
	if (msg.length != point.length || msg.length != pointend.length) return "";
	var kq= ""; 
	for (var i=0; i<msg.length; i++) {
		var min= strToInt(point[i]);
		var max= strToInt(pointend[i]);
		kq+= (trueAnswer >= min && trueAnswer <= max)? msg[i]:"";
	}
	return '<p>'+kq+'</p>';
}

	
function view_trueanswer(item) {
	for (var i=0; i<item.answer.length; i++) {
		item.label[i].setAttribute("status",item.answer[i].value);
	} 
}
//___________________________________________________________________





function move_center(){
	var screen= Math.floor(document.documentElement.clientHeight/3);
	var rect= showResult.getBoundingClientRect();
	pageY= document.documentElement.scrollTop + rect.top - screen;
	document.body.scrollTop= pageY;
	document.documentElement.scrollTop= pageY;
}

function finish(){
	map(function(item){
		var msg= item.getAttribute('msg'); msg= msg.split(pc);
		if (item.answered === true) {
			var msg2= (msg.length>=2)? msg[1]:"";
			var answer= '<b class="result-true fa fa-complete">Trả lời đúng</b>';
		} else {
			var msg2= (msg.length>=3)? msg[2]:"";
			var answer= '<b class="result-false fa fa-fault">Trả lời sai</b>';
		}
		msg= msg[0];
		if (msg  != "") msg=  '<div class="result-msg">'+msg+'</div>';
		if (msg2 != "") msg2= '<div class="result-msg">'+msg2+'</div>';
		view_trueanswer(item);
		item.result.innerHTML= msg+msg2+answer;
		item.result.style.display= "block";
	});
	
	var result= Math.floor(trueAnswer/len*10);
	var order= (result >= 8)? 1 : ((result >= 6)? 2:3);
	var flower= ""; for (var i=1; i <= result; i++) flower+= "🌻";
	
	var str= '<h1><b class="ping"></b>Kết quả '+flower+'('+result+')</h1>';
	str+= '<h3>';
		str+= '<b class="fa fa-complete result result-'+order+'">';
		str+= 	'Trả lời đúng:'+trueAnswer+'/'+len;
		str+= '</b>';
	str+= '</h3>';
	str+= get_msg();
	showResult.innerHTML= '<div class="contents">'+str+'</div>';
	move_center();
}


function save_server(){
	showResult.innerHTML= '<button class="nutgui fa fa-fresh fa-spin">Kiểm tra kết quả..</button>';
	var data= new FormData();
	data.append("xml_send","save_practice");
	data.append("idpost",idpost);
	data.append("title",titlepost);
	data.append("userid",userid);
	data.append("num-question",len);
	data.append("true-answer",trueAnswer);
	data.append("calendar",calendar);
	data.append("question-safe",codesafe);
	xml.complete= function(msg){
		if (msg==="<okcomplete>") setTimeout(finish,1000); else alert("msg= "+msg);
	}
	xml.send(data);
}


this.check= function() {
	if (edit) return alert('Câu hỏi đã thay đổi, cần tải lại..');
	for (var i=0; i<len; i++) if (!is_answer(items[i].answer)) return alert('Hãy trả lời hết câu hỏi');
	lock_items();
	
	map(function(item){
		var ok= check_answer(item.answer);
		if (ok) trueAnswer++;
		item.answered= ok;
	});
	save_server();
	edit= true;
}

} //End Class.