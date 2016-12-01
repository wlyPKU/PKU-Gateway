//author: wangly

var user, passwd, operation, state;

window.onload = function() {
    user = localStorage.user;
    passwd = localStorage.passwd;
	
    operation = document.getElementById("operation");
    state = document.getElementById("state");
	restore_options();
	document.querySelector('#save').addEventListener(
        'click', save_optionsAndUpdate);
	document.querySelector('#reset').addEventListener(
        'click', reset_options);
	localStorage.state = "";
	update_state();
    bindonclick('open', "正在连接到免费...");
    bindonclick('getconnections', "查看连接...");
    bindonclick('close', "正在断开...");
	bindonclick('closeall', "正在断开全部连接...");
    update_state();
};

function update_state() {
    state.innerHTML = localStorage.state;
}

function ipgwclient(operation) {
	save_options();
    cur_operation = operation;
    var range = 1, oper;
    req = new XMLHttpRequest();
    req.timeout = 7000;
	var requestContent = "https://its.pku.edu.cn/cas/ITSClient?" + "username=" + localStorage.user + "&password=" + localStorage.passwd + "&cmd=" + operation + "&iprange=free"
	req.open("POST", requestContent, "true");   
	req.onload = connect_callback;
    req.ontimeout = error_timeout;
    req.onabort = error_abort;
    req.onerror = error_error;
    req.send(null);
}

function toJson(str){
 return JSON.parse(str);
}

//connect result
function connect_callback() {
    var info = toJson(req.responseText),
        text = "";
    if (info.succ != undefined) {
        switch (cur_operation) {
            case "open":
				localStorage.state = "网络连接成功";
				text = "<div class=\"its_article response_style\"> \
						<div align=\"CENTER\">\
						<table class=\"ipgw\" cellpadding=\"16\" cellspacing=\"2\">\
						<tbody><tr align=\"CENTER\">\
							<td>\
								<table noboder=\"\">\
									<tbody><tr align=\"center\"><td>网络连接成功<br>Connect successfully</td>\
									</tr>\
									<tr><td>\
										<table noborder=\"\">\
										<tr><td align=\"right\">当前地址：</td><td align=\"left\">"+info.IP+"</td></tr>\
										<tr><td align=\"right\">账户余额：</td><td align=\"left\">"+info.BALANCE_CN+"</span> 元</td></tr>\
						</tbody></table></td></tr></tbody></table></td></tr></tbody></table>\
						</div>\
						</div>";
				localStorage.state = text;
                break;
            case "getconnections":
				localStorage.connections = new Array(3);
				var infos = info.succ.split(";")
				text = "<div class=\"its_article\" style=\"margin-bottom:20px;\">\
						<center>当前在线连接</center>\
						<div align=\"CENTER\">\
						<table class=\"table\" style=\"width:100%\">\
						<tbody>";
				if(infos.length > 1){
					text += "<tr class=\"info\" align=\"center\">\
							<td width=\"150\">" + infos[2]+"</td>\
							<td width=\"150\">" + infos[0]+"</td>\
							</tr>\
							<tr class=\"info\"align=\"center\">\
							<td width=\"150\" colspan=\"2\" >" + infos[3]+"</td>\
							</tr>";
				localStorage.connections[0] = infos[0];
				}
				if(infos.length > 4){
					text += "<tr align=\"center\">\
							<td width=\"150\">" + infos[6]+"</td>\
							<td width=\"150\">" + infos[4]+"</td>\
							</tr>\
							<tr align=\"center\">\
							<td width=\"150\" colspan=\"2\" >" + infos[7]+"</td>\
							</tr>";
				localStorage.connections[1] = infos[4];
				}
				if(infos.length > 8){
					text += "<tr class=\"info\" align=\"center\">\
							<td width=\"150\">" + infos[10]+"</td>\
							<td width=\"150\">" + infos[8]+"</td>\
							</tr>\
							<tr class=\"info\" align=\"center\">\
							<td width=\"150\" colspan=\"2\" >" + infos[11]+"</td>\
							</tr>";
				localStorage.connections[2] = infos[8];
				}
				text += "</tbody></table></div></div>";
				localStorage.state = text;
                break;
            case "close":
				text = "<div class=\"its_article response_style\"> \
						<div align=\"CENTER\">\
						<table class=\"ipgw\" cellpadding=\"16\" cellspacing=\"2\">\
						<tbody><tr align=\"CENTER\">\
							<td>\
								<table noboder=\"\">\
									<tbody><tr align=\"center\"><td>断开本机连接成功<br>Disconnect Succeeded</td>\
									</tr></tbody></table>\
						</div>\
						</div>";
				localStorage.state = text;
                break;
			case "closeall":
				text = "<div class=\"its_article response_style\"> \
						<div align=\"CENTER\">\
						<table class=\"ipgw\" cellpadding=\"16\" cellspacing=\"2\">\
						<tbody><tr align=\"CENTER\">\
							<td>\
								<table noboder=\"\">\
									<tbody><tr align=\"center\"><td>断开全部连接成功<br>Disconnect All Succeeded</td>\
									</tr></tbody></table>\
						</div>\
						</div>";
				localStorage.state = text;
                break;
		}
	}		
	else {
		localStorage.state = "网络连接失败<br>原因：" + info.error;                
	}
    update_state();
}

function get_default_string(info) {
    var text = "";
    for (var key in info) {
        var value = info[key];
        if (mappings[key]) key = mappings[key];
        if (mappings[value]) value = mappings[value];
        text = text + key + ":" + value + "； ";
    }
    return text;
}

function error_timeout(evt) {
    localStorage.state = "网络连接超时(" + evt.type + ")";
}

function error_abort(evt) {
    localStorage.state = "网络中断(" + evt.type + ")";
}

function error_error(evt) {
    localStorage.state = "网络连接错误(" + evt.type + ")";
}

function bindonclick(btname, szstate) {
    bt = document.getElementById(btname);
    bt.addEventListener('click', function() {
        localStorage.state = szstate;
		ipgwclient(btname);
        update_state();
    });
	update_state();
}


function save_options() {
    localStorage.user = document.getElementById("user").value;
    localStorage.passwd = document.getElementById("passwd").value;
    update_state();
}

function save_optionsAndUpdate() {
    localStorage.user = document.getElementById("user").value;
    localStorage.passwd = document.getElementById("passwd").value;
	localStorage.state = "保存成功！";
    update_state();
}

function reset_options() {
    document.getElementById("passwd").value = ""
	document.getElementById("user").value = ""
	localStorage.state = "已重置！";
	localStorage.user = "";
	localStorage.passwd = "";
    update_state();
}

// Restores options from localStorage.
function restore_options() {
    var datap = localStorage.passwd;
    if (datap) {
        document.getElementById("passwd").value = datap;
    }

    var datau = localStorage.user;
    if (datau) {
        document.getElementById("user").value = datau;
    }
}

