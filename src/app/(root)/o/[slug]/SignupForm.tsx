"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import { useState } from "react";

export default function SignupForm({redirectURL}: {redirectURL: string}) {
  const [email, setEmail] = useState("");

  return (
    <div className="mt-10">
      <Input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4"
        placeholder="Enter your email"
      />
      <RegisterLink
        postLoginRedirectURL={redirectURL}
        authUrlParams={{
          connection_id: "conn_0194647b282b904ba592cd725888b0f6",
          login_hint: email,
        }}
      >
        <Button className="w-full">Play My Video</Button>
      </RegisterLink>
    </div>
  );
}
