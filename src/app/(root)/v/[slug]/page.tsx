"use client";
import {
  LoginLink,
  LogoutLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";

export default function VideoPage() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  console.log(isAuthenticated)

  if (isLoading) return <div>Loading...</div>;

  return isAuthenticated ? (
    <div>
      <h1>Video</h1>
      <LogoutLink>Logout</LogoutLink>
    </div>
  ) : (
    <div>
      You have to <LoginLink>Login</LoginLink> to see this page
    </div>
  );
}
