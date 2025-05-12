import { Star } from "lucide-react";
import clsx from "clsx";

interface Props {
  filters: {
    service: string;
    location: string;
    minRating: number;
    maxPrice?: number | null;
  };
  onChange: (f: Props["filters"]) => void;
  className?: string;
  /** Si es mobile = aparece como sheet/drawer   */
  mobile?: boolean;
}

export default function FilterSidebar({
  filters,
  onChange,
  className,
  mobile = false,
}: Props) {
  /* ----- ejemplo rápido; en producción usa uno mejor :) ----- */
  return (
    <aside
      className={clsx(
        className,
        mobile
          ? "fixed inset-y-0 right-0 w-64 bg-white p-6 shadow-lg z-50"
          : "border rounded-md p-4 shadow-sm"
      )}
    >
      <h3 className="text-lg font-semibold mb-4">Filtrar</h3>

      {/* Rating */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Mín. Rating</label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={clsx(
                n <= filters.minRating ? "text-yellow-400" : "text-gray-300"
              )}
              onClick={() => onChange({ ...filters, minRating: n })}
            >
              <Star size={20} fill="currentColor" />
            </button>
          ))}
        </div>
      </div>

      {/* Precio */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Precio máximo</label>
        <input
          type="number"
          className="w-full border rounded p-2 text-sm"
          value={filters.maxPrice || ""}
          onChange={(e) =>
            onChange({ ...filters, maxPrice: Number(e.target.value) || null })
          }
          placeholder="Ej. 500"
        />
      </div>

      {/* Botón aplicar (solo mobile) */}
      {mobile && (
        <button
          onClick={() => /* cerrar drawer */ null}
          className="mt-4 w-full bg-violet-900 hover:bg-violet-800 text-white py-2 rounded"
        >
          Aplicar filtros
        </button>
      )}
    </aside>
  );
}
