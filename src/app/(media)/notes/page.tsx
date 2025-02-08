import { createPost, getPosts } from "@/app/actions/actions"
import PostForm from "@/app/(media)/notes/PostForm"
import PostList from "@/app/(media)/notes/PostList"

export default async function Home() {
  const posts = await getPosts()

  return (
    <main>
      <PostForm createPost={createPost} />
      <PostList posts={posts} />
    </main>
  )
}