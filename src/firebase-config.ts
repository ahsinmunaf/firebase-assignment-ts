/**
 * Importing necessary modules and components from respective libraries
 */
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";

/**
 * Firebase configuration object
 * TODO: Replace with your own Firebase project details
 */
const app = initializeApp({
    projectId: 'fir-assignment-f2a6a',
    appId: '',
    databaseURL: 'https://fir-assignment-f2a6a.firebasedatabase.app',
    storageBucket: '',
    apiKey: '',
    authDomain: '',
    messagingSenderId: '',
});

/**
 * Initializing Firestore, Functions, and Database services
 */
const firestore = getFirestore(app);
const functions = getFunctions(app);
const database = getDatabase(app);

/**
 * Connecting to Firebase emulators when running on localhost
 */
// eslint-disable-next-line no-restricted-globals
if (location.hostname === 'localhost') {
    connectFirestoreEmulator(firestore, 'localhost', 8080);
    connectFunctionsEmulator(functions, 'localhost', 5001);
    connectDatabaseEmulator(database, 'localhost', 9000);
}

/**
 * Exporting Firestore, Functions, and Database services for use in other modules
 */
export { firestore, functions, database };