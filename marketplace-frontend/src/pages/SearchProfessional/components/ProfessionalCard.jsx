import { Star, MapPin } from "lucide-react";
import { Link } from "react-router";

export default function ProfessionalCard({ professional }) {
  console.log("🚀 ~ ProfessionalCard ~ professional:", professional);
  return (
    <Link
      to={`/professionals/${professional?.id}`}
      className="block focus:outline-violet-800"
    >
      <article className="border rounded-lg p-4 shadow-theme-xs hover:shadow-md transition-shadow">
        <header className="flex items-center gap-3 mb-3">
          <img
            src={professional?.avatarUrl || "/images/user/user-01.jpg"}
            alt={professional?.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h4 className="font-semibold">{professional?.name}</h4>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin size={14} /> {professional?.location}
            </p>
          </div>
        </header>

        <p className="text-sm line-clamp-3 mb-3">{professional?.bio}</p>

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1">
            <Star size={16} className="text-yellow-400" />{" "}
            {professional?.avgRating.toFixed(1)}
          </span>
          <span className="font-semibold text-violet-900">
            ${professional?.priceFrom}/h
          </span>
        </div>
      </article>
    </Link>
  );
}
