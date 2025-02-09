import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SqueezePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
            <p>If <strong>YOU</strong> want to ...</p>
          <h1 className="mt-6 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Speak English with <span className="text-blue-600">Confidence</span>
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            without boring textbooks, confusing grammar rules or endless vocabulary memorization 
          </p>
        </div>
        <form className="mt-8 space-y-6" action="#" method="POST">
          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              type="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Enter your email to get FREE lessons"
            />
          </div>
          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
            Start practicing
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
