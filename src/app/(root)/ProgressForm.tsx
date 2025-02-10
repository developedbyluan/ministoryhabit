import { Button } from "@/components/ui/button";
import { insertData, fetchLogs } from "@/app/actions/continue-studying";
import type React from "react"; // Added import for React

type ProgressFormProps = {
  setLogs: React.Dispatch<React.SetStateAction<any[]>>;
};

export function ProgressForm({ setLogs }: ProgressFormProps) {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    try {
      const result = await insertData(formData);
      if (result.success) {
        // Refresh the logs after successful insertion
        const logsResult = await fetchLogs();
        if (logsResult.success) {
          setLogs(logsResult.data);
        }
      } else {
        console.error("Error inserting data:", result.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <div>
        <label
          htmlFor="lesson_slug"
          className="block text-sm font-medium text-gray-700"
        >
          Lesson Slug
        </label>
        <input
          type="text"
          id="lesson_slug"
          name="lesson_slug"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700"
        >
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label
          htmlFor="latest_time"
          className="block text-sm font-medium text-gray-700"
        >
          Latest Time (in seconds)
        </label>
        <input
          type="number"
          id="latest_time"
          name="latest_time"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label
          htmlFor="total_playing_time"
          className="block text-sm font-medium text-gray-700"
        >
          Total Playing Time (in seconds)
        </label>
        <input
          type="number"
          id="total_playing_time"
          name="total_playing_time"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label
          htmlFor="playlist_id"
          className="block text-sm font-medium text-gray-700"
        >
          Playlist ID
        </label>
        <input
          type="text"
          id="playlist_id"
          name="playlist_id"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <Button type="submit">Add Progress Data</Button>
    </form>
  );
}