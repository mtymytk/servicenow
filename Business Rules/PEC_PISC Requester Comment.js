(function executeRule(current, previous /*null when async*/) {
    //PISCインスタンスのu_support_desk_inquiryテーブルのレコードにて起票者が追加コメントを挿入する
	var action = "update";
    var successfulResponceStatus = false;
    var count = 5;

	var requestParams = {};
	//更新したいPISC側レコードのsys_idを設定
	requestParams.record_sys_id = current.u_pisc_record_sysid.toString();

    //連携エラー時に5回までリトライする
    while (successfulResponceStatus == false && count > 0) {
        count--;
		var requestBody = {};
		var sendResult = "";
		var piscRecordSysid = "";

		//項目設定
		requestBody.u_state = 3; //ステータス：対応中(3)
		requestBody.u_closed = ""; //クローズ日時（空）
		requestBody.u_description_dummy = current.comments.getJournalEntry(1); //追加コメント
	
		var updateRes = new global.pec_piscTableApiUtils().sendToPISC(action, requestParams, requestBody);

		if (updateRes.status == "200") {
            successfulResponceStatus = true;

			if (updateRes.body != "") {
				if (updateRes.body.result.sys_id != "") {
					piscRecordSysid = updateRes.body.result.sys_id.toString();
					sendResult = updateRes.status;
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

    //currentレコードを更新
	current.u_pisc_api_result = sendResult;
	current.update();

    if (!successfulResponceStatus) {
        // エラーメール通知										
        // var parms = {};										
        // new global.pec_eventUtils().sendMailEvent("global.pisc_send_error", current, parms);	
   }

})(current, previous);