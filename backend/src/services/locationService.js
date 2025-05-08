const geolib = require('geolib');
const { getFirestore } = require('firebase-admin/firestore');
const { db, admin } = require('../config/firebase');

class LocationService {
    constructor() {
        this.locations = [];
        this.startTime = null;
        this.db = getFirestore();
    }

    startTracking() {
        this.locations = [];
        this.startTime = new Date();
        console.log('GPS tracking started');
    }

    addLocation(latitude, longitude) {
        const timestamp = new Date();
        this.locations.push({ latitude, longitude, timestamp });
    }

    async stopTracking(userId) {
        if (this.locations.length < 0) {
            throw new Error('Not enough data points to calculate metrics');
        }

        const endTime = new Date();
        const duration = (endTime - this.startTime) / 1000; // in seconds
        const distance = this.calculateTotalDistance();
        const speed = distance / (duration / 3600); // km/h

        // Save to Firebase
        await this.saveWorkout(userId, {
            distance,
            duration,
            speed,
            startTime: this.startTime,
            endTime: endTime,
            locations: this.locations
        });

        return { distance, duration, speed };
    }

    calculateTotalDistance() {
        let totalDistance = 0; // in meters
        for (let i = 1; i < this.locations.length; i++) {
            const prev = this.locations[i-1];
            const curr = this.locations[i];
            
            totalDistance += geolib.getDistance(
                { latitude: prev.latitude, longitude: prev.longitude },
                { latitude: curr.latitude, longitude: curr.longitude }
            );
        }
        return totalDistance / 1000; // convert to kilometers
    }

    async saveWorkout(userId, workoutData) {
        try {
            const docRef = db.collection('workouts').doc();
            await docRef.set({
                userId,
                ...workoutData,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log('Workout saved to Firestore');
        } catch (error) {
            console.error('Error saving workout:', error);
            throw error;
        }
    }

    async getUserWorkouts(userId) {
        try {
            const snapshot = await db.collection('workouts')
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get();
            
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error fetching workouts:', error);
            throw error;
        }
    }
}

module.exports = new LocationService();