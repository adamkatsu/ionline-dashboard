var g_enable = 1;
var g_disable = 0;
var g_macfilterDisable = 0;
var g_macfilterBlack = 2;
var g_macfilterWhite = 1;
var g_maxFilterNum = 8;
var status;
var g_macfilterBlackList;
var g_macfilterWhiteList;
var g_macfilterWhiteNo = 0;
var g_macfilterAddrList;
var g_macFilterStatus;
var g_macfilter = [
    {
        type: g_macfilterDisable,
        name : str_security_wlanmacfilter_filterdisable
    },
    {
        type: g_macfilterBlack,
        name : str_security_wlanmacfilter_filterblack
    },
    {
        type: g_macfilterWhite,
        name : str_security_wlanmacfilter_filterwhite
    }

];
var macfilterList = (function(){
    var instance;
    var macdata;
    var number;
    var max;
    var dest;
    var listhead = [
        '<form id="macfilterform">',
        //'<h3>%title</h3>',
        '<table id="listtable"  cellpadding="0" cellspacing="1">',
        '<tbody id="listbody">',
        '<tr>',
        '<th class="width180">%macaddr</th>',
        '<th class="width100">%option</th>',
        '</tr>',
        '%list',
        '</tbody>',
        '</table>',
        '<input id="add" type="button" value="'+common_add+'" class="ipfilterlistadd-btn"/>',
        '</form>'
    ];
    var normalrow = [
        '<tr id="row" class="%class">',
        '<td id="macaddr">%macaddr</td>',
        '<td>',
        '<span id="btn1" class="option-btn">%btn1</span>',
        '<span id="btn2" class="option-btn">%btn2</span>',
        '</td>',
        '</tr>'
    ];
    var editrow = [
        '<tr id="row" class="%class">',
        '<td id="macaddr"><input type="text"></td>',
        '<td>',
        '<span id="btn1" class="option-btn">%btn1</span>',
        '<span id="btn2" class="option-btn">%btn2</span>',
        '</td>',
        '</tr>'
    ];
    function Create(id, num){
        dest = id;
        max = num;
        this.init = init;
    }
    function init(data){
        macdata = data;
        status = 0;
        number = macdata.length;
        show(macdata);
    }
    function show(data){
        var i, index, list, html, head, $dest;

        $dest = $("#" + dest);
        $dest.empty();
        head = listhead.join("");
        html = "";
        list = "";
        for(i = 0; i < number; i++) {
            index = i + 1;
            html = normalrow.join("");
            if (i % 2 === 0){
                html = html.replace("%class", "oddtr");
            } else {
                html = html.replace("%class", "eventr");
            }
            html = html.replace("%macaddr", XSSResolveCannotParseChar(data[i]));
            html = html.replace("%btn1", common_edit);
            html = html.replace("%btn2", common_del);
            html = html.replace("row", "row" + index);
            html = html.replace("macaddr", "macaddr" + index);
            html = html.replace("btn1", "edit" + index);
            html = html.replace("btn2", "delete" + index);
            list += html;
        }
        //head = head.replace("%title", str_security_macfilter_list);
        head = head.replace("%macaddr", str_security_macfilter_macaddr);
        head = head.replace("%option", str_security_macfilter_option);
        head = head.replace("%list", list);
        $dest.html(head);
        $("#macfilterform").on("click", function(ev){
            stopLogoutTimer();
            operator(ev);
            startLogoutTimer();
        });
    }

    function edit(index){
        var val, row, $addr, $edit, $del;
        var input = '<input type="text" value="%value"></td>';

        if (status != 0){
            return;
        }
        status = 1;
        $addr = $("#macaddr" + index);
        val = $addr.text();
        row = input.replace("%value", val);
        $addr.html(row);

        $edit = $("#edit" + index);
        $edit.text(common_ok).attr("id", "modify" + index);
        $del = $("#delete" + index);
        $del.text(common_cancel).attr("id", "cancel" + index);
    }
    function deleted(index){
        if (status != 0) {
            return;
        }
        macdata.splice(index -1, 1);
        number = macdata.length;
        status = 0;
        show(macdata);
    }
    function modify(index){
        var i, len, ret, tips, val;
        val = $("#macaddr" + index).children("input").val();

        tips = '<tr class="errortips"><td colspan="2">%tips</td></tr>';
        $(".errortips").remove();
        for(i = 0, len = macdata.length; i < len; i++) {
            if (macdata[i].toUpperCase() === val.toUpperCase()) {
                break;
            }
        }
        if ( (i !== (parseInt(index, 10) - 1)) && (i !== len) ) {
            tips = tips.replace("%tips", str_security_macfilter_exist);
            $("#listbody").append(tips);
            $("#macaddr" + index).children("input").focus();
            return false;
        }
        ret = checkMacAddr(val);
        if (ret === false) {
            tips = tips.replace("%tips", str_security_wlanmacfilter_invalidmacaddr);
            $("#listbody").append(tips);
            $("#macaddr" + index).children("input").focus();
            return false;
        }
        macdata.splice(index - 1, 1, val);
        status = 0;
        show(macdata);
    }
    function fire(index){
        var i, len, ret, val, tips;

        val = $("#macaddr" + index).children("input").val();

        tips = '<tr class="errortips"><td colspan="2">%tips</td></tr>';
        $(".errortips").remove();
        for(i = 0, len = macdata.length; i < len; i++) {
            if (macdata[i].toUpperCase() === val.toUpperCase()) {
                tips = tips.replace("%tips", str_security_macfilter_exist);
                $("#listbody").append(tips);
                $("#macaddr" + index).children("input").focus();
                return false;
            }
        }
        ret = checkMacAddr(val);
        if (ret === false) {
            tips = tips.replace("%tips", str_security_wlanmacfilter_invalidmacaddr);
            $("#listbody").append(tips);
            $("#macaddr" + index).children("input").focus();
            return false;
        }
        macdata.push(val);
        number = macdata.length;
        status = 0;
        show(macdata);
    }
    function add(num){
        var newrow, index;
        if (status != 0 ){
            return;
        }
        if( number >= max){
            showTipsDialog(common_info, str_secruity_wlanmacfilter_info, null,dialog_align_left);
            return;
        }
        status = 2;
        index = num + 1;
        newrow = editrow.join("");
        newrow = newrow.replace("row", "row" + index);
        newrow = newrow.replace("macaddr", "macaddr" + index);
        newrow = newrow.replace("btn1", "ok" + index);
        newrow = newrow.replace("btn2", "cancel" + index);
        newrow = newrow.replace("%btn1", common_ok);
        newrow = newrow.replace("%btn2", common_cancel);
        if (index % 2 === 1) {
            newrow = newrow.replace("%class", "oddtr");
        } else {
            newrow = newrow.replace("%class", "eventr");
        }
        $("#listbody").append(newrow);
    }
    function cancel(){
        status = 0;
        show(macdata);
    }
    function operator(ev){
        var id, index, reg, _ev = ev || event;
        var target = _ev.target || _ev.srcElemnt;

        reg = /[a-zA-Z]+/g;
        id = target.id.match(reg);
        if (id){
            id = id[0];
        }
        reg = /[0-9]+/g;
        index = target.id.match(reg);
        if (index){
            index = index[0];
        }
        switch(id){
            case "edit":
                edit(index);
                break;
            case "delete":
                deleted(index);
                break;
            case "modify":
                modify(index);
                break;
            case "add":
                if ($("#add").attr("disabled")) {
                    return;
                } else {
                    add(number);
                }

                break;
            case "ok":
                fire(index);
                break;
            case "cancel":
                cancel();
                break;
            default:
                break;
        }
    }
    return {
        getIntance: function(dest, num){
            if (!instance) {
                instance = new Create(dest, num);
            }
            return instance;
        }
    }
})();
function saveMacfilterData(){
    closeDialog();
    stopLogoutTimer();
    var postdata, data = {};
    if( status!=0){
        if (status !=0) {
            showTipsDialog(common_confirm, str_secruity_filter_editing_info,null,dialog_align_left);
            return;
        }
        return
    }
    var macFilterMode = $("#macfiltermode").val();
    data.mode = macFilterMode;
    if (macFilterMode == g_macfilterBlack){
        data.macaddrlist = g_macfilterBlackList;
    } else if (macFilterMode == g_macfilterWhite){
        data.macaddrlist = g_macfilterWhiteList;
        if(data.macaddrlist.length == g_macfilterWhiteNo){
            showTipsDialog(common_confirm, str_macfilter_white_no,function(){
                setTimeout(closeResultDialog,3000);
            },dialog_align_left);
            return;
        }
    } else {
        var temparrayList = new Array();
        data.macaddrlist = temparrayList;
    }
    postdata = JSON.stringify(data);
    showWaitingDialog(common_waiting, common_waitingmsg,dialog_align_left);
    saveAjaxJsonData("/action/set_wifi_macfilter_info", postdata, function(data){
        if (typeof data.retcode === "number" && data.retcode === g_resultSuccess){
            closeDialog();
            showResultDialog(common_result, common_success, 3000);
        } else {
            closeDialog();
            showResultDialog(common_result, common_failed, 3000);
        }
    }, {
        async: true
    });
}

function getMacFilterInfo(){
    getAjaxJsonData("/action/get_wifi_macfilter_info", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            g_macFilterStatus = obj.mode;
            var temparrayList = new Array();
            if(g_macFilterStatus == g_macfilterBlack){
                g_macfilterBlackList = obj.macaddrlist;
                g_macfilterWhiteList = temparrayList;
            }else if(g_macFilterStatus == g_macfilterWhite){
                g_macfilterBlackList = temparrayList;
                g_macfilterWhiteList = obj.macaddrlist;
            }else{
                g_macfilterBlackList = obj.macaddrlist;
                g_macfilterWhiteList = obj.macaddrlist;
            }
            initMacFilterSelectMode();
            if (g_macFilterStatus === g_macfilterBlack){
                $("#macfiltermode").val(g_macfilterBlack);
                filterList.init(g_macfilterBlackList);
            } else if (g_macFilterStatus === g_macfilterWhite){
                $("#macfiltermode").val(g_macfilterWhite);
                filterList.init(g_macfilterWhiteList);
            } else if(g_macFilterStatus === g_macfilterDisable){
                $("#macfiltermode").val(g_macfilterDisable);
                filterList.init([]);
                $("#add").attr("disabled","disabled");
            }
        }
    }, {
        async: false
    });
}
function checkMacAddr(mac) {
    var i, len, arr, reg;
    if (typeof mac !== "string"){
        return false;
    }
    if (mac.toLowerCase() === "ff:ff:ff:ff:ff:ff"||mac==="00:00:00:00:00:00") {
        return false;
    }
    arr = mac.split(":");
    if (arr.length !== 6) {
        return false;
    }
    for (i = 0, len = arr.length; i < len; i++){
        if (arr[i].length != 2){
            return false;
        }
    }

    reg = /[^0-9a-fA-F]/g;
    for(i = 0, len = arr.length; i < len; i++){
        if (arr[i].match(reg)){
            return false;
        }
    }
    if (parseInt(arr[0], 16) & 0x01 === 1) {
        return false;
    }
    return true;
}
function initMacFilterSelectMode(){
    var i, len,$list;
    var html = "";
    var option = "<option value=\"%d\">%s</option>";
    for(i = 0, len = g_macfilter.length; i < len; i++){
        html += option;
        html = html.replace("%d", g_macfilter[i].type);
        html = html.replace("%s", g_macfilter[i].name);
    }
    $list = $("#macfiltermode");
    $list.html(html);
}
var filterList;
function initModePage(){
    filterList = macfilterList.getIntance("macfilterlist", g_maxFilterNum);
    getMacFilterInfo();
    $("#macfiltermode").on("change", function(){
        var val = parseInt($(this).val());
        g_macFilterStatus = val;
        if (val === g_macfilterBlack){
            filterList.init(g_macfilterBlackList);
        } else if (val === g_macfilterWhite){
            filterList.init(g_macfilterWhiteList);
        } else {
            filterList.init([]);
            $("#add").attr("disabled","disabled");
        }
    });
    $("#apply").attr("value", common_apply).on("click", function(){
        showConfirmDialog(common_confirm, common_confirmtips, saveMacfilterData,dialog_align_left);
    });
}
