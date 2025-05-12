import { useState } from "react";
import { Star } from "lucide-react";
import { useCreateReview } from "../../../hooks/api/reviews";

export default function ReviewForm({ professionalId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const createReview = useCreateReview();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createReview.mutate(
          { professionalId, rating, comment },
          {
            onSuccess: () => {
              setRating(0);
              setComment("");
            },
          }
        );
      }}
      className="mt-6 border p-4 rounded-md shadow-sm"
    >
      <h4 className="font-semibold mb-2">Dejar una reseña</h4>
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={24}
            className={
              n <= rating
                ? "text-yellow-400 cursor-pointer"
                : "text-gray-300 cursor-pointer"
            }
            fill={n <= rating ? "currentColor" : "transparent"}
            onClick={() => setRating(n)}
          />
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        className="w-full border rounded p-2 text-sm mb-3"
        placeholder="Escribe tu comentario…"
      />
      <button
        type="submit"
        disabled={rating === 0 || createReview.isLoading}
        className="bg-violet-900 hover:bg-violet-800 text-white px-4 py-2 rounded-md disabled:opacity-50"
      >
        Publicar
      </button>
    </form>
  );
}
