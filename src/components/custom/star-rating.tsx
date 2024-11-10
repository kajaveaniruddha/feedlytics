import { Star } from "lucide-react";
import { useState } from "react";
const StarRating = ({ value, onChange }: { value: number; onChange: (rating: number) => void }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex -mb-2">
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;

        return (
          <label key={ratingValue}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => onChange(ratingValue)}
              className="hidden"
            />
            <Star
              className={`cursor-pointer transition-colors duration-200 ${
                ratingValue <= (hover || value) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
              size={20}
            />
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;
