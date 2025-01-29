// https://hono.dev/docs/getting-started/vercel#_2-hello-world
import { Hono } from "hono";
import { handle } from "hono/vercel";
import supabase from "@/utils/supabase";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.get("/supabase/:slug", async (c) => {
  const slug = c.req.param("slug");
  // console.log(slug)

  const { data, error } = await supabase
    .from("media")
    .select("id, title, type, paid, media_url, body, seriesId, thumbnail_url")
    .eq("slug", slug);

  if (error) return c.json({ error: error });

  console.log(data)

  // [
  //   {
  //     "id": 1,
  //     "title": "President Donald Trump’s full 2025 inauguration speech",
  //     "type": "video",
  //     "paid": true,
  //     "media_url": "https://res.cloudinary.com/dqssqzt3y/video/upload/v1737861394/xitrum-25-ttpb_vhapji.mp4"
  //   }
  // ]
  return c.json(data);
});

app.post("/supabase/addToPlaylist", async (c) => {
  // https://supabase.com/docs/reference/javascript/using-filters
  // https://supabase.com/docs/reference/javascript/upsert
  const body = await c.req.json();
  // console.log(body)
  const { data, error } = await supabase
    .from("users_playlist")
    .upsert(
      {
        media_id: body.media_id,
        kinde_auth_id: body.kinde_auth_id,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "media_id, kinde_auth_id",
      }
    )
    .eq("media_id", body.media_id)
    .eq("kinde_auth_id", body.kinde_auth_id)
    .select();

  if (error) return c.json({ error: error });

  // const { error } = await supabase
  //   .from("users_playlist")
  //   .insert({ kinde_auth_id: 1, playlist: JSON.stringify({"media_id": 1}) })

  // return c.json(error)

  return c.json(data);
});

export const GET = handle(app);
export const POST = handle(app);
