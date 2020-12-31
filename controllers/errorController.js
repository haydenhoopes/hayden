const httpStatus = require("http-status-codes");

module.exports = {
    logErrors: (error, req, res, next) => {
        console.error(error.stack);
        next(error);
    },
    respondNoResourceFound: ( req, res) => {
        res.status(httpStatus.StatusCodes.NOT_FOUND);
        res.render("error/notFound");
    },

    respondInternalError: (error, req, res, next) => {
        res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR);
        res.send({error: httpStatus.getReasonPhrase(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR)});
    }
}