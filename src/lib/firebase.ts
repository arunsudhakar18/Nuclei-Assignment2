import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyDWBBwWLvCUYw86XeIWB1aJ2Sru22BKXbU',
	authDomain: 'todo-app-dbbfa.firebaseapp.com',
	projectId: 'todo-app-dbbfa',
	storageBucket: 'todo-app-dbbfa.appspot.com',
	messagingSenderId: '492885013897',
	appId: '1:492885013897:web:f974ce7686bade16ec1d58',
	measurementId: 'G-10STJYZWVZ'
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
