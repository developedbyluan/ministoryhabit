// https://hono.dev/docs/getting-started/vercel#_2-hello-world
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import supabase from "@/utils/supabase";

export const runtime = 'edge'

const app = new Hono().basePath('/api')

app.get('/supabase/:slug', async(c) => {
  const slug = c.req.param('slug')
  // console.log(slug)

  const {data, error} = await supabase.from("media").select('id, title, type').eq('slug', slug)

  if (error) return c.json({error: error})

  return c.json(data)
})

export const GET = handle(app)
// export const POST = handle(app)