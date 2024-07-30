/**
 * Importing necessary modules and components from respective libraries
 */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from 'cors';

/**
 * Initializing Firebase admin SDK
 */
admin.initializeApp();

/**
 * Getting a reference to the Firebase Realtime Database
 */
const database = admin.database();

/**
 * Setting up CORS middleware
 */
const corsHandler = cors({origin: true});

/**
 * Firebase Cloud Function to publish a notification
 * This function is triggered by an HTTP request
 * It adds a new notification to the 'notifications' reference in the Realtime Database
 */
exports.publishNotification = functions.https.onRequest((request, response) => {
    corsHandler(request, response, () => {
        database.ref('notifications').push({ content: request?.body?.data?.message || '', isRead: false, createdAt: (new Date()).toISOString() });
        response.json({data: 'Notification sent!'});
    });
});

/**
 * Firebase Cloud Function to update a notification
 * This function is triggered by an HTTP request
 * It updates the 'isRead' field of a specific notification in the 'notifications' reference in the Realtime Database
 */
exports.updateNotification = functions.https.onRequest((request, response) => {
    corsHandler(request, response, async () => {
        const id = request?.body?.data?.id;
        if (!id) {
            response.status(400).json({ error: 'Missing id in request body' });
            return;
        }

        const notificationRef = database.ref(`notifications/${id}`);
        const snapshot = await notificationRef.once('value');
        if (!snapshot.exists()) {
            response.status(404).json({ error: 'Notification not found' });
            return;
        }

        await notificationRef.update({ isRead: true });
        response.json({ data: 'Notification updated!' });
    });
});