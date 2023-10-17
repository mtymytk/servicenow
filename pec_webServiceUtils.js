var pec_webServiceUtils = Class.create();
pec_webServiceUtils.prototype = {
	
    initialize: function(method) {
        this._restMessage = "global.PISC_Table_API";
        this._method = method;
        this.STATUS = {
            INTERNAL_ERR: "INTERNAL_ERR",
            OK: 200,
            POST_OK: 201
        };
    },

    _generateResponseBody: function(status, body, errCode, errMessage) {
        return {
            status: status,
            body: body,
            errCode: errCode,
            errMessage: errMessage
        };
    },

    request: function(params) {
        try {
            var r = new sn_ws.RESTMessageV2(this._restMessage, this._method);
            for (var key in params) {
                r.setStringParameterNoEscape(key, params[key]);
                //				r.setStringParameter(key, params[key]);

                //                gs.info("wmt_WebServiceUtil setStringParameterNoEscape: " + "key : " + key + " params[key] : " + params[key]);
            }

            var response = r.execute();
            var responseBody = response.getBody();
            var httpStatus = response.getStatusCode();
            var errCode = response.getErrorCode();
            var errMessage = response.getErrorMessage();
            if (httpStatus != this.STATUS.OK) {
                //                gs.error("wmt_WebServiceUtil Error: " + errMessage);
            }
            return this._generateResponseBody(httpStatus, responseBody, errCode, errMessage);
        } catch (ex) {
            var message = ex.getMessage();
            //            gs.error("wmt_WebServiceUtil Error: " + message);
            return this._generateResponseBody(this.STATUS.INTERNAL_ERR, "", this.STATUS.INTERNAL_ERR, message);
        }
    },

    encodedRequest: function(params) {
        for (var key in params) {
            params[key] = encodeURIComponent(params[key]);
        }
        return this.request(params);
    },

    requestBySetRequestBody: function(requestBody) {
        try {
            var r = new sn_ws.RESTMessageV2(this._restMessage, this._method);

            r.setRequestBody(JSON.stringify(requestBody));

            // タイムアウト時間設定（ミリ秒）
            //r.setHttpTimeout(1);

            var response = r.execute();
            var responseBody = response.getBody();
            var httpStatus = response.getStatusCode();
            var errCode = response.getErrorCode();
            var errMessage = response.getErrorMessage() + " " + responseBody;
            if (httpStatus != this.STATUS.OK) {
                //                gs.error("wmt_WebServiceUtil Error: " + errMessage);
            }
            return this._generateResponseBody(httpStatus, responseBody, errCode, errMessage);
        } catch (ex) {
            var message = ex.getMessage();
            //            gs.error("wmt_WebServiceUtil Error: " + message);
            return this._generateResponseBody(this.STATUS.INTERNAL_ERR, "", this.STATUS.INTERNAL_ERR, message);
        }
    },

    requestBySetRequestBodyWithEncodedParams: function(params, requestBody) {
        for (var key in params) {
            params[key] = encodeURIComponent(params[key]);
        }
        return this.requestBySetRequestBodyWithParams(params, requestBody);
    },

    requestBySetRequestBodyWithParams: function(params, requestBody) {
        try {
            var r = new sn_ws.RESTMessageV2(this._restMessage, this._method);

            for (var key in params) {
                r.setStringParameterNoEscape(key, params[key]);
                //				r.setStringParameter(key, params[key]);

                //                gs.info("wmt_WebServiceUtil setStringParameterNoEscape: " + "key : " + key + " params[key] : " + params[key]);
            }

            r.setRequestBody(JSON.stringify(requestBody));

            // タイムアウト時間設定（ミリ秒）
            //r.setHttpTimeout(1);

            var response = r.execute();
            var responseBody = response.getBody();
            var httpStatus = response.getStatusCode();
            var errCode = response.getErrorCode();
            var errMessage = response.getErrorMessage() + " " + responseBody;
            if (httpStatus != this.STATUS.OK) {
                //                gs.error("wmt_WebServiceUtil Error: " + errMessage);
            }
            return this._generateResponseBody(httpStatus, responseBody, errCode, errMessage);
        } catch (ex) {
            var message = ex.getMessage();
            //            gs.error("wmt_WebServiceUtil Error: " + message);
            return this._generateResponseBody(this.STATUS.INTERNAL_ERR, "", this.STATUS.INTERNAL_ERR, message);
        }
    },

    type: 'pec_webServiceUtils'
};