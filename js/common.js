/**
 * Created by Administrator on 2017/8/16 0016.
 */

var g_resultSuccess = 0;
var g_resultFailed = 1;
var g_globalConfigData;
var g_menuMap;
var g_menuRoute = [];
var g_currentUrl = "";
var g_maxMenuNum = 4;
var g_pageTitle;
var g_ipv6_support = 1;
var g_ipv6_notSupport = 0;
var g_ipv6Status = g_ipv6_notSupport;
var g_ajaxTimeout = 60000;
var g_networkModeNONE = 0;
var g_networkModeCDMA = 1;
var g_networkModeEVDO = 2;
var g_networkModeGSM = 3;
var g_networkModeWCDMA = 4;
var g_networkModeLTE = 5;
var g_networkModeTDSCDMA = 6;
var g_operatorNameHome;
var g_login = 1;
var g_logout = 0;
var g_curLoginStatus = 0;
var g_defaultLang = "";
var g_currentLang = "";
var g_userName = "";
var g_simStatusNo = 0;
var g_simStatusYes = 144;
var g_simstatus_absent = 0;
var g_notVerified = 1;
var g_pinBlocked = 2;
var g_simStatusPINLocked = 1;
var g_simStatusPUKLocked = 2;
var g_networkStatusTimer;
var g_logoutTime = 300000;
var g_logoutTimer;
var g_allTimer = [];
var g_curSimStatus;
var g_curSimImsi;
var g_sigLevel;
var g_roamStatus;
var g_operatorName;
var g_networkType;
var g_curNetworkType;
var g_curNetModeType;
var g_curNetModeType0="0";
var g_curNetModeType2="2G";
var g_curNetModeType3="3G";
var g_curNetModeType4="4G";
var qasyncflag=false;
var g_isCDMA=false;
var g_curWifiStatusOn = 1;
var g_curWifiStatusOff = 0;
var g_curWifiStatus;
var g_dataStatusOn = 1;
var g_dataStatusOff = 0;
var g_curDataStatus = g_dataStatusOff;
var g_internetModeStation = 3;
var g_internetModeMobile = 4;
var g_internetSIM = 1;
var g_internetETH = 2;
var g_internetStation = 4;
var g_curETHStatus = g_internetModeDHCP;
var g_internetModeAuto = 0;
var g_internetModePPPoE = 1;
var g_internetModeDHCP = 2;
var g_internetModeStatic = 3;
var g_internetModeLAN = 4;

var g_newVerisonFound=12;
var g_dialupConed = 100002;
var g_curInternetMode;
var g_getDialStatus = 0;
var dialog_align_left="left";
var g_priKey;
var g_timestamp;
var g_timestamp_start;
var g_simStatus_timeout;
var g_unreadSMS_timeout;
var g_internetStatus_timeout;
var g_diup_timout;
var g_WifiStatus_timout;
var g_psdStatus;




var g_headInfo = [
    
    '<div id="common_header" class="common_header">',
            '<div id="logo" class="logo">',
                '<div class="header-logo_container">',
                    '<img src="../images/logo_black.png">',
                    '<div class="header-action">',
                        '<div class="bt_logout">',
                            '<a id="logout" href="">Logout</a>',
                        '</div>',
                        '<div class="header-action_divider"></div>',
                        '<select class="selectList" id="langid">',
                            '<option value="english" selected>English</option>',
                            '<option value="spanish">Spanish</option>',
                            '<option value="arabic">Arabic</option>',
                        '</select>',
                    '</div>',
                '</div>',
            '</div>',
            '<div class="tool">',
                '<div class="header-tools_container">',
                    '<div class="main-menu">',
                        '<div class="bt_home" id="gotohome">',
                            '<a id="home" href="common/home.html">Home</a>',
                        '</div>',
                        '<div class="bt_shortmessage" id="gotosms">',
                            '<a id="shortmessage" href="html/shortmessage.html">SMS</a>',
                        '</div>',
                        '<div class="bt_settings" id="gotosetting">',
                            '<a id="settings" href="html/deviceinfo.html">Settings</a>',
                        '</div>',
                    '</div>',
                    '<div id="info" class="info">',
                        '<ul class="info_ul">',
                            '<li id="new" class="info-img">',
                                '<img id="newimg" src="../images/new/wireless.svg">',
                            '</li>',
                            '<li id="roam" class="info-img">',
                                '<img id="roamimg" src="../images/new/data_up_down.svg">',
                            '</li>',
                            '<li id="card-status" class="info-img" style="display: none;">',
                                '<img id="cardimg" src="" style="display: none;">',
                            '</li>',
                            '<li id="netmode" class="info-img" style="display: none;">',
                                '<img id="netmodeimg" src="" style="display: none;">',
                            '</li>',
                            '<li id="signal-simg" class="info-img">',
                                '<img id="signalimg" src="../images/new/signal.svg">',
                            '</li>',
                            '<li id="internet-mode" class="info-img" style="display: none;">',
                                '<img id="cradleimg" src="" style="display: none;">',
                            '</li>',
                            '<li id="wifi-status" class="info-img" style="display: none;">',
                                '<img id="wifiimg" src="" style="display: none;">',
                            '</li>',
                            '<li id="sms" class="info-img">',
                                '<img id="smsimg" src="../images/new/message.svg">',
                                '<span id="sms_Num" class="sms_title">2</span>',
                            '</li>',
                        '</ul>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>',
    ];

function transformtime(time) {
    var M, H, D;
    var seconds = time % 60;
    var minutes = parseInt((time / 60) % 60);
    var hours = parseInt(((time / 60) / 60) % 24);
    var days = parseInt(((time / 60) / 60) / 24);
    if(minutes == 0 || minutes == 1){
        M = minutes + str_minute;
    }else{
        M = minutes + str_minutes;
    }
    if(hours == 0 || hours == 1){
        H = hours + str_hour;
    }else{
        H = hours + str_hours;
    }
    if(days == 0 || days == 1){
        D = days + str_day;
    }else{
        D = days + str_days;
    }
    if(days == 0 && hours == 0){
        return M;
    }else if(days == 0){
        return H + M;
    }else{
        return D + H + M;
    }

}
function getCurrentUrl() {
    var url = window.location.pathname;
    var filenameArry = url.split("/");
    var filename = filenameArry[filenameArry.length-1];
    g_currentUrl = filename.split(".")[0];
}
function clickMenuMainRedirect(ev){
    var redirect = false;
    var _ev = ev || event;
    var target = _ev.target || _ev.srcElemnt;
    var id = target.id || $(target).parent().attr("id");

    switch(id) {
        case "settings":
            var dest = $("#" + id).attr("href");
            if (g_curLoginStatus === g_logout){
                window.location.replace("../common/login.html");
                redirect = true;
            } else {
                redirect = true;
            }
            break;
        case "home":
            redirect = true;
            break;
        default:
            redirect =  false;
            break;
    }
    return redirect;
}
function getNewVersionInfo(){
    getAjaxJsonData("/goform/fota_get_versioninfo", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            switch(obj.status){
                case g_newVerisonFound:
                    $("#new").children("img").attr("src", "../images/new.gif");
                    $("#new").attr("title", str_new_vesion);
                    $("#newimg").show();
                    $("#newimg").click(function(){
                        var dest = $(this).attr("href");
                        window.location.replace("upgrade.html");
                    });
                    break;
                default:
                    $("#new").hide();
                    break;
            }

        }
    }, {
        async: false
    });
}

function getInfoSimStatus(){
    getxCsrfTokens();
    getAjaxJsonData("/action/get_mobile_network_info", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            qasyncflag=true;
            g_sigLevel = obj.signal_level;
            g_roamStatus=obj.roam_state;
            g_operatorNameHome = obj.operator_name;
            g_networkType = obj.network_type;
            if (obj.network_type === g_networkModeNONE){
                g_curNetworkType = str_home_noservice;
                g_curNetModeType=g_curNetModeType0;
            } else if (obj.network_type === g_networkModeCDMA || obj.network_type === g_networkModeGSM) {
                g_curNetworkType = common_2G;
                g_curNetModeType=g_curNetModeType2;
            } else if (obj.network_type === g_networkModeEVDO ||
                obj.network_type === g_networkModeWCDMA ||
                obj.network_type === g_networkModeTDSCDMA)
            {
                g_curNetworkType = common_3G;
                g_curNetModeType=g_curNetModeType3;
            } else if (obj.network_type === g_networkModeLTE) {
                g_curNetworkType = common_4G;
                g_curNetModeType=g_curNetModeType4;
            } else {
                g_curNetworkType = common_limited;
                g_curNetModeType=g_curNetModeType0;
            }
        } else{
            g_curNetworkType = common_limited;
            g_curNetModeType=g_curNetModeType0;
            g_sigLevel = 0;
        }
    }, {
        async: false,
        timeout:2000
    });
    getAjaxJsonData("/goform/get_sim_info", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            switch(obj.state){
                case g_simStatusNo:
                    $("#signal-simg").remove();
                    $("#card-status").children("img").attr("src", "../images/card_invalid.png");
                    $("#card-status").attr("title",str_invalid_missing_card);
                    $("#cardimg").show();
                    //$("#signal-simg").remove();
                    $("#roam").hide();
                    break;
                case g_simStatusYes:
                    $("#cardimg").hide();
                    $("#card-status").remove();
                    if(g_sigLevel){
                        var _signal_s = "../images/signal_small_" + g_sigLevel + ".png";
                        $("#signal-simg").attr("title", g_curNetworkType).children("img").attr("src", _signal_s);
                        $("#signalimg").show();
                        if(g_curNetModeType!=g_curNetModeType0){
                            var _netmpde_s = "../images/netmode" + g_curNetModeType + ".png";
                            $("#netmode").children("img").attr("src", _netmpde_s);
                            $("#netmodeimg").show();
                            $("#netmode").show();

                        }

                    }else if(g_curNetworkType == str_home_noservice){
                        $("#signal-simg").attr("title", str_home_noservice).children("img").attr("src", "../images/limited.png");
                        $("#signalimg").show();
                        $("#netmodeimg").hide();
                        $("#netmode").hide();
                    } else{
                        $("#signal-simg").attr("title", common_limited).children("img").attr("src", "../images/limited.png");
                        $("#signalimg").show();
                        $("#netmodeimg").hide();
                        $("#netmode").hide();
                    }
                    if(g_roamStatus != 0 && g_networkType != g_networkModeNONE){
                        $("#roam").attr("title", common_roaming).children("img").attr("src", "../images/roaming.png");
                        $("#roam").show();
                    }
                    else{
                        $("#roam").hide();
                    }
                    break;
                case g_simStatusPINLocked:
                    $("#signal-simg").remove();
                    $("#card-status").children("img").attr("src", "../images/card_invalid.png");
                    $("#card-status").attr("title",str_pin_required);
                    $("#cardimg").show();
                    $("#roam").hide();
                    break;
                case g_simStatusPUKLocked:
                    $("#signal-simg").remove();
                    $("#card-status").children("img").attr("src", "../images/card_invalid.png");
                    $("#card-status").attr("title",str_puk_required);
                    $("#cardimg").show();
                    $("#roam").hide();
                    break;
                default:
                    $("#signal-simg").remove();
                    $("#card-status").children("img").attr("src", "../images/card_invalid.png");
                    $("#card-status").attr("title",str_invalid_missing_card);
                    $("#cardimg").show();
                    $("#roam").hide();
                    break;
            }
        } else{
            $("#signal-simg").remove();
            $("#card-status").children("img").attr("src", "../images/card_invalid.png");
            $("#card-status").attr("title",str_invalid_missing_card);
            $("#cardimg").show();
        }
    }, {
        async: false
    });
    g_simStatus_timeout = setTimeout(getInfoSimStatus,3000);
}
function getUnreadCount() {
    getAjaxJsonData("/action/get_sms_count", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            var inboxUnreadCount = obj.unread_count;
            if(inboxUnreadCount>0){
                $("#sms_Num").text(inboxUnreadCount);
                var  title=str_message_not_read.replace("%d",inboxUnreadCount);
                $("#sms").attr("title", title);
            }
            else {
                $("#sms_Num").text("0");
                $("#sms").attr("title", "");
            }
        }
    }, {
        async: true
    });

    g_unreadSMS_timeout = setTimeout(getUnreadCount,5000);
}
function getInfoWifiStatus(){
    getxCsrfTokens();
    getAjaxJsonData("/goform/get_wifi_status", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            g_curWifiStatus = obj.status;
            switch(obj.status){
                case g_curWifiStatusOn:
                    $("#wifi-status").children("img").attr("src", "../images/wifi_on.png");
                    $("#wifi-status").attr("title", str_wifi_on);
                    $("#wifiimg").show();
                    break;
                case g_curWifiStatusOff:
                    $("#wifi-status").children("img").attr("src", "../images/wifi_off.png");
                    $("#wifi-status").attr("title", str_wifi_off);
                    $("#wifiimg").show();
                    break;
                default:
                    $("#wifi-status").children("img").attr("src", "../images/wifi_off.png");
                    $("#wifi-status").attr("title", str_wifi_off);
                    $("#wifiimg").show();
                    break;
            }
        } else {
            $("#wifi-status").children("img").attr("src", "../images/wifi_off.png");
            $("#wifi-status").attr("title", str_wifi_off);
            $("#wifiimg").show();
        }
    }, {
        async: false
    });
   g_WifiStatus_timout = setTimeout(getInfoWifiStatus,3000);
}
function getInfoInternetStatus(){
    getAjaxJsonData("/goform/get_internet_mode", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            g_curInternetMode = obj.mode;
        } else {
            $("#internet-mode").children("img").attr("src", "../images/ethernet_small_v.png");
            $("#internet-mode").attr("title",common_unknown);
            $("#cradleimg").show();
        }
    }, {
        async: false
    });
   g_internetStatus_timeout = setTimeout(getInfoInternetStatus,3000);
}
function GetdialupStatus(){
    if(g_curInternetMode == g_internetSIM){
        getAjaxJsonData("/action/get_dialup_status", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                g_curDataStatus = obj.status;
                switch(obj.status){
                    case g_dialupConed:
                    case g_dataStatusOn:
                        $("#internet-mode").children("img").attr("src", "../images/data_up_down.png");
                        $("#internet-mode").attr("title",str_header_mobile_connection);
                        $("#cradleimg").show();
                        break;
                    case g_dataStatusOff:
                        $("#internet-mode").children("img").attr("src", "../images/data_disable.png");
                        $("#internet-mode").attr("title",str_header_mobile_disconnection);
                        $("#cradleimg").show();
                        break;
                    default:
                        $("#internet-mode").children("img").attr("src", "../images/data_disable.png");
                        $("#internet-mode").attr("title",str_header_mobile_disconnection);
                        $("#cradleimg").show();
                        break;
                }
            } else{
                $("#internet-mode").children("img").attr("src", "../images/data_disable.png");
                $("#internet-mode").attr("title",str_header_mobile_disconnection);
                $("#cradleimg").show();
            }
        }, {
            async: false
        });
    }else if(g_curInternetMode == g_internetETH){
        $("#internet-mode").children("img").attr("src", "../images/ethernet_small.png");
        $("#internet-mode").attr("title", str_internetMode_ethernet_mode);
        $("#cradleimg").show();
    }
    g_diup_timout = setTimeout(GetdialupStatus,3000)
}
function clearAllsetTimeout(){
    clearTimeout(g_simStatus_timeout);
    clearTimeout(g_unreadSMS_timeout);
    clearTimeout(g_WifiStatus_timout);
    clearTimeout(g_internetStatus_timeout);
    clearTimeout(g_diup_timout);
}
function initInfo() {
    $("#wifiimg").hide();
    $("#cradleimg").hide();
    $("#signalimg").hide();
    $("#netmodeimg").hide();
    $("#netmode").hide();
    $("#cardimg").hide();
    $("#newimg").hide();
    $("#roam").hide();
    getNewVersionInfo();
    getInfoSimStatus();
    getUnreadCount();
    getInfoWifiStatus();
    getInfoInternetStatus();
    GetdialupStatus();
}
function initMenuMain() {
    var head;
    head = g_headInfo.join("");
    $("#header").html(head);
    if (!g_menuMap) {
        return;
    }
    var menuNum = 0;
    if (g_menuMap.home && menuNum < g_maxMenuNum) {
        $(".bt_home").children("a").text(menu_main_home);
        menuNum++;
    } else {
        $(".bt_home").remove();
    }
    if (g_menuMap.settings && menuNum < g_maxMenuNum) {
        $(".bt_settings").children("a").text(menu_main_settings);
        menuNum++;
    } else {
        $(".bt_settings").remove();
    }
    if (g_menuMap.shortmessage && menuNum < g_maxMenuNum) {
        $(".bt_shortmessage").children("a").text(menu_main_sms);
        menuNum++;
    } else {
        $(".bt_shortmessage").remove();
    }
    $(".bt_logout").children("a").text(common_logout);
    $("." + "bt_" + g_menuRoute[0] + " a").addClass("click");
    if(g_menuRoute[0] == "home"){
        $("#gotohome img").attr("src","../images/home_2.png");
        $("#gotosetting img").attr("src","../images/settings_1.png");
    }else if(g_menuRoute[0] == "settings"){
        $("#gotosetting img").attr("src","../images/settings_2.png");
        $("#gotohome img").attr("src","../images/home_1.png");
    }
    $("#gotohome").on("click",function(){
        window.location.replace("../common/home.html");
    });
    $("#gotosetting").on("click",function(){
        window.location.replace("../html/deviceinfo.html");
    });
    $("#gotosms").on("click",function(){
        window.location.replace("../html/shortmessage.html");
    });
    $("#sms").on("click",function(){
        window.location.replace("../html/shortmessage.html");
    });
    $("#common_header").on("click", function(ev){
        return clickMenuMainRedirect(ev);
    });
    $("#logout").on("click", logout);
}
function logout(){
    showConfirmDialog(common_logout, str_logout_tips, do_logout);
}
function do_logout(){
    getAjaxJsonData("/action/logout", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            closeDialog();
            window.location.replace("../common/login.html");
        }
    }, {
        async: false
    });
}
function redirect(){
    setTimeout(goToHome,3000);
}
function goToHome(){
    window.location.replace("../common/home.html")
}
function changeMenuLeftStatus(ev){
    var submenu, _id;
    var _ev = ev || event;
    var target = _ev.target || _ev.srcElemnt;

    _id = $(target).parent().attr("id") || $(target).attr("id");
    if (_id === "menu-left-settings"){
        return;
    }
    if ($("#" + _id).children("a").length > 0) {
        return true;
    }
    submenu = $(this).children("ul").children("li");
    $.each(submenu, function(){
        if ($(this).attr("id") === _id) {
            if ($(this).hasClass("click")) {
                $(this).removeClass("click");
                $(this).children("ul").addClass("hide");
            } else {
                $(this).addClass("click");
                $(this).children("ul").removeClass("hide");
            }
        } else {
            $(this).removeClass("click");
            $(this).children("ul").addClass("hide");
        }
    });
}
function getMenuRoute(menumap){
    var ret = false;
    $.each(menumap, function(key, value){
        if (typeof value === "string") {
            if (value === g_currentUrl) {
                ret = true;
                g_menuRoute.unshift(key);
                return false;
            }
        } else if (typeof value === "object") {
            ret = getMenuRoute(value);
            if (ret) {
                g_menuRoute.unshift(key);
                return false;
            }
        }
    });
    return ret;
}
function getGlobalData(){
    getCurrentUrl();
    getAjaxJsonData("/goform/get_login_info", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            g_curLoginStatus = obj.loginStatus;
			var prikey = obj.priKey;
			g_priKey = prikey.split("x")[0];
			g_timestamp = prikey.split("x")[1];
			var date = new Date();
			g_timestamp_start = parseInt(date.getTime()/1000);
            if (g_curLoginStatus === g_login) {
                g_userName = obj.loginUser;
            } else {
                window.location.replace("../common/login.html");
            }
        } else {
            g_curLoginStatus = g_logout;
        }

    }, {
        async: false,
        timeout: 1000
    });
    getAjaxXMLData("/config/global/config.xml", function(xml){
        g_globalConfigData = xml;
        g_pageTitle = g_globalConfigData.config.title;
        g_maxMenuNum = g_globalConfigData.config.maxnumber_menu;
        g_ipv6Status = g_globalConfigData.config.ipv6;
        g_menuMap = g_globalConfigData.config.menu;
        g_defaultLang = g_globalConfigData.config.default_language;
        g_currentLang = g_defaultLang;
    }, {
        async: false,
        timeout: 1000
    });
    getMenuRoute(g_menuMap);
}
function initMoblienetworkSubmenu(obj){
    if (obj.hasOwnProperty("mobileconnection")) {
        $("#mobileconnection").children("a").text(str_leftmenu_mc);
    } else {
        $("#mobileconnection").remove();
    }
    if (obj.hasOwnProperty("profilemanagement")) {
        $("#profilemanagement").children("a").text(str_leftmenu_pm);
    } else {
        $("#profilemanagement").remove();
    }
    if (obj.hasOwnProperty("networksetting")) {
        $("#networksetting").children("a").text(str_leftmenu_ns);
    } else {
        $("#networksetting").remove();
    }
    if (obj.hasOwnProperty("balancechecker")) {
        $("#balancechecker").children("a").text(str_leftmenu_ussdservice);
    } else {
        $("#balancechecker").remove();
    }
    if (obj.hasOwnProperty("rfparamters")) {
        $("#rfparamters").children("a").text(str_leftmenu_rf);
    } else {
        $("#rfparamters").remove();
    }
}
function initInternetSubmenu(obj){
    if (obj.hasOwnProperty("ethernet")) {
        $("#ethernet").children("a").text(str_leftmenu_ethernet);
    } else {
        $("#ethernet").remove();
    }
    if (obj.hasOwnProperty("dhcp")) {
        $("#dhcp").children("a").text(str_wlan_dhcp);
    } else {
        $("#dhcp").remove();
    }
    /*if (obj.hasOwnProperty("vpn")) {
        $("#vpn").children("a").children("span").text(str_vpn);
    } else {
        $("#vpn").remove();
    }*/

}
function initWirelessSubmenu(obj){
    if (obj.hasOwnProperty("wlansettings")) {
        $("#wlansettings").children("a").text(str_leftmenu_ws);
    } else {
        $("#wlansettings").remove();
    }
    if (obj.hasOwnProperty("wifiadvanced")) {
        $("#wifiadvanced").children("a").text(str_leftmenu_wlanadv);
    } else {
        $("#wifiadvanced").remove();
    }
    if (obj.hasOwnProperty("wps")) {
        $("#wps").children("a").text(str_wireless_wps);
    } else {
        $("#wps").remove();
    }
    if (obj.hasOwnProperty("wlanmacfilter")) {
        $("#wlanmacfilter").children("a").text(str_leftmenu_wmf);
    } else {
        $("#wlanmacfilter").remove();
    }
}
function initVoiceSubmenu(obj){
    if (obj.hasOwnProperty("phonesettings")) {
        $("#phonesettings").children("a").text(str_leftmenu_ps);
    } else {
        $("#phonesettings").remove();
    }
}
function initVoipSubmenu(obj){
if (obj.hasOwnProperty("sipserver")) {
        $("#sipserver").children("a").text(str_sipserver);
    } else {
        $("#sipserver").remove();
    }
    if (obj.hasOwnProperty("sipaccount")) {
        $("#sipaccount").children("a").text(str_sipaccount);
    } else {
        $("#sipaccount").remove();
    }
    if (obj.hasOwnProperty("voipsetting")) {
        $("#voipsetting").children("a").text(str_voip_settings);
    } else {
        $("#voipsetting").remove();
    }
}
function initFeaturesSubmenu(obj){
    if (obj.hasOwnProperty("firewall")) {
        $("#firewall").children("a").text(str_leftmenu_firewall);
    } else {
        $("#firewall").remove();
    }
    if (obj.hasOwnProperty("macfilter")) {
        $("#macfilter").children("a").text(str_leftmenu_mf);
    } else {
        $("#macfilter").remove();
    }
    if (obj.hasOwnProperty("ipfilter")) {
        $("#ipfilter").children("a").text(str_leftmenu_if);
    } else {
        $("#ipfilter").remove();
    }
    if (obj.hasOwnProperty("portforwarding")) {
        $("#portforwarding").children("a").text(str_leftmenu_pf);
    } else {
        $("#portforwarding").remove();
    }
    if (obj.hasOwnProperty("dmzsettings")) {
        $("#dmzsettings").children("a").text(str_leftmenu_ds);
    } else {
        $("#dmzsettings").remove();
    }
    if (obj.hasOwnProperty("pinmanagement")) {
        $("#pinmanagement").children("a").text(str_leftmenu_pinm);
    } else {
        $("#pinmanagement").remove();
    }
    if (obj.hasOwnProperty("diagnosis")) {
        $("#diagnosis").children("a").text(str_diagnosis);
    } else {
        $("#diagnosis").remove();
    }
    if (obj.hasOwnProperty("upnp")) {
        $("#upnp").children("a").text(str_UPNP);
    } else {
        $("#upnp").remove();
    }
}
function initManagementSubmenu(obj){
    if (obj.hasOwnProperty("sntp")) {
        $("#sntp").children("a").text(str_sntp);
    } else {
        $("#sntp").remove();
    }
    if (obj.hasOwnProperty("deviceinfo")) {
        $("#deviceinfo").children("a").text(str_leftmenu_di);
    } else {
        $("#deviceinfo").remove();
    }
    if (obj.hasOwnProperty("statistics")) {
        $("#statistics").children("a").text(str_leftmenu_sta);
    } else {
        $("#statistics").remove();
    }
    if (obj.hasOwnProperty("systemlog")) {
        $("#systemlog").children("a").text(str_system_log);
    } else {
        $("#systemlog").remove();
    }
    if (obj.hasOwnProperty("systemadmin")) {
        $("#systemadmin").children("a").text(str_leftmenu_sa);
    } else {
        $("#systemadmin").remove();
    }
    if (obj.hasOwnProperty("upgrade")) {
        $("#upgrade").children("a").text(str_leftmenu_upgrade);
    } else {
        $("#upgrade").remove();
    }
    if (obj.hasOwnProperty("rebootreset")) {
        $("#rebootreset").children("a").text(str_leftmenu_rr);
    } else {
        $("#rebootreset").remove();
    }
}
function initMenuLeft(){
    var $leftmenu;
    if (!g_menuMap) {
        return;
    }
    $leftmenu = $("#menu-left");
    if ($leftmenu.children().is("#settings")) {
        $leftmenu.load("../html/leftmenu.html #menu-left-settings", function(){
            if (g_menuMap.settings.moblienetwork) {
                $("#label-mobilenetwork").text(str_leftmenu_moblienetwork);
                initMoblienetworkSubmenu(g_menuMap.settings.moblienetwork);
            } else {
                $("#mobilenetwork").remove();
            }
            if (g_menuMap.settings.internet) {
                $("#label-internet").text(str_leftmenu_internet);
                initInternetSubmenu(g_menuMap.settings.internet);
            } else {
                $("#internet").remove();
            }
            if (g_menuMap.settings.wireless) {
                $("#label-wireless").text(str_leftmenu_wireless);
                initWirelessSubmenu(g_menuMap.settings.wireless);
            } else {
                $("#wireless").remove();
            }
            if (g_menuMap.settings.voice) {
                $("#label-voice").text(str_leftmenu_voice);
                initVoiceSubmenu(g_menuMap.settings.voice);
            } else {
                $("#voice").remove();
            }
            if (g_menuMap.settings.voip) {
                $("#label-voip").text(str_voip);
                initVoipSubmenu(g_menuMap.settings.voip);
            } else {
                $("#voip").remove();
            }
            if (g_menuMap.settings.features) {
                $("#label-features").text(str_leftmenu_features);
                initFeaturesSubmenu(g_menuMap.settings.features);
            } else {
                $("#features").remove();
            }
            if (g_menuMap.settings.management) {
                $("#label-management").text(str_leftmenu_management);
                initManagementSubmenu(g_menuMap.settings.management);
            } else {
                $("#management").remove();
            }
            if (g_menuRoute.length === 3) {
                $("#" + g_menuRoute[1] + " " + "ul").removeClass("hide");
                $("#" + g_menuRoute[2]).addClass("click");
            }
            $("#" + g_menuRoute[1]).addClass("click");
            $("#menu-left-settings").on("click", changeMenuLeftStatus);
            $(".submenu-item").on("mouseover", function(){
                $(this).addClass("active");
            }).on("mouseout", function(){
                $(this).removeClass("active");
            });
        });
    }
}
function getPsdStatus(){
    getAjaxJsonData("/goform/get_modify_pwd_status", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            g_psdStatus = obj.modify_state;
            if(g_psdStatus == 0){
                showdefaultPasswordDialog(common_info,str_common_psd_tips,modifyPwd,dialog_align_left)
            }
        }
    }, {
        async: false,
        timeout: 1000
    });
}
function modifyPwd(){
    window.location.replace("../html/checkPassword.html");
}
function initFooter(){
    $("#privacy_policy").remove();
    $("#open_source").remove();
}
function initModePage(){

}
function startLogoutTimer(){
    if (g_curLoginStatus === g_login) {
        if (g_logoutTimer) {
            clearTimeout(g_logoutTimer)
        }
        g_logoutTimer = setTimeout(do_logout, g_logoutTime);
    }
}
function stopLogoutTimer(){
    if (g_logoutTimer) {
        clearTimeout(g_logoutTimer)
    }
}

function stopAllTimer(){
    var i, len;
    if (!Array.isArray(g_allTimer)) {
        return;
    }
    for(i = 0, len = g_allTimer.length; i < len; i++){
        g_allTimer[i].stop();
    }
}
function startAllTimer(){
    var i, len;
    if (!Array.isArray(g_allTimer)) {
        return;
    }
    for(i = 0, len = g_allTimer.length; i < len; i++){
        g_allTimer[i].start();
    }
}

function doIECompatibility(){
    if (!Array.isArray) {
        Array.isArray = function(arg) {
            return Object.prototype.toString.call(arg) === "[object Array]";
        }
    }
}
function keycodes(){
    // 禁止右键
    document.oncontextmenu=function(){
        return false
    };
    document.onkeydown = function(e) {
        e = window.event || e;
        var k = e.keyCode;
        //屏蔽ctrl+u，F12键
        if ((e.ctrlKey == true && k == 85) || k == 123) {
            e.keyCode = 0;
            e.returnValue = false;
            e.cancelBubble = true;
            return false;
        }
    }
}
doIECompatibility();
getGlobalData();
initlanguage();
$(document).ready(function(){
    keycodes();
    getPsdStatus();
    initMenuMain();
    initInfo();
    initLangList(g_langList);
    initMenuLeft();
    initModePage();
    initFooter();
    startLogoutTimer();
});
function XSSResolveCannotParseChar(xmlStr) {
    if(typeof(xmlStr)!='string'){
        return xmlStr;
    }
    if (typeof (xmlStr) != 'undefined' && xmlStr != null && xmlStr != '') {
        return xmlStr.replace(/(\&|\'|\"|\>|\<|\/|\(|\))/g, function($0, $1) {
            return {
                '&': '&amp;',
                "'": '&#39;',
                '"': '&quot;',
                '<': '&lt;',
                '>': '&gt;',
                '/': '&#x2F;',
                '(': '&#40;',
                ')': '&#41;'
            }[$1];
        });
    }
    return '';
}