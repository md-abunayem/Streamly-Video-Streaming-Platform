export const errorMiddleware = (error, req, res, next) => {
  if (res.headersSent) return next(error);

  const statusCode = error.statusCode || error.status || 500;
  const message =
    statusCode >= 500 && !error.statusCode
      ? "An unexpected server error occurred. Check the server logs."
      : error.message || "Something went wrong.";

  if (statusCode >= 500) {
    console.error("Request failed:", error);
  }

  return res.status(statusCode).json({
    statusCode,
    data: null,
    message,
    success: false,
    errors: error.errors || [],
  });
};
