import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from 'cors';

admin.initializeApp();

const database = admin.database();
const corsHandler = cors({origin: true});

exports.publishNotification = functions.https.onRequest((request, response) => {
    corsHandler(request, response, () => {
        database.ref('notifications').push({ content: request?.body?.data?.message || '', isRead: false, createdAt: (new Date()).toISOString() });
        response.json({data: 'Notification sent!'});
    });
});

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

