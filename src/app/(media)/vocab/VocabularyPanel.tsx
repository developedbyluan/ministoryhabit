import VocabularyList from "./VocabularyList";
import FurtherReviewList from "./FurtherReviewList";

export default function VocabularyPanel() {
  return (
    <div className="container mx-auto mt-4 px-4 py-8">
      <div className="space-y-12">
        <section>
          <h2 className="text-xl font-semibold mb-4">New Vocabulary</h2>
          <VocabularyList />
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-4">Further Review</h2>
          <FurtherReviewList />
        </section>
      </div>
    </div>
  );
}
