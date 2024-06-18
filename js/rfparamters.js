var NONE_SRV = 0;
var CDMA_SRV = 1;
var EVDO_SRV = 2;
var GSM_SRV = 3;
var WCDMA_SRV = 4;
var LTE_SRV = 5;
var TDSCDMA_SRV = 6;
var g_setIntervalTime = 3000;
var simStatus;
var g_notVerified = 1;
var g_pinBlocked = 2;
var g_ltestate;
var g_ca_state;
var g_pcc_band;
var g_scc_band_1;
var g_scc_band_2;
var g_rf_pararmters = {
    "mode":"",
    rsrp: "",
    rssi: "",
    rsrq: "",
    sinr: "",
    "pci":""
};
function getSimStatus(){
    getAjaxJsonData("/goform/get_sim_info", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            if (obj.state === g_simStatusNo) {
                showTipsDialog(common_info,str_dialup_no_simtips,redirect,dialog_align_left);
            } else if(obj.state == g_notVerified){
                window.location.replace("pinrequired.html");
            }else if(obj.state == g_pinBlocked){
                window.location.replace("pukrequired.html");
            }else {
            }
        }
    }, {
        async: false
    })
}

function initModePage(){
    document.title = str_leftmenu_di;
    $(".introduce h1").text(str_leftmenu_rf);
    $(".introduce p").text(str_deviceinfo_des);
    getSimStatus();
    showRFParamters();
}
function showRFParamters(){
    getAjaxJsonData("/action/get_signal_info", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            g_rf_pararmters.mode = g_networkType;
            g_rf_pararmters.rsrp = obj.rsrp;
            g_rf_pararmters.rssi = obj.rssi;
            g_rf_pararmters.rsrq = obj.rsrq;
            g_rf_pararmters.sinr = obj.sinr_ex;
            g_rf_pararmters.pci=obj.pci;
        }
    }, {
        async: false
    });
    getAjaxJsonData("/action/get_mobile_network_info", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                g_ltestate = obj.ltestate;
                g_ca_state = obj.ca_state;
                g_pcc_band = obj.pcc_band;
                g_scc_band_1 = obj.scc_band_1;
                g_scc_band_2 = obj.scc_band_2;
                if(g_ltestate == 0){
                    $("#caData").hide();
                }else{
                    $("#caData").show();
                    if(g_ca_state == 0){
                        $("#ca_state").text(str_statistics_rf_status);
                    }else {
                        $("#ca_state").text(str_statistics_rf_s1);
                    }
                    $("#pcc_band").text("B"+g_pcc_band);
                    $("#scc_band_1").text("B"+g_scc_band_1);
                    $("#scc_band_2").text("B"+g_scc_band_2);

                }
        }
    }, {
        async: false
    });



    var tab = $('#rfparam');
    tab.find('tr').remove();
    var rsrp ='<tr><td width="210">'+str_statistics_rf_rsrp+common_colon+'</td> <td>'+ XSSResolveCannotParseChar(g_rf_pararmters.rsrp+str_statistics_rf_dBm)+' </td></tr>';
    var rssi='<tr><td>'+str_statistics_rf_rssi+common_colon+'</td> <td>'+XSSResolveCannotParseChar(g_rf_pararmters.rssi+str_statistics_rf_dBm)+' </td></tr>';
    var rsrq='<tr><td>'+str_statistics_rf_rsrq+common_colon+'</td> <td>'+XSSResolveCannotParseChar(g_rf_pararmters.rsrq+str_statistics_rf_dB)+' </td></tr>';
    var sinr='<tr><td>'+str_statistics_rf_sinr+common_colon+'</td> <td>'+parseFloat(g_rf_pararmters.sinr)+str_statistics_rf_dB+' </td></tr>';
    var pci='<tr><td>'+str_statistics_rf_pci+common_colon+'</td> <td>'+XSSResolveCannotParseChar(g_rf_pararmters.pci)+' </td></tr>';
    switch (g_rf_pararmters.mode){
        case NONE_SRV:
            $("#rfparam").append(rsrp);
            $("#rfparam").append(rssi);
            $("#rfparam").append(rsrq);
            $("#rfparam").append(sinr);
            $("#rfparam").append(pci);
            break;
        case CDMA_SRV:
            $("#rfparam").append(rsrp);
            $("#rfparam").append(rssi);
            $("#rfparam").append(rsrq);
            $("#rfparam").append(sinr);
            $("#rfparam").append(pci);
            break;
        case EVDO_SRV:
            // $("#rfparam").append(rsrp);
            $("#rfparam").append(rssi);
            // $("#rfparam").append(rsrq);
            // $("#rfparam").append(sinr);
            // $("#rfparam").append(pci);
            break;
        case GSM_SRV:
            $("#rfparam").append(rsrp);
            $("#rfparam").append(rssi);
            $("#rfparam").append(rsrq);
            $("#rfparam").append(sinr);
            $("#rfparam").append(pci);
            break;
        case WCDMA_SRV:
            // $("#rfparam").append(rsrp);
            $("#rfparam").append(rssi);
            // $("#rfparam").append(rsrq);
            // $("#rfparam").append(sinr);
            // $("#rfparam").append(pci);
            break;
        case LTE_SRV:
            $("#rfparam").append(rsrp);
            $("#rfparam").append(rssi);
            $("#rfparam").append(rsrq);
            $("#rfparam").append(sinr);
            $("#rfparam").append(pci);
            break;
        case TDSCDMA_SRV:
            // $("#rfparam").append(rsrp);
            $("#rfparam").append(rssi);
            // $("#rfparam").append(rsrq);
            // $("#rfparam").append(sinr);
            // $("#rfparam").append(pci);
            break;
        default :
            $("#rfparam").append(rsrp);
            $("#rfparam").append(rssi);
            $("#rfparam").append(rsrq);
            $("#rfparam").append(sinr);
            $("#rfparam").append(pci);
            break;
    }
    setTimeout(showRFParamters, g_setIntervalTime);
}