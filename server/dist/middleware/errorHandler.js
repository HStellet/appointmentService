export default function errorHandler(err, _req, res, _next) {
    // keep logging minimal but useful
    console.error(err && err.stack ? err.stack : err);
    res.status(err?.status || 500).json({ error: err?.message || "Internal server error" });
}
