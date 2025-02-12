import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GroupCardProps {
  date: string;
  itemCount: number;
  isReviewCard?: boolean;
}

export default function GroupCard({
  date,
  itemCount,
  isReviewCard = false,
}: GroupCardProps) {
  const href = isReviewCard
    ? `/vocab/review/${encodeURIComponent(date)}`
    : `/vocab/${encodeURIComponent(date)}`;

  return (
    <Link href={href}>
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{date}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {itemCount} {itemCount === 1 ? "item" : "items"} to{" "}
            {isReviewCard ? "review" : "learn"}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
