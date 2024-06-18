var g_Enable;



function getUPNPInfo(){
    getAjaxJsonData("/action/get_upnp_status", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            g_Enable = obj.UPnP_enable;
        }
    }, {
        async: false
    });
}

function saveUPNPData(){
    closeDialog();
    stopLogoutTimer();
    var postdata, data = {};
    data.UPnP_enable = $("#upnpStatus").val();
    postdata = JSON.stringify(data);
    saveAjaxJsonData("/action/set_upnp_status", postdata, function(data){
        if (typeof data.retcode === "number" && data.retcode === g_resultSuccess){
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

function initModePage(){
    document.title = str_UPNP;
    getUPNPInfo();
    $("#upnpStatus").val(g_Enable);
    $("#apply").attr("value", common_apply).on("click", saveUPNPData);
}
