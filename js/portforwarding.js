var g_enable = 1;
var g_disable = 0;
var g_protocolTCPUDP = 0;
var g_protocolTCP = 1;
var g_protocolUDP = 2;
var g_ipFilterStatusOn = 1;
var g_ipFilterStatusOff = 0;
var g_max_ip_filter = 16;
var name_minlength=1;
var name_maxlength=31;
var status;    //0:init; 1:edit; 2:ok; 3:add;
var g_curPortForwardingData;

var g_lanNetmask;
var g_lanIpAddress;
var g_protocol = [
    {
        mode: g_protocolTCPUDP,
        name: "TCP/UDP"
    },
    {
        mode: g_protocolTCP,
        name: "TCP"
    },
    {
        mode: g_protocolUDP,
        name: "UDP"
    }
];
var g_status = [
    {
        status: g_ipFilterStatusOn,
        name: common_on
    },
    {
        status: g_ipFilterStatusOff,
        name: common_off
    }
];

var portforwardList = (function(){
    var instances;
    var ipdata;
    var dest;

    var listhead = [
        '<form id="portforwardlistform">',
        //'<h3>%title</h3>',
        '<table id="listtable" cellpadding="0" cellspacing="1" width="650">',
        '<tbody id="listbody">',
        '<tr id="head">',
        '<th width="110">%name</th>',
        '<th width="70">%wanport</th>',
        '<th width="110">%lanip</th>',
        '<th width="70">%lanport</th>',
        '<th width="100">%protocol</th>',
        '<th width="80">%status</th>',
        '<th  width="100">%option</th>',
        '</tr>',
        '%list',
        '</tbody>',
        '</table>',
        '<input id="add" type="button" value="'+common_add+'" class="ipfilterlistadd-btn"/>',
        '</form>'
    ];
    var protocolListStyle = [
        '<select id="protocol">',
        '%list',
        '</select>'
    ];
    var statusListStyle = [
        '<select id="statuslist">',
        '%list',
        '</select>'
    ];
    var normalStyle = [
        '<tr id="row" class="%class">',
        '<td id="name">%name</td>',
        '<td id="wanport">%wanport</td>',
        '<td id="lanip">%lanip</td>',
        '<td id="lanport">%lanport</td>',
        '<td id="protocol">%protocol</td>',
        '<td id="status">%status</td>',
        '<td>',
        '<span id="btn1" class="option-btn">'+common_edit+'</span>',
        '<span id="btn2" class="option-btn">'+common_del+'</span>',
        '</td>',
        '</tr>'
    ];
    var newOrEditStyle = [
        '<tr id="row" class="oddtr">',
        '<td id="name"><input type="text" maxlength="31"/></td>',
        '<td id="wanport"><input type="text"/></td>',
        '<td id="lanip"><input type="text"/></td>',
        '<td id="lanport"><input type="text"/></td>',
        '<td id="protocol">',
        '%protocollist',
        '</td>',
        '<td id="status">',
        '%status',
        '</td>',
        '<td>',
        '<span id="btn1" class="option-btn">'+common_ok+'</span>',
        '<span id="btn2" class="option-btn">'+common_cancel+'</span>',
        '</td>',
        '</tr>'
    ];
    function Create(id){
        var i, len, html, option = '<option value="%d">%s</option>';

        html = '';
        for(i = 0, len = g_status.length; i < len; i++){
            html += option;
            html = html.replace("%d", g_status[i].status);
            html = html.replace("%s", g_status[i].name);
        }
        statusListStyle = statusListStyle.join("").replace("%list", html);

        html = '';
        for(i = 0, len = g_protocol.length; i < len; i++){
            html += option;
            html = html.replace("%d", g_protocol[i].mode);
            html = html.replace("%s", g_protocol[i].name);
        }
        protocolListStyle = protocolListStyle.join("").replace("%list", html);
        dest = id || "";
        this.init = init;
    }

    function init(data){
        status = 0;
        ipdata = data;

        show(ipdata);
    }
    function show(data){
        var i, len, row, allrow, head, $ipfilterlist;

        $ipfilterlist = $("#" + dest);
        $ipfilterlist.empty();
        head = listhead.join("");
        //head = head.replace("%title", str_security_lanipfilter_filterlist);
        head = head.replace("%name", str_security_portforwarding_name);
        head = head.replace("%wanport", str_security_portforwarding_wanport);
        head = head.replace("%lanip", str_security_portforwarding_lanipaddr);
        head = head.replace("%lanport", str_security_portforwarding_lanport);
        head = head.replace("%protocol", str_security_portforwardingr_protocol);
        head = head.replace("%status", common_status);
        head = head.replace("%option", str_security_portforwarding_options);

        row = "";
        allrow = "";
        for(i = 0, len = data.length; i < len; i++){
            row = normalStyle.join("");
            row = row.replace("%name",XSSResolveCannotParseChar(data[i].name));
            row = row.replace("%wanport", XSSResolveCannotParseChar(data[i].wanport));
            row = row.replace("%lanip", XSSResolveCannotParseChar(data[i].lanip));
            row = row.replace("%lanport", XSSResolveCannotParseChar(data[i].lanport));
            row = row.replace("%protocol", XSSResolveCannotParseChar(data[i].protocol));
            row = row.replace("%status", XSSResolveCannotParseChar(data[i].switch));

            row = row.replace("name", "name" + (i + 1));
            row = row.replace("wanport", "wanport" + (i + 1));
            row = row.replace("lanip", "lanip" + (i + 1));
            row = row.replace("lanport", "lanport" + (i + 1));
            row = row.replace("protocol", "protocol" + (i + 1));
            row = row.replace("status", "status" + (i + 1));
            row = row.replace("btn1", "Edit" + (i + 1));
            row = row.replace("btn2", "Delete" + (i + 1));
            row = row.replace("row", "row" + (i + 1));

            if ( (i + 1) % 2 === 1) {
                row = row.replace("%class", "oddtr");
            } else {
                row = row.replace("%class", "eventr");
            }
            allrow += row;
        }
        head = head.replace("%list", allrow);
        $ipfilterlist.html(head);
        $("#portforwardlistform").on("click", function(ev){
            stopLogoutTimer();
            operator(ev);
            startLogoutTimer();
        });
    }
    function fire(index){
        var item;

        if (status != 1 && status != 3) {
            return;
        }
        item = getIpfilterItem(index);
        for(i = 0, len = ipdata.length; i < len; i++) {
            if( (item.wanport==ipdata[i].wanport) && (item.protocol== ipdata[i].protocol) ){
                $(".errortips").remove();
                tips = '<tr class="errortips"><td colspan="7">%tips</td></tr>';
                tips = tips.replace("%tips", str_security_laniprule_exist);
                $("#listbody").append(tips);
                return;
            }
        }
        if (item){
            status = 0;
            ipdata.push(item);
            show(ipdata);
        }

    }

    function edit(index){
        var value, $name, $wanport, $lanip, $lanport, $protocol, $status, $edit, $delete;

        if (status !=0) {
            return;
        }
        status = 1;

        $name = $("#name" + index);
        value = $name.text();
        $name.html('<input type="text" maxlength="31"/>').children("input").val(value);
        $wanport = $("#wanport" + index);
        value = $wanport.text();
        $wanport.html('<input type="text"/>').children("input").val(value);

        $lanip = $("#lanip" + index);
        value = $lanip.text();
        $lanip.html('<input type="text"/>').children("input").val(value).focus();

        $lanport = $("#lanport" + index);
        value = $lanport.text();
        $lanport.html('<input type="text"/>').children("input").val(value);

        $protocol = $("#protocol" + index);
        value = $protocol.text();
        $.each(g_protocol, function(){
            if (value === this.name){
                value = this.mode;
            }
        });
        $protocol.html(protocolListStyle).children("select").val(value);

        $status = $("#status" + index);
        value = $status.text();
        $.each(g_status, function(){
            if (value === this.name){
                value = this.status;
            }
        });
        $status.html(statusListStyle).children("select").val(value);

        $edit = $("#Edit" + index);
        $edit.text(common_ok).attr("id", "modify" + index);

        $delete = $("#Delete" + index);
        $delete.text(common_cancel).attr("id", "Cancel" + index);
    }
    function modify(index){
        var item;

        item = getIpfilterItem(index);
        for(i = 0, len = ipdata.length; i < len; i++) {
            if(index!=(i+1)){
                if( (item.wanPort==ipdata[i].wanport) && (item.protocol== ipdata[i].protocol) ){
                    $(".errortips").remove();
                    tips = '<tr class="errortips"><td colspan="7">%tips</td></tr>';
                    tips = tips.replace("%tips", str_security_laniprule_exist);
                    $("#listbody").append(tips);
                    return false;
                }
            }
        }
        if (item){
            status = 0;
            ipdata.splice(index - 1, 1, item);
            show(ipdata);
        }
    }

    function add(){
        var newlist, index, $row;

        if (status != 0) {
            return;
        }
        status = 3;
        index = ipdata.length + 1;
        newlist = newOrEditStyle.join("").replace("%protocollist", protocolListStyle).replace("%status", statusListStyle);
        newlist = newlist.replace("name", "name" + index);
        newlist = newlist.replace("wanport", "wanport" + index);
        newlist = newlist.replace("lanip", "lanip" + index);
        newlist = newlist.replace("lanport", "lanport" + index);
        newlist = newlist.replace("protocol", "protocol" + index);
        newlist = newlist.replace("protocollist", "protocollist" + index);
        newlist = newlist.replace("status", "status" + index);
        newlist = newlist.replace("statuslist", "statuslist" + index);
        newlist = newlist.replace("btn1", "OK" + index);
        newlist = newlist.replace("btn2", "Cancel" + index);
        if(index <= g_max_ip_filter ) {
            $("#listtable").append(newlist);
            $row = $("#row");
            if (index%2 === 1) {
                $row.attr("class", "oddtr");
            } else {
                $row.attr("class", "eventr");
            }
            $row.attr("id", "row" + index);
        } else {
            showTipsDialog(common_info, str_secruity_lanipfilter_info, null);
            status = 0;
            show(ipdata);
            $("#add").attr("disabled",true);
        }
    }

    function deleted(index) {
        if (status != 0) {
            return;
        }
        ipdata.splice(index - 1, 1);
        show(ipdata);
    }

    function cancel() {
        if (status != 1 && status !=3) {
            return;
        }
        status = 0;
        show(ipdata);
    }

    function operator(ev){
        var id, index, reg, _ev = ev || event;
        var target = _ev.target || _ev.srcElemnt;

        reg = /([a-zA-Z]+)/g;
        id = target.id.match(reg);
        if (id) {
            id = id[0].toLowerCase();
        }

        reg = /([0-9]+)/g;
        index = target.id.match(reg);
        if (index){
            index = index[0];
        }
        switch(id){
            case "add":
                add();
                break;
            case "edit":
                edit(index);
                break;
            case "delete":
                deleted(index);
                break;
            case "cancel":
                cancel();
                break;
            case "ok":
                fire(index);
                break;
            case "modify":
                modify(index);
                break;
            default:
                break;
        }
    }
    function checkLanIp(ip, gateway, mask){
        var ret, ipnum, gatewaynum, masknum;

        ret = checkIp(ip);
        if (!ret){
            return false;
        }
        ipnum = ip2Number(ip);
        gatewaynum = ip2Number(gateway);
        masknum = ip2Number(mask);

        return ( (ipnum & masknum) === (gatewaynum & masknum));
    }
    function checkIp(ip){
        var re = /[\t]/g;
        if (re.test(ip)){
            return false;
        }
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
    function checkPort(port){
        var i, len, val, reg,portList, portStart, portEnd;
        reg = /[^0-9]+/g;
        if(port.indexOf("-") == -1){
            if(port.match(reg)){
                return false;
            }
            if(port.indexOf("0")==0){
                return false;
            }
            if (port < 1 || port > 65535){
                return false;
            }
        }else{
            portList = port.split("-");
            if(portList.length > 2){
                return false;
            }
            portStart = portList[0];
            portEnd = portList[1];
            if(portStart.match(reg) || portEnd.match(reg)){
                return false;
            }
            if(portStart.indexOf("0") == 0 || portEnd.indexOf("0") == 0){
                return false;
            }
            if(portStart < 1 || portStart > 65535 || portEnd < 1 || portEnd > 65535){
                return false;
            }
            if(parseInt(portStart) > parseInt(portEnd)){
                return false;
            }
        }

        return true;
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
    function getIpfilterItem(index){
        var ret, val, $input, proname, status, statusname, item, tips;
        var reg = /[^!#$()*.\-\/0-9=@A-Z\[\]^_`a-z{}|~]/g;
        tips = '<tr class="errortips"><td colspan="7">%tips</td></tr>';
        $(".errortips").remove();
        item = {};


        $input = $("#name" + index).children("input");
        val = $input.val();
        if(val.length<1 || val.length>31){
            ret=false;
        }else{
            if(val.match(reg)) {
                $input.focus();
                tips = tips.replace("%tips",  str_security_portforwarding_name_tips);
                $(".errortips").remove();
                $("#listtable").append(tips);
                ret=false
            }else{
                ret=true;
            }

        }
        if (ret === true){
            item.name = val;
        } else {
            $input.focus();
            tips = tips.replace("%tips", str_security_portforwarding_tips1.replace("%s",name_minlength).replace("%e",name_maxlength));
            $(".errortips").remove();
            $("#listtable").append(tips);
            return;
        }
        $input = $("#wanport" + index).children("input");
        val = $input.val();

        if($.trim(val).length <=0){
            $input.focus();
            tips = tips.replace("%tips",  str_security_lanipfilter_tips3);
            $(".errortips").remove();
            $("#listtable").append(tips);
            return;
        }
        ret = checkPort(val);

        if (ret === true){
            item.wanport = val;
        } else {
            $input.focus();
            tips = tips.replace("%tips", str_security_lanipfilter_tips2);
            $(".errortips").remove();
            $("#listtable").append(tips);
            return;
        }


        $input = $("#lanip" + index).children("input");
        val = $input.val();
        ret = checkLanIp(val, g_lanIpAddress, g_lanNetmask);
        if (ret === true){
            item.lanip = val;
        } else {
            $input.focus();
            tips = tips.replace("%tips", str_security_lanipfilter_tips1);
            $(".errortips").remove();
            $("#listtable").append(tips);
            return;
        }
        ret=isBroadCast(val,g_lanNetmask);
        if (ret === false){
            item.lanip = val;
        } else {
            $input.focus();
            tips = tips.replace("%tips", str_secruity_invalid_ip_broadcast);
            $(".errortips").remove();
            $("#listtable").append(tips);
            return;
        }
        if(val === g_lanIpAddress){
            $input.focus();
            tips = tips.replace("%tips", str_security_lanipfilter_tips5);
            $(".errortips").remove();
            $("#listtable").append(tips);
            return;
        }

        $input = $("#lanport" + index).children("input");
        val = $input.val();
       var protoolval=parseInt($("#protocol" + index).children("select").val());
        if($.trim(val).length <=0){
            $input.focus();
            tips = tips.replace("%tips", str_security_lanipfilter_tips3);
            $(".errortips").remove();
            $("#listtable").append(tips);
            return;
        }
        ret = checkPort(val);
        if (ret === true){
            item.lanport = val;
        } else {
            $input.focus();
            tips = tips.replace("%tips", str_security_lanipfilter_tips2);
            $(".errortips").remove();
            $("#listtable").append(tips);
            return;
        }

        proname = common_unknown;
        val = parseInt($("#protocol" + index).children("select").val());
        $.each(g_protocol, function(){
            if (this.mode === val) {
                proname = this.name;
            }
        });
        item.protocol = proname;

        statusname = common_unknown;
        status = parseInt($("#status" + index).children("select").val());
        $.each(g_status, function(){
            if (this.status === status){
                statusname = this.name;
            }
        });
        item.switch = statusname;
        return item;
    }

    return {
        getInstance: function(id){
            if (!instances){
                instances = new Create(id);
            }
            return instances;
        }
    };
})();
function saveIpFilterData(){
    closeDialog();
    stopLogoutTimer();
    var postdata, filterdata, data = {};
        filterdata = g_curPortForwardingData;
        data.portfwd = g_curPortForwardingData;

    $.each(filterdata, function(){
        var i, len;
        for(i = 0, len = g_protocol.length; i < len; i++){
            if (this.protocol === g_protocol[i].name){
                this.protocol = g_protocol[i].mode
            }
        }
        for(i = 0, len = g_status.length; i < len; i++){
            if (this.switch === g_status[i].name){
                this.switch = g_status[i].status;
            }
        }
    });
    postdata = JSON.stringify(data);
    saveAjaxJsonData("/action/set_portfwd_info", postdata, function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            showResultDialog(common_result, common_success, 3000);
        } else {
            showResultDialog(common_result, common_failed, 3000);
        }
    }, {

    });
}

function getIpFilterData(){
    getAjaxJsonData("/action/get_portfwd_info", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){

            g_curPortForwardingData = obj.portfwd;
            $.each(g_curPortForwardingData, function(){
                var i, len;
                for(i = 0, len = g_protocol.length; i < len; i++){
                    if (this.protocol === g_protocol[i].mode){
                        this.protocol = g_protocol[i].name;
                    }
                }
                for(i = 0, len = g_status.length; i < len; i++){
                    if (this.switch === g_status[i].status){
                        this.switch = g_status[i].name;
                    }
                }
            });
        }
    }, {
        async: false
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

function initModePage(){
    document.title = str_leftmenu_pf;
    var portList;
    $(".introduce h1").text(str_security_portforwarding);
    $(".introduce p").text(str_security_portforwarding_des);
    getIpFilterData();

    portList = portforwardList.getInstance("portforwardlist", g_max_ip_filter);
    portList.init(g_curPortForwardingData);
    $("#apply").attr("value", common_apply).on("click", function(){
        if (status !=0) {
            showTipsDialog(common_confirm, str_secruity_filter_editing_info,null);
            return;
        }
        showConfirmDialog(common_confirm, common_confirmtips, saveIpFilterData,dialog_align_left);
    });
}
