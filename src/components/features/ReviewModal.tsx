import { useState } from "react";
import { Star, X } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => void;
}

export default function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!rating) return;
    onSubmit(rating, review);
    setRating(0);
    setReview("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl border border-border-primary bg-secondary p-6 shadow-lg dark:bg-primary">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">
            Add Review
          </h2>

          <button
            onClick={onClose}
            className="text-text-muted hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Rating */}
        <div className="mb-4">
          <p className="text-sm text-text-secondary mb-2">
            Rate the contributor
          </p>

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={28}
                onClick={() => setRating(star)}
                className={`cursor-pointer transition ${
                  rating >= star
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Review Text */}
        <div className="mb-5">
          <label className="text-sm text-text-secondary">Review</label>

          <textarea
            rows={4}
            placeholder="Share your experience working with this contributor..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="mt-2 w-full rounded-lg border border-border-primary bg-transparent p-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-btn-primary"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-border-primary px-4 py-2 text-sm text-text-secondary hover:bg-gray-700/30 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!rating}
            className="rounded-lg bg-btn-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-btn-primary-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}
