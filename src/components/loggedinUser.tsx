
type loggedInType = {
    userName: any,
    setLoginOrSignup: (fn: string) => void
}

export default function LoggedIn({ userName, setLoginOrSignup }: loggedInType) {
    return (
        <>
            <div className="h-screen bg-indigo-700 flex items-center justify-center flex-col gap-2">
                <h1 className="font-bold text-2xl">Hello {userName}</h1>
                <div className="flex gap-2">
                    <button className="rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-900 font-bold hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none-sm float-right"
                        onClick={() => { 
                            setLoginOrSignup('login') 
                            console.log('login');
                            
                        }}
                    >Go to Log in</button>

                    <button className="rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-900 font-bold hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none-sm float-right"
                        onClick={() => { setLoginOrSignup('signup') }}
                    >Go to Sign up</button>
                </div>
            </div>
        </>
    )
}