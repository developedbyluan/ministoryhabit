export const runtime = "edge";

// https://www.youtube.com/watch?v=qPsY4AKFlnM
export default async function OverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  // const baseUrl = 'https://ministoryhabit.pages.dev'
  const res = await fetch(`${baseUrl}/api/supabase/${slug}`)
  const data: { id: number; title: string }[] = await res.json();

  console.log(JSON.stringify(data));

  return (
    <main>
      <nav>
        <h2>{data[0].title}</h2>
        <p>{data[0].id}</p>
      </nav>
    </main>
  );
}
