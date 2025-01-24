"use client";

import { Input } from "@/components/ui/input";
import {
  LoginLink,
  LogoutLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import { useEffect, useState } from "react";

export const runtime = "edge";

export default function VideoPage() {
  const [email, setEmail] = useState("");
  const { isAuthenticated, isLoading, user, getPermission } =
    useKindeBrowserClient();

  console.log(isAuthenticated);
  useEffect(() => {
    if(!isAuthenticated) return
    async function getData() {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await fetch(`${baseUrl}/api/supabase/addToPlaylist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          media_id: 10,
          kinde_auth_id: user?.id,
        }),
      });

      return res.json();
    }
    getData().then((data) => console.log(data));
  }, [isAuthenticated]);

  if (isLoading) return <div>Loading...</div>;

  if (user?.id) {
    console.log("user", user?.id);
    // connect to the supabase
    // write user and add media to playlist
  } else {
    console.log("user not found");
  }

  // if this is a paid content
  // check if user is paid user
  // yes => render content
  // no => send warning and comeback to homepage

  const isPaid = getPermission("access:paidcontent");

  // https://docs.kinde.com/developer-tools/sdks/backend/nextjs-sdk/#redirecting-after-authentication
  return isAuthenticated ? (
    <div>
      <h1>
        {isPaid?.isGranted
          ? "Video"
          : "This content is exclusively for Coaching Clients!"}
      </h1>
      <p>{user?.email}</p>
      <LogoutLink>Logout</LogoutLink>
    </div>
  ) : (
    <div>
      <Input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      You have to{" "}
      <LoginLink
        postLoginRedirectURL="/v/trump"
        authUrlParams={{
          connection_id: "conn_0194647b282b904ba592cd725888b0f6",
          login_hint: email,
        }}
      >
        Login
      </LoginLink>{" "}
      to see this page
    </div>
  );
}
