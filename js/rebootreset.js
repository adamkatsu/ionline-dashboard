/**
 * Created by Administrator on 2017/8/21.
 */
var g_systemRebootReady = 2;
var g_systemRebootBooting = 1;
var g_systemRebootNormal = 0;
var g_systemRebootStatus = g_systemRebootNormal;
var img = new Image();
img.src = "../images/waiting.gif";

var g_defaultResetGateway = "//192.168.1.1";
var g_systemResetReady = 2;
var g_systemResetBooting = 1;
var g_systemResetNormal = 0;
var g_dhcphead;
var g_systemResetStatus = g_systemResetNormal;

function reboot(){
    getLanDhcp();
    getAjaxJsonData("/action/reboot", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            closeDialog();
            clearAllsetTimeout();
            showWaitingDialog(common_waiting, str_system_reboot_tips2,dialog_align_left);
            g_systemRebootStatus = g_systemRebootBooting;
            stopAllTimer();
            setTimeout(updateSystem_rebootStatus, 45000);
        } else {
            closeDialog();
            showResultDialog(common_result, common_failed, 3000);
        }
    }, {
    });
}
function getLanDhcp(){
    var lanIpDHCP;
    getAjaxJsonData("/action/get_dhcp_cfg", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            lanIpDHCP = obj.ipaddr;
        }
    }, {
        async: false,
        timeout: 1000
    });
    if(lanIpDHCP == "" || lanIpDHCP == undefined || lanIpDHCP == null){
        g_dhcphead = "";
    }else{
        g_dhcphead = window.location.protocol + "//" + lanIpDHCP;
    }
}
function updateSystem_rebootStatus(){
    getxCsrfTokens();
    if (g_systemRebootStatus === g_systemRebootReady || g_systemRebootStatus === g_systemRebootNormal) {
        if(g_dhcphead == ""){
            window.location.replace("../common/login.html");
        }else{
            window.location.replace(g_dhcphead);
        }
    }
    getAjaxJsonData(g_dhcphead + "/goform/get_system_status", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            g_systemRebootStatus = obj.status;
        }
    }, {
    });
    setTimeout(updateSystem_rebootStatus, 3000);
}
function restore(){
    stopLogoutTimer();
    getAjaxJsonData("/action/reset", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            closeDialog();
            clearAllsetTimeout();
            showWaitingDialog(common_waiting, str_system_restore_tips2,dialog_align_left);
            stopAllTimer();
            setTimeout(updateSystem_restoreStatus, 30000);
        } else {
            closeDialog();
            showResultDialog(common_result, common_failed);
            startLogoutTimer();
        }
    }, {

    });
}
function ResetGatwayFn(){
    window.location.replace(window.location.protocol + g_defaultResetGateway +"/common/login.html");
}
function updateSystem_restoreStatus(){
        $.ajax({
            type: 'GET',
            url:window.location.protocol + "//" + g_defaultResetGateway + "/goform/x_csrf_token",
            async: true,
            error: function() {
                return
            },
            success: function(){
                closeDialog();
                showTipsDialog(common_result, common_success,ResetGatwayFn,3000);
            }


        });
    setTimeout(updateSystem_restoreStatus, 3000);
}
function initModePage(){
    document.title = str_leftmenu_rr;
    $(".introduce h1").text(str_reboot_reset);
    $(".introduce p").text(str_reboot_reset_des);
    $("#reboot_button").attr("value", str_reboot).on("click", function(){
        showConfirmDialog(common_confirm, str_system_reboot_tips1, reboot,dialog_align_left);
    });
    $("#reset_button").attr("value", str_reset).on("click", function(){
        showConfirmDialog(common_confirm, str_system_restore_tips1, restore,dialog_align_left);
    });
}