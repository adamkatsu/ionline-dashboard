/**
 * Created by Administrator on 2017/8/22.
 */

var g_resultSuccess = 0;
var g_resultFailed = 1;
var g_wpsResultProcessing = 1;

var g_Enable=1;
var g_Disable=0;
var g_wpsStatus;
var postdata;
var g_wpsSetErrorCode=-23;
var g_broadcast;
var g_status=[
    {
        value:g_Enable,
        name:common_enable

    },
    {
        value:g_Disable,
        name:common_disable
    }
];

var g_wifi_24={
    'ssidstatus': "",
    'broadcast':""
};
var g_wifi_5={
    'ssidstatus': "",
    'broadcast':""
};


function initPage(){
    var option = "<option value=\"%d\">%s</option>";
    var status_html = "";
    for(var i= 0,len=g_status.length;i<len;i++){
        status_html += option;
        status_html = status_html.replace("%d", g_status[i].value).replace("%s", g_status[i].name);
    }
    $("#wpsstatus").html(status_html).val(g_wpsStatus);

    $("#wpsstatus").on("change", saveWPSStatus);
}

function initModePage(){
    document.title = str_leftmenu_ws;
    checkWPSStatus();
    $(".introduce h1").text(str_wireless);
    $(".introduce p").text(str_wireless_des);
    getWifiInfo();
    initPage();
}
function saveWPSStatus(){
        if(g_broadcast == g_Disable){
            showTipsDialog(common_confirm,str_wps_tips,null,dialog_align_left);
            $("#wpsstatus").val(g_wpsStatus);
            return false;
        }else{
                showConfirmDialog(common_info, str_wlan_warn, function(){
                    closeDialog();
                    var ass = $("#wpsstatus").val();
                    if(ass == g_Enable){
                        showWaitingDialog(common_waiting,str_wps_waiting1,dialog_align_left);
                    }
                    if(ass == g_Disable){
                        showWaitingDialog(common_waiting,str_wps_waiting,dialog_align_left);
                    }
                    var postdata, data = {};
                    stopLogoutTimer();
                    data.status = parseInt($("#wpsstatus").val());
                    postdata = JSON.stringify(data);
                    saveAjaxJsonData("/action/set_wps_status", postdata, function(obj){
                        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                            closeDialog();
                            showResultDialog(common_result, common_success, 2000);
                        }else if(typeof obj.retcode === "number" && obj.retcode === g_wpsSetErrorCode){
                            closeDialog();
                            showResultDialog(common_result, str_wlan_wps_set_errorCode23, 2000,dialog_align_left);
                        }else {
                            closeDialog();
                            showResultDialog(common_result, common_failed, 2000);
                        }
                    }, {

                    });
                },dialog_align_left);
        }
}
function checkWPSStatus(){
    getAjaxJsonData("/action/get_wps_connect_status", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            switch(obj.status){
                case g_wpsResultProcessing:
                    if ($("#pop-window").length === 0) {
                        showWaitingDialog(common_waiting, str_wlan_advancesettings_wpsconning,dialog_align_left);
                    }
                    setTimeout(checkWPSStatus, 5000);
                    break;
                default:
                    closeDialog();
                    break;
            }
        } else {
            closeDialog();
            return;
        }
    }, {
        async: false
    });
}

function getWifiInfo() {
    getAjaxJsonData("/action/get_wps_status", function (obj) {
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            g_wpsStatus = obj.status;
            g_broadcast = obj.broadcast;
        }
    }, {
        async: false
    });
}

