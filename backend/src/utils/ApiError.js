/*
This file gets created because we want to create a different structure 
to handle errors in api since in normal Errors we only get message and stack
but for api we also need statuscode and the precise reason for error so we extend 
error class to restructure the Error class of js
*/

class ApiError extends Error{
    constructor (
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors
        if(stack) {
            this.stack = stack
        }else {
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}