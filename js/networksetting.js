/**
 * Created by Administrator on 2017/8/8.
 */
var g_call_status;
var g_in_call = 1;
var g_not_in_call = 0;
var pinStatus;
var g_notVerified = 1;
var g_pinBlocked = 2;

var g_searchNetworkAuto = 0;
var g_searchNetworkManual = 1;
var g_searchNetworkMode = [
    {
        mode: g_searchNetworkAuto,
        name: str_dialup_networkauto
    },
    {
        mode: g_searchNetworkManual,
        name: str_dialup_networkmanual
    }
];
var g_networkModeAuto = 0;
var g_networkMode2G = 3;
var g_networkMode3G = 2;
var g_networkMode4G = 1;
var g_networkMode = [
    {
        mode: g_networkModeAuto,
        name: str_dialup_networkauto
    },
    /*{
        mode: g_networkMode2G,
        name: str_dialup_networkmode2G
    },*/
    {
        mode: g_networkMode3G,
        name: str_dialup_networkmode3G
    },
    {
        mode: g_networkMode4G,
        name: str_dialup_networkmode4G
    }
];
var g_networkBandAuto = 0;
var g_getNetworkListFailed = -1;
var g_getNetworkListMAX = 40;
var g_getNetworkListIdle = 0;
var g_getNetworkListEnd = 2;
var g_getNetworkListPadding = 1;
var g_getNetworkListSuccees = 0;
var g_getNetworkListBusy = 2;

var g_networkNormal = 1;
var g_networkRoaming = 2;

var g_networkRegist = 2;
var g_networkAvailable = 1;
var g_networkForbidden = 3;

var g_registStatusIdle = 0;
var g_registStatusRegisting = 1;
var g_registStatusEnd = 2;
var g_registStatusFailed = -1;
var g_registStatusSuccess = 0;
var g_registStatusBusy = 3;

var g_networkList;

var g_curSearchNetworkMode = g_searchNetworkAuto;
var g_curNetworkMode = g_networkModeAuto;
var g_curNetworkBand = g_networkBandAuto;

function initModePage(){
    document.title = str_leftmenu_mc;
    getSimStatus();
    getProfileInfo();

    initNetworkList();
    initSearchNetworkList();
    $("#networkmode").on("change",function(){
        var val = parseInt($(this).val());
        if(val == g_networkModeAuto){
            $("#networktypetips").hide();
        }else{
            $("#networktypetips").show();
        }
    })

    $("#networkapply").attr("value", common_apply).on("click",saveNetworkData);
    $(".introduce h1").text(str_mobile_connection);
    $(".introduce p").text(str_mobile_connection_des);
    var i, len, html, $newprofile;
    var option = "<option value=\"%d\">%s</option>";

}
function checkCallStatus(){
    getAjaxJsonData("/action/get_voicecall_state", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            g_call_status = obj.voicecall_state;
        }
    }, {
        async: false
    });
}
/*----------------------------profile-------------------------------*/
function getProfileInfo(){
    getAjaxJsonData("/action/get_mobile_network_mode", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            g_curNetworkMode = obj.web_rat;
            g_curSearchNetworkMode = obj.search_mode;
            if(g_curNetworkMode===g_networkModeAuto){
                $("#networktypetips").hide();
            }else{
                $("#networktypetips").show();
            }
        }
    }, {
        async: false
    });
}

/********************  Network  ***********************/
function initNetworkList(){
    var html = "";
    var option = '<option value="%d">%s</option>';
    $.each(g_networkMode, function(){
        html += option;
        html = html.replace("%d", this.mode);
        html = html.replace("%s", this.name);
    });
    $("#networkmode").html(html).val(g_curNetworkMode);
}
function initSearchNetworkList(){
    var html = "";
    var option = '<option value="%d">%s</option>';
    $.each(g_searchNetworkMode, function(){
        html += option;
        html = html.replace("%d", this.mode);
        html = html.replace("%s", this.name);
    });
    $("#networkoperator").html(html).val(g_curSearchNetworkMode);
}


function getSimStatus(){
    getAjaxJsonData("/goform/get_sim_info", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            if (obj.state === g_simStatusNo) {
               showTipsDialog(common_info,str_dialup_no_simtips,redirect,dialog_align_left);
            } else if(obj.state == g_notVerified){
                window.location.replace("pinrequired.html");
            }else if(obj.state == g_pinBlocked){
                window.location.replace("pukrequired.html");
            } else {
            }
        }
    }, {
        async: false
    })
}

function getNetworkList(){
    clearAllsetTimeout();
    getxCsrfTokens();
    getAjaxJsonData("/action/get_mobile_network_list", function(obj){
        var status,result;
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            g_networkList = obj.networkList;
            status = Number(obj.state);
            result = Number(obj.result);
            if (status === g_getNetworkListPadding) {
                setTimeout(getNetworkList, 5000);
            } else if (status == g_getNetworkListEnd) {
                initInfo();
                if(result == g_getNetworkListSuccees){
                    closeDialog();
                    showNetworkListDialog(obj.networkList, registNetwork);
                }else if(result == g_getNetworkListBusy){
                    closeDialog();
                    showResultDialog(common_failed, str_dialup_networktips2, 3000,dialog_align_left);
                }else{
                    closeDialog();
                    showResultDialog(common_failed, str_dialup_networktips1, 3000,dialog_align_left);
                }
            } else {
                closeDialog();
                showResultDialog(common_failed, str_dialup_networktips1, 3000,dialog_align_left);
            }
        }else{
            closeDialog();
            showResultDialog(common_failed, str_dialup_networktips1, 3000,dialog_align_left);
        }
    }, {
        async: false
    });
}
function getRegistResult(){
    getxCsrfTokens();
    getAjaxJsonData("/action/get_mobile_reg_status", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            if(obj.state == g_registStatusRegisting){
                setTimeout(getRegistResult, 4000);
            }else if(obj.state == g_registStatusEnd){
                if(obj.result == g_registStatusSuccess){
                    closeDialog();
                    showResultDialog(common_success, common_success, 3000);
                }else if(obj.result == g_registStatusBusy){
                    closeDialog();
                    showResultDialog(common_failed, str_dialup_networkregisttips1, 3000);
                }else{
                    closeDialog();
                    showResultDialog(common_failed, common_failed, 3000);
                }
            }else{
                closeDialog();
                showResultDialog(common_failed, common_failed, 3000);
            }
        }else{
            closeDialog();
            showResultDialog(common_failed, common_failed, 3000);
        }
    }, {
        async: false
    });
}
function checkRegistStatus(){
    getxCsrfTokens();
	getAjaxJsonData("/action/get_mobile_reg_status", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            if(obj.state == g_registStatusRegisting){
                showResultDialog(common_tip, str_dialup_networkregisttips, 3000,dialog_align_left);
				return;
            }
        }
    }, {
        async: false
    });
}
function registNetwork(){
    checkCallStatus();
    if(g_call_status == g_in_call){
        closeDialog();
        showResultDialog(common_tip,str_dialup_calling_tips,3000,dialog_align_left);
        return false;
    }
	checkRegistStatus();
    var index, data, postdata;
    index = 0;
    data = $("#networkform").serializeArray();
    $.each(data, function(key, val){
        if (val.name === "networklist") {
            index = val.value;
        }
    });
    postdata = g_networkList[index];
    postdata = JSON.stringify(postdata);
    closeDialog();
    startLogoutTimer();
    saveAjaxJsonData("/action/reg_mobile_network", postdata, function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            showWaitingDialog(common_waiting, str_dialup_networkregisttips,dialog_align_left);
            getRegistResult();
        } else {
            showResultDialog(common_failed, common_failed, 3000);
        }
    }, {
        async: false
    });
}
function showNetworkListDialog(networkinfo, callback){
    var i, len, networkarray, style, table;
    var networktable = [
        '<form id="networkform">',
        '<table>',
        '<tbody>',
        '<tr>',
        '<th class="tdwidth40"></th>',
        '<th class="tdwidth80 hide">%roam</th>',
        //'<th class="tdwidth40 hide"></th>',
        '<th class="tdwidth120">%operatorname</th>',
        '<th class="tdwidth60">%rate</th>',
        '<th class="tdwidth100">%status</th>',
        '</tr>',
        '%table',
        '</tbody>',
        '</table>',
        '</form>'].join("");
    var networklist = [
        '<tr class="%class">',
        '<td><input type="radio" name="networklist" value="%d"></td>',
        '<td class="hide">%roam</td>',
        //'<td class="hide">%act</td>',
        '<td>%operatorname</td>',
        '<td>%rate</td>',
        '<td>%status</td>',
        '</tr>'].join("");

    if (Array.isArray(networkinfo)) {
        networkarray = networkinfo;
    } else {
        networkarray = [];
    }

    networktable = networktable.replace("%roam", str_dialup_networkroam);
    networktable = networktable.replace("%operatorname", str_dialup_networkopname);
    networktable = networktable.replace("%rate", str_dialup_networkrate);
    networktable = networktable.replace("%status", str_dialup_networkstatus);
    style = "";
    for(i = 0, len = networkarray.length; i < len; i++) {
        style += networklist;
        style = style.replace("%operatorname", XSSResolveCannotParseChar(networkarray[i].operator_name));
        style = style.replace("%d", i);
        if (i % 2 === 0) {
            style = style.replace("%class", "oddtr");
        } else {
            style = style.replace("%class", "eventr");
        }

        style = style.replace("%roam", XSSResolveCannotParseChar(networkarray[i].plmn));
        //style = style.replace("%act", networkarray[i].network_type);

        if (networkarray[i].network_type === g_networkMode2G) {
            style = style.replace("%rate", "2G");
        } else if (networkarray[i].network_type === g_networkMode3G) {
            style = style.replace("%rate", "3G");
        } else if (networkarray[i].network_type === g_networkMode4G) {
            style = style.replace("%rate", "4G");
        } else {
            style = style.replace("%rate", common_unknown);
        }

        if (networkarray[i].stat === g_networkForbidden) {
            style = style.replace("%status", str_mobileconnection_forbidden);
        } else if (networkarray[i].stat === g_networkAvailable) {
            style = style.replace("%status", str_mobileconnection_allow);
        } else if (networkarray[i].stat === g_networkRegist) {
            style = style.replace("%status", str_mobileconnection_registed);
        } else {
            style = style.replace("%status", common_unknown);
        }
    }
    table = networktable.replace("%table", style);
    showDialog(table);
    $("#diatitle").children().text(str_dialup_networknetworklist);
    $("#diaclose").on("click", closeResultDialog);
    $("#ok-btn").attr("value", str_dialup_networkregist).on("click", callback);
    $("#cancel-btn").attr("value", common_cancel).on("click", closeResultDialog);
}



function saveNetworkData(){
    var obj, _data, postdata;
    checkCallStatus();
    if(g_call_status == g_in_call){
        closeDialog();
        showResultDialog(common_tip,str_dialup_calling_tips,3000,dialog_align_left);
        return false;
    }
    stopLogoutTimer();
    _data = {};
    obj = $("#networkoper").serializeArray();
    $.each(obj, function(){
        _data[this.name] = parseInt(this.value);
    });
	_data.network_band = g_networkBandAuto;
    postdata = JSON.stringify(_data);
    if(_data.search_mode === g_searchNetworkAuto){
        saveAjaxJsonData("/action/set_mobile_network_mode", postdata, function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                showResultDialog(common_success, common_success, 2000);
            } else {
                startLogoutTimer();
                showResultDialog(common_failed, common_failed);
            }
        }, {
            async: false
        });
    }
    else if(_data.search_mode === g_searchNetworkManual){
        showConfirmDialog(common_confirm, str_dialup_search_networktips1, function(){
            saveAjaxJsonData("/action/set_mobile_network_mode", postdata, function(obj){
                if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                    closeDialog();
                    showWaitingDialog(common_waiting, str_dialup_wait_networktips1,dialog_align_left);
                    getNetworkList();
                } else {
                    closeDialog();
                    startLogoutTimer();
                    showResultDialog(common_failed, common_failed);
                }
            }, {
                async: false
            });
        },dialog_align_left);
    }

}
