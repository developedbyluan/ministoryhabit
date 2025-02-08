import { getPost, getReplies, createReply } from "@/app/actions/actions";
import ReplyForm from "@/app/(media)/notes/ReplyForm";
import ReplyList from "@/app/(media)/notes/ReplyList";

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(Number.parseInt(params.id));
  const replies = await getReplies(Number.parseInt(params.id));

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Post</h2>
      <div className="mb-8 p-4 border rounded">
        <p>{post.content}</p>
      </div>
      <h3 className="text-xl font-bold mb-4">Replies</h3>
      <ReplyForm createReply={createReply} postId={post.id} />
      <ReplyList replies={replies} />
    </div>
  );
}
