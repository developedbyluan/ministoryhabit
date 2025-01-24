import Image from "next/image";
import SignupForm from "./SignupForm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export const runtime = "edge";

// https://www.youtube.com/watch?v=qPsY4AKFlnM
export default async function OverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  // const baseUrl = 'https://ministoryhabit.pages.dev'
  const res = await fetch(`${baseUrl}/api/supabase/${slug}`);
  const data: { id: number; title: string; type: string; paid: boolean }[] =
    await res.json();

  console.log(JSON.stringify(data));
  const redirectURL = `/${data[0].type === "video" ? "v" : "a"}/${slug}`;

  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  if (isUserAuthenticated) {
    redirect(redirectURL);
  }

  return (
    <main className="border-2 border-blue-600 min-h-full max-w-[480px] mx-auto px-4 py-7 pt-4 flex flex-col justify-center">
      <Image
        src={
          "https://res.cloudinary.com/dqssqzt3y/image/upload/v1737686701/hq720_vlqrye.avif"
        }
        alt="Donald J. Trump speaking and a bunch of people behind him"
        width={300}
        height={200}
        className="w-full rounded-lg shadow-lg"
      />
      <h1 className="scroll-m-20 text-lg font-extrabold tracking-tight md:text-xl text-center text-pretty mt-10">
        {data[0].title}
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        President Donald Trump delivers his inaugural speech after being sworn
        in as the 47th President of the United States.
      </p>
      <SignupForm redirectURL={redirectURL} />
    </main>
  );
}
