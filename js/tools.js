/*
* 定时器方法
* */
var gateways;
var tokenText;
var headerInfoss;
function getxCsrfTokens(){
    getAjaxJsonTokeData("/goform/x_csrf_token");
}
 var timerPrototype = {
    create: function(callback, time, name){
        this.id = 0;
        this.callback = callback;
        this.time = time;
        this.name = name;
    },
    stop: function(){
        var _this = this;
        clearTimeout(_this.id);
    },
    start: function(){
        var callback, time, _this;

        callback = this.callback;
        time = this.time;
        _this = this;
        function _start(){
            callback();
            _this.id = setTimeout(_start, time);
        }
        _start();

    }
};
function Timer(callback, time, name) {
    var f;
    function F(){}
    F.prototype = timerPrototype;
    f = new F();
    f.create(callback, time, name);
    return f;
}
/*获取Token*/
function getAjaxJsonTokeData(urlstr) {
	if(gateways != "" && typeof(gateways) != "undefined"){
		urlstr = window.location.protocol + "//" + gateways + urlstr;
        console.log(urlstr)
	} else {
		urlstr = urlstr;
	}
    $.ajax({
        type: 'GET',
        url:urlstr,
        async: false,
        /*dataType: "json",
        contentType: "application/json",*/
        //xhrFields: {withCredentials: true},
        complete: function (xhr) {
            headerInfoss = xhr.getResponseHeader('X-Csrf-Token');
            window.localStorage.setItem('XCsrfToken',headerInfoss)
        }
    });
}

/*
* ajax方法
* */
 function getAjaxJsonData(urlstr, callback, options) {
    var isasync = false,
        cache = false,
        inTimeout = 0;
    var Tokens = window.localStorage.getItem('XCsrfToken');
    if (options) {
        if (options.hasOwnProperty("async")) {
            isasync = options.async;
        }
        if (options.hasOwnProperty("cache")) {
            cache = options.cache;
        }
        if (options.hasOwnProperty("timeout")) {
            inTimeout = parseInt(options.timeout, 10);
            if ((inTimeout < 0) || isNaN(inTimeout)) {
                inTimeout = g_ajaxTimeout;
            }
        }
    }
	if(gateways != "" && typeof(gateways) != "undefined"){
		urlstr = window.location.protocol + "//" + gateways + urlstr;
        console.log(urlstr)
	} else {
		urlstr = urlstr;
	}
     if(Tokens == null ||Tokens == "null" ){
         setTimeout(function (){
             getxCsrfTokens();
             getAjaxJsonData(urlstr, callback, options);
         },1000);
         return;
	}
    $.ajax({
        url: urlstr,
        async: isasync,
        timeout: inTimeout,
        cache: cache,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        //携带XCsrfToken
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("X-Csrf-Token", localStorage.getItem('XCsrfToken'));
        },
        //保存XCsrfToken
        complete: function( xhr){
            var wpoInfo = {
                "XCsrfToken" : xhr.getResponseHeader('X-Csrf-Token')
            };
            window.localStorage.setItem('XCsrfToken',wpoInfo.XCsrfToken)
        },
        error: function(xhr, textStatus) {
            if(textStatus == "Redirect"){
                window.location.replace("../common/login.html");
            } else if(xhr.status == "403"){
                getxCsrfTokens();
                getAjaxJsonData(urlstr, callback, options);
                return;
            }
        },
        success: function(data){
            var obj = data2Object(data);
            if (typeof callback === "function"){
                callback(obj);
            }
        }
    });
}

/*
* ajax方法
* */
function getAjaxJsonDataByCondition(urlstr,data,callback, options) {
    var isasync = true,
        cache = false,
        inTimeout = 0;
    var Tokens = window.localStorage.getItem('XCsrfToken');
    if (options) {
        if (options.hasOwnProperty("async")) {
            isasync = options.async;
        }
        if (options.hasOwnProperty("cache")) {
            cache = options.cache;
        }
        if (options.hasOwnProperty("timeout")) {
            inTimeout = parseInt(options.timeout, 10);
            if ((inTimeout < 0) || isNaN(inTimeout)) {
                inTimeout = g_ajaxTimeout;
            }
        }
    }
    if(gateways != "" && typeof(gateways) != "undefined"){
		urlstr = window.location.protocol + "//" + gateways + urlstr;
        console.log(urlstr)
	} else {
		urlstr = urlstr;
	}
     if(Tokens == null ||Tokens == "null" ){
         setTimeout(function (){
             getxCsrfTokens();
             getAjaxJsonData(urlstr, callback, options);
         },1000);
         return;
	}
    $.ajax({
        url: urlstr,
        async: isasync,
        data: data,
        timeout: inTimeout,
        cache: cache,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        //携带XCsrfToken
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("X-Csrf-Token", localStorage.getItem('XCsrfToken'));
        },
        //保存XCsrfToken
        complete: function( xhr){
            var wpoInfo = {
                "XCsrfToken" : xhr.getResponseHeader('X-Csrf-Token')
            };
            window.localStorage.setItem('XCsrfToken',wpoInfo.XCsrfToken)
        },
        error: function(xhr, textStatus) {
            if(textStatus == "Redirect"){
                window.location.replace("../common/login.html");
            } else if(xhr.status == "403"){
                getxCsrfTokens();
                getAjaxJsonData(urlstr, callback, options);
                return;
            }
        },
        success: function(data){
            var obj = data2Object(data);
            if (typeof callback === "function"){
                callback(obj);
            }
        }
    });
}
function getAjaxXMLData(urlstr, callback, options) {
    var isasync = true,
        cache = false,
        inTimeout = 0;

    if (options) {
        if (options.hasOwnProperty("async")) {
            isasync = options.async;
        }
        if (options.hasOwnProperty("timeout")) {
            inTimeout = parseInt(options.timeout, 10);
            if ((inTimeout < 0) || isNaN(inTimeout)) {
                inTimeout = g_ajaxTimeout;
            }
        }
        if (options.hasOwnProperty("cache")) {
            cache = options.cache;
        }
    }
    $.ajax({
        url: urlstr,
        async: isasync,
        timeout: inTimeout,
        cache: cache,
        type: "POST",
        dataType: "xml",
        contentType: "application/xml",
        error: function(xhr, textStatus) {
            if(textStatus == "Redirect"){
                window.location.replace("../common/login.html");
            }
        },
        success: function(data){
            var obj = xml2object($(data));
            if (typeof callback === "function"){
                callback(obj);
            }
        }
    });
}

function saveAjaxJsonData(url, data, callback, options){
    var isasync = true,
        timeout = 0;
    var TokenX = window.localStorage.getItem('XCsrfToken');
    if (options){
        if (options.hasOwnProperty("async")){
            isasync = options.async;
        }
        if (options.hasOwnProperty("timeout")){
            timeout = options.timeout;
        }
    }
    if(TokenX == null ||TokenX == "null" ){
        setTimeout(function (){
            getxCsrfTokens();
            saveAjaxJsonData(url, data, callback, options);
         },1000);
        return;
    }
    $.ajax({
        url: url,
        async: isasync,
        data: data,
        timeout: timeout,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        //携带token
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("X-Csrf-Token", localStorage.getItem('XCsrfToken'));
        },
        //保存token
        complete: function( xhr){
            var wpoInfos = {
                "XCsrfToken" : xhr.getResponseHeader('X-Csrf-Token')
            };
            window.localStorage.setItem('XCsrfToken',wpoInfos.XCsrfToken);
            tokenText =window.localStorage.getItem("XCsrfToken")
        },
        error: function(xhr, textStatus){
            if(textStatus == "Redirect"){
                window.location.replace("../common/login.html");
            } else if(xhr.status == "403"){
                getxCsrfTokens();
                saveAjaxJsonData(url, data, callback, options);
                return;
            }
        },
        success: function(data){
            var obj = data2Object(data);
            if (typeof callback === "function") {
                callback(obj);
            }
        }
    });
}

function data2Object(data){
    var obj;
    if (data){
        if (typeof data === "object"){
            obj = data;
        } else {
            try{
                obj = JSON.parse(data);
            } catch(e){
                obj = {};
            }
        }
    } else {
        obj = {};
    }
    return obj;
}
function _getNodeValue(str) {
    if (typeof (str) === "undefined" || str === null ) {
        return null;
    }
    var trimStr = $.trim(str);
    if ( trimStr.length === 0) {
        return trimStr;
    }
    if (isNaN(str)) {
        return str;
    } else {
        return parseInt(str, 10);
    }
}
function _parseXML2Object($xml) {
    if ($xml.children().length > 0) {
        var obj = {};
        $xml.children().each(function(){
            var childObj = {};
            if ($(this).children().length > 0) {
                childObj = _parseXML2Object($(this));
            } else {
                childObj = _getNodeValue($(this).text());
            }
            if (obj[this.tagName]){
                if (Array.isArray(obj[this.tagName])) {
                    obj[this.tagName].push(childObj);
                } else {
                    var _value = obj[this.tagName];
                    obj[this.tagName] = [];
                    obj[this.tagName].push(_value);
                    obj[this.tagName].push(childObj);
                }
            } else {
                obj[this.tagName] = childObj;
            }
        });
        return obj;
    } else {
        return _getNodeValue($xml.text());
    }
}
function xml2object($xml){
    var obj = {};

    if ($xml.find("response").length > 0) {
        var _response = _parseXML2Object($xml.find("response"));
        obj.type = "response";
        obj.response =_response;
    } else if ($xml.find("config").length > 0) {
        var _config = _parseXML2Object($xml.find("config"));
        obj.type = "config";
        obj.config = _config;
    } else if ($xml.find("error").length > 0) {
        var _code = $xml.find("code").text(),
            _message = $xml.find("message").text();
        obj.type = "error";
        obj.error = {
            code: _code,
            message: _message
        };
    } else {
        obj.type = "unknow";
    }
    return obj;
}


/*
* 获取字符串方法
* */
function getText(text){
    if (typeof text === "string" && text.length !== 0) {
        document.write(text);
    } else {
        document.write("Error: Can't get string!");
    }
}

/**
 * 弹出框方法
 */
function showDialog(style,algin){
    var _dialog, odiv,dialog;
    if(dialog_align_left===algin){
            dialog = [
            '<div id="dialog">',
            '<div id="dialoghead">',
            '<div id="diatitle"><span></span></div>',
            '<div id="diaclose" class="pointer"><img src="../images/dialog_close_btn.png" /></div>',
            '</div>',
            '<div id="dialogbodyleft">%dialog</div>',
            '<div id="dialogbottom" class="btn-area">',
            '<input id="cancel-btn" class="common-btn" type="button">',
            '<input id="ok-btn" class="common-btn" type="button">',
            '</div>',
            '</div>'].join("");
    }else{
        dialog = [
            '<div id="dialog">',
            '<div id="dialoghead">',
            '<div id="diatitle"><span></span></div>',
            '<div id="diaclose" class="pointer"><img src="../images/dialog_close_btn.png" /></div>',
            '</div>',
            '<div id="dialogbody">%dialog</div>',
            '<div id="dialogbottom" class="btn-area">',
            '<input id="cancel-btn" class="common-btn" type="button">',
            '<input id="ok-btn"  type="submit" class="common-btn">',
            '</div>',
            '</div>'].join("");
    }

    if (typeof style === "string") {
        _dialog = dialog.replace("%dialog", style);
    } else {
        _dialog = dialog.replace("%dialog", "");
    }
    odiv = document.createElement("div");
    odiv.id = "pop-window";
    odiv.className = "mask";
    /*odiv.style.width = Math.max($(window).width(), $(document).width()) + "px";
    odiv.style.height = Math.max($(window).height(), $(document).height()) + "px";*/
    $(window).on("resize", adjustPopWindowSize);
    odiv.innerHTML = _dialog;
    document.body.appendChild(odiv);
}


/**
 * 弹出框方法
 */
function showSmsDialog(style,algin){
    var _dialog, odiv,dialog;
    if(dialog_align_left===algin){
        dialog = [
            '<div id="dialog">',
            '<div id="dialoghead">',
            '<div id="diatitle"><span></span></div>',
            '<div id="diaclose" class="pointer"><img src="../images/dialog_close_btn.png" /></div>',
            '</div>',
            '<div id="dialogbodyleft">%dialog</div>',
            '<div id="dialogbottom" class="btn-area">',
            '<input id="cancel-btn" class="common-btn" type="button">',
            '<input id="ok-btn" class="common-btn" type="button">',
            '<input id="save-btn"  type="submit" class="common-btn">',
            '</div>',
            '</div>'].join("");
    }else{
        dialog = [
            '<div id="dialog">',
            '<div id="dialoghead">',
            '<div id="diatitle"><span></span></div>',
            '<div id="diaclose" class="pointer"><img src="../images/dialog_close_btn.png" /></div>',
            '</div>',
            '<div id="dialogbody">%dialog</div>',
            '<div id="dialogbottom" class="btn-area">',
            '<input id="cancel-btn" class="common-btn" type="button">',
            '<input id="ok-btn"  type="submit" class="common-btn">',
            '<input id="save-btn"  type="button" class="common-btn">',
            '</div>',
            '</div>'].join("");
    }

    if (typeof style === "string") {
        _dialog = dialog.replace("%dialog", style);
    } else {
        _dialog = dialog.replace("%dialog", "");
    }
    odiv = document.createElement("div");
    odiv.id = "pop-window";
    odiv.className = "mask";
    /*odiv.style.width = Math.max($(window).width(), $(document).width()) + "px";
    odiv.style.height = Math.max($(window).height(), $(document).height()) + "px";*/
    $(window).on("resize", adjustPopWindowSize);
    odiv.innerHTML = _dialog;
    document.body.appendChild(odiv);
}


function adjustPopWindowSize(){
    var odiv = document.getElementById("pop-window");
    /*odiv.style.width = Math.max($(window).width(), $(document).width()) + "px";
    odiv.style.height = Math.max($(window).height(), $(document).height()) + "px";*/
}
function closeDialog(){
    $(window).off("resize", adjustPopWindowSize);
    $("#pop-window").remove();
}
function closeResultDialog(){
    $(window).off("resize", adjustPopWindowSize);
    $("#pop-window").remove();
    window.location.reload();
}
function showProgressDialog(title, msg, per,algin){
    var val, dialog = [
        '<div id="proinfo">',
        '<div id="promsg">%msg</div>',
        '<div id="pronav">',
        '<div id="probar"></div>',
        '</div>',
        '</div>'].join("");

    if ( $("#pop-window").length === 0 ){
        dialog = dialog.replace("%msg", msg);
        showDialog(dialog,algin);
        $("#diatitle").children("span").text(title);
        $("#diaclose").remove();
        $("#dialogbottom").remove();
    }
    $("#probar").width($("#pronav").width() * per / 100).text(per + "%");

}
function showResultOnlyDialog(title, msg, time,algin){
    var style = [
        '<div id="resultdialog" class="clearfix">',
        '<div id="resultmsg">',
        '<span></span>',
        '</div>',
        '</div>'].join("");

    showDialog(style,algin);
    $("#diatitle").children("span").text(title);
    $("#diaclose").remove();
    $("#resultmsg").children("span").text(msg);
    $("#dialogbottom").remove();
    if (typeof time === "number"){
        setTimeout(closeDialog, time);
    } else {
        setTimeout(closeDialog, 3000);
    }

}

function showResultOnlyDialogWithFlag(title, msg, time,algin){
    var style = [
        '<div id="resultdialog" class="clearfix">',
        '<div id="resultmsg">',
        '<span></span>',
        '</div>',
        '</div>'].join("");

    showDialog(style,algin);
    $("#diatitle").children("span").text(title);
    $("#diaclose").remove();
    $("#resultmsg").children("span").text(msg);
    $("#dialogbottom").remove();
    if (typeof time === "number"){
        setTimeout(closeDialogWithFlag, time);
    } else {
        setTimeout(closeDialogWithFlag, 3000);
    }

}

function showResultDialog(title, msg, time,algin){
    var style = [
        '<div id="resultdialog" class="clearfix">',
        '<div id="resultmsg">',
        '<span></span>',
        '</div>',
        '</div>'].join("");

    showDialog(style,algin);

    $("#diatitle").children("span").text(title);
    $("#diaclose").remove();
    $("#resultmsg").children("span").text(msg);
    $("#dialogbottom").remove();

    if (typeof time === "number"){
        setTimeout(closeResultDialog, time);
    } else {
        setTimeout(closeDialog, 3000);
    }

}


function showResultDialogNoFresh(title, msg, time,algin){
    var style = [
        '<div id="resultdialog" class="clearfix">',
        '<div id="resultmsg">',
        '<span></span>',
        '</div>',
        '</div>'].join("");

    showDialog(style,algin);

    $("#diatitle").children("span").text(title);
    $("#diaclose").remove();
    $("#resultmsg").children("span").text(msg);
    $("#dialogbottom").remove();

    if (typeof time === "number"){
        setTimeout(closeDialog, time);
    } else {
        setTimeout(closeDialog, 3000);
    }

}

function showWaitingDialog(title, msg,algin){
    var style = [
        '<div id="waitingdialog" class="clearfix">',
        '<div id="waitingimg"></div>',
        '<div id="waitingmsg">',
        '<span></span>',
        '</div>',
        '</div>'].join("");
    showDialog(style,algin);

    $("#diatitle").children("span").text(title);
    $("#diaclose").remove();
    $("#waitingmsg").children("span").text(msg);
    $("#dialogbottom").remove();
    $("#ok-btn").remove();
    $("#cancel-btn").remove();
}
function showWaitingDialogS(title, msg,callback,algin){
    var style = [
        '<div id="waitingdialog" class="clearfix">',
        '<div id="waitingimg"></div>',
        '<div id="waitingmsg">',
        '<span></span>',
        '</div>',
        '</div>'].join("");
    showDialog(style,algin);

    $("#diatitle").children("span").text(title);
    $("#diaclose").remove();
    $("#waitingmsg").children("span").text(msg);
    $("#dialogbottom").remove();
    if (typeof callback === "function"){
        callback
    }
}
function showConfirmDialog(title, msg, callback,algin){
    closeDialog();
    var style = [
        '<div id="confirmdialog">',
        '<div id="confirmmsg">',
        '<span></span>',
        '</div>',
        '</div>'].join("");

    showDialog(style,algin);
    $("#diatitle").children("span").text(title);
    $("#diaclose").on("click", closeDialog);
    $("#confirmmsg").children("span").text(msg);
    if (typeof callback === "function"){
        $("#ok-btn").attr("value", common_ok).on("click", callback);
    }
    $("#cancel-btn").attr("value", common_cancel).on("click", closeDialog);
    $("#ok-btn").focus();
}
function showConfirmRebootDialog(title, msg, callback,algin){
    var style = [
        '<div id="confirmdialog">',
        '<div id="confirmmsg">',
        '<span></span>',
        '</div>',
        '</div>'].join("");

    showDialog(style,algin);
    $("#diatitle").children("span").text(title);
    $("#diaclose").on("click", closeDialog);
    $("#confirmmsg").children("span").text(msg);
    if (typeof callback === "function"){
        $("#ok-btn").attr("value", str_wlan_dhcp_successtips_reboot_ok).on("click", callback);
    }
    $("#cancel-btn").attr("value", str_wlan_dhcp_successtips_reboot_no).on("click", closeDialog);
    $("#ok-btn").focus();
}

function showConfirmDialogSms(title, msg, callback,algin){
    var style = [
        '<div id="confirmdialog">',
        '<div id="confirmmsg">',
        '<span></span>',
        '</div>',
        '</div>'].join("");

    showDialog(style,algin);
    $("#diatitle").children("span").text(title);
    $("#diaclose").on("click", closeDialogWithFlag);
    $("#confirmmsg").children("span").text(msg);
    if (typeof callback === "function"){
        $("#ok-btn").attr("value", common_ok).on("click", callback);
    }
    $("#cancel-btn").attr("value", common_cancel).on("click", closeDialogWithFlag);
    $("#ok-btn").focus();
}
function showdefaultPasswordDialog(title, msg, callback,algin){
    var style = [
        '<div id="confirmdialog">',
        '<div id="confirmmsg">',
        '<span></span>',
        '</div>',
        '</div>'].join("");

    showDialog(style,algin);
    $("#diatitle").children("span").text(title);
    $("#diaclose").remove();
    $("#confirmmsg").children("span").text(msg);
    if (typeof callback === "function"){
        $("#ok-btn").attr("value", common_ok).on("click", callback);
    }
    $("#cancel-btn").remove();
    $("#ok-btn").focus();
}




function closeDialogWithFlag(){
    $(window).off("resize", adjustPopWindowSize);
    $("#pop-window").remove();
    g_deleting_flag=false;
}

function showTipsDialog(title, msg, callback,algin){
     var style = [
        '<div id="tipdialog">',
        '<div id="tipmsg">',
        '<span></span>',
        '</div>',
        '</div>'].join("");

    showDialog(style,algin);
    $("#diatitle").children("span").text(title);
    $("#diaclose").remove();
    $("#tipmsg").children("span").text(msg);
    $("#dialogbottom").remove();
    if (typeof callback === "function"){
        callback();
    } else {
        setTimeout(closeDialog, 3000);
    }
}




/**
 * 弹出框方法
 */
function showDialogOnlyResultSms(style,algin){
    var _dialog, odiv,dialog;
    if(dialog_align_left===algin){
        dialog = [
            '<div id="dialogsms">',
            '<div id="dialoghead">',
            '<div id="diatitleonly"><span></span></div>',
            '<div id="diacloseonly" class="pointer"><img src="../images/dialog_close_btn.png" /></div>',
            '</div>',
            '<div id="dialogbodyleft">%dialog</div>',
            '</div>',
            '</div>'].join("");
    }else{
        dialog = [
            '<div id="dialogsms">',
            '<div id="dialoghead">',
            '<div id="diatitleonly"><span></span></div>',
            '<div id="diacloseonly" class="pointer"><img src="../images/dialog_close_btn.png" /></div>',
            '</div>',
            '<div id="dialogbody">%dialog</div>',
            '</div>',
            '</div>'].join("");
    }

    if (typeof style === "string") {
        _dialog = dialog.replace("%dialog", style);
    } else {
        _dialog = dialog.replace("%dialog", "");
    }
    odiv = document.createElement("div");
    odiv.id = "pop-window-onlyresult";
    odiv.className = "mask";
    /*odiv.style.width = Math.max($(window).width(), $(document).width()) + "px";
    odiv.style.height = Math.max($(window).height(), $(document).height()) + "px";*/
    $(window).on("resize", adjustPopWindowSize);
    odiv.innerHTML = _dialog;
    document.body.appendChild(odiv);
}

function closeDialogOnlyresult(){
    $(window).off("resize", adjustPopWindowSize);
    $("#pop-window-onlyresult").remove();
    if(!(newsmsflag && sendeerorflag)){
        $("#pop-window").remove();
    }
}


function showResultOnlyDialog(title, msg, time,algin){
    var style = [
        '<div id="resultdialog" class="clearfix">',
        '<div id="resultmsg">',
        '<span></span>',
        '</div>',
        '</div>'].join("");

    showDialogOnlyResult(style,algin);
    $("#diatitleonly").children("span").text(title);
    $("#diacloseonly").remove();
    $("#resultmsg").children("span").text(msg);
    if (typeof time === "number"){
        setTimeout(closeDialogOnlyresult, time);
    } else {
        setTimeout(closeDialogOnlyresult, 3000);
    }

}



/**
 * 弹出框方法
 */
function showDialogOnlyResult(style,algin){
    var _dialog, odiv,dialog;
    if(dialog_align_left===algin){
        dialog = [
            '<div id="dialog">',
            '<div id="dialoghead">',
            '<div id="diatitleonly"><span></span></div>',
            '<div id="diacloseonly" class="pointer"><img src="../images/dialog_close_btn.png" /></div>',
            '</div>',
            '<div id="dialogbodyleft">%dialog</div>',
            '</div>',
            '</div>'].join("");
    }else{
        dialog = [
            '<div id="dialog">',
            '<div id="dialoghead">',
            '<div id="diatitleonly"><span></span></div>',
            '<div id="diacloseonly" class="pointer"><img src="../images/dialog_close_btn.png" /></div>',
            '</div>',
            '<div id="dialogbody">%dialog</div>',
            '</div>',
            '</div>'].join("");
    }

    if (typeof style === "string") {
        _dialog = dialog.replace("%dialog", style);
    } else {
        _dialog = dialog.replace("%dialog", "");
    }
    odiv = document.createElement("div");
    odiv.id = "pop-window-onlyresult";
    odiv.className = "mask";
    /*odiv.style.width = Math.max($(window).width(), $(document).width()) + "px";
    odiv.style.height = Math.max($(window).height(), $(document).height()) + "px";*/
    $(window).on("resize", adjustPopWindowSize);
    odiv.innerHTML = _dialog;
    document.body.appendChild(odiv);
}


function showResultOnlyDialogSms(title, msg, time,algin){
    var style = [
        '<div id="resultdialog" class="clearfix">',
        '<div id="resultmsg">',
        '<span></span>',
        '</div>',
        '</div>'].join("");

    showDialogOnlyResultSms(style,algin);
    $("#diatitleonly").children("span").text(title);
    $("#diacloseonly").remove();
    $("#resultmsg").children("span").text(msg);
    if (typeof time === "number"){
        setTimeout(closeDialogOnlyresult, time);
    } else {
        setTimeout(closeDialogOnlyresult, 3000);
    }

}
function showSendSMSWaitingDialog(title, msg){
    var odiv;
    var style = [
        '<div id="dialog">',
        '<div id="dialoghead">',
        '<div id="diatitlesendsms"><span></span></div>',
        '<div id="diaclosesms" class="pointer"><img src="../images/dialog_close_btn.png" /></div>',
        '</div>',
        '<div id="dialogbodyleft">',
        '<div id="waitingdialog" class="clearfix">',
        '<div id="waitingimg"></div>',
        '<div id="waitingmsgsms">',
        '<span></span>',
        '</div>',
        '</div>',
        '</div>',
        '</div>'].join("");
    odiv = document.createElement("div");
    odiv.id = "pop-window-sendsms";
    odiv.className = "mask";
    $(window).on("resize", adjustPopWindowSize);
    odiv.innerHTML = style;
    document.body.appendChild(odiv);

    $("#diatitlesendsms").children("span").text(title);
    $("#diaclosesms").remove();
    $("#waitingmsgsms").children("span").text(msg);
}
function closeSendSMSDialog(){
    $(window).off("resize", adjustPopWindowSize);
    $("#pop-window-sendsms").remove();
}

function showUseOverTipsDialog(title, msg, callback,algin){
    var style = [
        '<div id="tipdialog">',
        '<div id="tipmsg">',
        '<span></span>',
        '</div>',
        '</div>'].join("");

    showDialog(style,algin);
    $("#diatitle").children("span").text(title);
    $("#tipmsg").children("span").text(msg);
    $("#diaclose").on("click", closeDialog);
    $("#dialogbottom").remove();
    if (typeof callback === "function"){
        callback();
    } else {

    }
}