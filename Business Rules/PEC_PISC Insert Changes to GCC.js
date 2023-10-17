(function executeRule(current, previous /*null when async*/ ) {
    //PISCインスタンスのu_support_desk_inquiryテーブルにレコードを挿入する
    var action = "create";
    var successfulResponceStatus = false;
    var count = 5;

    //連携エラー時に5回までリトライする
    while (successfulResponceStatus == false && count > 0) {
        count--;
        var requestBody = {};
        var requestParams = {};

        var sendResult = "";
        var piscRecordSysid = "";

        //項目設定										
        requestBody.u_support_desk_group = "118358f81b5a0c182d7c4226cc4bcbaf"; //固定sys_id（GCCのgroup）
        requestBody.u_name_in_kana = current.caller_id.u_last_name_kana + current.caller_id.u_first_name_kana; //起票者のユーザマスタのビジネスカナ姓（Last name Kana）　＋　ビジネスカナ名（First name Kana）
        requestBody.u_name_in_kanji = current.caller_id.name.toString(); //起票者のユーザマスタのビジネス社内姓　＋　ビジネス社内名（Name）
        requestBody.u_email_address = current.caller_id.email.toString(); //起票者のユーザマスタのＥメールアドレス情報（Email）
        requestBody.u_external_telephone_number = current.caller_id.phone.toString(); //起票者のユーザマスタの外線電話番号１（Business phone）
        requestBody.u_short_description = current.short_description.toString(); //インシデントのタイトル
        requestBody.u_description = current.description.toString(); //インシデントの詳細
        requestBody.u_cc_mailing_list = watchList(); //インシデントの共有者（PISCのsys_userテーブルでsys_idをGETして、sys_idを連携）
        requestBody.u_global_id = current.caller_id.user_name.toString(); //起票者のGlobal ID（User ID）
        requestBody.u_hardware_management_no = new global.pec_piscTableApiUtils().getTargetRecordSysId("u_itam_vvuai0004", "u_hrd_knr_no=" + current.u_hard_management_number); //インシデントのハード管理No（PISCのu_itam_vvuai0004テーブルでsys_idをＧｅｔして、sys_idを連携）
        requestBody.u_pec_incident_sys_id = current.getUniqueValue(); //インシデントのレコードのsys_id

        var createRes = new global.pec_piscTableApiUtils().sendToPISC(action, requestParams, requestBody);

        if (createRes.status == "201") {
            successfulResponceStatus = true;

            if (createRes.body != "") {
                if (createRes.body.result.sys_id != "") {
                    piscRecordSysid = createRes.body.result.sys_id.toString();
                    sendResult = createRes.status;
                }
            } else {
                sendResult = "999";
            }

        } else {
            sendResult = "999";
        }
    }

    gs.info("sendResult : " + sendResult);
    gs.info("piscRecordSysid : " + piscRecordSysid);

    if (!successfulResponceStatus) {
        // エラーメール通知
        var parms = {};
        parms.operation = "create";
        parms.code = createRes.status;
        parms.detail = createRes.body.error.detail;
        parms.message = createRes.body.error.message;
        parms.piscSysId = createRes.body.result.sys_id;

        new global.pec_eventUtils().sendMailEvent("pec_pisc_send_error", current, JSON.stringify(parms));
    }

    //currentレコードを更新。PISCのレコードに合わせてStateを新規にする。
    current.u_pisc_record_sysid = piscRecordSysid;
    current.u_pisc_api_result = sendResult;
    current.state = 1;
    current.update();

    // Watch ListのユーザーのPISCインスタンスのsys_idを取得
    function watchList() {
        var piscWatchList = [];
        var piscUserSysid = "";
        var tableName = "sys_user";

        var pecWatchList = current.watch_list.split(",");
        for (var i = 0; i < pecWatchList.length; i++) {
            var pecUser = new GlideRecord("sys_user");
            pecUser.get(pecWatchList[i]);
            var value = pecUser.user_name;
            var query = "user_name=" + value;
            piscUserSysid = new global.pec_piscTableApiUtils().getTargetRecordSysId(tableName, query);
            // gs.info("piscUserSysid : " + piscUserSysid);
            piscWatchList.push(piscUserSysid.toString());
        }
        return piscWatchList.join();
    }

})(current, previous);