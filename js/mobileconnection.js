/**
 * Created by Administrator on 2017/8/8.
 */
var g_dataStatus;
var g_dataRoamingStatus;
var simStatus;
var g_notVerified = 1;
var g_pinBlocked = 2;
function initModePage(){
    document.title = str_leftmenu_mc;
    getSimStatus();
    getProfileInfo();
    $("#mobiledata").val(g_dataStatus);
    $("#dataroaming").val(g_dataRoamingStatus);
    $("#mobiledata").on("change",saveDataStatus);
    $("#dataroaming").on("change",saveDataRoamingStatus);

    $(".introduce h1").text(str_mobile_connection);
    $(".introduce p").text(str_mobile_connection_des);

}
/*----------------------------profile-------------------------------*/
function getProfileInfo(){
    getAjaxJsonData("/action/get_mobile_connection_cfg", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            g_dataStatus = obj.dataswitch;
            g_dataRoamingStatus = obj.roamingswitch;
        }
    }, {
        async: false
    });
}


function getSimStatus(){
    getAjaxJsonData("/goform/get_sim_info", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            if (obj.state === g_simStatusNo) {
               showTipsDialog(common_info,str_dialup_no_simtips,redirect,dialog_align_left);
            } else if (obj.state == g_notVerified) {
               window.location.replace("pinrequired.html");
            } else if (obj.state == g_pinBlocked) {
                window.location.replace("pukrequired.html");
            } else {
            }
        }
    }, {
        async: false
    })
}

function saveDataStatus(){
    var data=parseInt($("#mobiledata").val());
    var postdata = {};
    stopLogoutTimer();
    postdata.switch = data;
    postdata = JSON.stringify(postdata);
    saveAjaxJsonData("/action/set_mobile_data_switch", postdata, function(obj){
        startLogoutTimer();
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            showResultDialog(common_success, common_success);
        } else {
            showResultDialog(common_failed, common_failed, 2000);
        }
    }, {
        async: false
    });
}

function saveDataRoamingStatus(){
    var data=parseInt($("#dataroaming").val());
    var postdata = {};
    postdata.switch = data;
    postdata = JSON.stringify(postdata);
    stopLogoutTimer();
    saveAjaxJsonData("/action/set_mobile_roaming_switch", postdata, function(obj){

        startLogoutTimer();
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            showResultDialog(common_success, common_success);
        } else {
            showResultDialog(common_failed, common_failed, 2000);
        }
    }, {
        async: true
    })
}
