/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

exports.storeDataInFirestore = functions.https.onRequest(async (req, res) => {
    // Set CORS headers for preflight requests
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    
    // Return 200 for preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        res.status(200).send('');
        return;
    }

    // Ensure this is a POST request
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }
    
    try {
        // Get data from the request body
        const data = req.body;

        // Add a new document with a generated ID to the 'contacts' collection
        const newDocRef = await db.collection('contactForm').add(data);

        // Respond with the ID of the newly created document
        res.status(201).send({ id: newDocRef.id });
    } catch (error) {
        console.error('Error storing data in Firestore', error);
        res.status(500).send('Internal Server Error');
    }
});

