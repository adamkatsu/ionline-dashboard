var g_unregistered = 0;
var g_registered = 1;
var g_sipaccount;
var g_proxyserveraddress;
var g_username;
var g_password;
var g_registerstatus;
var g_minUsrLength = 1;
var g_maxUsrLength = 64;
var g_minPsdLength = 1;
var g_maxPsdLength = 32;

var g_status = [
    {
        status: g_unregistered,
        name: str_unregistered
    },
    {
        status: g_registered,
        name: str_registered
    }
];
function edit(){
    var value, $username, $psw, $option;
    $username = $("#username");
    value = $username.text();
    $username.html('<input type="text" class="inputip" maxlength=\"64\"/>').children("input").val(value);

    $psw = $("#password");
    value = $("#psw").val();
    $psw.html('<input type="password" class="inputip" maxlength=\"32\"/>').children("input").val(value);
    $option = $("#option");
    $option.html('<span onclick="modifysipaccount()" class="operation_btn">'+common_ok+'</span><span onclick="initSipaccountData()" class="operation_btn">'+common_cancel+'</span>');
}
function add(){
    var row = '<tr class=\"oddtr\"><td id=\"username\"><input type=\"text\" class=\"inputip\" maxlength=\"64\"/></td><td id=\"password\"><input id=\"psw\" type=\"password\" class=\"inputip\" maxlength=\"32\"/></td><td id=\"regstatus\"></td><td id=\"option\"><span onclick=\"setsipaccount()\" class=\"operation_btn\">'+common_ok+'</span><span onclick=\"cancel()\" class=\"operation_btn\">'+common_cancel+'</span></td></tr>'
    $("#listtable").append(row);
    $("#add").attr("disabled","disabled");
}
function deletesipaccount(){
    var tab = $('#listtable');
    tab.find('tr:gt(0)').remove();
    showWaitingDialog(common_waiting, common_waitingmsg,dialog_align_left);
    saveAjaxJsonData("/action/delete_sip_account", null, function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            closeDialog();
            showResultDialog(common_result, common_success, 3000);
        } else {
            closeDialog();
            showResultDialog(common_result, common_failed, 3000);
        }
    }, {
        async: true

    });
}
function checkAccountUsernamePsd(){
    var val, reg;

    reg = /[^!#$()*+.\-\/0-9=@A-Z\[\]^_`a-z{}|~]/g;
    val = $("#username").children("input").val();
    if (val.length < g_minUsrLength || val.length > g_maxUsrLength) {
        $("#errortips").text(str_invalid_username.replace("%s", g_minUsrLength).replace("%e", g_maxUsrLength));
        $("#errortips").show();
        $("#username").children("input").focus();
        return false;
    }
    /*if (val.match(reg)) {
        $("#errortips").text(str_invalid_username1);
        $("#errortips").show();
        $("#username").children("input").focus();
        return false;
    }*/
    val = $("#password").children("input").val();
    if (val.length < g_minPsdLength || val.length > g_maxPsdLength) {
        $("#errortips").text(str_invalid_password.replace("%s", g_minPsdLength).replace("%e", g_maxPsdLength));
        $("#errortips").show();
        $("#password").children("input").focus();
        return false;
    }
    /*if (val.match(reg)) {
        $("#errortips").text(str_invalid_password1);
        $("#errortips").show();
        $("#password").children("input").focus();
        return false;
    }*/
    return true;
}
function setsipaccount(){
    var ret;
    ret = checkAccountUsernamePsd();
    if(ret == false){
        return false;
    }
    var username, psw, postdata = {};
    username = $("#username").children("input").val();
    postdata.username = username;
    psw = $("#password").children("input").val();
    postdata.psw = password_encode(psw,g_priKey,g_timestamp,g_timestamp_start);
    postdata = JSON.stringify(postdata);
    startLogoutTimer();
    showWaitingDialog(common_waiting, common_waitingmsg,dialog_align_left);
    saveAjaxJsonData("/action/add_sip_account", postdata, function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            closeDialog();
            showResultDialog(common_result, common_success, 3000);
        } else {
            closeDialog();
            showResultDialog(common_result, common_failed, 3000);
        }
    }, {
        async: true

    });
}
function modifysipaccount(){
    var ret;
    ret = checkAccountUsernamePsd();
    if(ret == false){
        return false;
    }
    var username, psw, postdata = {};
    username = $("#username").children("input").val();
    postdata.username = username;
    psw = $("#password").children("input").val();
    postdata.psw = password_encode(psw,g_priKey,g_timestamp,g_timestamp_start);
    postdata = JSON.stringify(postdata);
    startLogoutTimer();
    showWaitingDialog(common_waiting, common_waitingmsg,dialog_align_left);
    saveAjaxJsonData("/action/set_sip_account_info", postdata, function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            closeDialog();
            showResultDialog(common_result, common_success, 3000);
        } else {
            closeDialog();
            showResultDialog(common_result, common_failed, 3000);
        }
    }, {
        async: true

    });
}
function GetSipaccountData(){
    getAjaxJsonData("/action/get_sip_account_info", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            g_username = obj.username;
            g_password = password_decode(obj.password,g_priKey);
            g_registerstatus = obj.registerstatus;
        }
    }, {
        async: false
    });
    setTimeout(GetSipaccountData,3000);
}
function initSipaccountData(){
    var tab = $('#listtable');
    tab.find('tr:gt(0)').remove();
    var value = g_registerstatus;
    $.each(g_status, function(){
        if (value === this.status){
            value = this.name;
        }
    });
    var row = '<tr class=\"oddtr\"><td id=\"username\">'+g_username+'</td><td id=\"password\"><input id=\"psw\" type=\"password\" style=\"border: none;background: #eaeaea;text-align: center;\" readonly=\"true\" value=\"'+g_password+'\"/></td><td id=\"regstatus\">'+value+'</td><td id=\"option\"><span class=\"operation_btn\" onclick=\"edit()\">'+common_edit+'</span><span class=\"operation_btn\" onclick="deletesipaccount()">'+common_del+'</span></td></tr>'
    $("#listtable").append(row);
    initstatus();
}
function initstatus(){
    var value = g_registerstatus;
    $.each(g_status, function(){
        if (value === this.status){
            value = this.name;
        }
    });
    $("#regstatus").text(value);
    setTimeout(initstatus,3000);
}
function cancel(){
    if(typeof (g_sipaccount) == "undefined"){
        var tab = $('#listtable');
        tab.find('tr:gt(0)').remove();
        $("#add").removeAttr("disabled");
        $("#errortips").hide();
        $("#errortips").text("");
    }else{
        $("#add").attr("disabled","disabled");
        initSipaccountData();
    }
}
function initModePage(){
    document.title = str_sipaccount;
    $(".introduce h1").text(str_sipaccount);
    $(".introduce p").text(str_sipaccount_des);
    GetSipaccountData();
    if((typeof (g_username) == "undefined") || (g_username == "") || (g_password == "")){
        var tab = $('#listtable');
        tab.find('tr:gt(0)').remove();
        $("#add").removeAttr("disabled");
    }else{
        $("#add").attr("disabled","disabled");
        initSipaccountData();
    }
    $("#add").attr("value",common_add).on("click",add);
}
