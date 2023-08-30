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
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDWaL05RsCwiOaTY7XJ22Yfky14l1zEAG4",
  authDomain: "fir-9-app-c602d.firebaseapp.com",
  projectId: "fir-9-app-c602d",
  storageBucket: "fir-9-app-c602d.appspot.com",
  messagingSenderId: "967892818152",
  appId: "1:967892818152:web:b4464527b8b7072204115d",
  measurementId: "G-2WS9D6EHMS"
};

// Init Firebase app
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Init services
const db = getFirestore();
const auth = getAuth();

// collection ref
const colRef = collection(db, 'users');

// queries

// collection data
getDocs(colRef).then((snapshot) => {
  let users = [];
  snapshot.docs.forEach(doc => users.push({...doc.data(), id: doc.id}));
  console.log('getDocs (on init)', users);

}).catch(err => console.log(err.message));

// real time collection data
const unsubCol = onSnapshot(colRef, (snapshot) => {
  let users = [];
  snapshot.docs.forEach(doc => users.push({...doc.data(), id: doc.id}));
  console.log('onSnapshot (real time)', users);
});

// real time collection data on query where age == 444 only!
// orderBy - should have index !
// https://console.firebase.google.com/u/0/project/fir-9-app-c602d/firestore/indexes
const q = query(colRef, where("age", "==", "444"), orderBy('createdAt'));
const unsubCol2 = onSnapshot(q, (snapshot) => {
  let users = [];
  snapshot.docs.forEach(doc => users.push({...doc.data(), id: doc.id}));
  console.log('onSnapshot (real time) query where ', users);
});


// adding docs
const addUserForm = document.querySelector('.add');
addUserForm.addEventListener('submit', (e) => {
  e.preventDefault()
  addDoc(colRef, {
    email: addUserForm.email.value,
    age: addUserForm.age.value,
    createdAt: serverTimestamp()
  }).then(() =>
    addUserForm.reset())
})

// deleting docs
const deleteUserForm = document.querySelector('.delete');
deleteUserForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'users', deleteUserForm.id.value)
  deleteDoc(docRef)
    .then(() =>
      deleteUserForm.reset())
})

// update docs
const updateUserForm = document.querySelector('.update');
updateUserForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const docRef = doc(db, 'users', updateUserForm.id.value)
  updateDoc(docRef, {
    email: updateUserForm.email.value,
  }).then(() => updateUserForm.reset())
})


// get single doc ( user id = 3Oa8ufFb3To2qrBF5wlB )
const docRef = doc(db, 'users', '3Oa8ufFb3To2qrBF5wlB')
// getDocs(docRef).then(doc => console.log(doc))
//
// ret single doc ( user id 3Oa8ufFb3To2qrBF5wlB ) - in real time
// onSnapshot(docRef, (doc => console.log(doc)));

const signupForm = document.querySelector('.signup');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = signupForm.mail.value
  const password = signupForm.pass.value

  createUserWithEmailAndPassword(auth, email, password)
    .then(cred => {
      console.log('user created:', cred.user);
      signupForm.reset();
    })
    .catch(err => console.log(err))
});

// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, user => {
  console.log('user status changed:', user);
});


const unsubButton = document.querySelector('.unsub');

unsubButton.addEventListener('click', () => {
  console.log('unsubscribing');
  unsubCol();
  unsubCol2();
  unsubAuth();
});
