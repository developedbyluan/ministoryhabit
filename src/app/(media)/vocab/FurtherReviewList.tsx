"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import GroupCard from "./GroupCard";
import { fetchGroupedItems } from "@/app/actions/vocab";

interface GroupedItems {
  [date: string]: number;
}

export default function FurtherReviewList() {
  const [groupedItems, setGroupedItems] = useState<GroupedItems>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchItems() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchGroupedItems(true);
        setGroupedItems(data);
      } catch (err) {
        console.error("Error fetching review items:", err);
        setError("Failed to fetch review items. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchItems();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-24">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {Object.keys(groupedItems).length === 0 ? (
        <p className="text-center text-gray-500">
          No items need further review at this time.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedItems).map(([date, count]) => (
            <GroupCard
              key={date}
              date={date}
              itemCount={count}
              isReviewCard={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
