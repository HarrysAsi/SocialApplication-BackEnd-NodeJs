class InternalServerErrorCodes {
    constructor() {

    }

    errorCodes(code) {
        switch (code) {
            case 0:
                return "Success";
            case -1:
                return "Authentication Failed";
            case -2:
                return "Bad request formatting";
            case -3:
                return "Image unexpected formatting";
            default: //Any other unhandled error
                return "Something went wrong, please try again";
        }
    }

    mySqlErrorCodes(code) {

        switch (code) {
            case -1:
                return "Bad Request Format";
            case "ER_DUP_ENTRY": // duplicate entry for --id --unique sql field
                return "Duplicate Entry";
            case "ECONNREFUSED": // Connection with mySql has been refused
                return "Internal Error, please contact with the administrator for further info";
            case "ER_BAD_NULL_ERROR":
                return "Bad Request";
            default: //Any other unhandled error (Criticals)
                return "Internal Error, please contact with the administrator for further info.";
        }
    }
}

module.exports = InternalServerErrorCodes;