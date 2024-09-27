"use client";

import { useRouter } from 'next/navigation';
import { signupWithEmailPassword } from '../firebase/firebaseAuth'
import { useState } from "react";


export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  function formatFirebaseErrorMessage(errorMessage: string): string {
    const match = errorMessage.match(/\(([^)]+)\)/);
    if (match && match[1]) {
      return match[1].split("/")[1];
    }
    return "Unknown error";
  }
  const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      await signupWithEmailPassword(email, password);
      setEmail('')
      setPassword('')
    } catch (error: any) {
      setErrorMessage(error.message || "An unknown error occurred.");
    }

  };

  const route = useRouter()

  return (
    <>
      <div className="flex h-screen bg-indigo-700">
        <div className="w-full max-w-xs m-auto bg-indigo-100 rounded p-5">
          <h1 className='text-center font-bold text-xl text-indigo-700 pb-3'>Register your account</h1>

          {errorMessage && (
            <p className="text-red-500 text-center mb-4">{formatFirebaseErrorMessage(errorMessage)}</p>
          )}

          <form>
            <div>
              <label className="block mb-2 text-indigo-500" htmlFor="Email">Email</label>
              <input
                className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300" type="email" name="Email"
                value={email}
                onChange={(e) => { setEmail(e.target.value) }} />
            </div>
            <div>
              <label className="block mb-2 text-indigo-500" htmlFor="password">Password</label>
              <input className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300" type="password" name="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value) }} />
            </div>
            <div>
              <button className="w-full bg-indigo-700 hover:bg-blue-700 hover:cursor-pointer text-white font-bold py-2 px-4 mb-6 rounded" onClick={handleSignup} >Sign up</button>
            </div>
          </form>
          <footer>
            <button className="text-indigo-700 hover:text-blue-700 text-sm float-right"
            onClick={()=>{
              route.push('/login')
            }}
            >Log in</button>
          </footer>
        </div>
      </div>
    </>
  );
}