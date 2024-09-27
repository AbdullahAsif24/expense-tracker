'use client'
import { useAuthContext } from "@/context/auth.context";
import { SignOutFunc, auth } from "@/firebase/firebaseAuth";
import { useState, useEffect } from "react";
import { db, deleteExpense, saveExpense, updateExpense } from "@/firebase/firebaseFirestore";
import { collection, DocumentData, onSnapshot, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function LoggedIn() {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState<number | null>();
    const [category, setCategory] = useState('Food');
    const [note, setNote] = useState('');
    const [editing, setEditing] = useState(false);
    const [editingExpenseId, setEditingExpenseId] = useState('');

    const authContext = useAuthContext();

    if (!authContext) {
        throw new Error("useAuthContext must be used within an AuthContextProvider");
    }
    const { user } = authContext as NonNullable<typeof authContext>;

    function extractNameFromEmail(email: string | null | undefined): string | undefined {
        const namePart = email?.split("@")[0];
        const formattedName = namePart
            ?.replace(/[\._]/g, " ")
            ?.split(" ")
            ?.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            ?.join(" ");
        return formattedName;
    }

    const name = extractNameFromEmail(user?.email);

    // Real-time fetching of expenses
    const [allExpenses, setAllExpenses] = useState<DocumentData[]>([]);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const currentUserUID = user.uid;
                const collectionRef = collection(db, "expenses");
                const condition = where("uid", "==", currentUserUID);
                const q = query(collectionRef, condition);

                const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
                    const newExpenses: DocumentData[] = [];
                    querySnapshot.docChanges().forEach((change) => {
                        if (change.type === "added") {
                            const expense = change.doc.data();
                            expense.id = change.doc.id;
                            newExpenses.push(expense);
                        }
                        if (change.type === "modified") {
                            const expense = change.doc.data();
                            expense.id = change.doc.id;
                            setAllExpenses(prevExpenses =>
                                prevExpenses.map(prevExpense =>
                                    prevExpense.id === expense.id ? expense : prevExpense
                                )
                            );
                        }
                        if (change.type === "removed") {
                            setAllExpenses(prevExpenses =>
                                prevExpenses.filter(expense => expense.id !== change.doc.id)
                            );
                        }
                    });

                    if (newExpenses.length > 0) {
                        setAllExpenses((prevExpenses) => [...prevExpenses, ...newExpenses]);
                    }
                });

                return () => unsubscribeSnapshot();
            } else {
                console.error("User not authenticated. Cannot fetch expenses.");
            }
        });

        return () => unsubscribe();
    }, []);

    function clearAllInput() {
        setTitle('')
        setPrice(null)
        setCategory('Food')
        setNote('')
    }

    function handleDelete(id: string) {
        deleteExpense(id)
    }


    function handleEdit(expense: DocumentData) {
        setEditing(true)
        setEditingExpenseId(expense.id)
        setTitle(expense.title)
        setPrice(expense.price)
        setCategory(expense.category)
        setNote(expense.note)
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-center">Expenses List for {name}</h1>

            {/* Expense Form */}
            <form
                id="addTodoForm"
                onSubmit={(e) => e.preventDefault()}
                className="space-y-4 bg-white shadow-md rounded-md p-6 w-full"
            >
                <div className="flex flex-col">
                    <label htmlFor="title" className="mb-2 text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        placeholder="Enter title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="price" className="mb-2 text-sm font-medium text-gray-700">
                        Price
                    </label>
                    <input
                        type="number"
                        id="price"
                        placeholder="Enter price"
                        value={price ? price : 123}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="category" className="mb-2 text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Bills">Bills</option>
                        <option value="Education">Education</option>
                        <option value="Investments">Investments</option>
                        <option value="Luxuries">Luxuries</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="note" className="mb-2 text-sm font-medium text-gray-700">
                        Note
                    </label>
                    <input
                        type="text"
                        id="note"
                        placeholder="Enter note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <button
                    onClick={() => {
                        if (!editing) {
                            const date = new Date();
                            saveExpense({ title, price, category, date, note });
                            clearAllInput()
                        } else {
                            const date = new Date();
                            updateExpense(editingExpenseId, { title, price, category, date, note });
                            setEditing(false);
                            setEditingExpenseId('');
                            clearAllInput()
                        }
                    }}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
                >
                    {editing ? 'Save' : 'Add'} Expense
                </button>
            </form>

            {/* Expense Table */}
            <div className="mt-8 overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Note</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allExpenses.length > 0 ? (
                            allExpenses.map((expense, index) => (
                                <tr key={index} className="border-b">
                                    <td className="px-6 py-4 text-sm text-gray-700">{expense.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{expense.price}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{expense.category}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{expense.note || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        <button
                                            onClick={() => handleEdit(expense)}
                                            className="text-blue-600 hover:underline mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(expense.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                    No expenses added yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-center">
                <button
                    className="rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-900 font-bold hover:text-white hover:bg-slate-800"
                    onClick={() => SignOutFunc(auth)}
                >
                    Sign out
                </button>
            </div>
        </div>
    );
}

