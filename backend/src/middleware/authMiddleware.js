const jwt = require('jsonwebtoken');
const { admin } = require('../config/firebase');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization token required' });
        }

        const token = authHeader.split(' ')[1];
        
        // Overenie Firebase tokenu
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = {
            id: decodedToken.uid,
            email: decodedToken.email
        };
        
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = { authenticate };