var simStatus;
var pinStatus;
var pinTimes;
var pukTimes;
var g_unknown = 0;
var g_permanentlyBlocked = 5;
var g_modify = 2;
var g_enable = 1;
var g_disable = 0;
var g_pinEnable = 1;
var g_pinDisabled = 0;
var g_simstatus_absent = 0;
var g_notVerified = 1;
var g_pinBlocked = 2;
var g_simnormal = 144;
var g_simstatus_present = 1;
var g_simstauts_error = 2;
var g_operate_checkPIN = 1;
var g_operate_PINstatus =2;
var g_operate_checkPUK = 3;
var g_operate_modifyPIN = 4;
var g_pinstatus = [
    {
        value: g_enable,
        name: common_enable
    },
    {
        value: g_disable,
        name: common_disable
    },
    {
        value: g_modify,
        name: common_modify
    }
]
function clearTips(){
    $("#codetips").hide();
    $("#pincodetips").text("");
    $("#newcodetips").hide();
    $("#newpincodetips").text("");
    $("#confirmcodetips").hide();
    $("#confirmpincodetips").text("");
}
function checkPINCode(code){
    var reg = /^[0-9]{4,8}$/;
    if (code.match(reg)) {
        return true;
    }else{
        $("#pincodetips").text(str_pin_code_tips);
        $("#codetips").show();
        return false;
    }
}
function checknewPIN(pincode){
    var reg = /^[0-9]{4,8}$/;
    if(pincode.match(reg)){
        return true;
    }else{
        $("#newpincodetips").text(str_pin_newPINTips);
        $("#newcodetips").show();
        return false;
    }
}
function checkconfirmPIN(pincode){
    var reg = /^[0-9]{4,8}$/;
    if(pincode.match(reg)){
        return true;
    }else{
        $("#confirmpincodetips").text(str_pin_conPINTips1);
        $("#confirmcodetips").show();
        return false;
    }
}
function getSimStatus(){
    getAjaxJsonData("/goform/get_sim_info", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            if (obj.state === g_simStatusNo) {
				closeDialog();
                showTipsDialog(common_info,str_dialup_no_simtips,redirect,dialog_align_left);
            }
            simStatus = obj.state;
        }
    }, {
        async: false
    })
}
function getpininfo(){
    getAjaxJsonData("/goform/get_pin_info", function (obj) {
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                pinStatus = obj.pin_state;
                pinTimes=obj.pin_times;
                pukTimes = obj.puk_times;
                if(simStatus == g_simstatus_absent){
                    closeDialog();
                    showTipsDialog(common_info,str_dialup_no_simtips,redirect,dialog_align_left);
                }else if(simStatus == g_notVerified){
                     window.location.replace("pinrequired.html");
                }else if(simStatus == g_pinBlocked){
                     window.location.replace("pukrequired.html");
                }else if(simStatus == g_pinBlocked && pukTimes == 0){
                    closeDialog();
                    showTipsDialog(common_info,str_dialup_no_simtips,redirect,dialog_align_left);
                }
                initPINinfo();
            }
    }, {
        async: false
    });
}

function initPINinfo(){
    var i, html, option = '<option value="%d">%s</option>';
    if(pinStatus == g_pinEnable){
        $("#newpin").hide();
        $("#newcodetips").hide();
        $("#confirmpin").hide();
        $("#confirmcodetips").hide();
        html = '';
        for(var i = 1;i<g_pinstatus.length;i++){
            html += option;
            html = html.replace("%d", g_pinstatus[i].value);
            html = html.replace("%s", g_pinstatus[i].name);
        }
        $("#pinOperation").html(html);
    }else if(pinStatus == g_pinDisabled){
        $("#newpin").hide();
        $("#newcodetips").hide();
        $("#confirmpin").hide();
        $("#confirmcodetips").hide();
        option = option.replace("%d", g_pinstatus[0].value);
        option = option.replace("%s", g_pinstatus[0].name);
        $("#pinOperation").html(option);
    }else{

    }
    $("#remainAttempts").text(pinTimes);
    var pinstatus = $("#pinOperation").children("option:selected").val();
    if(pinstatus == g_modify){
        $("#newpin").show();
        $("#confirmpin").show();
    }else if(pinstatus == g_enable || pinstatus == g_disable){
        $("#newpin").hide();
        $("#newcodetips").hide();
        $("#confirmpin").hide();
        $("#confirmcodetips").hide();
    }
}
function savepininfo(){
    var ret, postdata = {};
    var pinCode = $("#pinCode").val();
    ret = checkPINCode(pinCode);
    if(ret == false){
        return;
    }
    var pinStatus = $("#pinOperation").val();
    if(pinStatus == g_disable){
        postdata.operate = g_operate_PINstatus;
        postdata.enable = g_disable;
        postdata.pincode = password_encode(pinCode,g_priKey,g_timestamp,g_timestamp_start);
    }else if(pinStatus == g_enable){
        postdata.operate = g_operate_PINstatus;
        postdata.enable = g_enable;
        postdata.pincode = password_encode(pinCode,g_priKey,g_timestamp,g_timestamp_start);
    }else if(pinStatus == g_modify){
        var newpinCode = $("#newPinCode").val();
        var confirmpinCode = $("#confirmpinCode").val();
        ret = checknewPIN(newpinCode);
        if(ret == false){
            return;
        }
        if(pinCode == newpinCode){
            $("#newpincodetips").text(str_pin_same_tips);
            $("#newcodetips").show();
            return false;
        }
        ret = checkconfirmPIN(confirmpinCode);
        if(ret == false){
            return;
        }
        if(newpinCode !== confirmpinCode){
            $("#confirmpincodetips").text(str_puk_conPINTips);
            $("#confirmcodetips").show();
            return false;
        }
        postdata.operate = g_operate_modifyPIN;
        postdata.pincode = password_encode(pinCode,g_priKey,g_timestamp,g_timestamp_start);
        postdata.newpincode = password_encode(confirmpinCode,g_priKey,g_timestamp,g_timestamp_start);
    }
    postdata = JSON.stringify(postdata);
    startLogoutTimer();

    saveAjaxJsonData("/action/exec_pin_operate", postdata, function(obj){
        if (typeof obj.retcode === "number") {
            if (obj.retcode === g_resultSuccess) {
                stopAllTimer();
                closeDialog();
                showResultDialog(common_result, common_success, 3000);
            } else {
                showResultDialog(common_result, str_incorrect_pin, 3000);
            }
        }
    }, {

    });
    /*window.location.replace("pukrequired.html");*/
}
function initModePage(){
    document.title = str_leftmenu_pinm;
    $(".introduce h1").text(str_pin_management);
    $(".introduce p").text(str_pin_management_des);
    getSimStatus();
    getpininfo();
    $("#pinOperation").on("change",function(){
        var pinStatus = $("#pinOperation").val();
        if(pinStatus == g_modify){
            $("#newpin").show();
            $("#confirmpin").show();
        }else if(pinStatus == g_enable || pinStatus == g_disable){
            $("#newpin").hide();
            $("#newcodetips").hide();
            $("#confirmpin").hide();
            $("#confirmcodetips").hide();
        }
    })
    $("#apply").attr("value", common_apply).on("click", function(){
        clearTips();
        savepininfo();
    });
}
