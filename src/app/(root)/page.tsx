import Link from "next/link";

export default function Homepage() {
  return (
    <main className="border-2 border-dashed border-blue-400 h-full flex flex-col justify-center items-center">
      <h1 className="text-4xl font-extrabold tracking-tight">Home page</h1>
      <Link className="hover:bg-yellow-200" href={"/audio-player"}>The Race Audio</Link>
      <Link href={"/o/trump"}>Trump: {process.env.NEXT_PUBLIC_BASE_URL}</Link>
    </main>
  );
}
