"use client";
import { Input } from "@/components/ui/input";
import {
  LoginLink,
  LogoutLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import { useState } from "react";

export default function VideoPage() {
    const [email, setEmail] = useState("")
  const { isAuthenticated, isLoading, user } = useKindeBrowserClient();
  console.log(isAuthenticated)

  if (isLoading) return <div>Loading...</div>;

  return isAuthenticated ? (
    <div>
      <h1>Video</h1>
      <p>{user?.email}</p>
      <LogoutLink>Logout</LogoutLink>
    </div>
  ) : (
    <div>
        <Input 
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
        />
      You have to <LoginLink authUrlParams={{
        connection_id: process.env.KINDE_CONNECTION_ID_OTP!,
        login_hint: email
      }}>Login</LoginLink> to see this page
    </div>
  );
}
