/**
 * Created by Administrator on 2017/8/8.
 */
var g_ethernetModePPPoEHome = 1;
var g_ethernetModeDynamicHome = 2;
var g_ethernetModeStaticHome = 3;
var g_wanConnect = 1;
var g_wanDisconnect = 0
var g_curInternetModeHome=1;
var g_internetModeMobileHome = 4;
var g_dialupConedHome = 100002;
var g_curNetworkTypeHome;
var g_operatorNameHome;
var curviermode=0;
var mode_intenetview=0;
var mode_wifiview=1;
var mode_clientview=2;
var enabled=1;
var disabled=0;
var firstFlag=true;
var firstGetModeFlag = true;
var checklogout=false;
var wifinum=0;
var g_wanStatusInfo = {
    mode: "",
    status: "",
    duration: "",
    ipaddr: "",
    netmask: "",
    gateway: "",
    dns1: "",
    dns2: "",
    macaddr: "",
    uptime:"",
    ipv6:"",
    ipv6dns1:"",
    ipv6dns2:""
};

var g_wifi_24={
    'mode':"",
    'ssidstatus': "",
    'ssid':"",
    'securitymode':"",
    'securitykey':"",
    'freqband':"",
    'bandwidth':"",
    'channel':""
};
var g_wifi_5={
    'mode':"",
    'ssidstatus': "",
    'ssid':"",
    'securitymode':"",
    'securitykey':"",
    'freqband':"",
    'bandwidth':"",
    'channel':""
};
/*var v4network={
    'mac':"",
    'gateway': "",
    'netmask':""
};*/

function initModePage(){
    document.title = menu_main_home;
    initData();
    showview();
    firstFlag=false;
    setTimeout(viewlloop, 3000);
}
function initData(){
    initInternet();
    initWifi();
    initClients();
}

var g_clienthtmlleft = [
    '<tr><td width="100">%index</td><td width="245">%hostname</td><td width="245">%type</td><td width="200">%ip</td></tr>'
];

function showInternet(){
   if (g_curInternetModeHome === g_internetSIM ){
        $("#internetMode").text(str_internetMode_mobile_mode);
        $("#connectMode").parent("tr").show();
        $("#connectMode").text(g_operatorNameHome+"  "+g_curNetworkTypeHome);
    }else{
        $("#internetMode").text(str_internetMode_ethernet_mode);
       $("#connectMode").parent("tr").hide();
       /*if (g_wanStatusInfo.mode === g_ethernetModeDynamicHome) {
           $("#connectMode").text(str_ethernet_dynamic);
       } else if (g_wanStatusInfo.mode === g_ethernetModeStaticHome) {
           $("#connectMode").text(str_ethernet_static);
       } else if (g_wanStatusInfo.mode === g_ethernetModePPPoEHome) {
           $("#connectMode").text(str_ethernet_pppoe);
       } else {
           $("#connectMode").text(common_unknown);
       };*/

    }

    if (g_wanStatusInfo.status === g_wanConnect) {
        $("#networkStatus").text(str_ethernet_status_conned);
        $("#internet_title_auto").text(str_home_internet_part+str_ethernet_status_conned);
    } else if (g_wanStatusInfo.status === g_wanDisconnect) {
        $("#networkStatus").text(str_ethernet_status_disconned);
        $("#internet_title_auto").text(str_home_internet_part+str_ethernet_status_disconned);
    } else {
        $("#networkStatus").text(common_unknown);
        $("#internet_title_auto").text(str_home_internet_part+common_unknown);
    }

   // $("#connectionType").append(g_wanStatusInfo.connectionType);
    if(g_wanStatusInfo.uptime.length>0){
        $("#connectionUptime").text(g_wanStatusInfo.uptime);
    }else{
        $("#connectionUptime").text(common_unknown);
    }
    if(g_wanStatusInfo.macaddr.length>0){
        $("#macAdress").text(g_wanStatusInfo.macaddr);
    }else{
        $("#macAdress").text(common_unknown);
    }
    if(g_wanStatusInfo.ipaddr.length>0){
        $("#ipAddress").text(g_wanStatusInfo.ipaddr);
    }else{
        $("#ipAddress").text(common_unknown);
    }
    if(g_wanStatusInfo.netmask.length>0){
        $("#subnetMask").text(g_wanStatusInfo.netmask);
    }else{
        $("#subnetMask").text(common_unknown);
    }
    if(g_wanStatusInfo.gateway.length>0){
        $("#defaultGateway").text(g_wanStatusInfo.gateway);
    }else{
        $("#defaultGateway").text(common_unknown);
    }
    if(g_wanStatusInfo.dns1.length>0){
        $("#primaryDNS").text(g_wanStatusInfo.dns1);
    }else{
        $("#primaryDNS").text(common_unknown);
    }
   if(g_wanStatusInfo.dns2.length>0){
       $("#secondaryDNS").text(g_wanStatusInfo.dns2);
   }else{
       $("#secondaryDNS").text(common_unknown);
   }
    if(g_wanStatusInfo.ipv6.length>0){
        $("#ipv6Address").text(g_wanStatusInfo.ipv6);
    }else{
        $("#ipv6Address").text(common_unknown);
    }
    if(g_wanStatusInfo.ipv6dns1.length>0){
        $("#ipv6primaryDNS").text(g_wanStatusInfo.ipv6dns1);
    }else{
        $("#ipv6primaryDNS").text(common_unknown);
    }
    if(g_wanStatusInfo.ipv6dns2.length>0){
        $("#ipv6secondaryDNS").text(g_wanStatusInfo.ipv6dns2);
    }else{
        $("#ipv6secondaryDNS").text(common_unknown);
    }
    if(g_ipv6Status == g_ipv6_support){
        $(".ipv6hide").show();
    }else{
        $(".ipv6hide").hide();
    }
}
function getInternetMode(){
    //获取联网类型
    getAjaxJsonData("/goform/get_internet_mode", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            g_curInternetModeHome = obj.mode;
        }
    }, {
        async: false
    });
}
function initInternet(flag){
    if(flag !=checklogout){
        stopLogoutTimer();
        startLogoutTimer();
    }
    g_curInternetModeHome = g_curInternetMode;
    if(firstGetModeFlag == true){
        firstGetModeFlag = false;
        getInternetMode();
    }
    //获取拨号连接状态
    getAjaxJsonData("/action/get_wan_status_info", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            var list = obj.linkList;
            g_wanStatusInfo.status = list[0].status;
            g_wanStatusInfo.mode = list[0].mode;
            g_wanStatusInfo.ipaddr = list[0].ipaddr;
            g_wanStatusInfo.macaddr=list[0].macaddr;
            g_wanStatusInfo.netmask = list[0].netmask;
            g_wanStatusInfo.gateway = list[0].gateway;
            g_wanStatusInfo.dns1 = list[0].dns1;
            g_wanStatusInfo.dns2 = list[0].dns2;
            g_wanStatusInfo.ipv6 = list[0].ipv6;
            g_wanStatusInfo.ipv6dns1 = list[0].ipv6_dns1;
            g_wanStatusInfo.ipv6dns2 = list[0].ipv6_dns2;
            var  timelong=list[0].uptime;
            g_wanStatusInfo.uptime =transformtime(timelong);
        }
    }, {
        async: false,
        timeout: 1000
    });
    if (g_wanStatusInfo.status ===  g_wanConnect) {
        $("#internet_title_auto").text(str_home_internet_part+str_ethernet_status_conned);
        $("#networkStatus").text(str_ethernet_status_conned);
    } else {
        $("#internet_title_auto").text(str_home_internet_part+str_ethernet_status_disconned);
        $("#networkStatus").text(str_ethernet_status_disconned);
    }
    if(g_curInternetModeHome === g_internetSIM) {
        if (g_networkType === g_networkModeNONE){
            g_curNetworkTypeHome = str_home_noservice;
        } else if (g_networkType === g_networkModeCDMA || g_networkType === g_networkModeGSM) {
            g_curNetworkTypeHome = common_2G;
        } else if (g_networkType === g_networkModeEVDO ||
            g_networkType === g_networkModeWCDMA ||
            g_networkType === g_networkModeTDSCDMA)
        {
            g_curNetworkTypeHome = common_3G;
        } else if (g_networkType === g_networkModeLTE) {
            g_curNetworkTypeHome = common_4G;
        } else {
            g_curNetworkTypeHome = common_limited;
        }
    }
    showInternet();
    if(!firstFlag){
        curviermode=0;
        showview();
    }
}
function showWifi(){
    if(g_wifi_24.ssidstatus==enabled) {
        $("#enable24").text(str_enabled);
    }else{
        $("#enable24").text(str_disabled);
    }
    if(g_wifi_24.ssid.length>0){
        $("#ssidname24").text(g_wifi_24.ssid);
    }else{
        $("#ssidname24").text(common_unknown);
    }
    if(g_wifi_24.securitymode == 0){
        $("#password24").text("");
    }else{
        if(g_wifi_24.securitykey.length>0){
            $("#password24").text(password_decode(g_wifi_24.securitykey,g_priKey));
        }else{
            $("#password24").text(common_unknown);
        }
    }
    if(g_wifi_5.ssidstatus==enabled) {
        $("#enable5").text(str_enabled);
    }else{
        $("#enable5").text(str_disabled);
    }
    if(g_wifi_5.ssid.length>0){
        $("#ssidname5").text(g_wifi_5.ssid);
    }else{
        $("#ssidname5").text(common_unknown);
    }
    if(g_wifi_5.securitymode == 0){
        $("#password5").text("");
    }else{
        if(g_wifi_5.securitykey.length>0){
            $("#password5").text(password_decode(g_wifi_5.securitykey,g_priKey));
        }else{
            $("#password5").text(common_unknown);
        }
    }
    if(wifinum==1){
        $(".midDown_i232s tr:gt(3)").remove();
    }
}

function initWifi(flag){
    if(flag !=checklogout){
        stopLogoutTimer();
        startLogoutTimer();
    }
    getAjaxJsonData("/action/get_wifi_info", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            var wifiList=obj.wifiList;
            wifinum=wifiList.length;
            for(var i=0,len=wifiList.length;i<len;i++){
                if(wifiList[i].freqband==0){
                    g_wifi_24.mode=wifiList[i].mode;
                    g_wifi_24.ssidstatus=wifiList[i].ssidstatus;
                    g_wifi_24.ssid=wifiList[i].ssid;
                    g_wifi_24.securitymode=wifiList[i].securitymode;
                    g_wifi_24.securitykey=wifiList[i].securitykey;
                    g_wifi_24.freqband=wifiList[i].freqband;
                    g_wifi_24.bandwidth=wifiList[i].bandwidth;
                    g_wifi_24.channel=wifiList[i].channel;
                }
                else if(wifiList[i].freqband==1) {
                    g_wifi_5.mode=wifiList[i].mode;
                    g_wifi_5.ssidstatus=wifiList[i].ssidstatus;
                    g_wifi_5.ssid=wifiList[i].ssid;
                    g_wifi_5.securitymode=wifiList[i].securitymode;
                    g_wifi_5.securitykey=wifiList[i].securitykey;
                    g_wifi_5.freqband=wifiList[i].freqband;
                    g_wifi_5.bandwidth=wifiList[i].bandwidth;
                    g_wifi_5.channel=wifiList[i].channel;
                }
            }
        }
    }, {
        async: false
    });
    showWifi();
    if(!firstFlag){
        curviermode=1;
        showview();
    }
}

function showClients(g_clientsList){
    var totalhtml="";
    var temphtml="<tr><th>"+str_home_index+"</th><th>"+str_home_hostname+"</th><th>"+str_home_type+"</th><th>"+str_home_ip+"</th></tr>";
    var len = g_clientsList.length;
    for(var i = 0; i < len; i++) {
        var leftclient=g_clienthtmlleft.join("");
        leftclient = leftclient.replace("%index", i+1);
        if(g_clientsList[i].hostname.length>0){
            leftclient = leftclient.replace("%hostname", XSSResolveCannotParseChar(g_clientsList[i].hostname));
        }else{
            leftclient = leftclient.replace("%hostname", common_unknown);
        }
        var typestr = XSSResolveCannotParseChar(g_clientsList[i].type);
        if(g_clientsList[i].type.length>19){
            typestr=typestr.substring(0,16);
            typestr=typestr+'...';
        }
        if(g_clientsList[i].mac.length>0){
            leftclient = leftclient.replace("%type", XSSResolveCannotParseChar(g_clientsList[i].mac));
        }else{
            leftclient = leftclient.replace("%type", common_unknown);
        }
        if(g_clientsList[i].ip.length>0){
            leftclient = leftclient.replace("%ip", XSSResolveCannotParseChar(g_clientsList[i].ip));
        }else{
            leftclient = leftclient.replace("%ip", common_unknown);
        }
        temphtml=temphtml+leftclient;
        if(i+1 == len){
            totalhtml=totalhtml+temphtml;
        }
    }
    $("#clients").html(temphtml);
}

function initClients(flag){
    if(flag !=checklogout){
        stopLogoutTimer();
        startLogoutTimer();
    }
    getAjaxJsonData("/action/get_clients_info", function(obj){
        var status;
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            var len=obj.clientList.length;
            if( len>0){
                $("#clinetnum").text(len);
            }else{
                $("#clinetnum").text(0);
            }
            showClients(obj.clientList);
        }
    }, {
        async: false
    });
    if(!firstFlag){
        curviermode=2;
        showview();
    }
}
function showview(){
    if(curviermode==mode_intenetview){
        $("#internetimg").addClass("midBigOnfocus");
        $("#internetimg img").attr("src","../images/menu_internet_click.png");
        $("#wifiimghome").removeClass("midBigOnfocus");
        $("#wifiimghome img").attr("src","../images/wireless.png");
        $("#clientimg").removeClass("midBigOnfocus");
        $("#clientimg img").attr("src","../images/phone-connection-with-a-boy_v.png");
        $("#internet").show();
        $("#wifi").hide();
        $("#client").hide();
    }
   else if(curviermode==mode_wifiview){
        $("#internetimg").removeClass("midBigOnfocus");
        $("#internetimg img").attr("src","../images/menu_internet.png");
        $("#wifiimghome").addClass("midBigOnfocus");
        $("#wifiimghome img").attr("src","../images/wireless_click.png");
        $("#clientimg").removeClass("midBigOnfocus");
        $("#clientimg img").attr("src","../images/phone-connection-with-a-boy_v.png");
        $("#internet").hide();
        $("#wifi").show();
        $("#client").hide();
    }
    else if(curviermode==mode_clientview){
        $("#internetimg").removeClass("midBigOnfocus");
        $("#internetimg img").attr("src","../images/menu_internet.png");
        $("#wifiimghome").removeClass("midBigOnfocus");
        $("#wifiimghome img").attr("src","../images/wireless.png");
        $("#clientimg").addClass("midBigOnfocus");
        $("#clientimg img").attr("src","../images/phone-connection-with-a-boy_v_click.png");

        $("#internet").hide();
        $("#wifi").hide();
        $("#client").show();
    }
    else{
        $("#internetimg").addClass("midBigOnfocus");
        $("#wifiimghome").removeClass("midBigOnfocus");
        $("#clientimg").removeClass("midBigOnfocus");
        $("#internet").show();
        $("#wifi").hide();
        $("#client").hide();
    }
}
function viewlloop(){
    if(curviermode==mode_intenetview){
       initInternet(checklogout);
    }
    else if(curviermode==mode_wifiview){
       initWifi(checklogout);
    }
    else if(curviermode==mode_clientview){
       initClients(checklogout);
    }
    else{
       initInternet();
    }
    setTimeout(viewlloop, 3000);

}
