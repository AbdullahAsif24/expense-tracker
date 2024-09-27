import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getFirestore,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { auth } from "./firebaseAuth";
import { app } from "./firebaseconfig";
import { onAuthStateChanged } from "firebase/auth";


export const db = getFirestore(app);

type UserType = {
    email: string|null;
    uid: string;
};

export async function saveUser(user: UserType) {
    //   let docRef = doc(db, "collectionName", "docID");
    //   await setDoc(docRef, user);

    //   let collectionRef = collection(db, "collectionName");
    //   await addDoc(collectionRef, user);

    try {
        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, user);
    } catch (e) {
        console.log(e);
    }
}

export type ExpenseType = {
    title: string,
    price: number|null|undefined,
    category: string,
    date: Date,
    note: string
}

export async function saveExpense({ title, price, category, date, note }: ExpenseType) {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const uid = user.uid; // Now we have the uid after authentication
            const newExpense = { uid, title, price, category, date, note };

            try {
                const collectionRef = collection(db, "expenses");
                await addDoc(collectionRef, newExpense);
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log("User is not authenticated");
        }
    });
}

// export async function fetchTodos(setCrrTodo: (todos: any[]) => void) {
//     onAuthStateChanged(auth, async (user) => {
//         if (user) {
//             let currentUserUID = user.uid; // uid is now available after authentication
//             let collectionRef = collection(db, "todos");

//             // Query the todos collection with the condition
//             let q = query(collectionRef, where("uid", "==", currentUserUID));
//             let allTodosSnapshot = await getDocs(q);

//             // Collect the todos into an array
//             let todosArray: any[] = [];
//             allTodosSnapshot.forEach((todo) => {
//                 let todoData = todo.data();
//                 todoData.id = todo.id; // Include the id for reference
//                 todosArray.push(todoData); // Add todoData to the array
//             });

//             // Update the state with the todos array
//             setCrrTodo(todosArray);
//         } else {
//             console.log("User is not authenticated");
//         }
//     });
// }

// delete expense 
export async function deleteExpense(id: string){
    await deleteDoc(doc(db, "expenses", id));
}

export async function updateExpense(expenseId: string, { title, price, category, date, note }: ExpenseType) {
    const expenseRef = doc(db, "expenses", expenseId); // Reference to the specific expense document

    try {
        const editedExpense = { title, price, category, date, note };
        await updateDoc(expenseRef, editedExpense); // Update the document
        console.log("Expense updated successfully");
    } catch (error) {
        console.error("Error updating expense: ", error);
    }
}