function errorMiddleware(err, req, res, next){
    const msg = err.message || "Internal server error"
    const status = err.statusCode || 500

    res.status(status).json({msg})
}

module.exports = errorMiddleware