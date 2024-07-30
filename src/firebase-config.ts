import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";

// TODO: Use a configuration object
const app = initializeApp({
    projectId: 'fir-assignment-f2a6a',
    appId: '',
    databaseURL: 'https://fir-assignment-f2a6a.firebasedatabase.app',
    storageBucket: '',
    apiKey: '',
    authDomain: '',
    messagingSenderId: '',
});

const firestore = getFirestore(app);
const functions = getFunctions(app);

const database = getDatabase(app);

// eslint-disable-next-line no-restricted-globals
if (location.hostname === 'localhost') {
    connectFirestoreEmulator(firestore, 'localhost', 8080);
    connectFunctionsEmulator(functions, 'localhost', 5001);
    connectDatabaseEmulator(database, 'localhost', 9000);
}

export { firestore, functions, database };