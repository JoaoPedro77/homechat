import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBld1AuiofS8_0d6ntjz5vwx-gDY99BA60',
  authDomain: 'homechat-5d320.firebaseapp.com',
  projectId: 'homechat-5d320',
  storageBucket: 'homechat-5d320.firebasestorage.app',
  messagingSenderId: '142930405705',
  appId: '1:142930405705:web:e0637800d7ee22cf969298',
  measurementId: 'G-YTDVGDGRT8'
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
