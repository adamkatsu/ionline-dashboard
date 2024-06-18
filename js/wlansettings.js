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
// var objData = {};
var preferVals;
var securitymodeVla;
var securitymodeVlas;
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
var psd_value_24;
var psd_value_5;
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

var g_wifi_24={
    'wifimode':"",
    'ssidstatus': "",
    'ssid':"",
    'securitymode':"",
    'securitykey':"",
    'freqband':"",
    'broadcast':""
};
var g_wifi_5={
    'ssidstatus': "",
    'ssid':"",
    'securitymode':"",
    'securitykey':"",
    'freqband':"",
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
                        name: "40MHz"
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
                channel: "0,1,2,3,4,5,6,7,8,9,10,11"
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
                channel: "0,36,40,44,48,149,153,157,161,165"
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
        //$("#prefer").val(g_wifi_24.wifimode);
        if(band == g_wifiBandMode24G){
            $("#status24").html(status_html).val(g_wifi_24.ssidstatus);
            $("#ssidname24").val(g_wifi_24.ssid);
            $("#securitykey24").val(password_decode(g_wifi_24.securitykey,g_priKey));
            psd_value_24 = $("#securitykey24").val();
            $("#securitymode24").html(securitymode_html).val(g_wifi_24.securitymode);
            $("#broadcast24").html(status_html).val(g_wifi_24.broadcast);
        }
        else{
            $("#status5").html(status_html).val(g_wifi_5.ssidstatus);
            $("#ssidname5").val(g_wifi_5.ssid);
            $("#securitykey5").val(password_decode(g_wifi_5.securitykey,g_priKey));
            psd_value_5 = $("#securitykey5").val();
            $("#securitymode5").html(securitymode_html).val(g_wifi_5.securitymode);
            $("#broadcast5").html(status_html).val(g_wifi_5.broadcast);
        }
    }
/*--------------------------kaishi --------------------*/
//wifi密码强度
function primary(){
    $("p.pwdColor span").removeClass("co1,co2,co3");
}
function primaryfive(){
    $("p.pwdColors span").removeClass("co1,co2,co3");
}
function weak(){
    $("span.c1").addClass("co1");
    $("span.c2").removeClass("co2");
    $("span.c3").removeClass("co3");
}
function middle(){
    $("span.c1").addClass("co1");
    $("span.c2").addClass("co2");
    $("span.c3").removeClass("co3");
}
function strong(){
    $("span.c1").addClass("co1");
    $("span.c2").addClass("co2");
    $("span.c3").addClass("co3");
}

function weaks(){
    $("span.weak_c1").addClass("weak_c1");
    $("span.middle_c2").removeClass("middle_co2");
    $("span.powerful_c3").removeClass("powerful_co3");
}
function middles(){
    $("span.weak_c1").addClass("weak_c1");
    $("span.middle_c2").addClass("middle_co2");
    $("span.powerful_c3").removeClass("powerful_co3");
}
function strongs(){
    $("span.weak_c1").addClass("weak_c1");
    $("span.middle_c2").addClass("middle_co2");
    $("span.powerful_c3").addClass("powerful_co3");
}

function checkpwds(obj) {
    let password = $.trim(obj.val());
    // 密码中存在大写字母、小写字母、数字、特殊字符的个数
    let uppercase = /[A-Z]/.test(password);
    let lowercase = /[a-z]/.test(password);
    let digit = /\d/.test(password);
    let special = /[^A-Za-z0-9]/.test(password);
    // 判断密码强度
    let strength = 0;
    if (uppercase) strength++;
    if (lowercase) strength++;
    if (digit) strength++;
    if (special) strength++;
    if(password.length < 1){
        primary();
    }
    if (password.length < 12) {
        weak()
    }
    if(password.length >= 12 && password.length <= 36){
        if (strength === 4) {
            strong();
        } else if (strength >= 2 && strength <= 3) {
            middle();
        } else {
            weak()
        }
    }
}
function checkpwdfive(obj) {
    var txt = $.trim(obj.val());
    let passwordfive = $.trim(obj.val());
    // 密码中存在大写字母、小写字母、数字、特殊字符的个数
    let uppercasefive = /[A-Z]/.test(passwordfive);
    let lowercasefive = /[a-z]/.test(passwordfive);
    let digitfive = /\d/.test(passwordfive);
    let specialfive = /[^A-Za-z0-9]/.test(passwordfive);
    // 判断密码强度
    let strengthfive = 0;
    if (uppercasefive) strengthfive++;
    if (lowercasefive) strengthfive++;
    if (digitfive) strengthfive++;
    if (specialfive) strengthfive++;
    if(passwordfive.length < 1){
        primaryfive();
    }
    if (passwordfive.length < 12) {
        weaks();
    }
    if(passwordfive.length >= 12 && passwordfive.length <= 36){
        if (strengthfive === 4) {
            console.log("密码强度强")
            strongs();
        } else if (strengthfive >= 2 && strengthfive <= 3) {
            console.log("密码强度适中")
            middles();
        } else {
            console.log("密码强度弱")
            weaks();
        }
    }
}

function initPage(){
    initdata(g_wifiBandMode24G,g_wifi_24.mode);
    $("#mode24").on("change", function(){
        initWifiBandwidth(g_wifiBandMode24G,$("#mode24").val(),change_flag);
    });
    //checkBoxTrue();
    $("#securitymode24").on("change", changeSecurityMode24);
    changeSecurityMode24();
    $("#apply5").attr("value", common_apply);
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
        $("#securitymode5").on("change", changeSecurityMode5);
        changeSecurityMode5();
    }
    $("#prefer").click(function () {
        if ($(this).is(":checked")) {
            preferVals = 4;
            $("#wifi5title").hide();
            $("#wifi5g").hide();
            $("#wifi24title").hide();
        } else {
            preferVals = 0;
            $("#wifi5title").show();
            $("#wifi5g").show();
            $("#wifi24title").show();
            $("#ssidname5").val(g_wifi_5.ssid + "_5G");
        }
    });
    $("#apply5").on("mousedown",function(e){
        e.preventDefault();
        // $(".pwdColors").css("display","none");
        // saveWlanAdvanceInfo24();
    });
    $("#apply5").on("click",function(){
        //event.preventDefault();
        $(".pwdColor").addClass("hide");
        saveWlanAdvanceInfo24();
    });
    $("#securitykey24").focus(function () {
        $("#wifi24g .pwdColor").removeClass("hide");
        //$(".pwdColor").css("display","table-row");
    }).blur(function () {
        $("#wifi24g .pwdColor").addClass("hide");
    });
    $("#securitykey5").focus(function () {
        $("#wifi5g .pwdColor").removeClass("hide");
    }).blur(function () {
        $("#wifi5g .pwdColor").addClass("hide");
    });
}

function  initWifiBandchanel(band,width) {

    var option = "<option value=\"%d\">%s</option>";
    var frequency;
    frequency = getWifiFrequency(band);
    var  country = getWifiCountry(band);
    var channel = [];
    $.each(country, function(){
        if ( this.sab=== "US") {
            channel = this.channel.split(",");
        }
    });
    if(band == g_wifiBandMode5G){
        var mode=parseInt($("#mode5").val());
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
        $("#channel5").html(channel_html);
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
    checkpwds($("#securitykey24"));
    checkpwdfive($("#securitykey5"))
    $("input#securitykey24").keyup(function(){
        var txt=$(this).val(); 
        var len=txt.length;
        if(txt=='' || len<6){
            $("label").show();
            $("label").addClass("tips");
        }else {
            $("label").hide();
        }
        checkpwds($(this));
    });
    $("input#securitykey5").keyup(function(){
        var txt=$(this).val(); 
        var len=txt.length;
        if(txt=='' || len<6){
            $("label").show();
            $("label").addClass("tips");
        }else {
            $("label").hide();
        }
        checkpwdfive($(this));
    });
}

function saveWlanAdvanceInfo24(){
    closeDialog();
    clearErrorTips();
    stopLogoutTimer();
    var data;
    var objFiv = {};
    var currentData = {};
    var wifiArr = [];
    data = $("#wifi24g").serializeArray();
    preferVals =  $("#prefer").is(":checked") ? 4 : 0;
    $.each(data, function(key, val){
        if(val.name === "securitykey"){
            objFiv[val.name] = val.value;

        }else{
            objFiv[val.name] =$.trim(val.value);
        }
    });
    ret = checkWifiSSID(objFiv.ssid,g_wifiBandMode24G);
    if (ret === false){
        return;
    }
    objFiv.securitymode = parseInt(objFiv.securitymode);
    if (objFiv.securitymode != g_SSIDSecurityOpen) {
        ret = checkWifiSSIDPassword(objFiv.securitykey,g_wifiBandMode24G);
        if (ret === false) {
            return;
        }
    } else {
        objFiv.securitykey = psd_value_24;
    }
    // objFiv["securitykey"] = password_encode(objFiv["securitykey"],g_priKey,g_timestamp,g_timestamp_start);
    objFiv["band"] = g_wifiBandMode24G;
    objFiv["ssidstatus"] = parseInt(objFiv["ssidstatus"]);
    objFiv["broadcast"] = parseInt(objFiv["broadcast"]);
    objFiv["freqband"] = parseInt(objFiv["freqband"]);
    objFiv["wifimode"] = parseInt(preferVals);
    currentData = JSON.parse(JSON.stringify(objFiv));   
    wifiArr.push(currentData);
    if(preferVals == 0){
        data = $("#wifi5g").serializeArray();
        $.each(data, function(key, val){
            if(val.name === "securitykey"){
                objFiv[val.name] =val.value;
            }else{
                objFiv[val.name] =$.trim(val.value);
            }
        });
        objFiv["band"] = g_wifiBandMode5G;
        objFiv["broadcast"] = parseInt(objFiv["broadcast"]);
        ret = checkWifiSSID(objFiv.ssid,g_wifiBandMode5G);
        if (ret === false){
            return;
        }
        objFiv.securitymode = parseInt(objFiv.securitymode);
        if (objFiv.securitymode != g_SSIDSecurityOpen) {
            ret = checkWifiSSIDPassword(objFiv.securitykey,g_wifiBandMode5G);
            if (ret === false) {
                return;
            }
        } else {
            objFiv.securitykey = psd_value_5;
        }
        objFiv["ssidstatus"] = parseInt(objFiv["ssidstatus"]);
        objFiv["freqband"] = parseInt(objFiv["freqband"]);
        objFiv["wifimode"] = parseInt(preferVals);
        // objFiv["securitykey"] = password_encode(objFiv["securitykey"],g_priKey,g_timestamp,g_timestamp_start);
        currentData = JSON.parse(JSON.stringify(objFiv));
        wifiArr.push(currentData);
    } else {
        currentData = JSON.parse(JSON.stringify(objFiv));
        wifiArr.push(currentData);
        wifiArr[1].band = parseInt(g_wifiBandMode5G);
        wifiArr[1].freqband = parseInt(g_wifiBandMode5G);   
    }
    var string;
    wifipsdLen = wifiArr[0].securitykey.length;
    wifipsdLens = wifiArr[1].securitykey.length;
    wifipsdVla = /\d/.test(wifiArr[0].securitykey) +  /[a-z]/.test(wifiArr[0].securitykey) + /[A-Z]/.test(wifiArr[0].securitykey) + /\W/.test(wifiArr[0].securitykey);
    wifipsdVlas = /\d/.test(wifiArr[1].securitykey) +  /[a-z]/.test(wifiArr[1].securitykey) + /[A-Z]/.test(wifiArr[1].securitykey) + /\W/.test(wifiArr[1].securitykey);
    var ssidstatus24=$("#status24").children("option:selected").val();
    var ssidstatus5=$("#status5").children("option:selected").val();
    var checkboxStatus = $("input[type='checkbox']").prop("checked");
    if (checkboxStatus === true) {
        if(wifiArr[0].securitymode == g_SSIDSecurityOpen){
            string = str_wifi_closure_tips;
        }else if(ssidstatus24 == 0){
            string = str_wifi_closure_tips1;
        }else if((ssidstatus24 != 0)&&(wifiArr[0].securitymode != g_SSIDSecurityOpen)&&(wifipsdLen<12)){
            string = str_wifi_closure_tips2;
        }else{
            string = str_wifi_closure_tips;
        }
    } else  {
        if(wifiArr[0].securitymode == g_SSIDSecurityOpen && wifiArr[1].securitymode == g_SSIDSecurityOpen){
            string = str_wifi_closure_tips;
        }else if(ssidstatus24 == 0 && ssidstatus5 == 0){
            string = str_wifi_closure_tips3;
        }else if( (ssidstatus24 == 0)&&(wifiArr[1].securitymode != g_SSIDSecurityOpen) && ((wifipsdLens >= 12 &&(wifipsdVlas == 4 || wifipsdVlas == 3)))){
            string = str_wifi_closure_tips4;
        }else if( (ssidstatus5 == 0)&&(wifiArr[0].securitymode != g_SSIDSecurityOpen) && ((wifipsdLen >= 12 &&(wifipsdVla == 4 || wifipsdVla == 3)))){
            string = str_wifi_closure_tips5;
        }else if(((ssidstatus24 != 0)&&(wifiArr[0].securitymode != g_SSIDSecurityOpen)&& (wifipsdLen < 12))&&((ssidstatus5 != 0)&&(wifiArr[1].securitymode != g_SSIDSecurityOpen)&& (wifipsdLens < 12))             ){
            string = str_wifi_closure_tips6;
        }else if( ((ssidstatus24 != 0)&&(wifiArr[0].securitymode != g_SSIDSecurityOpen)&&(wifipsdLen < 12)&&((ssidstatus5 != 0)&&(wifiArr[1].securitymode != g_SSIDSecurityOpen)&&(wifipsdLens >= 12 &&(wifipsdVlas == 4 || wifipsdVlas == 3))))             ){
            string = str_wifi_closure_tips7;
        }else if( ((ssidstatus5 != 0)&&(wifiArr[1].securitymode != g_SSIDSecurityOpen)&&(wifipsdLens < 12)&&((ssidstatus24 != 0)&&(wifiArr[0].securitymode != g_SSIDSecurityOpen)&&(wifipsdLen >= 12 &&(wifipsdVla == 4 || wifipsdVla == 3))))               ){
            string = str_wifi_closure_tips8;
        }else if((ssidstatus24 == 0)&&(ssidstatus5 != 0)&&(wifiArr[1].securitymode != g_SSIDSecurityOpen)&& (wifipsdLens< 12)){
            string = str_wifi_closure_tips9;
        }else if((ssidstatus5 == 0)&&(ssidstatus24 != 0)&&(wifiArr[0].securitymode != g_SSIDSecurityOpen)&& (wifipsdLen< 12)){
            string = str_wifi_closure_tips_10;
        }else{
            string = str_wifi_closure_tips
        }
    }
    showConfirmDialog(common_info, string, function(){
        closeDialog();
        string = $("#prefer").is(":checked") ? str_band_settings : str_band_switch;
        showConfirmDialog(common_info, string, function(){
            var objData = {};
            wifiArr[0].securitykey = password_encode(wifiArr[0].securitykey,g_priKey,g_timestamp,g_timestamp_start);
            wifiArr[1].securitykey = password_encode(wifiArr[1].securitykey,g_priKey,g_timestamp,g_timestamp_start);
            objData.basicconflist=wifiArr;
            wlanAdvanceIfConfirm(objData);
        },dialog_align_left)
    },dialog_align_left);
}
function wlanAdvanceIfConfirm(obj){
    closeDialog();
    showWaitingDialogS(common_info, str_wlan_waiting2, SetWirelessInfo(obj),dialog_align_left);
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
    closeDialog();
    postdata = JSON.stringify(obj);
    stopLogoutTimer();
    getxCsrfTokens();
    saveAjaxJsonData("/action/set_basicwifi_conf", postdata, function(data){
        var _obj = data;
        if (typeof _obj.retcode === "number" && _obj.retcode === g_resultSuccess) {
            closeDialog();
            showResultDialog(common_result, common_success, g_waitingTime);
        }else if(typeof _obj.retcode === "number" && _obj.retcode === g_wpsSetErrorCode){
            closeDialog();
            showResultDialog(common_result, str_wlan_wps_set_errorCode23, 2000,dialog_align_left);
        } else {
            closeDialog();
            showResultDialog(common_result, common_failed, g_waitingTime);
        }
    }, {

    });
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
    getAjaxJsonData("/action/get_basicwifi_conf", function (obj) {
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            wifiList = obj.basicconflist;
             wifinum=wifiList.length;
            for (var i = 0, len = wifiList.length; i < len; i++) {
                if (wifiList[i].freqband == g_wifiBandMode24G) {
                    g_wifi_24.wifimode = wifiList[i].wifimode;
                    g_wifi_24.ssidstatus = wifiList[i].ssidstatus;
                    g_wifi_24.ssid = wifiList[i].ssid;
                    g_wifi_24.securitymode = wifiList[i].securitymode;
                    g_wifi_24.securitykey = wifiList[i].securitykey;
                    g_wifi_24.freqband = wifiList[i].freqband;
                    g_wifi_24.broadcast=wifiList[i].broadcast;
                    if (g_wifi_24.wifimode === 4) {
                        $("#prefer").prop("checked",true);
                        $("#wifi5title").hide();
                        $("#wifi5g").hide();
                        $("#wifi24title").hide();
                    } else  {
                        $("#prefer").prop("checked",false);
                        $("#wifi24title").show();
                        $("#wifi24g").show();
                        $("#wifi5title").show();
                    }
                }
                else if (wifiList[i].freqband == g_wifiBandMode5G) {
                    g_wifi_5.ssidstatus = wifiList[i].ssidstatus;
                    g_wifi_5.ssid = wifiList[i].ssid;
                    g_wifi_5.securitymode = wifiList[i].securitymode;
                    g_wifi_5.securitykey = wifiList[i].securitykey;
                    g_wifi_5.freqband = wifiList[i].freqband;
                    g_wifi_5.broadcast=wifiList[i].broadcast;
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
    var reg = /[^ !#$()*?<>+.&%\-\/0-9=@A-Z\[\]^_a-z{}|~]/g;
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
    }
    return true;
}

function checkWifiSSIDPassword(psd,band){
    psd = $.trim(psd);
    var reg = /[^0-9a-fA-F]+/g;
    var num = /\d/.test(psd);
    var small = /[a-z]/.test(psd);
    var big = /[A-Z]/.test(psd);
    var corps = /\W/.test(psd);
    var ret = /[\u4e00-\u9fa5]/g;
    var keylevel = num+small+big+corps;
    clearErrorTips();
    if(band == g_wifiBandMode24G){
            if (psd.length < g_minSSIDPaswordLength || psd.length > g_maxSSIDPasswordLength) {
                $("#securitykey24").focus();
                $("#wpatipstring24").text(str_wlan_basicsettings_psdtips3.replace("%s", g_minSSIDPaswordLength).replace("%e", g_maxSSIDPasswordLength));
                $("#wpatip24").show();
                return false;
            }
            if (psd.length === g_maxSSIDPasswordLength){
                
                if (psd.match(reg)){
                    $("#securitykey24").focus();
                    $("#wpatipstring24").text(str_wlan_basicsettings_psdtips4.replace("%d", g_maxSSIDPasswordLength));
                    $("#wpatip24").show();
                    return false;
                }
            } else {
                if (psd[0] === " ") {
                    $("#securitykey24").focus();
                    $("#wpatipstring24").text(str_wlan_basicsettings_psdtips1);
                    $("#wpatip24").show();
                    return false;
                }

                if(psd.indexOf("O")>=0 || psd.indexOf("I")>=0 || psd.indexOf("l")>=0 || psd.indexOf("0")>=0 ||psd.indexOf("1")>=0){
                    $("#securitykey24").focus();
                    $("#wpatipstring24").text(str_wlan_basicsettings_psdtips2);
                    $("#wpatip24").show();
                    return false;
                }
                if (keylevel < 2) { 
                    $("#securitykey24").focus();
                    $("#wpatipstring24").text(str_wlan_basicsettings_psdtips2);
                    $("#wpatip24").show();
                    return false;
                }
                if(psd.match(ret)){
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
            if (psd.match(reg)) {
                $("#securitykey5").focus();
                $("#wpatipstring5").text(str_wlan_basicsettings_psdtips4.replace("%d", g_maxSSIDPasswordLength));
                $("#wpatip5").show();
                return false;
            }
        } else {
            if (psd[0] === " ") {
                $("#securitykey5").focus();
                $("#wpatipstring5").text(str_wlan_basicsettings_psdtips1);
                $("#wpatip5").show();
                return false;
            }
            if(psd.indexOf("O")>=0 || psd.indexOf("I")>=0 || psd.indexOf("l")>=0 || psd.indexOf("0")>=0 ||psd.indexOf("1")>=0){
                $("#securitykey5").focus();
                $("#wpatipstring5").text(str_wlan_basicsettings_psdtips2);
                $("#wpatip5").show();
                return false;
            }
            if (keylevel < 2) {// || psd.indexOf("O")>=0 || psd.indexOf("I")>=0 || psd.indexOf("l")>=0 || psd.indexOf("0")>0 ||psd.indexOf("1")>=0
                $("#securitykey5").focus();
                $("#wpatipstring5").text(str_wlan_basicsettings_psdtips2);
                $("#wpatip5").show();
                return false;
            }
            if(psd.match(ret)){
                $("#securitykey5").focus();
                $("#wpatipstring5").text(str_wlan_basicsettings_psdtips2);
                $("#wpatip5").show();
                return false;
            }
        }
        return true;
    }
}
function ShowPsw(){
    var biyanjing = document.getElementById("biyanjing");
    var demoInput = document.getElementById("securitykey24");
    if (demoInput.type == "password") {
        demoInput.type = "text";
        biyanjing.src = "../images/yanjing_kai.png";

    }else {
        demoInput.type = "password";
        biyanjing.src = "../images/yanjing_bi.png";
    }
}
function psdshow(){
    var biyanjing = document.getElementById("yanjing_img");
    var demoInput = document.getElementById("securitykey5");
    if (demoInput.type == "password") {
        demoInput.type = "text";
        biyanjing.src = "../images/yanjing_kai.png";

    }else {
        demoInput.type = "password";
        biyanjing.src = "../images/yanjing_bi.png";
    }
}
