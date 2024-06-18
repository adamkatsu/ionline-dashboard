    var g_newVersionChecking = 11;
    var g_newVerisonFound = 12;
    var g_newVersionFailed = 13;
    var g_newVersionNotFound = 14;
    var g_internetModeMobile = 4;

	var g_fotaDownloading = 20;
    var g_fotaDownloading1 =21;
    var g_fotaDownloadFailed = 23;
    var g_fotaDownloadPedding = 24;
    var g_fotaDownloadSuccess = 22;

    var g_fotaInstallReady = 50;
    var g_fotaInstalling = 60;
    var g_fotaInstallFailed = 101;
    var g_fotaInstallSuccess = 100;
    var g_fotaInstallReport = 99;
    var UpdateLoadTimeout;
    var FotaLoadTimeout;

    var g_upgrade_Istatuslist = [
        str_upgrade_ISTATUS_IDLE,
        str_upgrade_ISTATUS_DOWNLOAD,
        str_upgrade_ISTATUS_ASYNC,
        str_upgrade_ISTATUS_CHECK_HEADER,
        str_upgrade_ISTATUS_UNPACK_AP,
        str_upgrade_ISTATUS_UNPACK_MODEM,
        str_upgrade_ISTATUS_CHECK_FILE,
        str_upgrade_ISTATUS_DISPATCH_MODEM,
        str_upgrade_ISTATUS_CONFIRM_MODEM,
        str_upgrade_ISTATUS_INSTALL_AP_A,
        str_upgrade_ISTATUS_INSTALL_MODEM,
        str_upgrade_ISTATUS_INSTALL_AP_B,
        str_upgrade_ISTATUS_COMPLETE,
        str_upgrade_ISTATUS_MAX
    ];

    var RS_ERR_FAILED = -1;
    var RS_ERR_OK = 0;
    var RS_DL_STATE_ERROR = 1;
    var RS_SESSION_STATE_ERROR = 2;
    var RS_USER_CANCEL = 3;
    var RS_CARD_NOT_INSERT = 4;
    var RS_CARD_NOT_RECOGNIZE = 5;
    var RS_SYSTEM_BUSY = 6 ;
    var RS_IMEI_NOT_WRITTEN = 7;
    var RS_ERR_INVALID_PARAM = 9;
    // system
    var RS_ERR_UNSPECIFIC = 10 ;
    var RS_ERR_MALLOC_FAIL = 11 ;
    var RS_ERR_OPEN_FILE = 12 ;
    var RS_ERR_CREATE_FILE = 13;
    var RS_ERR_SERVICE_NOT_AVAILABLE =14 ;
    var RS_ERR_INVALID_FILE = 15 ;
    var RS_ERR_INVALID_URL = 16 ;
    var RS_ERR_WRITE_DATA_FAILE = 17 ;
    var RS_ERR_READ_DATA_FAILE = 18 ;
    var RS_ERR_FLASH_INIT = 19;
    var RS_ERR_FLASH_WRITE = 20 ;
    var RS_ERR_FLASH_READ  = 21;
    var RS_ERR_SPACE_NOT_ENGHOU	 = 22 ;
    var RS_ERR_BATTERY_LEVEL_LOW =	23;
    // network
    var RS_ERR_XPT_OPEN_SOCK = 40 ;
    var RS_ERR_XPT_OPEN_TIMEOUT = 41;
    var RS_ERR_XPT_SEND_DATA = 42;
    var RS_ERR_XPT_RECV_SELECT = 43;
    var RS_ERR_XPT_RECV_DATA = 44;
    var RS_ERR_XPT_RECV_TIMEOUT = 45;
    var RS_ERR_XPT_RECV_PENDING = 46;
    var RS_ERR_XPT_SSL_INIT = 47;
    var RS_ERR_XPT_SSL_CONNECT = 48;
    var RS_ERR_XPT_GET_HOST_BY_NAME = 49;

    var g_systemReady = 2;
    var g_systemBooting = 1;
    var g_systemNormal = 0;

    var g_deviceInfo;
    var g_curNewVersionStatus = g_newVersionChecking;
    var flag=false;
    var hasgraded=false;
    var gradebutton=false;
    var  UPDATE_LOCAL="1";
    var  UPDATE_ONLINE="2";
    var g_FileError= 102;
    var g_updatingError= 104;
    var g_update_noimei = 111;
    var g_update_noversionnum = 110;
    var g_update_register = -1;
	
    var UPGRADE_IDLE = 0;
	var UPGRADE_FOTA = 1;
	var UPGRADE_TR069 = 2;
	var UPGRADE_LOCAL = 3;
    var UPGRADE_PRODUCTION = 4;
	var UPGRADE_TYPE_VOICE = 5;

    var UPGRADE_BUSY_CS=4;
    var  UPGRADE_EXECUTING=2;
    var	 UPGRADE_COMPLETED = 99;
    var  UPGRADE_SUCCESS=100;
	var  UPGRADE_FAILURE=101;
    //var  UPGRADE_MAINBOAR_FAILURE=101;
    //var  UPGRADE_MODEM_FAILURE=102;
    var  changeflag=false;

    var MEIG_ERROR_OK = 0;
    var MEIGE_ERROR_FAILED = -1;
    var MEIG_ERROR_FORMAT = 100,
        MEIG_ERROR_NOTFOUND = 101,
        MEIG_ERROR_PARAM = 102,
        MEIG_ERROR_PROCESS = 103,
        MEIG_ERROR_PROCESSING = 104,
        MEIG_ERROR_UNSUPPORTED = 105,
        MEIG_ERROR_REACHMAX = 106,
        MEIG_ERROR_OUTOFBUF = 107,
        MEIG_ERROR_MALLOC = 108,
        MEIG_ERROR_IPC = 109,
        MEIG_ERROR_NOVERSIONNUMBER = 110,
        MEIG_ERROR_NOIMEI = 111,
        MEIG_ERROR_OPT_MODULE_FAILED = 112,
        MEIG_ERROR_LOCAL_UPGRDING = 113,
        MEIG_ERROR_FOTA_UPGRDING = 114,
        MEIG_ERROR_TR069_UPGRDING = 115,
        MEIG_ERROR_PRODUCTION_UPGRDING = 116,
        MEIG_ERROR_INVALID_PACK = 120,
        MEIG_ERROR_CHECK_RAW	= 121,
        MEIG_ERROR_PARSE_PACK_HEAD = 122,
        MEIG_ERROR_PACK_MAGIC = 123,
        MEIG_ERROR_PACK_FILE_ID = 124,
        MEIG_ERROR_LATESET_VER = 125,
        MEIG_ERROR_MAINBOARD_MD5 = 126,
        MEIG_ERROR_MODEM_MD5 = 127,
        MEIG_ERROR_NO_ENOUGH_SPACE = 128,
        MEIG_ERROR_MODEM = 129,
        MEIG_ERROR_STATUS = 130,
        MEIG_ERROR_INTERNAL = 199;
    var filtFormat;

    function initModePage(){
        document.title = str_leftmenu_upgrade;
        $(".introduce h1").text(str_upgrade);
        $(".introduce p").text(str_upgrade_des);
        if($("#updatetype").val()===UPDATE_LOCAL){
            $("#onlinebtn").hide();
            $("#newver").hide();
            $("#myform").show();
        }else if($("#updatetype").val()===UPDATE_ONLINE){
            $("#onlinebtn").show();
            $("#myform").hide();
            if( $("#check").val()===str_update_onlineupdate_doupdate){
                $("#newver").show();
            }
        }else{

        }

        getDeviceInfo();
        $("#check").attr("value", str_update_onlineupdate_checknewver).on("click", checkNewVersion);
        //local update
        $("#applylocal").attr("value", str_system_update).on("click", update)
        $("#fileId").on("change", selfile);
        $("#btn_file").attr("value",str_system_update_file);
  
    }


    function checkNewVersion(){
        getxCsrfTokens();
        getAjaxJsonData("/action/fota_check_new_version", function(obj){
            closeDialog();
            stopLogoutTimer();
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                if(hasgraded==false){
                    showWaitingDialog(common_waiting, str_update_onlineupdate_checking,dialog_align_left);
                    setTimeout(updateNewVersionInfo,2000);
                }

            } else if (typeof obj.retcode === "number" && obj.retcode === MEIG_ERROR_NOIMEI){
                if(hasgraded==false){
                    showResultDialog(common_result, str_update_error_noimei);
                    startLogoutTimer();
                }
            } else if (typeof obj.retcode === "number" && obj.retcode === MEIG_ERROR_NOVERSIONNUMBER){
                if(hasgraded==false){
                    showResultDialog(common_result, str_update_error_noversionnumber);
                    startLogoutTimer();
                }
            } else if (typeof obj.retcode === "number" && obj.retcode === MEIG_ERROR_LOCAL_UPGRDING){
                if(hasgraded==false){
                    showResultDialog(common_result, str_update_error_local_upgrding);
                    startLogoutTimer();
                }
			} else if (typeof obj.retcode === "number" && obj.retcode === MEIG_ERROR_IPC){
                if(hasgraded==false){
                    showResultDialog(common_result, str_update_error_ipc);
                    startLogoutTimer();
                }
			} else if (typeof obj.retcode === "number" && obj.retcode === MEIG_ERROR_TR069_UPGRDING){
                if(hasgraded==false){
                    showResultDialog(common_result, str_update_error_tr069_upgrding);
                    startLogoutTimer();
                }
			} else if (typeof obj.retcode === "number" && obj.retcode === MEIG_ERROR_PRODUCTION_UPGRDING){
                if(hasgraded==false){
                    showResultDialog(common_result, str_update_error_production_upgrding);
                    startLogoutTimer();
                }
            } else if (typeof obj.retcode === "number" && obj.retcode === MEIG_ERROR_PROCESS){
                if(hasgraded==false){
                    showResultDialog(common_result, str_update_error_process);
                    startLogoutTimer();
                }
            } else if (typeof obj.retcode === "number" && obj.retcode === MEIG_ERROR_FOTA_UPGRDING){
                if(hasgraded==false){
                    showResultDialog(common_result, str_update_error_fota_upgrding);
                    startLogoutTimer();
                }
            } else{
                showResultDialog(common_result, common_failed);
                startLogoutTimer();
            }
        }, {
            async: true
        });
    }
    function updateNewVersionInfo(){
        if(hasgraded==true){
            return;
        }
        getxCsrfTokens();
        getAjaxJsonData("/action/fota_get_check_versioninfo", function(obj){
            if(hasgraded==true){
                return;
            }
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                switch(obj.status){
                    case g_newVersionChecking:
                        setTimeout(updateNewVersionInfo, 2000);
                        break;
                    case g_newVerisonFound:
                        closeDialog();
                        startLogoutTimer();
                        var brief = obj.brief;
                        if(gradebutton==false){
                            $("#newsoftver").text(obj.version);
                            if(brief.indexOf("content")>0){
                                brief = brief.split("\"");
                                $("#desc").text(brief[brief.length-2]);
                            }else{
                                $("#desc").text(obj.brief);
                            }
                            $("#newver").show();
                            $("#check").attr("value", str_update_onlineupdate_doupdate);
                            $("#check").show();
                            $("#check").unbind("click");
                            $("#check").on("click",startUpgrade);
                            gradebutton=true;
                        }
                        break;
                    case g_newVersionFailed:
                        closeDialog();
                        var message=common_failed;
                        var errno=obj.errno;
                        switch (errno){
                            case RS_ERR_FAILED:
                                message=str_system_update_network_error;
                                break;
                            case  RS_DL_STATE_ERROR :
                                message=str_system_update_status_error;
                                break;
                            case RS_SESSION_STATE_ERROR:
                                message=str_system_update_session_error;
                                break;
                            case  RS_USER_CANCEL:
                                message=str_system_update_canel_error;
                                break;
                            case RS_CARD_NOT_INSERT:
                                message=str_system_update_nosim_error;
                                break;
                            case RS_CARD_NOT_RECOGNIZE:
                                message=str_system_update_invalidsim_error;
                                break;
                            case RS_SYSTEM_BUSY:
                                message=str_system_update_busy_error;
                                break;
                            case RS_IMEI_NOT_WRITTEN:
                                message=str_system_update_imei_error;
                                break;
                            case RS_ERR_INVALID_PARAM:
                                message=str_system_update_parameter_error;
                                break;
                            case RS_ERR_UNSPECIFIC:
                            case RS_ERR_MALLOC_FAIL:
                            case RS_ERR_OPEN_FILE:
                            case RS_ERR_CREATE_FILE:
                            case RS_ERR_SERVICE_NOT_AVAILABLE:
                            case RS_ERR_INVALID_FILE:
                            case RS_ERR_INVALID_URL:
                            case RS_ERR_WRITE_DATA_FAILE:
                            case RS_ERR_READ_DATA_FAILE:
                            case RS_ERR_FLASH_INIT:
                            case RS_ERR_FLASH_WRITE:
                            case RS_ERR_FLASH_READ:
                                message=str_system_update_system_error;
                                break;
                            case RS_ERR_SPACE_NOT_ENGHOU:
                                message=str_system_update_space_error;
                                break;
                            case RS_ERR_BATTERY_LEVEL_LOW:
                                message=str_system_update_power_error;
                                break;
                             case RS_ERR_XPT_OPEN_SOCK:
                             case RS_ERR_XPT_OPEN_TIMEOUT:
                             case RS_ERR_XPT_SEND_DATA:
                             case RS_ERR_XPT_RECV_SELECT:
                             case RS_ERR_XPT_RECV_DATA:
                             case RS_ERR_XPT_RECV_TIMEOUT:
                             case RS_ERR_XPT_RECV_PENDING:
                             case RS_ERR_XPT_SSL_INIT:
                             case RS_ERR_XPT_SSL_CONNECT:
                             case RS_ERR_XPT_GET_HOST_BY_NAME:
                                 message=str_system_update_network_error;
                                 break;
                            default:
                                message=str_system_update_unknown_error;
                                break;
                        }
                        showResultDialog(common_result, message, 3000,dialog_align_left);
                        break;
                    case g_newVersionNotFound:
                        closeDialog();
                        showResultDialog(common_result, str_update_onlineupdate_uptodata,dialog_align_left);
                        break;
                    default:
                        closeDialog();
                        showResultDialog(common_result, common_unknown, 3000);
                        break;
                }
            } else if(typeof obj.retcode === "number" && obj.retcode === MEIG_ERROR_IPC) {
                closeDialog();
                showResultDialog(common_result, str_update_error_ipc,dialog_align_left);
            } else if(typeof obj.retcode === "number" && obj.retcode === MEIG_ERROR_PROCESS) {
                closeDialog();
                showResultDialog(common_result, str_update_error_process,dialog_align_left);
            }
        }, {
            async: false,
            timeout:1000
        });
        startLogoutTimer();
    }
    function startUpgrade(){
        if (g_curInternetMode === g_internetModeMobile) {
            showConfirmDialog(common_tip, str_update_onlineupdate_mobiledatatips.replace("%s", str_dialup_mobiledata), do_update,dialog_align_left);
        } else {
            do_update();
        }
    }
    function do_update(){
        hasgraded=true;
        closeDialog();
        getxCsrfTokens();
        getAjaxJsonData("/action/fota_download", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                $("#check").attr("disabled","disabled");
                updateDownloadStatus();
            }else if(typeof obj.retcode === "number" && obj.retcode === MEIG_ERROR_IPC){
                closeDialog();
                showResultDialog(common_result, str_update_error_ipc, 3000,dialog_align_left);
            }else if(typeof obj.retcode === "number" && obj.retcode === MEIG_ERROR_PROCESS){
                closeDialog();
                showResultDialog(common_result, str_update_error_process, 3000,dialog_align_left);
            }else if(typeof obj.retcode === "number" && obj.retcode === MEIG_ERROR_LOCAL_UPGRDING){
                closeDialog();
                showResultDialog(common_result, str_update_error_local_upgrding, 3000,dialog_align_left);
            }else if(typeof obj.retcode === "number" && obj.retcode === MEIG_ERROR_TR069_UPGRDING){
                closeDialog();
                showResultDialog(common_result, str_update_error_tr069_upgrding, 3000,dialog_align_left);
            }else if(typeof obj.retcode === "number" && obj.retcode === MEIG_ERROR_PRODUCTION_UPGRDING){
                closeDialog();
                showResultDialog(common_result, str_update_error_production_upgrding, 3000,dialog_align_left);
            } else {
                closeDialog();
                showResultDialog(common_result, str_update_onlineupdate_updatefailed, 3000);
            }
        }, {
            async: true
        });
    }
    function updateDownloadStatus(){
        startLogoutTimer();
        getxCsrfTokens();
        getAjaxJsonData("/action/fota_get_download_status", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                switch(obj.status){
                    case g_fotaDownloading:
                        showProgressDialog(str_update_onlineupdate_downloading, str_update_onlineupdate_downloadtips, obj.percent,dialog_align_left);
                        setTimeout(updateDownloadStatus, 2000);
                        break;
                    case g_fotaDownloading1:
                        showProgressDialog(str_update_onlineupdate_downloading, str_update_onlineupdate_downloadtips, obj.percent,dialog_align_left);
                        setTimeout(updateDownloadStatus, 2000);
                        break;
                    case g_fotaDownloadFailed:
                        closeDialog();
                        showResultDialog(common_result, str_update_onlineupdate_downloadfailed + common_colon + obj.errno, 3000);
                        break;
                    case g_fotaDownloadSuccess:
                        closeDialog();
                        showTipsDialog(common_result, str_update_onlineupdate_downloadsuccess, function(){
                            setTimeout(do_Upgrade, 5000);
                        },dialog_align_left);
                        break;
                    case g_fotaDownloadPedding:
                        closeDialog();
                        showResultDialog(common_result, str_update_onlineupdate_pedding.replace("%id", obj.errno).replace("%d", obj.percent),3000,dialog_align_left);
                        break;
                    default:
                        closeDialog();
                        showResultDialog(common_result, str_update_onlineupdate_interrupt);
                        break;
                }
            }else if(typeof obj.retcode === "number" && obj.retcode === MEIG_ERROR_IPC){
                closeDialog();
                showResultDialog(common_result, str_update_error_ipc,3000,dialog_align_left);
            }else if(typeof obj.retcode === "number" && obj.retcode === MEIG_ERROR_PROCESS){
                closeDialog();
                showResultDialog(common_result, str_update_error_process,3000,dialog_align_left);
            }else{
                closeDialog();
                showResultDialog(common_result, common_failed);
            }
        }, {
            async: true
        });
    }
    function getFotaUpdateLoading() {
        startLogoutTimer();
        getxCsrfTokens();
        getAjaxJsonData("/goform/fota_get_upgrade_prog", function (data) {
            var obj = data2Object(data);
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                var status = obj.status;
                switch (status) {
                    case UPGRADE_COMPLETED:
                        clearTimeout(FotaLoadTimeout);
                        updateUpgradeStatus();
                        break;
                    default :
                        closeDialog();
                        showWaitingDialog(str_update_loading, str_update_update_installing + g_upgrade_Istatuslist[obj.istatus], dialog_align_left);
                        break;
                }
            }
        }, {
            async: false
        });
        FotaLoadTimeout = setTimeout(getFotaUpdateLoading, 1000);
    }
    function do_Upgrade(){
        getxCsrfTokens();
        getAjaxJsonData("/action/fota_upgrade", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                closeDialog();
                showWaitingDialog(common_waiting, str_update_onlineupdate_installing,dialog_align_left);
                getFotaUpdateLoading();
            }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_STATUS){
                closeDialog();
                showResultDialog(common_result, str_update_error_status, 3000);
            }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_CHECK_RAW){
                closeDialog();
                showResultDialog(common_result, str_update_error_check_raw, 3000);
            }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_MAINBOARD_MD5){
                closeDialog();
                showResultDialog(common_result, str_update_error_mainboard_md5, 3000);
            }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_MODEM_MD5){
                closeDialog();
                showResultDialog(common_result, str_update_error_modem_md5, 3000);
            }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_NO_ENOUGH_SPACE){
                closeDialog();
                showResultDialog(common_result, str_update_error_no_enough_space, 3000);
            }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_MODEM){
                closeDialog();
                showResultDialog(common_result, str_update_error_modem, 3000);
            }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_LATESET_VER){
                closeDialog();
                showResultDialog(common_result, str_update_error_lateset_ver, 3000);
            }else{
                closeDialog();
                showResultDialog(common_result, common_failed,3000);
            }
        }, {
            async: true
        });
    }
    function goTohome(){
        window.location.replace("../common/login.html");
    }
    function goSucess() {
        setTimeout(goTohome,5000);
    }
    function updateUpgradeStatus(){
        getxCsrfTokens();
        var timeout1 = setTimeout(updateUpgradeStatus, 3000);
        getAjaxJsonData("/goform/fota_get_upgrade_status", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                switch (obj.status){
                    case UPGRADE_SUCCESS:
                        if(flag==false){
                            clearTimeout(timeout1);
                            closeDialog();
                            showTipsDialog(common_result, str_update_onlineupdate_installsuccess,function(){
                                setTimeout(goSucess,3000);
                            });
                        }
                        flag=true;
                        break;
                    case UPGRADE_FAILURE:
                        if(flag==false) {
                            clearTimeout(timeout1);
                            closeDialog();
                            showResultDialog(common_result, str_update_onlineupdate_installfailed, 3000);
                        }
                        flag=true;
                        break;
                    default :
                        break;
                }
            }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_IPC){
                clearTimeout(timeout1);
                closeDialog();
                showResultDialog(common_result, str_update_error_ipc, 3000,dialog_align_left);
            }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_PROCESS){
                clearTimeout(timeout1);
                closeDialog();
                showResultDialog(common_result, str_update_error_process, 3000,dialog_align_left);
            }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_FOTA_UPGRDING){
                clearTimeout(timeout1);
                closeDialog();
                showResultDialog(common_result, str_update_error_fota_upgrding, 3000,dialog_align_left);
            }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_LOCAL_UPGRDING){
                clearTimeout(timeout1);
                closeDialog();
                showResultDialog(common_result, str_update_error_local_upgrding, 3000,dialog_align_left);
            }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_TR069_UPGRDING){
                clearTimeout(timeout1);
                closeDialog();
                showResultDialog(common_result, str_update_error_tr069_upgrding, 3000,dialog_align_left);
            }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_PRODUCTION_UPGRDING){
                clearTimeout(timeout1);
                closeDialog();
                showResultDialog(common_result, str_update_error_production_upgrding, 3000,dialog_align_left);
            }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_OPT_MODULE_FAILED){
                clearTimeout(timeout1);
                closeDialog();
                showResultDialog(common_result, str_update_error_opt_module_failed, 3000,dialog_align_left);
            }else{
                clearTimeout(timeout1);
                closeDialog();
                showResultDialog(common_result, common_failed,3000);
            }
        }, {
            async: true,
            timeout:1000
        });
    }
    function getDeviceInfo(){
        getAjaxJsonData("/action/get_device_info", function(obj){
            g_deviceInfo = {};
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                g_deviceInfo.softwareVersion = obj.swv;
                g_deviceInfo.hardwareVersion = obj.hwv;
                if (g_deviceInfo.softwareVersion){
                    $("#cursoftver").text(g_deviceInfo.softwareVersion);
                } else {
                    $("#cursoftver").text(common_unknown);
                }
                if (g_deviceInfo.hardwareVersion){
                    $("#curhardver").text(g_deviceInfo.hardwareVersion);
                } else {
                    $("#curhardver").text(common_unknown);
                }
            }
        }, {
            async: false
        });
    }

    function chaneUPtype(){
        if($("#updatetype").val()===UPDATE_LOCAL){
            $("#onlinebtn").hide();
            $("#newver").hide();
            $("#myform").show();
        }else if($("#updatetype").val()===UPDATE_ONLINE){
            $("#onlinebtn").show();
            $("#myform").hide();
            if( $("#check").val()===str_update_onlineupdate_doupdate){
                $("#newver").show();
            }
        }else{
           // alert($("#updatetype").val());
        }
    }

    function selfile(){
        var filepath=$("#fileId").val();
        var filenames=filepath.split("\\");
        $("#txt").val(filenames[filenames.length-1]);
    }

    var options = {
        type: 'POST',
        url: '/action/firmware_upgrade',
        dataType: "json",
        async: false,
        beforeSend: function (XMLHttpRequest) {
            getxCsrfTokens();
            XMLHttpRequest.setRequestHeader("X-Csrf-Token", localStorage.getItem('XCsrfToken'));
        },
        complete: function( xhr){
            var wpoInfoA = {
                "XCsrfToken" : xhr.getResponseHeader('X-Csrf-Token')
            };
            window.localStorage.setItem('XCsrfToken',wpoInfoA.XCsrfToken)
        },
        success:showResponse,
        dateType: "json",

        error : function(xhr, status, err) {
            closeDialog();
            showResultDialog(common_result, str_system_update_upload_error, 3000,dialog_align_left);
        }
    };

    function update(){
        if ($('#fileId').val()=="") {
            return false;
        }
        showConfirmDialog(common_confirm, str_system_update_tips1, function(){
            var fileName, fileNameSplit;
            var data = {},postdata;
            fileName = $("#txt").val();
            fileNameSplit = fileName.split(".");
            filtFormat = fileNameSplit[fileNameSplit.length-1].toLowerCase();
            closeDialog();
            if(filtFormat != "img" && filtFormat != "bin"){
                closeDialog();
                showResultDialog(common_result, str_system_update_file_error1, 3000,dialog_align_left);
                return false;
            }
            showWaitingDialog(common_waiting,str_system_update_uploading,dialog_align_left);
            postdata = JSON.stringify(data);
            saveAjaxJsonData("/action/get_upgrade_status",postdata, function(data){
                var obj = data2Object(data);
                if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                    stopLogoutTimer();
                    $("#myform").ajaxSubmit(options);
                }else if (typeof obj.retcode === "number" && obj.retcode === MEIG_ERROR_IPC) {
                    showResultDialog(common_result, str_update_error_ipc, 3000,dialog_align_left);
                }else if (typeof obj.retcode === "number" && obj.retcode === MEIG_ERROR_PROCESS) {
                    showResultDialog(common_result, str_update_error_process, 3000,dialog_align_left);
                }else if (typeof obj.retcode === "number" && obj.retcode === MEIG_ERROR_FOTA_UPGRDING) {
                    showResultDialog(common_result, str_update_error_fota_upgrding, 3000,dialog_align_left);
                }else if (typeof obj.retcode === "number" && obj.retcode === MEIG_ERROR_LOCAL_UPGRDING) {
                    showResultDialog(common_result, str_update_error_local_upgrding, 3000,dialog_align_left);
                }else if (typeof obj.retcode === "number" && obj.retcode === MEIG_ERROR_TR069_UPGRDING) {
                    showResultDialog(common_result, str_update_error_tr069_upgrding, 3000,dialog_align_left);
                }else if (typeof obj.retcode === "number" && obj.retcode === MEIG_ERROR_PRODUCTION_UPGRDING) {
                    showResultDialog(common_result, str_update_error_production_upgrding, 3000,dialog_align_left);
                }else{
                    showResultDialog(common_result, str_system_update_upload_error, 3000,dialog_align_left);
                }
            }, {
                async: true
            });
        },dialog_align_left);
        return false;
    }

    function showResponse(data, statusText, xhr, $form){
        var obj = data2Object(data);
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            closeDialog();
            showWaitingDialog(common_waiting,str_update_update_installing,dialog_align_left);
            if(filtFormat == "img"){
                setTimeout(getUpdateStatus,10000);
            }else if(filtFormat == "bin"){
                getUpdateLoading();
            }
        } else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_NOTFOUND){
            closeDialog();
            showResultDialog(common_result, str_update_error_notfound, 3000,dialog_align_left);
        }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_PROCESSING){
            closeDialog();
            showResultDialog(common_result, str_update_error_processing, 3000,dialog_align_left);
        }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_IPC){
            closeDialog();
            showResultDialog(common_result, str_update_error_ipc, 3000,dialog_align_left);
        }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_PROCESS){
            closeDialog();
            showResultDialog(common_result, str_update_error_process, 3000,dialog_align_left);
        }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_FOTA_UPGRDING){
            closeDialog();
            showResultDialog(common_result, str_update_error_fota_upgrding, 3000,dialog_align_left);
        }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_LOCAL_UPGRDING){
            closeDialog();
            showResultDialog(common_result, str_update_error_local_upgrding, 3000,dialog_align_left);
        }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_TR069_UPGRDING){
            closeDialog();
            showResultDialog(common_result, str_update_error_tr069_upgrding, 3000,dialog_align_left);
        }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_PRODUCTION_UPGRDING){
            closeDialog();
            showResultDialog(common_result, str_update_error_production_upgrding, 3000,dialog_align_left);
        }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_MALLOC){
            closeDialog();
            showResultDialog(common_result, str_update_error_malloc, 3000,dialog_align_left);
        }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_INVALID_PACK){
            closeDialog();
            showResultDialog(common_result, str_update_error_invalid_pack, 3000,dialog_align_left);
        }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_CHECK_RAW){
            closeDialog();
            showResultDialog(common_result, str_update_error_check_raw, 3000,dialog_align_left);
        }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_PARSE_PACK_HEAD){
            closeDialog();
            showResultDialog(common_result, str_update_error_parse_pack_head, 3000,dialog_align_left);
        }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_PACK_MAGIC){
            closeDialog();
            showResultDialog(common_result, str_update_error_pack_magic, 3000,dialog_align_left);
        }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_PACK_FILE_ID){
            closeDialog();
            showResultDialog(common_result, str_update_error_pack_file_id, 3000,dialog_align_left);
        }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_LATESET_VER){
            closeDialog();
            showResultDialog(common_result, str_update_error_lateset_ver, 3000,dialog_align_left);
        }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_STATUS){
            closeDialog();
            showResultDialog(common_result, str_update_error_status, 3000,dialog_align_left);
        }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_MAINBOARD_MD5){
            closeDialog();
            showResultDialog(common_result, str_update_error_mainboard_md5, 3000,dialog_align_left);
        }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_MODEM_MD5){
            closeDialog();
            showResultDialog(common_result, str_update_error_modem_md5, 3000,dialog_align_left);
        }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_NO_ENOUGH_SPACE){
            closeDialog();
            showResultDialog(common_result, str_update_error_no_enough_space, 3000,dialog_align_left);
        }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_MODEM){
            closeDialog();
            showResultDialog(common_result, str_update_error_modem, 3000,dialog_align_left);
        } else{
            closeDialog();
            showResultDialog(common_result, str_system_update_upload_error, 3000,dialog_align_left);
        }
        startLogoutTimer();
    }

    function getUpdateLoading() {
        startLogoutTimer();
        getAjaxJsonData("/goform/get_upgrade_prog", function (data) {
            var obj = data2Object(data);
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                var status = obj.status;
                switch (status) {
                    case UPGRADE_COMPLETED:
                        clearTimeout(UpdateLoadTimeout);
                        getUpdateStatus();
                        break;
                    default :
                        closeDialog();
                        showWaitingDialog(str_update_loading, str_update_update_installing + g_upgrade_Istatuslist[obj.istatus], dialog_align_left);
                        break;
                }
            }
        }, {
            async: false
        });
        UpdateLoadTimeout = setTimeout(getUpdateLoading, 1000);
    }
    function getUpdateStatus(){
        startLogoutTimer();
        var timeout1 = setTimeout(getUpdateStatus,3000);
        getAjaxJsonData("/goform/get_upgrade_result", function(data){
            var obj = data2Object(data);
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                var  status=obj.status;
                switch (status){
                    case UPGRADE_SUCCESS:
                        if(changeflag==false){
							clearTimeout(timeout1);
                            closeDialog();
                            showResultDialog(common_result, str_system_update_success, 3000);
                        }
                        changeflag=true;
                        break;
                    case UPGRADE_FAILURE:
                        if(changeflag==false) {
							clearTimeout(timeout1);
                            closeDialog();
                            showResultDialog(common_result, str_system_update_error, 3000);
                        }
                        changeflag=true;
                        break;
                    default :
                        break;
                }
            }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_IPC){
                closeDialog();
                showResultDialog(common_result, str_update_error_ipc, 3000,dialog_align_left);
            }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_PROCESS){
                closeDialog();
                showResultDialog(common_result, str_update_error_process, 3000,dialog_align_left);
            }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_OPT_MODULE_FAILED){
                closeDialog();
                showResultDialog(common_result, str_update_error_opt_module_failed, 3000,dialog_align_left);
            }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_FOTA_UPGRDING){
                closeDialog();
                showResultDialog(common_result, str_update_error_fota_upgrding, 3000,dialog_align_left);
            }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_LOCAL_UPGRDING){
                closeDialog();
                showResultDialog(common_result, str_update_error_local_upgrding, 3000,dialog_align_left);
            }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_TR069_UPGRDING){
                closeDialog();
                showResultDialog(common_result, str_update_error_tr069_upgrding, 3000,dialog_align_left);
            }else if (typeof obj.retcode === "number"  && obj.retcode === MEIG_ERROR_PRODUCTION_UPGRDING){
                closeDialog();
                showResultDialog(common_result, str_update_error_production_upgrding, 3000,dialog_align_left);
            }else{
                closeDialog();
                showResultDialog(common_result, str_system_update_error, 3000);
            }
        }, {
            async: false
        });
    }



