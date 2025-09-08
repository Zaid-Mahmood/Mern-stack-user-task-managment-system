export const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res , next))
            .catch((err) => {
                const statusCode = err.statusCode || 500;
                const message = err.message || "Something went wrong";

                // Don't call next after sending response
                return res.status(statusCode).json({
                    success: false,
                    message: message,
                    errors: err.errors || []
                });
            });
    };
};
