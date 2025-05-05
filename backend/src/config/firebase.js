const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Cesta k služobnému účtu
const serviceAccountPath = path.join(__dirname, '../../firebase-service-account.json');

try {
  // Overenie existencie súboru
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error('Firebase service account file not found!');
  }

  const serviceAccount = require(serviceAccountPath);

  // Inicializácia Firebase
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
    });
    console.log('Firebase initialized successfully');
  }

  const db = admin.firestore();
  const auth = admin.auth();    

  module.exports = { admin, db, auth };
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  process.exit(1); // Ukončí aplikáciu pri chybe inicializácie
}