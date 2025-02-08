import Link from "next/link";

type Post = {
  id: number;
  content: string;
  created_at: string;
  replies: [];
};

export default function PostList({ posts }: { posts: Post[] }) {
  return (
    <div>
      {posts.map((post) => (
        <div
          key={post.id}
          className={`${
            post.replies.length > 0 ? "text-xs" : "text-xl font-bold"
          } mb-4 p-4 border rounded`}
        >
          <p>{post.content}</p>
          <Link href={`notes/post/${post.id}`} className="text-blue-500">
            View Replies
          </Link>
        </div>
      ))}
    </div>
  );
}
