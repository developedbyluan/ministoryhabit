import SignupForm from "./SignupForm";

export default function SqueezePage({redirectURL}: {redirectURL: string}) {
  return (
    <div className="min-h-dvh bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
            <p className="text-left">If <strong>YOU</strong> want to ...</p>
          <h1 className="my-6 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Speak English <span className="text-blue-600">Fluently</span> & <span className="text-blue-600">Confidently</span>
          </h1>
          <p className="text-xl font-semibold">in <span className="underline underline-offset-2">6 Months</span></p>
          <p className="mt-4 text-xl text-gray-500">
            no boring textbooks, confusing grammar rules or endless memorization required 
          </p>
        </div>
       <SignupForm redirectURL={redirectURL}/>
      </div>
    </div>
  );
}
