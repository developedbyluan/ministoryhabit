// https://hono.dev/docs/getting-started/vercel#_2-hello-world
import { Hono } from "hono";
import { handle } from "hono/vercel";
import supabase from "@/utils/supabase";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.get("/supabase/:slug", async (c) => {
  const slug = c.req.param("slug");

  const { data, error } = await supabase
    .from("songs")
    .select("id, title, type, paid, media_url, body, seriesId, thumbnail_url")
    .eq("slug", slug);

  if (error) return c.json({ error: error });

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

app.get("/supabase_extra/:slug", async (c) => {
  const slug = c.req.param("slug");

  const { data, error } = await supabase
    .from("songs")
    .select(
      "id, title, type, paid, media_url, body, thumbnail_url, playlists(id, name)"
    )
    .eq("slug", slug)
    .single();

  if (error) return c.json({ error: error });

  // {
  //   "id": "7dcbb5f3-3f52-407d-94ff-8c3de7c82792",
  //   "title": "Bài phát biểu nhậm chức đầy đủ năm 2025 của Tổng thống Donald Trump",
  //   "type": "video",
  //   "paid": false,
  //   "body": "..."
  //   "media_url": "https://res.cloudinary.com/dqssqzt3y/video/upload/v1737861394/xitrum-25-ttpb_vhapji.mp4",
  //   "thumbnail_url": "https://res.cloudinary.com/dqssqzt3y/image/upload/v1738924547/trump-inaguration-thumbnail_zh49yt.jpg",
  //   "playlists": {
  //     "id": "490944ad-4474-44d7-bc29-5e00877466b6",
  //     "name": "Unshakable Confidence"
  //   }
  // }
  return c.json(data);
});

app.post("/supabase/addToPlaylist", async (c) => {
  // https://supabase.com/docs/reference/javascript/using-filters
  // https://supabase.com/docs/reference/javascript/upsert
  const body = await c.req.json();

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return c.json({ error: "User not authenticated." });
  }

  const { data, error } = await supabase
    .from("users_playlist")
    .upsert(
      {
        media_id: body.media_id,
        // kinde_auth_id: body.kinde_auth_id,
        kinde_auth_id: user.id,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "media_id, kinde_auth_id",
      }
    )
    .eq("media_id", body.media_id)
    // .eq("kinde_auth_id", body.kinde_auth_id)
    .eq("kinde_auth_id", user.id)
    .select();

  if (error) return c.json({ error: error });

  return c.json(data);
});

app.post("/supabase_vocab", async (c) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return c.json({ error: "User not authenticated." });
  }
  // const body = await c.req.json();
  const { data, error } = await supabase
    .from("collected_vocab")
    .select("vocab_array")
    .eq("kinde_id", user.id);
    // .eq("kinde_id", body.kinde_auth_id);

  if (error) return c.json({ error: error });

  return c.json({ data: data });
});

app.get("/supabase_goldlist_count", async (c) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return c.json({ error: "User not authenticated." });
  }

// Calculate the date 14 days ago
const fourteenDaysAgo = new Date()
fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

const { count, error } = await supabase
  .from("goldlist")
  .select("*", { count: "exact", head: true })
  .or(`last_review_at.is.null,and(last_review_at.lt.${fourteenDaysAgo.toISOString()},is_acquired.is.false)`)
  .eq("kinde_id", user.id)

  if (error) return c.json({ error: error, status: 500 });

  return c.json({ count: count});
})

export const GET = handle(app);
export const POST = handle(app);