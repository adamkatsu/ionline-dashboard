var g_checkb = "*114#";
var g_airtime = "*113#";
var g_buydata = "*575#";
var g_buysoche = "*140#";
var g_airtel = "*778#";
var USSD_DCS_INVALID = -1;
var USSD_DCS_7_GSM = 15;
var USSD_DCS_8_GSM = 68;
var USSD_DCS_8_UCS2 = 72;
var SMS_TEXT_MODE_UCS2 =  0;
var SMS_TEXT_MODE_7BIT =  1;
var SMS_TEXT_MODE_8BIT =  2;
var g_short_message;
var g_short_message_error;
var g_short_message_noerror = 0;
var g_error_QMI_abnormal = -1;
var g_error_QMI_TIMEOUT = -3;
var g_error_not_continue = 0;
var g_error_continue = 1;
var g_error_stop = 2;
var g_error_other_res = 3;
var g_error_operator_not_support = 4;
var g_error_timeout = 5;

var g_error_NO_NETWORK_FOUND = 13;
var g_error_INCOMPATIBLE_STATE = 90;
var g_error_info = [
    "NONE",
    "MALFORMED MSG",
    "NO MEMORY",
    "INTERNAL",
    "ABORTED",
    "CLIENT IDS EXHAUSTED",
    "UNABORTABLE TRANSACTION",
    "INVALID CLIENT ID",
    "NO THRESHOLDS",
    "INVALID HANDLE",
    "INVALID PROFILE",
    "INVALID PINID",
    "INCORRECT PIN",
    str_balancechecker_error_no_network,
    "CALL FAILED",
    "OUT OF CALL",
    "NOT PROVISIONED",
    "MISSING ARG",
    "UNKNOW ERROR",
    "ARG TOO LONG",
    "UNKNOW ERROR",
    "UNKNOW ERROR",
    "INVALID TX ID",
    "DEVICE IN USE",
    "OP NETWORK UNSUPPORTED",
    "OP DEVICE UNSUPPORTED",
    "NO EFFECT",
    "NO FREE PROFILE",
    "INVALID PDP TYPE",
    "INVALID TECH PREF",
    "INVALID PROFILE TYPE",
    "INVALID SERVICE TYPE",
    "INVALID REGISTER ACTION",
    "INVALID PS ATTACH ACTION",
    "AUTHENTICATION FAILED",
    "PIN BLOCKED",
    "PIN PERM BLOCKED",
    "SIM NOT INITIALIZED",
    "MAX QOS REQUESTS IN USE",
    "INCORRECT FLOW FILTER",
    "NETWORK QOS UNAWARE",
    //"INVALID_ID",
    "INVALID QOS ID",
    "REQUESTED NUM UNSUPPORTED",
    "INTERFACE NOT FOUND",
    "FLOW SUSPENDED",
    "INVALID DATA FORMAT",
    "GENERAL",
    "UNKNOWN",
    "INVALID ARG",
    "INVALID INDEX",
    "NO ENTRY",
    "DEVICE STORAGE FULL",
    "DEVICE NOT READY",
    "NETWORK NOT READY",
    "CAUSE CODE",
    "MESSAGE NOT SENT",
    "MESSAGE DELIVERY FAILURE",
    "INVALID MESSAGE ID",
    "ENCODING",
    "AUTHENTICATION LOCK",
    "INVALID TRANSITION",
    "NOT A MCAST IFACE",
    "MAX MCAST REQUESTS IN USE",
    "INVALID MCAST HANDLE",
    "INVALID IP FAMILY PREF",
    "SESSION INACTIVE",
    "SESSION INVALID",
    "SESSION OWNERSHIP",
    "INSUFFICIENT RESOURCES",
    "DISABLED",
    "INVALID OPERATION",
    "INVALID QMI CMD",
    "TPDU TYPE",
    "SMSC ADDR",
    "INFO UNAVAILABLE",
    "SEGMENT TOO LONG",
    "SEGMENT ORDER",
    "BUNDLING NOT SUPPORTED",
    "OP PARTIAL FAILURE",
    "POLICY MISMATCH",
    "SIM FILE NOT FOUND",
    "EXTENDED INTERNAL",
    "ACCESS DENIED",
    "HARDWARE RESTRICTED",
    "ACK NOT SENT",
    "INJECT TIMEOUT",
    "UNKNOW ERROR",
    "UNKNOW ERROR",
    "UNKNOW ERROR",
    "UNKNOW ERROR",
    str_balancechecker_error_tips,
    "FDN RESTRICT",
    "SUPS FAILURE CAUSE",
    "NO RADIO",
    "NOT SUPPORTED",
    "NO SUBSCRIPTION",
    "CARD CALL CONTROL FAILED",
    "NETWORK ABORTED",
    "MSG BLOCKED",
    "UNKNOW ERROR",
    "INVALID SESSION TYPE",
    "INVALID PB TYPE",
    "NO SIM",
    "PB NOT READY",
    "PIN RESTRICTION",
    "PIN2 RESTRICTION",
    "PUK RESTRICTION",
    "PUK2 RESTRICTION",
    "PB ACCESS RESTRICTED",
    "PB DELETE IN PROG",
    "PB TEXT TOO LONG",
    "PB NUMBER TOO LONG",
    "PB HIDDEN KEY RESTRICTION",
    "PB NOT AVAILABLE",
    "DEVICE MEMORY ERROR",
    "NO PERMISSION",
    "TOO SOON",
    "TIME NOT ACQUIRED",
    "OP IN PROGRESS"
];
var g_error_code16;
var pinStatus;
var g_notVerified = 1;
var g_pinBlocked = 2;
var simLockStatus;
var simLock = 0;
var g_call_status;
var g_in_call = 1;
function str_pad( hex ){
    var zero = '0000';
    var tmp  = 4-hex.length;
    return '0x' + zero.substr(0,tmp) + hex;
}
function initModePage(){
    getSimStatus();
    getMessage();
    $("#send_ussdcode").val(str_ussd_service_send).on("click",function(){
        var ret;
        ret = checkcallstatus();
        if(!ret){
            return false;
        }
        cleartips();
        var ussdcode = $("#send_input").val();
        if(ussdcode.length < 1 || ussdcode.length >= 180){
            $("#ussdcodetips").text(str_balancechecker_ussd_tips);
            $("#ussdcodetips").show();
            return false;
        }
        dial(ussdcode);
    });
    $("#response_ussdcode").val(str_ussd_service_send).on("click",send);
    $("#ussd_cancel").val(common_cancel).on("click",cancel);
    $("#cancel1,#cancel2").val(common_cancel).on("click",cancel);
}
function checkcallstatus(){
    getAjaxJsonData("/action/get_voicecall_state", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            g_call_status = obj.voicecall_state;
        }
    }, {
        async: false
    });
    if(g_call_status == g_in_call && g_volteStatus == g_volte){
        closeDialog();
        showResultDialog(common_tip,str_balancechecker_calling_tips,3000,dialog_align_left);
        return false;
    }
    return true;
}
function getSimStatus(){
    getAjaxJsonData("/goform/get_sim_info", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            if (obj.state === g_simStatusNo) {
                showTipsDialog(common_info,str_dialup_no_simtips,redirect,dialog_align_left);
            }else if(obj.state == g_notVerified){
                window.location.replace("pinrequired.html");
            }else if(obj.state == g_pinBlocked){
                window.location.replace("pukrequired.html");
            }
        }
    }, {
        async: false
    })
}
function redirectIC(){
    setTimeout(goToInvalidCard,3000);
}
function goToInvalidCard(){
    window.location.replace("../common/home.html")
}
function getMessage(){
    getAjaxJsonData("/action/ussd_inddata_req", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            g_short_message = obj.ussd_ind_data;
            g_short_message_error = obj.ussd_ind_error;
            $("#response_ussdcode").removeAttr("disabled");
            if(g_short_message_error == g_error_not_continue){
                if(g_short_message.length != 0){
                    $("#short_message").text(g_short_message);
                }else{
                    $("#response_ussdcode").attr("disabled","disabled");
                }
            }else if(g_short_message_error == g_error_continue ){
                if(g_short_message.length != 0){
                    $("#short_message").text(g_short_message);
                }
            }else if(g_short_message_error == g_error_stop){
                if(g_short_message.length != 0){
                    $("#short_message").text(str_balancechecker_error_networkStop);
                }
            }else if (g_short_message_error == g_error_other_res){
                if(g_short_message.length != 0){
                    $("#short_message").text(str_balancechecker_error_otherRes);
                }
            }else if (g_short_message_error == g_error_operator_not_support){
                if(g_short_message.length != 0){
                    $("#short_message").text(str_balancechecker_error_ipcNotSupport);
                }
            }else if (g_short_message_error == g_error_timeout){
                if(g_short_message.length != 0){
                    $("#short_message").text(str_balancechecker_error_timeout);
                }
            }else{
                $("#short_message").text(str_balancechecker_error_tips2);
            }
        }
    }, {
        async: false,
        timeout: 1000
    });
    setTimeout(getMessage,3000);
}
function showFailedError(errorcode){
    if(errorcode == 0){
        closeDialog();
        showTipsDialog(common_result, common_failed,3000);
    }else if(errorcode < 0){
        closeDialog();
        if(errorcode == -1){
            showConfirmDialog(common_failed, str_balancechecker_error_qmiabnormal, closeDialog);
        }else if(errorcode == -3){
            showConfirmDialog(common_failed, str_balancechecker_error_timeout, closeDialog);
        }else {
            showConfirmDialog(common_failed, str_ussd_error_code + errorcode, closeDialog);
        }
    }else{
        closeDialog();
        g_error_code16 = errorcode;
        if(g_error_code16 < g_error_info.length){
            showConfirmDialog(common_failed, g_error_info[g_error_code16], closeDialog);
        }else{
            showConfirmDialog(common_failed, str_balancechecker_error_tips2, closeDialog);
        }
    }
}
function showSuccessError(errorcode){
    if(errorcode == 0){
        closeDialog();
        showTipsDialog(common_result, common_success,3000);
    }else if(errorcode < 0){
        closeDialog();
        if (errorcode  == -1) {
            showConfirmDialog(common_failed, str_balancechecker_error_qmiabnormal, closeDialog);
        }else  if(errorcode == -3){
            showConfirmDialog(common_failed, str_balancechecker_error_timeout, closeDialog);
        }else{
            showConfirmDialog(common_failed, str_ussd_error_code + errorcode, closeDialog);
        }
    }else{
        closeDialog();
        g_error_code16 = errorcode;
        if(g_error_code16 < g_error_info.length){
            showConfirmDialog(common_failed, g_error_info[g_error_code16], closeDialog);
        }else{
            showConfirmDialog(common_failed, str_balancechecker_error_tips2, closeDialog);
        }
    }
}
function checkrechargePIN(code){
    var reg = /[^0-9]/g;
    if(code.match(reg)){
        $("#rechargePINtips").text(str_balancechecker_recharge_tips1);
        $("#rechargePINtips").show();
        return false;
    }
}
function checkUSSDcode(code){
    /*var reg = /[^#*0-9`!@$a-z%^&-()_+=|;:'"A-z~<>\\?\[\]{},.\/]/g;*/
    var reg = /[^`~!@#$%^&*0-9()_+-=\[\]a-z{};'\\,.\/:A-Z"|<>?]/g;
    if(code.match(reg)){
        $("#responsecodetips").text(str_balancechecker_option_code_tips1);
        $("#responsecodetips").show();
        return false;
    }
}
function dial(ussd){
    $("#short_message").text("");
    cleartips();
    startLogoutTimer();
    var postdata, obj = {};
    sms_contentChange_ussd(ussd);
    if(g_text_mode == SMS_TEXT_MODE_UCS2){
        g_text_mode = USSD_DCS_8_UCS2;
    }else if(g_text_mode == SMS_TEXT_MODE_7BIT){
        g_text_mode = USSD_DCS_7_GSM;
    }else if(g_text_mode = SMS_TEXT_MODE_8BIT){
        g_text_mode = USSD_DCS_8_GSM;
    }else{
        g_text_mode = USSD_DCS_INVALID;
    }
    obj.ussd_orig_encode_type = g_text_mode;
    obj.ussd_orig_reqdata = ussd;
    postdata = JSON.stringify(obj);
    showWaitingDialog(common_waiting, common_waitingmsg,dialog_align_left);
    saveAjaxJsonData("/action/ussd_orig_req", postdata, function(data){
        var _obj = data;
        if (typeof _obj.retcode === "number" && _obj.retcode === g_resultSuccess) {
            closeDialog();
            showTipsDialog(common_result, common_success,3000);
            /*if(_obj.UssdOrigRspError == 0){
                closeDialog();
                showTipsDialog(common_result, common_success,3000);
                $("#short_message").text(_obj.UssdOrigRspData);
            }else if(_obj.UssdOrigRspError < 0){
                closeDialog();
                if(_obj.UssdOrigRspError == g_error_QMI_abnormal){
                    showConfirmDialog(common_failed, str_balancechecker_error_qmiabnormal, closeDialog);
                }else if(_obj.UssdOrigRspError == g_error_QMI_TIMEOUT){
                    showConfirmDialog(common_failed, str_balancechecker_error_timeout, closeDialog);
                }else{
                    showConfirmDialog(common_failed, str_ussd_error_code + _obj.UssdOrigRspError, closeDialog);
                }
            }else{
                closeDialog();
                g_error_code16 = _obj.UssdOrigRspError;
                if(g_error_code16 < g_error_info.length){
                    showConfirmDialog(common_failed, g_error_info[g_error_code16], closeDialog);
                }else{
                    showConfirmDialog(common_failed, str_balancechecker_error_tips2, closeDialog);
                }
            }*/

        } else {
            /*startLogoutTimer();
            showFailedError(_obj.UssdOrigRspError);*/
            closeDialog();
            showTipsDialog(common_result, common_failed,3000);
        }
    }, {
    });
    startLogoutTimer();
}
function cancel(){
    var ret;
    ret = checkcallstatus();
    if(!ret){
        return false;
    }
    cleartips();
    startLogoutTimer();
    $("#short_message").text("");
    var postdata, obj = {};
    postdata = JSON.stringify(obj);
    saveAjaxJsonData("/action/ussd_cancel_req", postdata, function(data){
        var _obj = data;
        if (typeof _obj.retcode === "number" && _obj.retcode === g_resultSuccess) {
            /*showSuccessError(_obj.UssdCancelRspError);*/
            closeDialog();
            showTipsDialog(common_result, common_success,3000);
        } else {
            startLogoutTimer();
            /*showFailedError(_obj.UssdCancelRspError);*/
            closeDialog();
            showTipsDialog(common_result, common_failed,3000);
        }
    }, {
    });
    startLogoutTimer();
}
function cleartips(){
    $("#responsecodetips").text("");
    $("#responsecodetips").hide();
    $("#ussdcodetips").text("");
    $("#ussdcodetips").hide();
}
function send(){
    var ret;
    ret = checkcallstatus();
    if(!ret){
        return false;
    }
    cleartips();
    startLogoutTimer();
    var postdata, obj = {}, answerData;
    answerData = $("#response_input").val();
    if(answerData.length < 1 || answerData.length >= 180){
        $("#responsecodetips").text(str_balancechecker_option_code_tips);
        $("#responsecodetips").show();
        return false;
    }
    /*ret = checkUSSDcode(answerData);
    if(ret == false){
        return;
    }*/
    $("#short_message").text("");
    sms_contentChange_ussd(answerData);
    if(g_text_mode == SMS_TEXT_MODE_UCS2){
        g_text_mode = USSD_DCS_8_UCS2;
    }else if(g_text_mode == SMS_TEXT_MODE_7BIT){
        g_text_mode = USSD_DCS_7_GSM;
    }else if(g_text_mode = SMS_TEXT_MODE_8BIT){
        g_text_mode = USSD_DCS_8_GSM;
    }else{
        g_text_mode = USSD_DCS_INVALID;
    }
    obj.ussd_answer_encode_type = g_text_mode;
    obj.ussd_answer_reqdata = answerData;
    postdata = JSON.stringify(obj);
    saveAjaxJsonData("/action/ussd_answer_req", postdata, function(data){
        var _obj = data;
        if (typeof _obj.retcode === "number" && _obj.retcode === g_resultSuccess) {
            /*showSuccessError(_obj.UssdAnswerRspError);*/
            closeDialog();
            showTipsDialog(common_result, common_success,3000);
        } else {
            startLogoutTimer();
            /*showFailedError(_obj.UssdAnswerRspError);*/
            closeDialog();
            showTipsDialog(common_result, common_failed,3000);
        }
    }, {
    });
    startLogoutTimer();
}

function sms_contentChange_ussd(str) {
    if(g_isCDMA) {
        g_text_mode = CDMA_textmode_check(str);
    } else {
        /* if( $.browser.msie ) {
         if(g_net_mode_type==MACRO_NET_DUAL_MODE && g_net_mode_change==MACRO_NET_MODE_CHANGE) {
         g_ucs2_num=ucs2_number_check(str);
         } else {
         sms_contentDiffUCS2Num( str );
         }
         } else {*/
        g_ucs2_num =  ucs2_number_check(str);
        //}
        if (g_ucs2_num >0) {
            g_text_mode = SMS_TEXT_MODE_UCS2;
        } else {
            g_text_mode = SMS_TEXT_MODE_7BIT;
        }
    }
}