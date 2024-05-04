import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    where,
    orderBy,
    serverTimestamp,
    getDoc,
    updateDoc,
} from 'firebase/firestore';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
};

// init firebase app
const app = initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const auth = getAuth();

// collection ref
const colRef = collection(db, 'books');

// queries
/* const q = query(
    colRef,
    where('author', '==', 'Cal Newport'),
    orderBy('title', 'desc')
); */
const q = query(colRef, orderBy('createdAt'));

/* // get collection data
getDocs(colRef)
    .then((snapshot) => {
        let books = [];
        snapshot.docs.forEach((doc) => {
            books.push({ ...doc.data(), id: doc.id });
        });
        console.log(books);
    })
    .catch((err) => console.log(err)); */

// get real time collection data, listen to the data
const unsubCol = onSnapshot(q, (snapshot) => {
    // this function runs everytime when there is a change in the collection
    let books = [];
    snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id });
    });
    console.log(books);
});

// add document
const addBookForm = document.querySelector('.add');
addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addDoc(colRef, {
        title: addBookForm.title.value,
        author: addBookForm.author.value,
        createdAt: serverTimestamp(),
    }).then(() => {
        addBookForm.reset();
    });
});

// delete document
const deleteBookForm = document.querySelector('.delete');
deleteBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const docRef = doc(db, 'books', deleteBookForm.id.value);
    deleteDoc(docRef).then(() => {
        deleteBookForm.reset();
    });
});

// get a single document
const docRef = doc(db, 'books', 'JLkjX1K1Wnss6JoTrvWj');
/* getDoc(docRef).then((doc) => {
    console.log(doc.data(), doc.id);
}); */

// real time listener for a particular doc
const unsubDoc = onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id);
});

// update doc
const updateBookForm = document.querySelector('.update');
updateBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const docRef = doc(db, 'books', updateBookForm.id.value);
    updateDoc(docRef, {
        title: 'lorem',
    }).then(() => {
        updateBookForm.reset();
    });
});

// signin
const signupForm = document.querySelector('.signup');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signupForm.email.value;
    const password = signupForm.password.value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            //console.log('user created: ', cred.user);
            signupForm.reset();
        })
        .catch((err) => console.log(err.message));
});

// signout
const logoutButton = document.querySelector('.logout');
logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            //console.log('the user signed out');
        })
        .catch((err) => console.log(err.message));
});

// login
const loginForm = document.querySelector('.login');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            //console.log('User logged in: ', cred.user);
        })
        .catch((err) => console.log(err.message));
});

// subscribe to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log('user status changes:', user);
});

// unsubscribe from changes
const unsubButton = document.querySelector('.unsub');
unsubButton.addEventListener('click', () => {
    console.log('unsubscribing');
    unsubCol();
    unsubDoc();
    unsubAuth();
});
