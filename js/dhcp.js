var g_systemReady = 2;
var g_systemBooting = 1;
var g_systemNormal = 0;
var g_lanDhcpStatusOn = 1;
var g_lanNetmask;
var g_lanIpAddress;
var g_lanDhcpStart;
var g_lanDhcpEnd;
var g_lanIpLeaseTime;
var g_lanDhcpStatus;
var g_systemStatus = g_systemNormal;
var firstFlag = true;
var g_wanGateway;

var g_lanDhcpStatusOff = 0;
var headerInfox;
var g_dhcpMode = [
    {
        mode: g_lanDhcpStatusOn,
        name: common_enable
    },
    {
        mode: g_lanDhcpStatusOff,
        name: common_disable
    }
];
function getLanDhcpData(){
    getAjaxJsonData("/action/get_dhcp_cfg", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            g_lanNetmask = obj.netmask;
            g_lanIpAddress = obj.ipaddr;
            g_lanDhcpStart = obj.startip;
            g_lanDhcpEnd = obj.endip;
            g_lanIpLeaseTime = obj.leasetime;
            g_lanDhcpStatus = obj.status;
        }
    }, {
        async: false,
        timeout: 1000
    });
}
var gateway;
var loginStatus;
function getloginInfo(){
    getAjaxJsonData(window.location.protocol + "//" + gateway + "/goform/get_system_status", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            loginStatus = obj.status;
        } else {

        }

    }, {
        async: false
    });
}
function locationFn(){
    window.location.replace(window.location.protocol + "//" + gateway +"/common/login.html")
}
function updateSystemStatus(){
    clearAllsetTimeout();
    $.ajax({
        type: 'GET',
        url:window.location.protocol + "//" + gateway + "/goform/x_csrf_token",
        async: true,
        error: function() {
            return
        },
        success: function(){
            closeDialog();
            showTipsDialog(common_result, common_success,locationFn,3000);
        }

    });
    setTimeout(updateSystemStatus, 2000);
}
function saveLanDhcpData(){
    var ret, ip, status, leasetime, dhcpstart, dhcpend, ip3, postdata = {};
    getWanStatusInfo();
    ip3 = $("#ipaddr1").text() + "." + $("#ipaddr2").text() + "." + $("#ipaddr3").val();
    ip = ip3 + "." + $("#ipaddr4").val();
    ret = isValidIP(ip);
    if (ret === false) {
        return false;
    }
    ret = checkIPPart3($("#ipaddr3").val());
    if(ret == false){
        return false;
    }
    ret = checkIPPart4($("#ipaddr4").val());
    if(ret == false){
        return false;
    }
    ret = checkLanIp(g_wanGateway, ip, g_lanNetmask);
    if(ret == true && $("#ipaddr3").val() == 255){
        gateway = $("#ipaddr1").text() + "." + $("#ipaddr2").text() + "." + (parseInt($("#ipaddr3").val()) - 1) + "." + $("#ipaddr4").val();
        dhcpstart = $("#ipaddr1").text() + "." + $("#ipaddr2").text() + "." + (parseInt($("#ipaddr3").val()) - 1) + "." + $("#dhcpstart").val();
        dhcpend = $("#ipaddr1").text() + "." + $("#ipaddr2").text() + "." + (parseInt($("#ipaddr3").val()) - 1) + "." + $("#dhcpend").val();
    }else if(ret == true){
        gateway = $("#ipaddr1").text() + "." + $("#ipaddr2").text() + "." + (parseInt($("#ipaddr3").val()) + 1) + "." + $("#ipaddr4").val();
        dhcpstart = $("#ipaddr1").text() + "." + $("#ipaddr2").text() + "." + (parseInt($("#ipaddr3").val()) + 1) + "." + $("#dhcpstart").val();
        dhcpend = $("#ipaddr1").text() + "." + $("#ipaddr2").text() + "." + (parseInt($("#ipaddr3").val()) + 1) + "." + $("#dhcpend").val();
    }else{
        gateway = $("#ipaddr1").text() + "." + $("#ipaddr2").text() + "." + $("#ipaddr3").val() + "." + $("#ipaddr4").val();
        dhcpstart = $("#ipaddr1").text() + "." + $("#ipaddr2").text() + "." + $("#ipaddr3").val() + "." + $("#dhcpstart").val();
        dhcpend = $("#ipaddr1").text() + "." + $("#ipaddr2").text() + "." + $("#ipaddr3").val() + "." + $("#dhcpend").val();
    }
    postdata.ipaddr = gateway;
    ret = isValidIP(dhcpstart);
    if (ret === false) {
        return;
    }
    ret = isBroadCast(dhcpstart, g_lanNetmask);
    if (ret === true) {
        return;
    }
    postdata.startip = dhcpstart;

    ret = isValidIP(dhcpend);
    if (ret === false) {
        return;
    }
    ret = isBroadCast(dhcpend, g_lanNetmask);
    if (ret === true) {
        return;
    }
    postdata.endip = dhcpend;
    leasetime = $("#leasetime").val();
    ret = checkLeaseTime(leasetime);
    if (ret === false) {
        return;
    }
    var ip4int=parseInt($("#ipaddr4").val());
    var ipstartint=parseInt($("#dhcpstart").val());
    var ipendint=parseInt($("#dhcpend").val());
    if( ( ip4int>=ipstartint ) && (ip4int<= ipendint ) ){
        $("#ipaddrtips").addClass("error-tips").text(str_wlan_dhcp_iprangetipswrong);
        $("#iptips").show();
        return false;
    }
    postdata.leasetime = parseInt(leasetime);
    status = parseInt($("#dhcpmode option:selected") .val());
    postdata.status = status;
    postdata.netmask = g_lanNetmask;
    postdata = JSON.stringify(postdata);
    stopLogoutTimer();
    stopAllTimer();
    saveAjaxJsonData("/action/set_dhcp_cfg", postdata, function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            showConfirmRebootDialog(common_confirm,str_wlan_dhcp_successtips_reboot,function(){
                getAjaxJsonData("/action/reboot", function(obj){
                    if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                        if (status === g_lanDhcpStatusOn) {
                            closeDialog();
                            clearAllsetTimeout();
                            showWaitingDialog(common_waiting, str_wlan_dhcp_successtips,dialog_align_left);
                            setTimeout(updateSystemStatus,30000);
                        } else {
                            closeDialog();
                            showWaitingDialog(common_tip, str_wlan_dhcp_tips,dialog_align_left);
                        }
                    }else{
                        showResultDialog(common_result, common_failed);
                    }
                }, {
                });
            },dialog_align_left);

        } else {
            showResultDialog(common_result, common_failed);
            startLogoutTimer();
            startAllTimer();
        }
    }, {
        async: false
    });
}
function initdhcpMode(){
    var i, len, $list;
    var option = "<option value=\"%d\">%s</option>";
    var html = "";

    for(i = 0, len = g_dhcpMode.length; i < len; i++){
        html += option;
        html = html.replace("%d", g_dhcpMode[i].mode);
        html = html.replace("%s", g_dhcpMode[i].name);
    }
    $list = $("#dhcpmode");
    $list.html(html);
    $list.val(g_lanDhcpStatus);
    if (g_lanDhcpStatus === g_lanDhcpStatusOn) {
        $("#ipaddr3").removeAttr("disabled", "disabled");
        $("#ipaddr4").removeAttr("disabled", "disabled");
        $("#dhcpstart").removeAttr("disabled", "disabled");
        $("#dhcpend").removeAttr("disabled", "disabled");
        $("#leasetime").removeAttr("disabled", "disabled");
    } else {
        $("#ipaddr3").attr("disabled", "disabled");
        $("#ipaddr4").attr("disabled", "disabled");
        $("#dhcpstart").attr("disabled", "disabled");
        $("#dhcpend").attr("disabled", "disabled");
        $("#leasetime").attr("disabled", "disabled");
    }
}
function getWanStatusInfo(){
    getAjaxJsonData("/action/get_wan_status_info", function(obj){

        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            g_wanGateway = obj.linkList[0].gateway;
        }
    }, {
        async: false,
        timeout: 1000
    });
}
function checkIPPart3($this){
    var $tips, ipaddr, reg;
    var ipaddr4;
    ipaddr4 = $("#ipaddr4").val();
    reg = /^[0-9]{1,3}$/;
    ipaddr = $("#ipaddr3").val();
    $tips = $("#ipaddrtips");
    if ((isNaN(ipaddr) === true) ||
        (ipaddr.length <= 0) ||
        (ipaddr.indexOf(" ") !== -1))
    {
        $tips.addClass("error-tips").text(str_wlan_dhcp_iprangetip2);
        $("#iptips").show();
        return false;
    }
    if(ipaddr.length > 1 && ipaddr.indexOf("0") == 0){
        $tips.addClass("error-tips").text(str_wlan_dhcp_iprangetip2);
        $("#iptips").show();
        return false;
    }
    if (ipaddr < 0 || ipaddr > 255) {
        $tips.addClass("error-tips").text(str_wlan_dhcp_iprangetip2);
        $("#iptips").show();
        return false;
    }
    if($("#ipaddr4").val() <= 0 || $("#ipaddr4").val() >= 255 || ipaddr4.indexOf("0") == 0){
        $tips.addClass("error-tips").text(str_wlan_dhcp_iprangetip2);
        $("#iptips").show();
        return false;
    }
    if(ipaddr.match(reg) && ipaddr4.match(reg)){
        $tips.removeClass("error-tips");
        $("#iptips").hide();
        return true;
    }else{
        $tips.addClass("error-tips").text(str_wlan_dhcp_iprangetip2);
        $("#iptips").show();
        return false;
    }
    $tips.removeClass("error-tips");
    $("#iptips").hide();
}
function checkIPPart4($this){
    var $tips, ipaddr, reg;
    var ipaddr3;
    ipaddr3 = $("#ipaddr3").val();
    reg = /^[0-9]{1,3}$/;
    ipaddr = $("#ipaddr4").val();
    $tips = $("#ipaddrtips");
    if ((isNaN(ipaddr) === true) ||
        (ipaddr.length <= 0) ||
        (ipaddr.indexOf(" ") !== -1))
    {
        $tips.addClass("error-tips").text(str_wlan_dhcp_iprangetip2);
        $("#iptips").show();
        return false;
    }

    if (ipaddr <= 0 || ipaddr >= 255 || ipaddr.indexOf("0") == 0) {
        $tips.addClass("error-tips").text(str_wlan_dhcp_iprangetip2);
        $("#iptips").show();
        return false;
    }
    if($("#ipaddr3").val() < 0 || $("#ipaddr3").val() > 255){
        $tips.addClass("error-tips").text(str_wlan_dhcp_iprangetip2);
        $("#iptips").show();
        return false;
    }
    if(ipaddr3.length > 1 && ipaddr3.indexOf("0") == 0){
        $tips.addClass("error-tips").text(str_wlan_dhcp_iprangetip2);
        $("#iptips").show();
        return false;
    }
    if(ipaddr.match(reg) && ipaddr3.match(reg)){
        $tips.removeClass("error-tips");
        $("#iptips").hide();
        return true;
    }else{
        $tips.addClass("error-tips").text(str_wlan_dhcp_iprangetip2);
        $("#iptips").show();
        return false;
    }
    $tips.removeClass("error-tips");
    $("#iptips").hide();
}
function checkLeaseTime(time){
    var $tips, reg;
    reg = /^[0-9]{3,6}$/;
    $tips = $("#leasetimetips");
    if(time.indexOf("0") == 0){
        $tips.text(str_wlan_dhcp_leasetimetips1);
        return false;
    }
    /*if ((isNaN(time) === true) ||
        (time.length === 0) ||
        (time.indexOf(" ") !== -1))
    {
        $tips.text(str_wlan_dhcp_leasetimetips);
        return false;
    }*/
    if (time > 604800 || time < 120) {
        $tips.text(str_wlan_dhcp_leasetimetips);
        return false;
    }
    if(time.match(reg)){
        $tips.text("");
        return true;
    }else{
        $tips.text(str_wlan_dhcp_leasetimetips2);
        return false;
    }
    $tips.text("");
    return true;
}
function ip2Number(ip){
    var num;
    var ipaddr = ip.split(".");
    num = ipaddr[0]<<24 | ipaddr[1]<<16 | ipaddr[2]<<8 | ipaddr[3];
    return num>>>0;
}
function checkLanIp(ip, gateway, mask){
    var  ipnum, gatewaynum, masknum;
    ipnum = ip2Number(ip);
    gatewaynum = ip2Number(gateway);
    masknum = ip2Number(mask);
    return ( (ipnum & masknum) === (gatewaynum & masknum));
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
function checkDhcpInput($this){
    var ret, reg, ip, ipaddr, start, end, $tips, tipstr;
    reg = /^[0-9]{1,3}$/;
    $tips = $("#iprangetips");
    ipaddr = $this.val();
    var $start = $("#dhcpstart").val();
    var $end = $("#dhcpend").val();
    if (isNaN(ipaddr) === true) {
        $tips.addClass("error-tips").text(str_wlan_dhcp_iprangetip2);
        return false;
    }
    start = Number($("#dhcpstart").val());
    end = Number($("#dhcpend").val());
    if ((start >= end) || (start > 255 || start < 0) || (end > 255 || end < 0)) {
        $tips.addClass("error-tips").text(str_wlan_dhcp_iprangetip2);
        return false;
    }
    if(ipaddr.indexOf("0") == 0){
        $tips.addClass("error-tips").text(str_wlan_dhcp_iprangetip2);
        return false;
    }
    ip = $("#ipaddr1").text() + "." + $("#ipaddr2").text() + "." + $("#ipaddr3").val();
    start = ip + "." + start;
    end = ip + "." + end;
    ret = isBroadCast(start, g_lanNetmask);
    if (ret) {
        $tips.addClass("error-tips").text(str_wlan_dhcp_iprangetip2);
        return false;
    }
    ret = isBroadCast(end, g_lanNetmask);
    if (ret){
        $tips.addClass("error-tips").text(str_wlan_dhcp_iprangetip2);
        return false;
    }
    if($start.match(reg) && $end.match(reg)){
        tipstr = str_wlan_dhcp_iprangetips.replace("%s", start).replace("%e", end);
        $tips.removeClass("error-tips").text(tipstr);
        return true;
    }else{
        $tips.addClass("error-tips").text(str_wlan_dhcp_iprangetip2);
        return false;
    }
    tipstr = str_wlan_dhcp_iprangetips.replace("%s", start).replace("%e", end);
    $tips.removeClass("error-tips").text(tipstr);
    return true;
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
function initLanDhcpInfo(){
    initdhcpMode();
    var dhcptips;
    var lanip = g_lanIpAddress.split(".");
    $("#ipaddr3").attr("value", lanip[2]);
    $("#ipaddr4").attr("value", lanip[3]);
    $("#ipaddr3").on("keyup", function(){
        var $this = $("#ipaddr3");
        checkIPPart3($this);
    });
    $("#ipaddr4").on("keyup", function(){
        var $this = $("#ipaddr4");
        checkIPPart4($this);
    });

    var landhcpstart = g_lanDhcpStart.split(".");
    $("#dhcpstart").attr("value", landhcpstart[3]);

    var landhcpend = g_lanDhcpEnd.split(".");
    $("#dhcpend").attr("value", landhcpend[3]);

    dhcptips = str_wlan_dhcp_iprangetips.replace("%s", g_lanDhcpStart).replace("%e", g_lanDhcpEnd);
    $("#iprangetips").text(dhcptips);

    $("#leasetime").attr("value", g_lanIpLeaseTime).on("keyup", function(){
        var time = $(this).val();
        checkLeaseTime(time);
    });
    $("#dhcpstart, #dhcpend").on("keyup", function(){
        var $this = $(this);
        checkDhcpInput($this);
    });
}
function initModePage(){
    document.title = str_wlan_dhcp;
    $(".introduce h1").text(str_dhcp);
    $(".introduce p").text(str_dhcp_des);
    getLanDhcpData();
    initLanDhcpInfo();
    $("#dhcpmode").on("change", function(){
        var val = parseInt($(this).val());
        if (val === g_lanDhcpStatusOn) {
            $("#ipaddr3").removeAttr("disabled", "disabled");
            $("#ipaddr4").removeAttr("disabled", "disabled");
            $("#dhcpstart").removeAttr("disabled", "disabled");
            $("#dhcpend").removeAttr("disabled", "disabled");
            $("#leasetime").removeAttr("disabled", "disabled");
        } else {
            $("#ipaddr3").attr("disabled", "disabled");
            $("#ipaddr4").attr("disabled", "disabled");
            $("#dhcpstart").attr("disabled", "disabled");
            $("#dhcpend").attr("disabled", "disabled");
            $("#leasetime").attr("disabled", "disabled");
        }
    });
    $("#apply").attr("value", common_apply).on("click", function(){
        var ret;
        ret = saveLanDhcpData();
        if (ret === false) {
            startLogoutTimer();
        }
    });
}
