var pec_piscTableApiUtils = Class.create();
pec_piscTableApiUtils.prototype = {
    initialize: function () { },

    /**
     * 指定テーブルのレコードのsys_idを取得
     * 
     * 
     */
    getTargetRecordSysId: function (tableName, query) {

        var recordSysId = "";

        var callParams = {};
        callParams.apiName = "Get_Record";
        callParams.tableName = tableName;
        callParams.query = query;

//        gs.info("callParams.tableName: " + callParams.tableName);
//        gs.info("callParams.query: " + callParams.query);

        var targetRecord = this.apiSendCall(callParams);

        if (targetRecord.status == "200") {
            if (targetRecord.body != "") {
                if (targetRecord.body.result[0].sys_id != "") {
                    recordSysId = targetRecord.body.result[0].sys_id.toString();
                }
            }
        }

        return recordSysId;
    },


    /**
     * データ登録
     * action
     * bodyParams
     * 
     */
    sendToPISC: function (action, requestParams, requestBody) {
        var result;

        var callParams = {};

        if (action == "create") {
            callParams.apiName = "Create_Record";
        } else if (action == "update") {
            callParams.apiName = "Update_Record";
        }

        callParams.requestParams = requestParams;
        callParams.requestBody = requestBody;

        var sendToPISCRes = this.apiSendCall(callParams);

        result = sendToPISCRes;

        return result;
    },


    /**
     * @description call API and pick up messsage from response
     * @param {string} method 
     */
    apiSendCall: function (params) {

        var res = {};
        var apiName = params.apiName.toString();

        switch (apiName) {

            // レコードSysID取得            
            case "Get_Record":
                var getRecordUtil = new global.pec_webServiceUtils(apiName);

                var getRecordResponse = getRecordUtil.request({
                    'tableName': params.tableName.toString(),
                    'query': params.query.toString()
                });
                if (getRecordResponse.status != getRecordUtil.STATUS.OK) {
                    //ERROR
                    gs.error("[PEC][apiSendCall][Get_Record] status = " + getRecordResponse.status +
                        " *** error message = " + getRecordResponse.errMessage);
                    //                    throw getRecordResponse.errMessage;
                } else {
                    gs.info("[PEC][apiSendCall][Get_Record] status =" + getRecordResponse.status +
                        " *** kekka = " + getRecordResponse.body);
                    //                    result = getRecordResponse.body;
                }
                res.status = getRecordResponse.status;
                //                res.body = JSON.parse(workflowCreateResponse.body);
                try {
                    res.body = JSON.parse(getRecordResponse.body);
                } catch (error) {
                    res.body = "";
                }

                break;

            // レコード作成
            case "Create_Record":
                var createUtil = new global.pec_webServiceUtils(apiName);

                var createResponse = createUtil.requestBySetRequestBody(params.requestBody);

                if (createResponse.status != createUtil.STATUS.POST_OK) {
                    //ERROR
                    gs.error("[PEC][apiSendCall][Create_Record] status = " + createResponse.status +
                        " *** error message = " + createResponse.errMessage);
                    //                    throw workflowCreateResponse.errMessage;
                    //                    result = workflowCreateResponse.status;

                } else {
                    gs.info("[PEC][apiSendCall][Create_Record] status =" + createResponse.status +
                        " *** kekka = " + createResponse.body);
                    //                    result = workflowCreateResponse.body;
                }
                res.status = createResponse.status;
                //                res.body = JSON.parse(workflowCreateResponse.body);
                try {
                    res.body = JSON.parse(createResponse.body);
                } catch (error) {
                    res.body = "";
                }

                break;

            // レコード更新
            case "Update_Record":
                var updateUtil = new global.pec_webServiceUtils(apiName);

                var updateResponse = updateUtil.requestBySetRequestBodyWithEncodedParams({
                    'record_sys_id': params.requestParams.record_sys_id

                }, params.requestBody);

                if (updateResponse.status != updateUtil.STATUS.OK) {
                    //ERROR
                    gs.error("[PEC][apiSendCall][Update_Record] status = " + updateResponse.status +
                        " *** error message = " + updateResponse.errMessage);
                    //                    throw workflowUpdateResponse.errMessage;
                    //                    result = workflowUpdateResponse.status;
                } else {
                    gs.info("[PEC][apiSendCall][Update_Record] status =" + updateResponse.status +
                        " *** kekka = " + updateResponse.body);
                    //                    result = workflowUpdateResponse.body;
                }
                res.status = updateResponse.status;
                //                res.body = JSON.parse(workflowUpdateResponse.body);
                try {
                    res.body = JSON.parse(updateResponse.body);
                } catch (error) {
                    res.body = "";
                }

                break;

        }

        //        var res = JSON.parse(result);

        return res;
    },

    type: 'pec_piscTableApiUtils'
};
