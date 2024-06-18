
var g_inboxType=1
var g_outboxType=2;
var g_simSMSType=3;
var g_draftType=0;
var g_smsType=g_inboxType;
var simLock = 0;
var simLockStatus;
var pinStatus;
var g_sms_full_show_flag=false;
var g_sms_full_flag=false;
var g_deleting_flag=false;

var g_perpagesize=10;
var g_pageIndex=1;
var g_sms_status_unread=0;
var g_sms_status_read=1;

var g_total_page_number=1;
var g_number="";
var g_userName="";
var g_smss_totalnum=0;
var g_singlenumber_totalnum=0;
var g_smsList=[];
var g_singlenumberlist=[];
var setReadMessageArray=[];
var g_sms_count;
var g_source_type_new= 0;
var g_source_type_reply= 1;
var g_source_type;
var g_messageId=0;
var g_notVerified = 1;
var g_pinBlocked = 2;
var newsmsflag=true;
var sendeerorflag=false;
var is_new_flag=true;
var firstSMSFlag = true;
var getsmsTimeout;
var initTimeout;
var g_message_data={
    'inBoxUnreadCount':0,
    'inBoxTotalCount':0,
    'localMax':100,
    'outBoxCount':0,
    'draftBoxCount':0,
    'localUsed':0
};

function getMessagesdata() {
    var postdata, data = {};
    stopLogoutTimer();
    getxCsrfTokens();
    data.start=(g_pageIndex-1)*g_perpagesize+1;
    data.end=(g_pageIndex)*g_perpagesize;
    data.smsbox=g_smsType;
    postdata = JSON.stringify(data);
  //  {'retcode': 0, 'totalCount': 2,userList: [{'userId': 1,'userName':'张三','mobileNumber':'13312312311','homeNumber':'12345678','officeNumber':'2222222','groupId': 1,'email':'sina@sina.com','location': 0},{'userId': 2,'userName':'lishi' , 'mobileNumber':'1331231333','homeNumber':'33333333','officeNumber':'55555','groupId': 0,'email':'tttt@sina.com','location': 1}]}
    getAjaxJsonDataByCondition("/action/get_sms_list",postdata, function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            g_smss_totalnum=obj.totalCount;
            g_smsList = obj.smsList;
        }else {
            g_smss_totalnum=0;

        }
    }, {
        async: false,
        timeout:2000
    });
    getsmsTimeout = setTimeout(getMessagesdata, 5000);
}

function initSmss() {
    $("#sms_check_all").removeAttr("checked");
    $(".sms_list_tr").remove();
    $("#deletemessage_button").attr("disabled",true);
    if(g_smsList.length <= 0){
        $("#sms_check_all").prop("checked",false);
        return;
    }
    var $preTr= $("#smsList_title"),
        $row = null,
        $cell_1 = null,$cell_2 = null,$cell_3 = null,$cell_4 = null,
        $pre = null;

    g_total_page_number=Math.ceil(g_smss_totalnum/g_perpagesize);
    $.each(g_smsList, function(n, message) {   
        $row  = $("<tr class='sms_list_tr' onclick='resendMessage(\""+message.index+"\")'></tr>");
        if(g_smsType == g_inboxType){
            if(message.isread == 0){
                $row.addClass("unread");
            }else{
                $row.addClass("read");
            }
        }else {
            $row.addClass("read");
        }

        $cell_1 = $("<td></td>");
        $cell_1.append("<input type='checkbox' name='subcheckbox' value='"+message.index+"' />");
        $row.append($cell_1);

        var mobileNumber=message.phone;
        $cell_2 = $("<td class='autoShowWidth' title='"+mobileNumber+"'></td>");
        $cell_2.append(mobileNumber);
        $row.append($cell_2);

        var content="";
        content=message.content;
        content = content.replace(/>/g,"&gt;");
        content = content.replace(/</g,"&lt;");
        $cell_3 = $("<td class='autoShowWidth' title='"+content+"' ></td>");
        $cell_3.append(content);
        $row.append($cell_3);
        $cell_4 = $("<td ></td>");
        var tempdate=new Date(message.datetime *1000).Format("yyyy-MM-dd HH:mm:ss");
        $cell_4.append(tempdate);
        $row.append($cell_4);
        $preTr.after($row);
        $preTr = $row;
        $("#sms_check_all").removeAttr("checked");
    });
    $("#deletemessage_button").attr("disabled",true);
    //$(".sms_list_tr").unbind("click").on("click",function () {
    $("input[name='subcheckbox']").unbind("click").on("click",function (event) {
        event.stopPropagation();
        $("#deletemessage_button").attr("disabled",true);
        $.each($("input[name='subcheckbox']:checked"),function(){
            $("#deletemessage_button").attr("disabled",false);
            return false;
        });
        if( $("input[name='subcheckbox']").not("input[name='subcheckbox']:checked").length>0){
            $("#sms_check_all").removeAttr("checked");
        }else {
            $("#sms_check_all").prop("checked",true);
        }
        $("input[name='subcheckbox']").attr("disabled",false);
    });
    initTimeout = setTimeout(initSmss, 5000);
}


function doSendOneMessage(postdata) {
    stopLogoutTimer();
    getxCsrfTokens();
    sendeerorflag=false;
    //closeDialog();
    setTimeout(function(){
        saveAjaxJsonData("/action/send_sms_info", postdata, function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                closeSendSMSDialog();
                //showResultOnlyDialogSms(common_result, send_suc, 2000);
                //setTimeout(closeDialog, 2000);
                //initSmsList();
                var result = obj.result;
                if(result.failNumbers.length > 1){
                    sendeerorflag=true;
                    //此处掉用不关闭发送窗口
                    showResultOnlyDialogSms(common_result, send_fail_numbers + result.failNumbers, 2000);
                    setTimeout(closeDialog, 2000);
                    initSmsList();
                }else {
                    showResultOnlyDialogSms(common_result, send_suc, 2000);
                    setTimeout(closeDialog, 2000);
                    initSmsList();
                }
            }else {
                closeSendSMSDialog();
                showResultOnlyDialogSms(common_result, common_failed, 2000);
                initSmsList();
            }
        }, {
            async:false,
            timeout:2000
        });
    },0);


}


function initCheckAllbox() {
    $("#sms_check_all").unbind("click").on("click", function () {
        if (this.checked) {
            $("input[name='subcheckbox']").prop("checked", true);
            $("#deletemessage_button").attr("disabled", false);
        }
        else {
            $("input[name='subcheckbox']").prop("checked", false);
            $("#deletemessage_button").attr("disabled", true);
        }
    });
}
function initNewSmsButton() {
        $("#newmessge_button").on("click",newMessage);
}


function  initDeleteSmsbutton() {
    $("#deletemessage_button").attr("disabled",true);
    $("#deletemessage_button").on("click",function () {
        var idsArry=[];
        $("input[name='subcheckbox']:checked").each(function () {
            idsArry.push(this.value);
        });

        if(idsArry.length <=0){
            showResultOnlyDialog(common_info, str_message_delete_no_content, 3000);
            return false;
        }
        g_deleting_flag=true;
        showConfirmDialogSms(common_info, str_del_message_warn, function(){

            closeDialog();
            var postdata, data = {};
            stopLogoutTimer();
            data.index = idsArry;
            data.smsbox = g_smsType;
            postdata = JSON.stringify(data);
            saveAjaxJsonData("/action/del_sms_info", postdata, function(obj){
                if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                    if(g_smsType != g_simSMSType ){
		        g_sms_full_flag=false;
                        setTimeout(function () {
                            g_sms_full_show_flag=false;
                        },3000);
                    }
                    closeDialog();
                    showResultOnlyDialogWithFlag(common_result, common_success, 2000);
                    setTimeout(go_pageNav(1),2000);
                }else {
                    closeDialog();
                    showResultOnlyDialogWithFlag(common_result, common_failed, 2000);
                    console.log(g_smsType);
                }
                startLogoutTimer();
            }, {
                async:false,
                timeout:2000
            });
        },dialog_align_left);


    });
}

function initgo() {
    $("#jump_page").bind("click", function() {
        var pageIndex = $("#jump_page_index").val();
        if(isValidatePageIndex(pageIndex)) {
            go_pageNav(parseInt(pageIndex));
        } else {
            $("#jump_page_index").select();
        }
    });
}


function isValidatePageIndex(pageIndex) {
    var pattern = new RegExp("^\\+?[1-9][0-9]*$");
    var result = pattern.test(pageIndex);
    if(result) {
        if(pageIndex>g_total_page_number) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}
function initQueryButton() {
    $("#querymessage_button").val(common_query);
    $("#querymessage_button").on("click",function () {
        go_pageNav(1);
    })
}

function initRefresh_button() {
    $("#refreshmessage_button").on("click",function () {
        go_pageNav(1);
    })
}

function initButtons() {

    $("#newmessge_button").val(str_new_message);
    $("#deletemessage_button").val(common_del);
    $("#deletemessage_button").attr("disabled", true);
    $("#refreshmessage_button").val(str_refresh);

}

function initModePage(){
    //判断是否锁卡
    //getsimlockstatus();
    //判断PIN码锁定否
    //没插卡提示，3秒返回home界面
    getSimStatus();
    //获取对应类型的参数
    getMessagesdata();
    //初始化按钮
    initButtons();
    initSmss();
    initCheckAllbox();
    initNewSmsButton();
    initDeleteSmsbutton();
    createPageNav();
    initgo();
    initRefresh_button();
    getMessageCounts();
    getCdmaflag();
    CheckboxNum();
}

function CheckboxNum(){
    $(function(){
        //"input[type='checkbox']"
        $(".sms_table").change(function() {
            if($("#sms_check_all").is(":checked")==true){
                clearTimeout(initTimeout);
            } else if($("input[type='checkbox']:checked")){
                clearTimeout(initTimeout);
                if($("input[type='checkbox']:checked").length == 0){
                    initSmss();
                }
            }
        });
    })
}
function getsimlockstatus(){
    getAjaxJsonData("/action/GetSimlockStatus", function (obj) {
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            simLockStatus = obj.status;
            if(simLockStatus == simLock){
                closeDialog();
                showSIMLockDialog(common_info,str_simlock,goToHome);
                return false;
            }else{
                return true;
            }
        }
    }, {
        async: false
    });
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
            }else{
            }
        }
    }, {
        async: false
    })
}

function create_button(content, button_id, buttonClassName) {
    if (buttonClassName != '' && buttonClassName != ' ' && buttonClassName != null) {
        var disButtonClassName = "disable_btn clr_gray_disable_btn_center";
        if(buttonClassName == disButtonClassName) {
            button = "<span class='button_wrapper ' id='span_" + button_id + "'>";
            button +="<input id='" + button_id + "' class='" + buttonClassName + "' type='button' value='" + content + "'/></span>";
        } else {
            button = "<span class='button_wrapper ' id='span_" + button_id + "'>";
            button +="<input id='" + button_id + "' class='common-btn " + buttonClassName + "' type='button' value='" + content + "'/></span>";
        }
    } else {
        button = "<span class='button_wrapper' id='span_" + button_id + "'>";
        button += "<input id='" + button_id + "' class='common-btn' type='button' value='" + content + "'/></span>";
    }
    document.write(button);
    //ieRadiusBorder();
}

function createPageNav() {
    var page_number = "";
    var aContent = 0;
    var pageBeginHref = "",
        pageLastHref = "";
    pageBeginHref = (g_pageIndex==1)?"javascript:void(0);" : "javascript:go_pageNav('first')";
    pageLastHref = (g_pageIndex == g_total_page_number)?"javascript:void(0);" : "javascript:go_pageNav('last')";

    $('#pageBegin').attr('href', pageBeginHref);
    $('#pageLast').attr('href', pageLastHref);

    var prePageHref = "",
        nextPageHref = "";
    prePageHref = (g_pageIndex==1)? "javascript:void(0);" : "javascript:go_pageNav('prePage')";
    nextPageHref = (g_pageIndex == g_total_page_number)? "javascript:void(0);" : "javascript:go_pageNav('nextPage')";

    $('#prePage').attr('href', prePageHref);
    $('#nextPage').attr('href', nextPageHref);

    var beginPage , endPage ,pageSize = 8;

    if(g_total_page_number > pageSize) {
        if(g_pageIndex +pageSize/2 >=g_total_page_number) {
            endPage = g_total_page_number;
            beginPage = endPage - pageSize;
        } else if(g_pageIndex <=pageSize/2) {
            beginPage = 1;
            endPage = beginPage +pageSize;
        } else {
            beginPage = g_pageIndex>4?g_pageIndex-4:1;
            endPage = g_pageIndex +4> g_total_page_number? g_total_page_number:g_pageIndex +4;
        }
    } else {
        beginPage = 1;
        endPage = g_total_page_number;
    }

    for(i=beginPage;i<=endPage;i++) {
        aHref = i==g_pageIndex? " href=\"javascript:void(0);\" style=\"text-decoration:none\" " : " href=\"javascript:go_pageNav('"+i+"')\" style=\"text-decoration:underline\"";
        page_number += "<a "+aHref+">"+i+"</a>";
    }
    $("#page_num").html(page_number);
    var curPage;
    if(g_smss_totalnum == 0){
        curPage = "0/0";
    }else{
        curPage = g_pageIndex+"/"+g_total_page_number;
    }

    $("#curPage").text(curPage);
}


function go_pageNav(to) {
    switch(to) {
        case "first":
            g_pageIndex = 1;
            break;
        case "last":
            g_pageIndex = g_total_page_number;
            break;
        case "prePage":
            g_pageIndex --;
            break;
        case "nextPage":
            g_pageIndex ++;
            break;
        default:
            g_pageIndex = to;
            break;
    }
    sms_initPage();
    $("#jump_page_index").val("");

    $(document).scrollTop(0);
}

function sms_initPage() {
    clearTimeout(initTimeout);
    clearTimeout(getsmsTimeout);
    getMessagesdata();
    initSmss();
    createPageNav();
    startLogoutTimer();

}

//短信的会话界面
function initSmsList() {
    clearTimeout(initTimeout);
    clearTimeout(getsmsTimeout);
    stopLogoutTimer();
    getMessagesdata();
    initSmss();
    initCheckAllbox();
    createPageNav();
    startLogoutTimer();
}

function resendMessage(messageId) {
    $("#sms_check_all").attr("checked", false);
    is_new_flag=false;
    // $row  = $("<tr class='sms_list_tr' onclick='resendMessage(\""+message.messageId+"\",\""+message.mobileNumber+"\",\""+message.content+"\",\""+message.read+"\")'></tr>");
    var mobileNumber,content,read;
    var getpostdata, getdata = {};
    getdata.index=parseInt(messageId);
    getdata.smsbox=g_smsType;
    getpostdata = JSON.stringify(getdata);
    getAjaxJsonDataByCondition("/action/read_sms_info",getpostdata,function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            mobileNumber=  obj.phone;
            content=obj.content;
            //read=obj.read;
        }
    }, {
        async: false,
        timeout:2000
    });
    /*if(read == g_sms_status_unread && g_smsType == g_inboxType){
        var messageIds= new Array();
        messageIds.push(parseInt(messageId));
        var postdata, data = {};
        data.messageIds=messageIds;
        data.type=g_smsType;
        data.read=g_sms_status_read;
        stopLogoutTimer();
        postdata = JSON.stringify(data);
        saveAjaxJsonData("/action/SetMessagesStatuByIDAndType", postdata, function(obj){
            startLogoutTimer();
            go_pageNav(g_pageIndex);
        }, {
            async:true,
            timeout:2000
        });
    }*/
    is_new_flag=false;
    newMessage(messageId,mobileNumber,content);
    if(g_smsType == g_inboxType){
        $("#ok-btn").attr("disabled","disabled");
    }


}

function newMessage(messageId,mobileNumber,content){
    if(g_sms_full_flag == true ){
        if(is_new_flag){
            g_sms_full_show_flag=true;
            closeDialog();
            showConfirmDialog(common_info, str_sms_message_full_tips, function(){
                closeDialog();
            },dialog_align_left);
            $("#cancel-btn").remove();
            return false;
        }
        else {
            is_new_flag=true;
        }

    }
    stopLogoutTimer();
    if(content==null || content== undefined || content.length ==0 ){
        content="";
    }
    if(messageId instanceof Object  || messageId == null ){
        messageId=0;
    }
    if(messageId==null || messageId== undefined || messageId.length ==0 ){
        messageId=0;
    }
    if(mobileNumber==null || mobileNumber== undefined || mobileNumber.length ==0 ){
        mobileNumber="";
    }
    g_source_type= g_source_type_new;
    var i, len, html, style;
    var option = "<option value=\"%d\">%s</option>";
    var newconactdialog = [
        '<div id="newconactdialog">',
        '<form id="newconactinfo">',
        '<table class="editmessages">',
        '<tr>',
        '<tr><td><span style="text-align: left ;color: #535353; " >'+str_shortmessage_recipients+common_colon+'</span></td>',
        '<td align="right"></td>',
        '</tr>',
        '<tr><td> <textarea id="recipientsnew" name="message" onchange="initSendNumber()" title="'+str_sms_message_split_tips+'"></textarea> ',
        '<input type="hidden" id="recipientsnum" disabled name="recipientsnum" value=""><img id="delconacts" src="../images/deleteConact.png" alt="" srcset=""></td>',
        '<td valign="top" style="padding-top: 6px;" ></td></tr>',
        /*'<td valign="top" style="padding-top: 6px;" ><a href="#modal"  class="second" ><img id="modal_img" src="../images/conacts_clicked.png" onclick="findConacts()" ></a></td></tr>',*/
        '<tr><td height="54px"></td><input type="hidden" id="messageIdTemp" name="messageId" value='+messageId+'><td></td>',
        '<tr>',
        '<tr><td><span style="text-align: left ;color: #535353 ;" >'+str_shortmessage_content+common_colon+'</span></td>',
        '<td align="right"></td>',
        '</tr>',
        '<td colspan="2"> <textarea id="inputcontentnew" name="message"></textarea> </td>',
        '</tr>',
        '<tr><td><span style="text-align: left ;color: #535353 ;" id="sms_countnew">160(1)</span></td>',
        '<td align="right"></td>',
        '</tr>',
        '</table>',
        '</form>',
        '</div>'].join("");

    style = newconactdialog;
    showSmsDialog(style,dialog_align_left);
    $("#recipientsnew").focus();
    $("#cancel-btn").attr("value", common_cancel).on("click", mycloseDialog);
    if(content==null || content== undefined || content.length ==0){
        $("#diatitle").children().text(str_new_message);
    }
    else {
        $("#diatitle").children().text(str_shortmessage_message);
    }
    $("#diaclose").on("click", mycloseDialog);
    $("#ok-btn").attr("value", str_send).on("click", sentMessage);
    $("#save-btn").attr("value", str_save).on("click", saveMessage);
    $("#delconacts").attr("alt",str_delete_conactstip);
    $("#delconacts").attr("title",str_delete_conactstip);
    $("#delconacts").on("click", clearRecipients);

    if(mobileNumber.length>0){
        $("#recipientsnew").val(mobileNumber);
        $("#recipientsnum").val(mobileNumber.replace(",",";"));
    }

    if(content.length>0){
        $("#inputcontentnew").val(content);
    }else {
        $("#ok-btn").attr("disabled", true);
    }
    setnewmessagecheck();
    if($("#inputcontentnew").val().length>0){
        //短信内容长度判断
        sms_numberCheck($("#inputcontentnew").val());
        sms_contentChange($("#inputcontentnew").val());
    }
    if(g_sms_full_flag == true ){
        if(g_smsType == g_inboxType || g_smsType == g_simSMSType || g_smsType== g_outboxType ){
            $("#recipientsnew").attr("disabled",true);
            $("#inputcontentnew").attr("disabled",true);
            $("#ok-btn").attr("disabled", true);
            $("#save-btn").attr("disabled", true);
        }
        if(g_smsType==g_draftType ){
            $("#recipientsnew").attr("disabled",true);
            $("#inputcontentnew").attr("disabled",true);
            $("#ok-btn").attr("disabled", true);
            $("#save-btn").attr("disabled", true);
        }

    }
    startLogoutTimer();

}
function saveMessage() {
    initSendNumber();
    qcSendNumber();
    $('.error_message').remove();
    var recipients = $("#recipientsnum").val();
    var strSMSContent = $.trim($("#inputcontentnew").val());
    if(!checkValid(recipients,strSMSContent)){
        return false;
    }
    var postdata, data = {};
    //webserver 要求增加";"用于发送
    data.recipients =  recipients;
    data.content = strSMSContent;
    postdata = JSON.stringify(data);
    g_source_type=g_source_type_new;
    getxCsrfTokens();
    stopLogoutTimer();
    closeDialog();
    saveAjaxJsonData("/action/save_sms_info", postdata, function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            showResultDialogNoFresh(common_result, common_success, 2000);
            initSmsList();
        }else {
            showResultDialogNoFresh(common_result, common_failed, 2000);
            initSmsList();
            startLogoutTimer();
        }
    }, {
        async:false,
        timeout:2000
    });
}

function clearRecipients() {
    if(g_sms_full_flag == true ){
        if(g_smsType != g_draftType){
            return false;
        }
    }
    $("#recipientsnew").val("");
    $("#recipientsnum").val("");
}

function qc(arr){
    var arr1=[];
    for(var i=0;i<arr.length;i++){
        if(arr1.indexOf(arr[i]) == -1){
            arr1.push(arr[i]);
        }
    }
    return arr1;

}

function initSendNumber() {
    $('.error_message').remove();
    stopLogoutTimer();
    var str_name=$("#recipientsnew").val();
    var str_number="";
    var users_array1=str_name.split(",");
    var users_array = qc(users_array1);
    users_array.forEach(function (value) {
        if(str_name.length>0) {
            if (str_number.length > 0) {
                if(value.length > 0){
                    str_number = str_number + ";" + value;
                }else{
                    str_number = str_number + "";
                }
            } else {
                str_number = value;
            }
        }
    });
    $("#recipientsnum").val(str_number);
    startLogoutTimer();
}
function qcSendNumber() {
    $('.error_message').remove();
    stopLogoutTimer();
    var str_name=$("#recipientsnum").val();
    var str_number="";
    var users_array1=str_name.split(";");
    var users_array = qc(users_array1);
    users_array.forEach(function (value) {
        if(str_name.length>0) {
            if (str_number.length > 0) {
                if(value.length > 0){
                    str_number = str_number + ";" + value;
                }else{
                    str_number = str_number + "";
                }
            } else {
                str_number = value;
            }
        }
    });
    $("#recipientsnum").val(str_number);
    startLogoutTimer();
}

function mycloseDialog() {
    $(window).off("resize", adjustPopWindowSize);
    $("#pop-window").remove();
}


function checkValid(recipients,strSMSContent) {
    var recipients = $("#recipientsnum").val();
    if(recipients.length<=0){
        showErrorUnderTextbox("delconacts", str_recipient_empty_error);
        $("#recipientsnew").focus().select();
        return false;
    }
    var PhoneArray = recipients.split(";");

    if( (!sms_sendNumberCheck(PhoneArray))){
        showErrorUnderTextbox("delconacts", str_recipient_error);
        return false;
    }
    var strSMSContent = $.trim($("#inputcontentnew").val());
    if(!sms_contentCheck(strSMSContent)){
        return false;
    }
    return true;

}
function sentMessage(){
    initSendNumber();
    qcSendNumber();
    $('.error_message').remove();
    var recipients = $("#recipientsnum").val();
    var strSMSContent = $.trim($("#inputcontentnew").val());

   if(!checkValid(recipients,strSMSContent)){
       return false;
   }
    showSendSMSWaitingDialog(common_waiting, sms_sending);
    var postdata, data = {};
    //webserver 要求增加";"用于发送
    data.recipients = recipients;
    //data.direction = 2;
    //data.read = 1;
    //data.datetime = Date.parse(new Date());
    data.content = strSMSContent;
    data.codetype = g_text_mode;
    data.index=parseInt($("#messageIdTemp").val());
    postdata = JSON.stringify(data);

    g_source_type=g_source_type_new;
    doSendOneMessage(postdata);
}
function sms_sendNumberCheck() {
    sms_clearAllErrorLabel();
    var i = 0;
    var checkResult = true;
    var numbers;
    numbers = arguments[0];
    var hight = 0;
    g_numberValid = true;
    if(numbers.length > g_sms_maxphonesize) {
        showErrorUnderTextbox("recipientsnew", str_recipient_maxnum_error.replace("%d",g_sms_maxphonesize));
        $('#recipientsnew').focus().select();
        return false;
    }
    for(i = 0;i<numbers.length;i++) {
        numbers[i] = $.trim(numbers[i]);
        if(false == sms_isSendNumber(numbers[i])) {
            var recipients = $("#recipientsnum").val();
            var checkitem=numbers[i]+";";
            if(recipients.indexOf(checkitem)>=0){
                $("#recipientsnum").val(recipients.replace("checkitem",""));
            }else {
                $("#recipientsnum").val(recipients.replace(numbers[i]+"",""));
            }
            showErrorUnderTextbox("delconacts", str_mobile_formate_error);

            $('#recipients_number').focus().select();
            return false;
        }
    }
    return checkResult;
}

function sms_contentCheck(strcotent) {
    var checkResult = true;
    if(strcotent.length == 0) {
        showErrorUnderTextbox("inputcontentnew", str_message_content_error);
        checkResult=false;
    }
    return checkResult;
}

function initmessageUsers() {
    var users_tmp=[];
    var user_count=0;
    var postdata ,data = {};
    var groupid_temp=$("#messageGroup").val();
    if(groupid_temp==0){
        data.startNum=0;
        data.endNum=500;
        //data.queryMessage="";
        postdata = JSON.stringify(data);
        //  {'retcode': 0, 'totalCount': 2,userList: [{'userId': 1,'userName':'张三','mobileNumber':'13312312311','homeNumber':'12345678','officeNumber':'2222222','groupId': 1,'email':'sina@sina.com','location': 0},{'userId': 2,'userName':'lishi' , 'mobileNumber':'1331231333','homeNumber':'33333333','officeNumber':'55555','groupId': 0,'email':'tttt@sina.com','location': 1}]}
        getAjaxJsonDataByCondition("/action/GetUsersByConditon",postdata, function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                user_count=obj.totalCount;
                users_tmp = obj.userList;
            }else {
                user_count=0;
                users_tmp = [];
            }
        }, {
            async: false,
            timeout:2000
        });
    }else {
        data.groupId = groupid_temp;
        postdata = JSON.stringify(data);
        getAjaxJsonDataByCondition("/action/GetUsersByGroupId",postdata,function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                user_count = obj.totalCount;
                users_tmp=obj.userList;
            }
        }, {
            async: false,
            timeout:2000
        });
    }
    $(".mes_user_list_tr").remove();
    var str_user_tr_temp='<tr class="mes_user_list_tr"><td width="5%" align="center"><input type="checkbox" name="usercheckbox" value=\"%d\"/></td><td  width="95%" align="left">%s</td></tr>';
    var users_html="";
    for(var i=0,len=users_tmp.length;i<len;i++){
        var value=users_tmp[i].userName+"."+users_tmp[i].mobileNumber;
        var name_and_number=users_tmp[i].userName+"&nbsp;&nbsp;&nbsp;"+users_tmp[i].mobileNumber;
        users_html=users_html+str_user_tr_temp.replace("%d", value).replace("%s",name_and_number);
    }
    $("#messageconact_table tr:eq(-1)").after(users_html);

    $("#smsuser_check_all").unbind("click").on("click", function () {
        if (this.checked) {
            $("input[name='usercheckbox']").prop("checked", true);
        }
        else {
            $("input[name='usercheckbox']").prop("checked", false);
        }
    });

    $("input[name='usercheckbox']").unbind("click").on("click",function (event) {
        event.stopPropagation();

        if( $("input[name='usercheckbox']").not("input[name='usercheckbox']:checked").length>0){
            $("#smsuser_check_all").removeAttr("checked");
        }else {
            $("#smsuser_check_all").prop("checked",true);
        }
    });

}

function setnewmessagecheck() {
    g_sms_count="sms_countnew";
    $("#inputcontentnew").on("keydown keypress keyup focus change input", function(event) {
        stopLogoutTimer();
        if(("keydown" == event.type || "keypress" == event.type || "keyup" == event.type)
            && (37 == event.keyCode || 38 == event.keyCode || 39 == event.keyCode || 40 == event.keyCode)) {
            return;
        }
        sms_numberCheck($("#inputcontentnew").val());
        sms_contentChange($("#inputcontentnew").val());
        startLogoutTimer();
    });
}

function changeSmsType(type){
    g_smsType=type;
    //处理样式
    switch (g_smsType){
        case g_inboxType:
            $("#inbox-menu").addClass("click");
            $("#boxmessage").text(str_sms_inbox +"("+g_message_data.inBoxUnreadCount+"/"+g_message_data.inBoxTotalCount+")" );
            $("#phone_number").text(str_conact_sender);
            $("#inbox_img").attr("src","../images/inbox_click.png");
            $("#outbox_img").attr("src","../images/outbox.png");
            $("#draftbox_img").attr("src","../images/draftbox.png");
            $("#outbox-menu").removeClass("click");
            $("#simsms-meun").removeClass("click");
            $("#draft-meun").removeClass("click");
            break;
        case g_outboxType:
            $("#inbox-menu").removeClass("click");
            $("#outbox-menu").addClass("click");
            $("#boxmessage").text(str_sms_outbox +"("+g_message_data.outBoxCount+")" );
            $("#phone_number").text(str_conact_addressee);
            $("#inbox_img").attr("src","../images/inbox.png");
            $("#outbox_img").attr("src","../images/outbox_click.png");
            $("#draftbox_img").attr("src","../images/draftbox.png");
            $("#simsms-meun").removeClass("click");
            $("#draft-meun").removeClass("click");
            break;
        case g_simSMSType:
            $("#inbox-menu").removeClass("click");
            $("#outbox-menu").removeClass("click");
            $("#simsms-meun").addClass("click");
            $("#draft-meun").removeClass("click");
            break;
        case g_draftType:
            $("#inbox-menu").removeClass("click");
            $("#outbox-menu").removeClass("click");
            $("#simsms-meun").removeClass("click");
            $("#draft-meun").addClass("click");
            $("#boxmessage").text(str_sms_draft +"("+ g_message_data.draftBoxCount +")" );
            $("#phone_number").text(str_conact_addressee);
            $("#inbox_img").attr("src","../images/inbox.png");
            $("#outbox_img").attr("src","../images/outbox.png");
            $("#draftbox_img").attr("src","../images/draftbox_click.png");
            break;
        default:
            break;
    }
    go_pageNav(1);
}


Date.prototype.Format = function(format) {
    var o = {
        "M+" : this.getMonth()+1,
        "d+" : this.getDate(),
        "H+" : this.getHours(),
        "m+" : this.getMinutes(),
        "s+" : this.getSeconds()
    };
    var k;
    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear()+'').substr(4 - RegExp.$1.length));
    }
    for(k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((''+ o[k]).length));
        }
    }
    return format;
};

function getMessageCounts() {
    getAjaxJsonData("/action/get_sms_count", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            g_message_data.inBoxUnreadCount=obj.unread_count;
            g_message_data.inBoxTotalCount=obj.inbox_count;
            g_message_data.localMax=obj.max_count;
            g_message_data.outBoxCount = obj.outbox_count;
            g_message_data.draftBoxCount = obj.draftbox_count;
            g_message_data.localUsed = obj.inbox_count + obj.outbox_count + obj.draftbox_count;
            if(firstSMSFlag == true){
                $("#boxmessage").text(str_sms_inbox +"("+g_message_data.inBoxUnreadCount+"/"+g_message_data.inBoxTotalCount+")" );
                $("#inbox_img").attr("src","../images/inbox_click.png");
                $("#phone_number").text(str_conact_sender);
                firstSMSFlag = false;
            }
            if(g_message_data.inBoxUnreadCount>0){
                var  title=str_message_not_read.replace("%d",g_message_data.inBoxUnreadCount);
                $("#inbox-menu").attr("title", title);
            }
            else {
                $("#inbox-menu").attr("title", "");
            }
            if(g_smsType == g_inboxType){
                $("#boxmessage").text(str_sms_inbox +"("+g_message_data.inBoxUnreadCount+"/"+g_message_data.inBoxTotalCount+")" );
            }else if(g_smsType == g_outboxType){
                $("#boxmessage").text(str_sms_outbox +"("+g_message_data.outBoxCount+")" );
            }else if(g_smsType == g_draftType){
                $("#boxmessage").text(str_sms_draft +"("+ g_message_data.draftBoxCount +")" );
            }
            //$("#simsms-meun").children("span").text(g_message_data.simUsed);
            if(g_message_data.localUsed>=g_message_data.localMax){
                $(".content-right").attr("title", str_sms_message_full_del_tips);
                if(!g_deleting_flag){
                    g_sms_full_flag=true;
                    if(!g_sms_full_show_flag){
                        g_sms_full_show_flag=true;
                        closeDialog();
                        showConfirmDialog(common_info, str_sms_message_full_tips, function(){
                            closeDialog();
                        },dialog_align_left);
                        $("#cancel-btn").remove();
                    }
                }
            }
            else {
                $(".content-right").attr("title", "");
            }
        }
    }, {
        async: true
    });

    setTimeout(getMessageCounts,3000);
}

function getCdmaflag() {
    getAjaxJsonData("/action/get_mobile_network_info", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {

            if (obj.network_type === g_networkModeNONE){
                g_isCDMA=false;
            } else if (obj.network_type === g_networkModeCDMA || obj.network_type === g_networkModeGSM) {
                g_isCDMA=false;
            } else if (obj.network_type === g_networkModeEVDO ||
                obj.network_type === g_networkModeWCDMA ||
                obj.network_type === g_networkModeTDSCDMA)
            {
                g_isCDMA=true; //可以按照触网sim卡类型赋值。
            } else if (obj.network_type === g_networkModeLTE) {
                g_isCDMA=false;
            } else {
                g_isCDMA=false;
            }
        } else{
            g_isCDMA=false;
        }
    }, {
        async: false,
        timeout:2000
    });
}
