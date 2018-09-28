module.exports = class CustomResponse {
    constructor(res, req, message, code, params) {
        this.res = res;
        this.req = req;
        this.message = message || "Unknown";
        this.code = code || 200;
        this.params = params || {};
        this.responseTime = new Date();
        this.init();
    }

    init() {
        let parameters = {};
        let response;
        if (!this.params.empty)
            parameters = this.params;
        if(this.code === 200) {
            response = {
                "Code": this.code,
                "ResponseTime": this.responseTime,
                "Data": parameters
            };
        } else {
            response = {
                "Code": this.code,
                "ErrorMessage": this.message,
                "ResponseTime": this.responseTime,
                "Data": parameters
            };
        }
        this.response(response);
    }

    response(response){
        if (this.code === 200) {
            this.res.status(this.code).json({
                "success": response
            });
        } else {
            this.res.status(this.code).json({
                "error": response
            });
        }
    }
};