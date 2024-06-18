var g_none = "null";
var g_err = "error";
var g_warning = "warning";
var g_info = "info";
var g_debug = "debug";

var g_monitor = "monitor";
var g_atserver = "atserver";
var g_router = "router";
var g_mobilenet = "mobilenet";
var g_dialup = "dialup";
var g_wland = "wland";
var g_goahead = "goahead";
var g_devctrl = "device_control";
var g_voice = "voice";
var g_tr069 = "tr069";
var g_upgrade = "upgrade";
var g_sntp = "fgntp";
//var g_sms = "sms";
var g_statistics = "statistics";
var g_dbm = "dbm";

var g_module = [
    {
        module:g_monitor,
        str:str_systemlog_monitor
    },
    {
        module:g_atserver,
        str:str_systemlog_atserver
    },
    {
        module:g_router,
        str:str_systemlog_router
    },
    {
        module:g_mobilenet,
        str:str_systemlog_wirelessnet
    },
    {
        module:g_dialup,
        str:str_systemlog_dialup
    },
    {
        module:g_wland,
        str:str_systemlog_wland
    },
    {
        module:g_goahead,
        str:str_systemlog_goahead
    },
    {
        module:g_devctrl,
        str:str_systemlog_devcrtl
    },
    {
        module:g_voice,
        str:str_systemlog_voice
    },
    {
        module:g_tr069,
        str:str_systemlog_tr069
    },
    {
        module:g_upgrade,
        str:str_systemlog_upgrade
    },
    {
        module:g_sntp,
        str:str_systemlog_sntp
    },
    /*{
        module:g_sms,
        str:str_systemlog_sms
    },*/
    {
        module:g_statistics,
        str:str_systemlog_statistics
    },
    {
        module:g_dbm,
        str:str_systemlog_dbm
    }
];
var g_level = [
    {
        mode:g_none,
        name:str_systemlog_none
    },
    {
        mode:g_err,
        name:str_systemlog_err
    },
    {
        mode:g_warning,
        name:str_systemlog_warning
    },
    {
        mode:g_info,
        name:str_systemlog_info
    },
    {
        mode:g_debug,
        name:str_systemlog_debug
    }
];
var g_modulesList;

var g_cpeType = 1;
var g_logurl;
function initModePage(){
    document.title = str_system_log;
    $(".introduce h1").text(str_system_log);
    $(".introduce p").text(str_system_log_des);
    initPageContent();
    showlevel();
    initConfigLog();
    $("#apply").val(str_config_log).on("click",function(){
        configLog();
    });
    $("#export").val(str_export_log).on("click",function(){
        exportLog();
    });
}
function initPageContent(){
    var tr = "<tr><td><input type='checkbox' class='checkbox-status' name='module' value='%f'/>%d" + common_colon + "</td><td><select name='level' id='%s' class='select-status'></select></td></tr>";
    var html = "";
    var len = g_module.length;
    for(var i = 0;i < len; i++){
        html += tr;
        html = html.replace("%s",g_module[i].module + "log").replace("%f",g_module[i].module).replace("%d",g_module[i].str);
    }
    $("#logContent").html(html);
}
function showlevel(){
    var option = "<option value='%s'>%d</option>";
    var html = "";
    var len = g_level.length;
    for(var i = 0;i < len;i++){
        html += option;
        html = html.replace("%s",g_level[i].mode).replace("%d",g_level[i].name);
    }
    $("#log-info select").html(html);
}
function initConfigLog(){
    getAjaxJsonData("/action/get_trace_info", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            g_modulesList = obj.modulesList;
            $.each(g_modulesList,function(){
                var objs=$(":checkbox[value="+this.module+"]");
                objs.attr("checked","checked");
                $("#"+this.module+"log").val(this.level);

            });
        }
    }, {
        async: false,
        timeout: 1000
    });
}
function configLog(){
    var postdata, $val, $levle;
    var g_modules = [];
    var obj = {};
    stopLogoutTimer();
    var checkArry = document.getElementsByName("module");
    for(var i = 0;i<checkArry.length;i++){
        if(checkArry[i].checked == true){
            var g_moduleObj = {};
            $val = checkArry[i].value;
            $levle = $('#'+$val+"log").val();
            g_moduleObj.module = $val;
            g_moduleObj.level = $levle;
            g_modules.push(g_moduleObj);
        }
    }
    obj.type = g_cpeType;
    obj.modulesList =g_modules;
    postdata = JSON.stringify(obj);
    saveAjaxJsonData("/action/set_trace_info", postdata, function(data){
        var _obj = data;
        if (typeof _obj.retcode === "number" && _obj.retcode === g_resultSuccess) {
            showTipsDialog(common_result, common_success,3000);
        } else {
            startLogoutTimer();
            showResultDialog(common_result, common_failed);
        }
    }, {
        async: false
    });
}
function exportLog(){
    var postdata, obj = {};
    obj.type = g_cpeType;
    postdata = JSON.stringify(obj);
    showWaitingDialog(common_waiting,common_waitingmsg,dialog_align_left);
    saveAjaxJsonData("/action/get_trace_package", postdata, function(data){
        var _obj = data;
        if (typeof _obj.retcode === "number" && _obj.retcode === g_resultSuccess) {
            closeDialog();
            g_logurl = _obj.url;
            window.open(g_logurl);
            /*showConfirmDialog(common_confirm, str_system_reboot_tips1, function(){
                closeDialog();
            },dialog_align_left);*/
        } else {
            closeDialog();	
            startLogoutTimer();
            showResultDialog(common_result, common_failed);
        }
    }, {
        async: false
    });
}