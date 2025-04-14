const { analytics } = require('../config/firebase');

function logEvent(userId, eventName, eventParams = {}) {
    try {
        analytics.logEvent({
            userId,
            name: eventName,
            params: {
                ...eventParams,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error logging analytics event:', error);
    }
}

function errorHandler(err, req, res, next) {
    // Log error to Firebase Crashlytics
    console.error('Application error:', err);
    
    // Log error event to Analytics
    logEvent(req.user?.id || 'anonymous', 'app_error', {
        error: err.message,
        route: req.path,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });

    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
}

function trackRequest(req, res, next) {
    const startTime = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        
        logEvent(req.user?.id || 'anonymous', 'api_request', {
            method: req.method,
            path: req.path,
            status: res.statusCode,
            duration,
            userAgent: req.headers['user-agent']
        });
    });
    
    next();
}

module.exports = {
    errorHandler,
    trackRequest,
    logEvent
};