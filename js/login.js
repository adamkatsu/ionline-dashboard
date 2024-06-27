/**
 * Created by Administrator on 2017/8/18 0018.
 */
var simStatus;
var pukTimes;
var pinNotVerified = 1;
var pinBlocked = 2;
var pinPermanentlyBlocked = 5;
var g_resultSuccess = 0;
var g_resultFailed = 1;
var g_ajaxTimeout = 60000;
var g_login = 1;
var g_logout = 0;
var g_curLoginStatus = 0;
var key = "0123456789";
var g_priKey;
var g_timestamp;
var g_timestamp_start;
var g_deviceInfo = {
    deviceName: "",
    hardwareVersion: ""
};

getxCsrfTokens();
initlanguage();
$(document).ready(function(){
    document.title = common_login;
    initLangList(g_langList);
    $(".bt_login").val(common_login);
    $("#username").attr("placeholder",str_login_username);
    $("#password").attr("placeholder",str_login_password);
    getsimstatus();
    getpininfo();
    //getDeviceInfo();
    //showDeviceInfo();
    $("#username").focus();
});
function getDeviceInfo(){
    getAjaxJsonData("/action/get_device_info", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            g_deviceInfo.deviceName = obj.device_name;
            g_deviceInfo.softwareVersion = obj.software_version;
        }
    }, {
        async: false
    });
}
/*function showDeviceInfo(){
    if (g_deviceInfo.deviceName.length > 0) {
        $("#devicename").text(g_deviceInfo.deviceName);
    } else {
        $("#devicename").text(common_unknown);
    }
    if (g_deviceInfo.softwareVersion){
        $("#softwareversion").text(g_deviceInfo.softwareVersion);
    } else {
        $("#softwareversion").text(common_unknown);
    }
}*/
function checkUsernamePassword() {
    var _username = $("#username").val();
    var _pwd= $("#password").val();
    clearErrorMsg();
    if ( (_username.length < 5 || _username.length > 15) ) {
        showErrorMsg("pwtips", "login-error-tips", str_login_username_error);
        $("#username").focus();
        return false;
    }
    if ( (_pwd.length < 5 || _pwd.length > 36) ) {
        showErrorMsg("pwtips", "login-error-tips", str_login_length_error);
        $("#password").focus();
        return false;
    }
    return true;
}
function getpininfo(){
    getAjaxJsonData("/goform/get_pin_info", function (obj) {
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            pukTimes = obj.puk_times;
        }
    }, {
        async: false
    });
}
function getLoginInfo(){
    getAjaxJsonData("/goform/get_login_info", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            var prikey = obj.priKey;
            g_priKey = prikey.split("x")[0];
            g_timestamp = prikey.split("x")[1];
            var date = new Date();
            g_timestamp_start = parseInt(date.getTime()/1000);
        }

    }, {
        async: false,
        timeout: 1000
    });
}
function getsimstatus(){
    getAjaxJsonData("/goform/get_sim_info", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            simStatus = obj.state;
        }
    }, {
        async: false
    });
}

function login(){
    getLoginInfo();
    var ret = checkUsernamePassword();
    if (ret) {
        var data = $(".login-input").serializeArray();
        var _obj = {};
        var postdata;
        $.each(data, function(index, val){
            _obj[val.name] = hex_hmac_md5(key,val.value);
        });
		_obj.password = password_encode(_obj.password,g_priKey,g_timestamp,g_timestamp_start);
        postdata = JSON.stringify(_obj);
    } else {
        return false;
    }
	clearErrorMsg();
    saveAjaxJsonData("/goform/login", postdata, function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            if(simStatus == pinBlocked){
                window.location.replace("../html/pukrequired.html");
            }else if(simStatus == pinNotVerified){
                window.location.replace("../html/pinrequired.html");
            }else if(simStatus == pinBlocked && pukTimes == 0){
                window.localStorage.setItem('XCsrfToken',tokenText)
                window.location.replace("../common/home.html");
            }else{
                window.localStorage.setItem('XCsrfToken',tokenText)
                window.location.replace("../common/home.html");
            }
        } else {
            switch (obj.reminingTimes){
                case 2:
                    showErrorMsg("numtips", "login-error-tips", str_login_two_error);
                    break;
                case 1:
                    showErrorMsg("numtips", "login-error-tips", str_login_one_error);
                    break;
                case 0:
                    showErrorMsg("pwtips", "login-error-tips", str_login_num_error);                  
                    break;
                default :
                    showErrorMsg("tips", "login-error-tips", str_login_error);
                    break;

            }
			// showErrorMsg("tips", "login-error-tips", str_login_error);
        }
    }, {
        async: false
    });
    return false;
}
function clearErrorMsg(){
    $("#error-msg").remove();
}
function showErrorMsg(id, css, msg){
    var tips = document.createElement("p");
    tips.id = "error-msg";
    tips.className = css;
    $(tips).text(msg);
    $("#" + id).children('span').append(tips);
}
doIECompatibility();

function doIECompatibility(){
    if (!Array.isArray) {
        Array.isArray = function(arg) {
            return Object.prototype.toString.call(arg) === "[object Array]";
        }
    }
}

