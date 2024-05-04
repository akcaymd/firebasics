Tutorial: [Firebase 9 Tutorial](https://www.youtube.com/playlist?list=PL4cUxeGkcC9jERUGvbudErNCeSZHWUVlb) by [Net Ninja](https://www.youtube.com/@NetNinja)

```js
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
```

```js
const firebaseConfig = {
	apiKey: process.env.API_KEY,
	authDomain: process.env.AUTH_DOMAIN,
	projectId: process.env.PROJECT_ID,
	storageBucket: process.env.STORAGE_BUCKET,
	messagingSenderId: process.env.MESSAGING_SENDER_ID,
	appId: process.env.APP_ID,
};
```

Initialize app:

```js
const app = initializeApp(firebaseConfig);
```

Init services:

```js
const db = getFirestore();
const auth = getAuth();
```

## Collections:

For all books:

```js
const colRef = collection(db, 'books');
```

Queries:

```js
const q = query(
	colRef,
	where('author', '==', 'Cal Newport'),
	orderBy('title', 'desc')
);
```

```js
const q = query(colRef, orderBy('createdAt'));
```

Get collection data:

```js
getDocs(colRef)
	.then((snapshot) => {
		let books = [];
		snapshot.docs.forEach((doc) => {
			books.push({ ...doc.data(), id: doc.id });
		});
		console.log(books);
	})
	.catch((err) => console.log(err));
```

Get real time collection data (listen to the data):

```js
const unsubCol = onSnapshot(q, (snapshot) => {
	// this function runs everytime when there is a change in the collection
	let books = [];
	snapshot.docs.forEach((doc) => {
		books.push({ ...doc.data(), id: doc.id });
	});
	console.log(books);
});
```

Add doc:

```js
addDoc(colRef, {
	title: "Deep Work",
	author: "Cal Newport",
	createdAt: serverTimestamp(),
})
.then(() => {})
.catch((err) => console.log(err.message));
```

Delete doc:

```js
const docRef = doc(db, 'books', book.id);
deleteDoc(docRef).then(() => {
	deleteBookForm.reset();
});
```

Get a single document:

```js
const docRef = doc(db, 'books', book.id);
getDoc(docRef).then((doc) => {
	console.log(doc.data(), doc.id);
});
```

Real time listener for a particular doc:

```js
const docRef = doc(db, 'books', book.id);
const unsubDoc = onSnapshot(docRef, (doc) => {
	console.log(doc.data(), doc.id);
});
```

Update doc:

```js
const docRef = doc(db, 'books', book.id);
updateDoc(docRef, {
	title: title,
	author: author,
})
.then(() => {})
.catch((err) => console.log(err.message));
```

## Auth

Signin:

```js
createUserWithEmailAndPassword(auth, email, password)
	.then((cred) => {
		console.log('user created:', cred.user);
	})
	.catch((err) => console.log(err.message));
```

Signout:

```js
signOut(auth)
	.then(() => {
		console.log('the user signed out');
	})
	.catch((err) => console.log(err.message));
```

Login:

```js
signInWithEmailAndPassword(auth, email, password)
	.then((cred) => {
		console.log('User logged in: ', cred.user);
	})
	.catch((err) => console.log(err.message));
```

Subscribe to auth changes:

```js
const unsubAuth = onAuthStateChanged(auth, (user) => {
	console.log('user status changes:', user);
});
```

## Unsubscribe

```js
unsubButton.addEventListener('click', () => {
	unsubCol();
	unsubDoc();
	unsubAuth();
});
```
