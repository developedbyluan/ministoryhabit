type Reply = {
  id: number;
  content: string;
  video_url: string;
  created_at: string;
};

export default function ReplyList({ replies }: { replies: Reply[] }) {
  return (
    <div>
      {replies.map((reply) => (
        <div
          key={reply.id}
          className="flex flex-col gap-4 mb-4 p-4 border rounded"
        >
          <p>{reply.content}</p>
          {reply.video_url && (
            <>
              <label
                htmlFor="toggle"
                className="cursor-pointer hover:text-blue-500 font-bold"
              >
                Video
              </label>
              <input type="checkbox" id="toggle" />
              <video
                className="rounded-md border toggle-video"
                src={reply.video_url}
                controls
              ></video>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
