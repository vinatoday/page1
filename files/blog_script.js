	// ===============================================================================================
	window.onerror= function(msg,url,line) {alert('Message: '+msg+', url: ' +url+ ', Line number: ' + line);}
	function ___(id) {return document.getElementById(id);}
	function strToInt(s)   {var num= parseInt(s);  return (isNaN(num))? 0:num; }
	function strToFloat(s) {var num= parseFloat(s);return (isNaN(num))? 0:num; }
	function gotoUrl(link) {document.location.href= link.getAttribute("url");}
	function closePopup(el) {el.parentElement.blur();}
	function baoloi(s) {___("thongbao").innerHTML= s;}
	// ____________________________________________________

function TXMLhttp(url,method="POST"){
	this.running= false;
	this.complete= null;
	this.progress= null;
	var self= this;
	
	function response(text) {self.running= false; self.complete(text);};
	function progress(event){if(self.progress) self.progress.innerHTML=(Math.round((event.loaded/event.total)*100))+"%";};
	function complete(event){response(event.target.responseText);};

	var xml= new XMLHttpRequest();
	this.xml1= xml;
	xml.addEventListener("load",  complete, false);
	xml.upload.addEventListener("progress", progress, false);
	xml.addEventListener("error", function(e){response("Đã bị rớt!");}, false);
	xml.addEventListener("abort", function(e){response("Đã hủy!");}, false);
	this.abort= function(){xml.abort();}
	
	this.send= function(data){
		if(self.running) {alert("Đang gửi.."); return;} else self.running= true;
		xml.open(method, url);
		xml.send(data);
	}
}



//======================================================================================================
function select_images(el){
	var view= el.parentElement.querySelector('i');
	view.textContent= "Hình ảnh(" + el.files.length + ")";
}


function add_label(select){
	if(select.value =="*") return;
	var nhan= ___('edit-nhan');
	if(nhan.value=='nolabel' || nhan.value=='') nhan.value= select.value; 
		else nhan.value+= ';' + select.value;
}



function send_question(form) {
	var pc= "|"; var answer=""; var point= "";
	var traloi= form.traloi; var diem= form.diem;
	var num= 0; var check= false;
	
	for (var i=0; i<=4; i++) if (traloi[i].value != ""){
		var str= traloi[i].value;
		if (str.indexOf(pc,0) >= 0){alert("Ký tự không được phép: "+pc); return false;}
		if (answer != "") {answer+=pc; point+= pc;}
		answer+= str;
		point+= (diem[i].checked)? "1" : "0";
		if (diem[i].checked) check= true;
		num++;
	}
	if (num<2)  {alert("Nhập thêm lựa chọn.."); return false;}
	if (!check) {alert("Cần ít nhất 1 lựa chọn.."); return false;}
	//for (var i=0; i<=4; i++) form.traloi[i].value= "";
	form.answer.value= answer;
	form.point.value=  point;
	return true;
}








var message= new function TMessage(){
	var xml= new TXMLhttp("blog_request.php");
	//======================================================================
	
this.return_message= function(el,id){
	if(xml.running || !confirm("Thu hồi tin nhắn ?")) return;
	var item= el.parentElement.parentElement.parentElement;
	var data= new FormData();
	data.append("xml_send","delete_message");
	data.append("status","return_message");
	data.append("item",id);
	xml.complete= function(msg){if (msg==="<okcomplete>") item.style.display= "none"; else alert(msg);}
	xml.send(data);
}


this.delete_message= function(el,id){
	if (xml.running || !confirm("Xóa tin nhắn ?")) return;
	var item= el.parentElement.parentElement.parentElement;
	var data= new FormData();
	data.append("xml_send","delete_message");
	data.append("status","delete_message");
	data.append("item",id);
	xml.complete= function(msg){if (msg==="<okcomplete>") item.style.display= "none"; else alert(msg);}
	xml.send(data);
}


this.delete_conversation= function(el,id){
	if(xml.running || !confirm("Xóa hội thoại ?")) return;
	var item= el.parentElement.parentElement.parentElement;
	var data= new FormData();
	data.append("xml_send","delete_message");
	data.append("status","delete_conversation");
	data.append("item",id);
	xml.complete= function(msg){if (msg==="<okcomplete>") item.style.display= "none"; else alert(msg);}
	xml.send(data);
}
 //====================================================
}//Class.





//============TSitePhp============================================================
function TSitePhp(login){
	var id_item= "";
	var xml= new TXMLhttp("blog_request.php");
	var self= this;
	//___________________________________

this.logout= function() {if(confirm("Thoát đăng nhập?"))___('idformlogout').submit();}
this.logout_item= function(el,id){
	if (xml.running) return alert("Đang gửi Data..");
	if (!confirm("Thoát đăng nhập này?")) return;
	var item= el.parentElement;
	var data= new FormData();
	data.append("xml_send","logout_item");
	data.append("id_item",id);
	xml.complete= function(msg){if (msg==='<okcomplete>') item.style.display='none'; else alert("msg= "+msg);};
	xml.send(data);
}



	//_________delete______________________________
this.delete_comment= function(el){
	if (xml.running) return alert("Đang gửi Data..");
	if (!confirm('Xóa bình luận?')) return;
	
	var item= el.parentElement.parentElement.parentElement;
	var data= new FormData();
	data.append("xml_send","delete_comment");
	data.append("id_comment",item.getAttribute("id_comment"));
	xml.complete= function(msg){
		if (msg==='<okcomplete>') item.style.display= 'none';
		else alert("msg= "+msg);
	};
	xml.send(data);
}


this.delete_practice= function(el){
	if (xml.running) return alert("Đang gửi Data..");
	if (!confirm('Xóa tất cả thực hành?')) return;
	
	var page= el.parentElement;
	var data= new FormData();
	data.append("xml_send","delete_practice");
	xml.complete= function(msg){
		if (msg==='<okcomplete>') page.style.display= 'none';
		else alert("msg= "+msg);
	};
	xml.send(data);
}


this.delete_post= function(id,status){
	if (!login) return alert("Chưa đăng nhập..");
	if (xml.running) return alert("Đang gửi Data..");
	switch (status) {
		case  1: if (!confirm('Khôi phuc bài viết về mục "Private" ?')) return; break;
		case  0: if (!confirm('Xóa bài viết ?')) return; break;
		case -1: if (!confirm('Xóa vĩnh viễn ?')) return; break;
		default: return alert('No status..');
	}
	var item= ___("item_post"+id);
	var data= new FormData();
	data.append("xml_send","delete_post");
	data.append("id_item",id);
	data.append("status",status);
	
	xml.complete= function(msg){
		if (msg==='<okcomplete>') item.style.display= 'none';
		else alert("msg= "+msg);
	};
	xml.send(data);
}


	//_________set_post______________________________
this.set_post_comment= function(item){
	if (!login) return alert("Chưa đăng nhập..");
	if (xml.running) return alert("Đang gửi Data..");
	if (!confirm("Thay đổi?")) return;
	
	var new_status= strToInt(item.getAttribute("status"));
	var next_status= (new_status<2)? new_status+1 : 0;
	
	var popup= item.parentElement.parentElement;
	var icon= popup.querySelector('.iconComment');
	
	var data= new FormData();
	data.append("xml_send", "set_post_comment");
	data.append("id_post", popup.getAttribute("id_post"));
	data.append("status",new_status);
	
	xml.complete= function(msg){
		if(msg==="<okcomplete>") {
			icon.setAttribute("status",new_status);
			item.setAttribute("status",next_status);
		} else {alert(msg);}
	};
	xml.send(data);
}


this.set_post_public= function(item){
	if (!login) return alert("Chưa đăng nhập..");
	if (xml.running) return alert("Đang gửi Data..");
	if (!confirm("Thay đổi?")) return;
	
	var new_status=  strToInt(item.getAttribute("status"));
	var next_status= new_status ? 0 : 1;
	
	var popup= item.parentElement.parentElement;
	var icon= popup.querySelector('.iconPublic');
	
	var data= new FormData();
	data.append("xml_send", "set_post_public");
	data.append("id_post", popup.getAttribute("id_post"));
	data.append("status",new_status);
	
	xml.complete= function(msg){
		if(msg==="<okcomplete>") {
			icon.setAttribute("status",new_status);
			item.setAttribute("status",next_status);
		} else {alert(msg);}
	};
	xml.send(data);
}


this.send_comment= function(form){
	if (!login) {if (confirm("Tới đăng nhập?")) document.location.href= "login"; return false;}
	var content=  form.querySelector('textarea').value;
	var files= form.querySelector('input[type="file"]').files;
	var size= 0;
	
	for (var i= 0; i<files.length; i++){
		var img= /^(image)/i.test(files[i].type);
		if (img) size+= files[i].size; else {alert("Tập tin không phải hình ảnh.."); return false;}
	}
	if (size >= 8388608) {
		alert("Gửi file quá giới hạn..");
		return false;
	}
	if (content.length<10 && size<10){
		alert("Thêm nội dung để gửi..");
		return false;
	}
	return true;
}




this.send_post= function(form){
	var title= form.querySelector('input[name="tieude"]').value;
	var content= form.querySelector('.nicEdit-main').textContent;
	var files= form.querySelector('#pics').files;
	var size= 0;
	
	for (var i= 0; i<files.length; i++){
		var img= /^(image)/i.test(files[i].type);
		if (img) size+= files[i].size; else {alert("Tập tin không phải hình ảnh.."); return false;}
	}
	if (size >= 8388608) {
		alert("Gửi file quá giới hạn..");
		return false;
	}
	if (title.length<10 || content.length<10){
		alert("Tiêu đề hoặc nội dung ngắn..");
		return false;
	}
	
	var pc="|";
	var min= ""; var max= ""; var msg="";
	var index= 0; var diem;

	for (var i=0; i<=4; i++) if (form.nhanxet[i].value != "") {
		var nhanxet= form.nhanxet[i].value;
		if (nhanxet.indexOf(pc,0)>=0) {alert('Ký tự không được phép: '+pc); return false;}
		if (index == 0) index++; else {min+= pc; max+= pc; msg+= pc;}
		diem= parseInt(form.diem[i].value); if (isNaN(diem)) {alert('Nhập lại điểm..'); return false;} else min+= diem;
		diem= parseInt(form.cuoi[i].value); if (isNaN(diem)) {alert('Nhập lại điểm..'); return false;} else max+= diem;
		msg+= form.nhanxet[i].value;
	}
	form.point.value= min;
	form.pointend.value= max;
	form.msg.value= msg;
	return true;
}

}// End class.