var g_lanNetmask;
var g_lanIpAddress;
var g_dmzDisable = 0;
var g_dmzEnable = 1;
var g_dmzStatus;
var g_dmzAddress;

var g_DmzMode = [
    {
        mode: g_dmzEnable,
        name: common_enable
    },
    {
        mode: g_dmzDisable,
        name: common_disable
    }
];
function getDmzCfgData(){
    getAjaxJsonData("/action/get_dmz_info", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            g_dmzStatus = obj.switch;
            g_dmzAddress = obj.ip;
            if(g_dmzStatus == 0){
                $("#dmzIP").attr("disabled",true);
            }else{
                $("#dmzIP").attr("disabled",false);
            }
            initDmzInfo();
        }
    }, {
        async: false,
        timeout: 1000
    });
    getAjaxJsonData("/action/get_dhcp_cfg", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            g_lanNetmask = obj.netmask;
            g_lanIpAddress = obj.ipaddr;
        }
    }, {
        async: false,
        timeout: 1000
    });
}
function clearError(){
        $("#ipaddrtips").removeClass("error-tips").text("");
        $("#iptips").hide();
}
function saveDmzData(){
    clearError();
    var ret, ip, postdata = {};
    ip =  $("#dmzIP").val();
    ret = isValidIP(ip);
    if (ret === false) {
        $("#ipaddrtips").addClass("error-tips").text(str_dmz_ip_error);
        $("#iptips").show();
        return;
    }
    ret = checkLanIp(ip,g_lanIpAddress,g_lanNetmask);
    if (ret === false) {
        $("#ipaddrtips").addClass("error-tips").text(str_dmz_invalid_ip_gateway);
        $("#iptips").show();
        return;
    }
    ret = isBroadCast(ip, g_lanNetmask);
    if (ret === true) {
        $("#ipaddrtips").addClass("error-tips").text(str_dmz_invalid_ip_broadcast);
        $("#iptips").show();
        return;
    }
    if (ip === g_lanIpAddress) {
        $("#ipaddrtips").addClass("error-tips").text(str_dmz_invalid_ipsame_gateway);
        $("#iptips").show();
        return;
    }
    postdata.switch = $("#dmzstatus").val();
    postdata.ip =ip;
    postdata = JSON.stringify(postdata);
    stopLogoutTimer();
    stopAllTimer();
    saveAjaxJsonData("/action/set_dmz_info", postdata, function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            showResultDialog(common_result, common_success);
        } else {
            showResultDialog(common_result, common_failed, 3000);
        }
    }, {
        async: false,
        timeout: 1000
    });
    startLogoutTimer();
    startAllTimer();
}

function isBroadCast(ipaddr, netmask){
    var ip, mask;
    ip = ip2Number(ipaddr);
    mask = ip2Number(netmask);
    if (((ip&(~mask))===(~mask)) || ((ip&(~mask))===0)){
        return true;
    } else {
        return false;
    }
}

function isValidIP(ip) {
    var ipArr, i, len;
    ipArr = ip.split(".");
    len = ipArr.length;
    if (len !== 4){
        return false;
    }
    for(i = 0; i < len; i++) {
        if (isNaN(ipArr[i]) === true) {
            return false;
        }
        if (ipArr[i].length === 0) {
            return false;
        }
        if (ipArr[i].indexOf(" ") !== -1) {
            return false;
        }
        if(ipArr[i].length > 1 && ipArr[i].indexOf("0")=== 0){
            return false;
        }
    }
    if ((ipArr[0] <= 0 || ipArr[0] == 127 || ipArr[0] > 223) ||
        (ipArr[1] < 0 || ipArr[1] > 255) ||
        (ipArr[2] < 0 || ipArr[2] > 255) ||
        (ipArr[3] < 0 || ipArr[3] > 255))
    {
        return false;
    }
    return true;
}

function ip2Number(ip){
    var num;
    var ipaddr = ip.split(".");
    num = ipaddr[0]<<24 | ipaddr[1]<<16 | ipaddr[2]<<8 | ipaddr[3];
    return num>>>0;
}

function checkLanIp(ip, gateway, mask){
    var ret, ipnum, gatewaynum, masknum;
    ipnum = ip2Number(ip);
    gatewaynum = ip2Number(gateway);
    masknum = ip2Number(mask);
    return ( (ipnum & masknum) === (gatewaynum & masknum));
}

function initDmzInfo(){
    var i, len, $list;
    var option = "<option value=\"%d\">%s</option>";
    var html = "";

    for(i = 0, len = g_DmzMode.length; i < len; i++){
        html += option;
        html = html.replace("%d", g_DmzMode[i].mode);
        html = html.replace("%s", g_DmzMode[i].name);
    }
    $list = $("#dmzstatus");
    $list.html(html);
    $list.val(g_dmzStatus);
   $("#dmzIP").val(g_dmzAddress);
}
function initModePage(){
    document.title = str_leftmenu_ds;
    $(".introduce h1").text(str_dmz);
    $(".introduce p").text(str_dmz_des);
    getDmzCfgData();
    $("#apply").attr("value", common_apply).on("click", saveDmzData);
    $("#dmzstatus").on("change", function(){
        if($("#dmzstatus").val() == 0){
            $("#dmzIP").attr("disabled",true);
        }else{
            $("#dmzIP").attr("disabled",false);
        }
    });
}
