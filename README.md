
## This project provides examples of the next Firebase features:
> * The Firebase Realtime Database is a cloud-hosted NoSQL.
> * Firestore CRUD Collection + real-time updates
> * Firebase Auth signup

----

##### // config json

```
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};
```

---
#####  Firebase Console
https://console.firebase.google.com/u/0/project/fir-9-app-c602d/firestore/data/~2Fusers~2F1R9TQygMUWvS8MGuDJx1

---- 

##### Add SDKs for Firebase products that you want to use
https://firebase.google.com/docs/web/setup#available-libraries


##### src/indexjs

```
// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {
  getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';

import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';
```

```
const firebaseConfig = {
  apiKey: "AIzaSyDWaL05RsCwiOaTY7XJ22Yfky14l1zEAG4",
  authDomain: "fir-9-app-c602d.firebaseapp.com",
  projectId: "fir-9-app-c602d",
  storageBucket: "fir-9-app-c602d.appspot.com",
  messagingSenderId: "967892818152",
  appId: "1:967892818152:web:b4464527b8b7072204115d",
  measurementId: "G-2WS9D6EHMS"
};
```



##### // Init Firebase app
```
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
```

##### // Init Firebase services

```
const db = getFirestore();
const auth = getAuth();
// collection ref
const colRef = collection(db, 'users');
```

##### // Firebase collection - get data

```
getDocs(colRef).then((snapshot) => {
  let users = [];
  snapshot.docs.forEach(doc => users.push({...doc.data(), id: doc.id}));
  console.log('getDocs (on init)', users);
}).catch(err => console.log(err.message));
```

##### // Real-time collection data

```
const unsubCol = onSnapshot(colRef, (snapshot) => {
  let users = [];
  snapshot.docs.forEach(doc => users.push({...doc.data(), id: doc.id}));
  console.log('onSnapshot (real time)', users);
});
```

##### // Query Example
- !!! orderBy - should have index !!!
  https://console.firebase.google.com/u/0/project/fir-9-app-c602d/firestore/indexes

```
const q = query(colRef, where("age", "==", "444"), orderBy('createdAt'));
const unsubCol2 = onSnapshot(q, (snapshot) => {
  let users = [];
  snapshot.docs.forEach(doc => users.push({...doc.data(), id: doc.id}));
  console.log('onSnapshot (real time) query where ', users);
});
```

##### // Add Firebase document

```
addDoc(colRef, {
  email: 'example@gmail.com',
  age: 23,
  createdAt: serverTimestamp()
}).then(() => {});
```

##### // Deleting Firebase document

```
const docRef = doc(db, 'users', deleteUserForm.id.value)
deleteDoc(docRef).then(() => {})
```

##### // Update Firebase document

```
const updateUserForm = document.querySelector('.update');
const docRef = doc(db, 'users', updateUserForm.id.value)
updateDoc(docRef, {email: 'example@gmail.com'})
  .then(() => {
  // reset
});
```

##### // Get single doc ( user id = 3Oa8ufFb3To2qrBF5wlB )
  
```
const docRef = doc(db, 'users', '3Oa8ufFb3To2qrBF5wlB')
getDocs(docRef).then(doc => console.log(doc))
```

##### // Get single doc ( user id 3Oa8ufFb3To2qrBF5wlB ) - in real time

```
onSnapshot(docRef, (doc => console.log(doc)));
```

##### // Firebase Auth ( signup user )

```
createUserWithEmailAndPassword(auth, 'example@gmail.com', 'pass123')
  .then(cred => console.log('user created:', cred.user))
  .catch(err => console.log(err))
```

##### // Subscribe to auth changes

```
const unsubAuth = onAuthStateChanged(auth, user => console.log('user status changed:', user));
const unsubButton = document.querySelector('.unsub');
```

##### // Unsubscribe from changed

```
unsubButton.addEventListener('click', () => {
  console.log('unsubscribing');
  unsubCol();
  unsubCol2();
  unsubAuth();
});
```

