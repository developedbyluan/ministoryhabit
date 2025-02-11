"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import { useState } from "react";

export default function SignupForm({ redirectURL }: { redirectURL: string }) {
  const [email, setEmail] = useState("");

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-md shadow-sm -space-y-px">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          placeholder="Enter your email to get FREE lessons"
        />
      </div>
      <div>
        <RegisterLink
          postLoginRedirectURL={redirectURL}
          authUrlParams={{
            connection_id: "conn_0194647b282b904ba592cd725888b0f6",
            login_hint: email,
          }}
        >
          <Button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Start practicing
          </Button>
        </RegisterLink>
      </div>
    </div>
  );
}
