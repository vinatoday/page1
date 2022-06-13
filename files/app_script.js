	// ===============================================================================================
	window.onerror= function(msg,url,line) {alert('Message: '+msg+', url: ' +url+ ', Line number: ' + line);}
	function ___(el) {return document.querySelector(el);}
	function strToInt(s)  {var num= parseInt(s);  return (num+''=='NaN')? 0:num; }
	function strToFloat(s)  { var num= parseFloat(s);return (num+''=='NaN')? 0:num; }
	function gotoUrl(alink) { document.location.href= alink.getAttribute("url");}
	function closePopup(el) {el.parentElement.blur();}
	// ______________________________________

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

//============blog= new TSitePhp============================================================
function TMySql(el){
	var page= ___(el);
	var edit= page.querySelector('textarea');
	var panel1= page.querySelector('.panel1');
	var panel2= page.querySelector('.panel2');
	var panel3= page.querySelector('.panel3');
	
	var showtab1= panel1.querySelector('.showtab1');
	var showtab3= panel3.querySelector('.showtab3');
	var column1= panel2.querySelector('.column1');
	var column2= panel2.querySelector('.column2');
	
	var xml= new TXMLhttp("app_request.php");
	var sql= '';
	var self= this;

	function on(tab)  {tab.style.display='block';}
	function off(tab) {tab.style.display='none';}
	panel1.querySelector('.btfresh').onclick= function() {view_tab1();};
	panel1.querySelector('.btclose').onclick= function() {off(panel1); sql= '';};
	panel2.querySelector('.btclose').onclick= function() {off(panel2); sql= '';};
	panel3.querySelector('.btclose').onclick= function() {off(panel3); sql= '';};
	this.add= function(sql){edit.value= sql;}
	this.clear= function(){off(panel1);off(panel2);off(panel3); edit.value= ''; sql= '';}
	//___________________________________


function view_tab1(){
	if (xml.running) return alert("Đang gửi Data..");
	var data= new FormData();
	data.append("xml_send", "view_tab1");
	xml.complete= function(msg){showtab1.innerHTML= msg; on(panel1); off(panel2);};
	xml.send(data);
}


this.info_table= function(tab,ask=1){
	if (xml.running) return alert("Đang gửi Data..");
	if (ask && sql==tab) return alert('Đã truy vấn..');
	sql= tab;
	
	var data= new FormData();
	data.append("xml_send", "info_table");
	data.append("tab", tab);
	xml.complete= function(msg){column2.innerHTML= msg;};
	xml.send(data);
}


function info_database(){
	if (xml.running) return alert("Đang gửi Data..");
	var data= new FormData();
	data.append("xml_send", "info_database");
	xml.complete= function(msg){column1.innerHTML= msg; on(panel2); off(panel1);};
	xml.send(data);
}


this.query= function(){
	if (xml.running) return alert("Đang gửi Data..");
	if (sql===edit.value) return alert('Đã truy vấn..');
	sql= edit.value;
	if (sql==='SHOW TABLES') return info_database(); else
	if (sql==='SELECT * FROM mytab1') return view_tab1();
	
	var data= new FormData();
	data.append("xml_send", "sql_query");
	data.append("sql", sql);
	xml.complete= function(msg){
		showtab3.innerHTML= msg; on(panel3);
		if (/\s(mytab1)[\s|\(]*/i.test(sql)) view_tab1();
	};
	xml.send(data);
}

}// End class.