class CustomApiError extends Error{
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode
    }
}

function createError(msg, status){
    throw new CustomApiError(msg, status)
}

module.exports = createError