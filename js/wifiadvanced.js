/**
 * Created by Administrator on 2021/9/6.
 */
/**
 * Created by Administrator on 2017/8/22.
 */

var g_resultSuccess = 0;
var g_resultFailed = 1;
var g_waitingTime = 3000;
var g_wifiFrequencyMode802b = 0;
var g_wifiFrequencyMode802g = 1;
var g_wifiFrequencyMode802a = 2;
var g_wifiFrequencyMode802n = 4;
//var g_wifiFrequencyMode802bgn = 3;
var g_wifiFrequencyMode802ac = 5;
var g_wifiWidthAuto = 0;
var g_wifiWidth20MHz = 1;
var g_wifiWidth40MHz = 2;
var g_wifiWidth80MHz = 3;
var g_wpsResultProcessing = 1;

var g_Enable=1;
var g_Disable=0;
var g_wifiBandMode24G = 0;
var g_wifiBandMode5G = 1;
var g_minSSIDLength = 1;
var g_maxSSIDLength = 32;
var g_minSSIDPaswordLength = 8;
var g_maxSSIDPasswordLength = 63;
var postdata;
var obj = {};
var g_wpsSetErrorCode=-23;
var change_flag=true;
var wifiList;
var wifinum=0;
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

var g_SSIDSecurity = {
    0: str_wlan_basicsettings_securityopen,
    //2: str_wlan_basicsettings_securitywpa,
    3: str_wlan_basicsettings_securitywpa2,
    4: str_wlan_basicsettings_securitywpa12
};
var g_SSIDSecurityOpen = 0;
var g_SSIDSecurityWep = 1;
var g_SSIDSecurityWpa = 2;
var g_SSIDSecurityWpa2 = 3;
var g_SSIDSecurityWpa12 = 4;

var wifipsdLen;
var wifipsdVla;
var wifipsdLens;
var wifipsdVlas;
var objData = {};
var wifiArr = [];
var g_wifi_24={
    'mode':"",
    'ssidstatus': "",
    'ssid':"",
    'securitymode':"",
    'securitykey':"",
    'freqband':"",
    'bandwidth':"",
    'channel':"",
    'broadcast':""
};
var g_wifi_5={
    'mode':"",
    'ssidstatus': "",
    'ssid':"",
    'securitymode':"",
    'securitykey':"",
    'freqband':"",
    'bandwidth':"",
    'channel':"",
    'broadcast':""
};

var g_wifiBand = [
    {
        band: g_wifiBandMode24G,
        name: "2.4G",
        frequency: [
            {
                fremode: g_wifiFrequencyMode802n,
                frename: "Auto(802.11b/g/n mixed)",
                width: [
                    /*{
                     value: g_wifiWidthAuto,
                     name: g_valueAuto
                     },*/
                    {
                        value: g_wifiWidth40MHz,
                        name: "Auto(20/40MHz)"
                    },
                    {
                        value: g_wifiWidth20MHz,
                        name: "20MHz"
                    }
                ]
            },
            {
                fremode: g_wifiFrequencyMode802g,
                frename: "802.11g only",
                width: [
                    {
                        value: g_wifiWidth20MHz,
                        name: "20MHz"
                    }
                ]
            },
            {
                fremode: g_wifiFrequencyMode802b,
                frename: "802.11b only",
                width: [
                    {
                        value: g_wifiWidth20MHz,
                        name: "20MHz"
                    }
                ]
            }
        ],
        country: [
            {
                sab: "US",
                fullname: common_country_America,
                channel: "0,1,2,3,4,5,6,7,8,9,10,11,12,13"
            }
        ]
    },
    {
        band: g_wifiBandMode5G,
        name: "5G",
        frequency: [
            {
                fremode: g_wifiFrequencyMode802ac,
                frename: "Auto(802.11ac/a/n mixed)",
                width: [
                    /*{
                     value: g_wifiWidthAuto,
                     name: g_valueAuto
                     },*/
                    {
                        value: g_wifiWidth80MHz,
                        name: "80MHz"
                    },
                    {
                        value: g_wifiWidth40MHz,
                        name: "40MHz"
                    },
                    {
                        value: g_wifiWidth20MHz,
                        name: "20MHz"
                    }

                ]
            } ,
            {
                fremode: g_wifiFrequencyMode802n,
                frename: "802.11n only",
                width: [
                    /*{
                     value: g_wifiWidthAuto,
                     name: g_valueAuto
                     },*/
                    {
                        value: g_wifiWidth40MHz,
                        name: "40MHz"
                    },
                    {
                        value: g_wifiWidth20MHz,
                        name: "20MHz"
                    }
                ]
            },
            {
                fremode: g_wifiFrequencyMode802a,
                frename: "802.11a only",
                width: [
                    {
                        value: g_wifiWidth20MHz,
                        name: "20MHz"
                    }
                ]
            }

        ],
        country: [
            {
                sab: "US",
                fullname: common_country_America,
                channel: "0,36,40,44,48,52,56,60,64,100,104,108,112"
            }
        ]
    }
];


function initdata(band,freemod){
    var option = "<option value=\"%d\">%s</option>";
    var status_html = "";
    for(var i= 0,len=g_status.length;i<len;i++){
        status_html += option;
        status_html = status_html.replace("%d", g_status[i].value).replace("%s", g_status[i].name);
    }
    var  securitymode_html = "";
    $.each(g_SSIDSecurity, function(key, val){
        securitymode_html += option;
        securitymode_html = securitymode_html.replace("%d", key);
        securitymode_html = securitymode_html.replace("%s", val);
    });
    var mode_html = "";
    var frequency = getWifiFrequency(band);
    $.each(frequency, function(){
        mode_html += option;
        mode_html = mode_html.replace("%d", this.fremode).replace("%s", this.frename);
    });
    var option = "<option value=\"%d\">%s</option>";
    var country, channel;
    country = getWifiCountry(band);
    channel = [];
    $.each(country, function(){
        if ( this.sab=== "US") {
            channel = this.channel.split(",");
        }
    });
    var channel_html = "";
    $.each(channel, function(){
        channel_html += option;
        if( 0==this ){
            channel_html = channel_html.replace("%d", this).replace("%s", g_valueAuto);
        }
        else{
            channel_html = channel_html.replace("%d", this).replace("%s", this);
        }
    });
    var widths = [];
    $.each(frequency, function(){
        if (freemod=== this.fremode) {
            widths = this.width;
        }
    });
    var widths_html = "";
    $.each(widths, function(){
        widths_html += option;
        widths_html = widths_html.replace("%d", this.value).replace("%s", this.name);
    });
    if(band == g_wifiBandMode24G){
        $("#mode24").html(mode_html).val(g_wifi_24.mode);
        $("#channel24").html(channel_html).val(g_wifi_24.channel);
        $("#bandwidth24").html(widths_html).val(g_wifi_24.bandwidth);
        $("#broadcast24").html(status_html).val(g_wifi_24.broadcast);
    }
    else{
        $("#mode5").html(mode_html).val(g_wifi_5.mode);
        $("#channel5").html(channel_html).val(g_wifi_5.channel);
        if(g_wifi_5.channel==165){
            $("#bandwidth5").html("<option value='1'>20MHz</option>");
            $("#bandwidth5").val(g_wifiWidth20MHz);
        }else{
            $("#bandwidth5").html(widths_html).val(g_wifi_5.bandwidth);
        }

        $("#broadcast5").html(status_html).val(g_wifi_5.broadcast);
    }
}


function initPage(){
    initdata(g_wifiBandMode24G,g_wifi_24.mode);
    $("#mode24").on("change", function(){
        initWifiBandwidth(g_wifiBandMode24G,$("#mode24").val(),change_flag);
    });

    $("#securitymode24").on("change", changeSecurityMode24);
    changeSecurityMode24();
    if(wifinum==2){
        initdata(g_wifiBandMode5G,g_wifi_5.mode);
        $("#mode5").on("change", function(){
            initWifiBandwidth(g_wifiBandMode5G,$("#mode5").val(),change_flag);
        });
        $("#channel5").on("change", function(){
            var channel = parseInt($("#channel5").val());
            var option = "<option value=\"%d\">%s</option>";
            var _html = "";
            if(channel==165){
                _html += option;
                _html = _html.replace("%d", g_wifiWidth20MHz).replace("%s", "20MHz");
                $("#bandwidth5").html(_html);
                $("#bandwidth5").val(g_wifiWidth20MHz);
            }
            else{
                var frequency, width, _html;
                frequency = getWifiFrequency(g_wifiBandMode5G);
                var mode=parseInt($("#mode5").val());
                $.each(frequency, function(){
                    if (mode === this.fremode) {
                        width = this.width;
                    }
                });
                _html = "";
                $.each(width, function(){
                    _html += option;
                    _html = _html.replace("%d", this.value).replace("%s", this.name);
                });
                $("#bandwidth5").html(_html);
            }
        });
        $("#apply5").attr("value", common_apply).on("click", saveWlanAdvanceInfo24);
        $("#securitymode5").on("change", changeSecurityMode5);
        changeSecurityMode5();
    }

}
function changeSecurityMode24(){
    var val = parseInt($("#securitymode24").val());
    if (val === g_SSIDSecurityOpen) {
        $("#securitymodetips24").text(str_wlan_basicsettings_opentips).parent().show();
        $("#securitykey24").parent().parent().hide();

    } else  {
        $("#securitymodetips24").text("").parent().hide();
        $("#securitykey24").parent().parent().show();
    }
}
function changeSecurityMode5(){
    var val = parseInt($("#securitymode5").val());
    if (val === g_SSIDSecurityOpen) {
        $("#securitymodetips5").text(str_wlan_basicsettings_opentips).parent().show();
        $("#securitykey5").parent().parent().hide();

    } else  {
        $("#securitymodetips5").text("").parent().hide();
        $("#securitykey5").parent().parent().show();
    }
}
function initModePage(){
    document.title = str_leftmenu_ws;
    checkWPSStatus();
    $(".introduce h1").text(str_wireless);
    $(".introduce p").text(str_wireless_des);
    getWifiInfo();
}

function saveWlanAdvanceInfo24(){
    clearErrorTips();
    var data;
    var objFiv = {};
    stopLogoutTimer();
    data = $("#wifi24gfive").serializeArray();
    $.each(data, function(key, val){
        objFiv[val.name] =$.trim(val.value);
    });

    objFiv["band"] = parseInt(objFiv["band"]);
    objFiv["mode"] = parseInt(objFiv["mode"]);
    objFiv["bandwidth"] = parseInt(objFiv["bandwidth"]);
    objFiv["channel"] = parseInt(objFiv["channel"]);
    wifiArr.push(objFiv);
    data = $("#wifi5gfive").serializeArray();
    $.each(data, function(key, val){
        obj[val.name] =$.trim(val.value);
    });
    obj["band"] = parseInt(obj["band"]);
    obj["mode"] = parseInt(obj["mode"]);
    obj["bandwidth"] = parseInt(obj["bandwidth"]);
    obj["channel"] = parseInt(obj["channel"]);
    wifiArr.push(obj);
    objData.advconflist=wifiArr;
    wlanAdvanceIfConfirm(objData)
}
function wlanAdvanceIfConfirm(obj){
    showConfirmDialog(common_info, str_wlan_warn, function(){
        closeDialog();
        showWaitingDialogS(common_info,str_wlan_waiting2, SetWirelessInfo(obj),dialog_align_left);
    },dialog_align_left);
}




function initWifiBandwidth(band,val,flag){
    var option = "<option value=\"%d\">%s</option>";
    var frequency, width, _html;
    frequency = getWifiFrequency(band);

    width = [];
    $.each(frequency, function(){
        if (parseInt(val) === this.fremode) {
            width = this.width;
        }
    });
    _html = "";
    $.each(width, function(){
        _html += option;
        _html = _html.replace("%d", this.value).replace("%s", this.name);
    });
    if(band == g_wifiBandMode24G){
        if(flag===change_flag){
            $("#bandwidth24").html(_html);
        }else{
            $("#bandwidth24").html(_html).val(g_wifi_24.bandwidth);
        }
    }
    else{
        if(flag===change_flag) {
            $("#bandwidth5").html(_html);
            var channel = parseInt($("#channel5").val());
            if(channel==165){
                var option = "<option value=\"%d\">%s</option>";
                var _html = "";
                _html += option;
                _html = _html.replace("%d", g_wifiWidth20MHz).replace("%s", "20MHz");
                $("#bandwidth5").html(_html);
                $("#bandwidth5").val(g_wifiWidth20MHz);
            }
        }else{
            $("#bandwidth5").html(_html).val(g_wifi_5.bandwidth);
        }
    }
}

function SetWirelessInfo(obj){
    postdata = JSON.stringify(obj);
    stopLogoutTimer();
    saveAjaxJsonData("/action/set_advancedwifi_conf", postdata, function(data){
        var _obj = data;
        if (typeof _obj.retcode === "number" && _obj.retcode === g_resultSuccess) {
            closeDialog();
            showResultDialog(common_result, common_success, g_waitingTime);
        }else if(typeof _obj.retcode === "number" && _obj.retcode === g_wpsSetErrorCode){
            showResultDialog(common_result, str_wlan_wps_set_errorCode23, 2000,dialog_align_left);
        } else {
            closeDialog();
            showResultDialog(common_result, common_failed, g_waitingTime);
        }
    }, {

    });
}
function wlanAdvanceIfConfirm24(){
    closeDialog();
    var ssidstatus24=$("#status24").children("option:selected").val();
    if(g_wifi_24.ssidstatus==g_Enable && ssidstatus24==g_wifi_24.ssidstatus){
        showWaitingDialog(common_waiting, str_wlan_waiting1,dialog_align_left);
    }else if(g_wifi_24.ssidstatus==g_Disable && ssidstatus24==g_Enable){
        showWaitingDialog(common_waiting, str_wlan_waiting1,dialog_align_left);
    }else{
        showWaitingDialog(common_waiting, str_wlan_waiting,dialog_align_left);
    }
    SetWirelessInfo(obj);
}
function wlanAdvanceIfConfirm5(){
    closeDialog();
    var ssidstatus5=$("#status5").children("option:selected").val();
    if(g_wifi_5.ssidstatus==g_Enable && ssidstatus5==g_wifi_5.ssidstatus){
        showWaitingDialog(common_waiting, str_wlan_waiting1,dialog_align_left);
    }else if(g_wifi_5.ssidstatus==g_Disable && ssidstatus5==g_Enable){
        showWaitingDialog(common_waiting, str_wlan_waiting1,dialog_align_left);
    }else{
        showWaitingDialog(common_waiting, str_wlan_waiting,dialog_align_left);
    }
    SetWirelessInfo(obj);
}

function getWifiFrequency(band){
    var frequency;
    frequency = [];
    $.each(g_wifiBand, function(){
        if (this.band === band) {
            frequency = this.frequency;
        }
    });
    return frequency;
}

function getWifiCountry(band){
    var country;
    country = [];
    $.each(g_wifiBand, function(){
        if (this.band === band) {
            country = this.country;
        }
    });
    return country;
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
    getAjaxJsonData("/action/get_advancedwifi_conf", function (obj) {
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            wifiList = obj.advconflist;
            wifinum=wifiList.length;
            for (var i = 0, len = wifiList.length; i < len; i++) {
                if (wifiList[i].band == g_wifiBandMode24G) {
                    g_wifi_24.mode = wifiList[i].mode;
                    g_wifi_24.bandwidth = wifiList[i].bandwidth;
                    g_wifi_24.channel = wifiList[i].channel;
                }
                else if (wifiList[i].band == g_wifiBandMode5G) {
                    g_wifi_5.mode = wifiList[i].mode;
                    g_wifi_5.bandwidth = wifiList[i].bandwidth;
                    g_wifi_5.channel = wifiList[i].channel;
                }
            }
            initPage();
        }
    }, {
        async: false
    });
}
function clearErrorTips(){
    $("#ssidtip24").hide();
    $("#ssidtipstring24").text("");
    $("#wpatip24").hide();
    $("#wpatipstring24").text("");

    $("#ssidtip5").hide();
    $("#ssidtipstring5").text("");
    $("#wpatip5").hide();
    $("#wpatipstring5").text("");
}
function checkWifiSSID(ssid,band){
    //var reg = /[,":;\\&%+'<>?]+/g;
    var reg = /[^ !#$()*?<>+'.&%\-\/0-9=@A-Z\[\]^_a-z{}|~]/g;
    clearErrorTips();
    if(band == g_wifiBandMode24G){
        if (ssid[0] === " ") {
            $("#ssidname24").focus();
            $("#ssidtipstring24").text(str_wlan_basicsettings_ssidtips1);
            $("#ssidtip24").show();
            return false;
        }
        if (ssid.match(reg)){
            $("#ssidname24").focus();
            $("#ssidtipstring24").text(str_wlan_basicsettings_ssidtips2);
            $("#ssidtip24").show();
            return false;
        }
        if (ssid.length < g_minSSIDLength || ssid.length > g_maxSSIDLength) {
            $("#ssidname24").focus();
            $("#ssidtipstring24").text(str_wlan_basicsettings_ssidtips3.replace("%s", g_minSSIDLength).replace("%e", g_maxSSIDLength));
            $("#ssidtip24").show();
            return false;
        }
        if(ssid === $("#ssidname5").val()){
            $("#ssidname24").focus();
            $("#ssidtipstring24").text(str_wlan_ssid_name_error);
            $("#ssidtip24").show();
            return false;
        }
    }
    if(band == g_wifiBandMode5G){
        if (ssid[0] === " ") {
            $("#ssidname5").focus();
            $("#ssidtipstring5").text(str_wlan_basicsettings_ssidtips1);
            $("#ssidtip5").show();
            return false;
        }
        if (ssid.match(reg)){
            $("#ssidname5").focus();
            $("#ssidtipstring5").text(str_wlan_basicsettings_ssidtips2);
            $("#ssidtip5").show();
            return false;
        }
        if (ssid.length < g_minSSIDLength || ssid.length > g_maxSSIDLength) {
            $("#ssidname5").focus();
            $("#ssidtipstring5").text(str_wlan_basicsettings_ssidtips3.replace("%s", g_minSSIDLength).replace("%e", g_maxSSIDLength));
            $("#ssidtip5").show();
            return false;
        }
        if(ssid === $("#ssidname24").val()){
            $("#ssidname5").focus();
            $("#ssidtipstring5").text(str_wlan_ssid_name_error);
            $("#ssidtip5").show();
            return false;
        }
    }
    return true;
}

function checkWifiSSIDPassword(psd,band){
    var reg = /[^ !#$()*?<>+'.&%\-\/0-9=@A-Z\[\]^_a-z{}|~]/g;
    clearErrorTips();
    if(band == g_wifiBandMode24G){
        if (psd.length < g_minSSIDPaswordLength || psd.length > g_maxSSIDPasswordLength) {
            $("#securitykey24").focus();
            $("#wpatipstring24").text(str_wlan_basicsettings_psdtips3.replace("%s", g_minSSIDPaswordLength).replace("%e", g_maxSSIDPasswordLength));
            $("#wpatip24").show();
            return false;
        }
        if (psd.length === g_maxSSIDPasswordLength){
            // reg = /[^0-9a-fA-F]+/g;
            if (psd.match(reg)){
                $("#securitykey24").focus();
                $("#wpatipstring24").text(str_wlan_basicsettings_psdtips4.replace("%d", g_maxSSIDPasswordLength));
                $("#wpatip24").show();
                return false;
            }
        } else {
            // reg = /[,":;\\&%+'<>?]+/g;

            if (psd[0] === " ") {
                $("#securitykey24").focus();
                $("#wpatipstring24").text(str_wlan_basicsettings_psdtips1);
                $("#wpatip24").show();
                return false;
            }
            if (psd.match(reg)) {
                $("#securitykey24").focus();
                $("#wpatipstring24").text(str_wlan_basicsettings_psdtips2);
                $("#wpatip24").show();
                return false;
            }
        }
    }
    if(band == g_wifiBandMode5G) {
        if (psd.length < g_minSSIDPaswordLength || psd.length > g_maxSSIDPasswordLength) {
            $("#securitykey5").focus();
            $("#wpatipstring5").text(str_wlan_basicsettings_psdtips3.replace("%s", g_minSSIDPaswordLength).replace("%e", g_maxSSIDPasswordLength));
            $("#wpatip5").show();
            return false;
        }
        if (psd.length === g_maxSSIDPasswordLength) {
            // reg = /[^0-9a-fA-F]+/g;
            if (psd.match(reg)) {
                $("#securitykey5").focus();
                $("#wpatipstring5").text(str_wlan_basicsettings_psdtips4.replace("%d", g_maxSSIDPasswordLength));
                $("#wpatip5").show();
                return false;
            }
        } else {
            //  reg = /[,":;\\&%+'<>?]+/g;
            if (psd[0] === " ") {
                $("#securitykey5").focus();
                $("#wpatipstring5").text(str_wlan_basicsettings_psdtips1);
                $("#wpatip5").show();
                return false;
            }
            if (psd.match(reg)) {
                $("#securitykey5").focus();
                $("#wpatipstring5").text(str_wlan_basicsettings_psdtips2);
                $("#wpatip5").show();
                return false;
            }
        }
        return true;
    }
}

