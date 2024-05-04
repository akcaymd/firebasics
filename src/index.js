import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
} from 'firebase/firestore';

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

// collection ref
const colRef = collection(db, 'books');

// get collection data
getDocs(colRef)
    .then((snapshot) => {
        let books = [];
        snapshot.docs.forEach((doc) => {
            books.push({ ...doc.data(), id: doc.id });
        });
        console.log(books);
    })
    .catch((err) => console.log(err));

// add document
const addBookForm = document.querySelector('.add');
addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addDoc(colRef, {
        title: addBookForm.title.value,
        author: addBookForm.author.value,
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
