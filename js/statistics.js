/**
 * Created by Administrator on 2017/8/29.
 */
var g_curstatisticsInfo = {
    flowtx: "",
    flowrx: "",
    flowtotal: ""
};
var g_setIntervalTime = 3000;
function showstatisticsInfo(){
    getAjaxJsonData("/action/get_dsflow_info", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            g_curstatisticsInfo.flowtx = obj.tx_dsflow;
            g_curstatisticsInfo.flowrx = obj.rx_dsflow;
            g_curstatisticsInfo.flowtotal = obj.total_dsflow;
            $('#upload_volume').text(transform(g_curstatisticsInfo.flowtx));
            $('#download_volume').text(transform(g_curstatisticsInfo.flowrx));
            $('#total_volume').text(transform(g_curstatisticsInfo.flowtotal));
        }
    }, {
        async: false
    });
    setTimeout(showstatisticsInfo, g_setIntervalTime);

}
function transform(bytes){
    if (bytes === 0){
        return '0 B';
    }else if(bytes < 1024 * 1024){
        var i = parseFloat(bytes/(1024)).toFixed(2);
        return  i +' KB';
    }else if(1024 * 1024 <= bytes && bytes < 1024 * 1024 * 1024){
        var j = parseFloat(bytes/(1024 * 1024)).toFixed(2);
        return j + " MB";
    }else if(1024 * 1024 * 1024 <= bytes){
        var k = parseFloat(bytes/(1024 * 1024 * 1024)).toFixed(2);
        return k + " GB";
    }
}

function statistics_clear(){
    showConfirmDialog(common_confirm, str_statistics_clear_tips, function(){
        closeDialog();
        var obj = {};
        postdata = JSON.stringify(obj);
        saveAjaxJsonData("/action/clear_dsflow_info", postdata, function(data){
            var _obj = data;
            if (typeof _obj.retcode === "number" && _obj.retcode === g_resultSuccess){
                showResultDialog(common_result, common_success, 3000);
            } else {
                showResultDialog(common_result, common_failed);
                startLogoutTimer();
            }
        }, {
        });
    },dialog_align_left);
}

function getsimstate(){
    getAjaxJsonData("/goform/get_sim_info", function (obj) {
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            simStatus = obj.state;
        }
    }, {
        async: false
    });
}

function getpininfo(){
    getAjaxJsonData("/goform/get_pin_info", function (obj) {
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            pinStatus = obj.pin_state;
            pinTimes=obj.pin_times;
            pukTimes = obj.puk_times;
            if(simStatus == g_simstatus_absent){
                showTipsDialog(common_info,str_dialup_no_simtips,redirect,dialog_align_left);
            }else if(simStatus == g_notVerified){
                window.location.replace("pinrequired.html");
            }else if(simStatus == g_pinBlocked){
                window.location.replace("pukrequired.html");
            }else if(simStatus == g_pinBlocked && pukTimes == 0){
                showTipsDialog(common_info,str_dialup_no_simtips,redirect,dialog_align_left);
            }
        }
    }, {
        async: false
    });
}
function initModePage(){
    document.title = str_leftmenu_sta;
    getsimstate();
    getpininfo();
    $(".introduce h1").text(str_statistics);
    $(".introduce p").text(str_statistics_des);
    showstatisticsInfo();
    $("#apply").attr("value", str_statistics_clearhistory).on("click", statistics_clear);
}