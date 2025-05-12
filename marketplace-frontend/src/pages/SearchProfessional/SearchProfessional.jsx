import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import AutocompleteSelect from "../../components/Select/AutocompleteSelect";
import Button from "../../components/template/ui/button/Button";
import {
  MapPin,
  PaintRoller,
  Search,
  LayoutGrid,
  List,
  ChevronDown,
} from "lucide-react";
import FilterSidebar from "./components/FilterSidebar";
import ProfessionalCard from "./components/ProfessionalCard";
import { useCategories, useCategory } from "../../hooks/api/categories";
import { useLocations } from "../../hooks/api/locations";
import { useProfessionals } from "../../hooks/api/professionals";
import { getText } from "../../config/texts/texts";
import HomeHeader from "../../components/Header/HomeHeader";
import CustomSelect from "../../components/Select/CustomSelect";
import Footer from "../../components/Footer/Footer";

export default function ProfessionalsPage() {
  /* ---------- leer query params ---------- */
  const [params, setParams] = useSearchParams();

  const [filters, setFilters] = useState({
    categoryId: params.get("service") ?? "",
    locationId: params.get("loc") ?? "",
    minRating: 0,
    maxPrice: null,
  });

  const [sort, setSort] = useState("rating_desc");

  const [view, setView] = useState("grid");

  /* ---------- options ---------- */
  const { data: categories = [] } = useCategories();
  const { data: locations = [] } = useLocations();

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    name: c.name,
  }));
  const locationOptions = locations.map((l) => ({
    value: l.id,
    name: `${l.city}, ${l.province}, ${l.country}`,
  }));

  /* ---------- profesionales ---------- */
  const { data: professionals = [], isLoading } = useProfessionals({
    ...filters,
    order: sort,
  });
  console.log("🚀 ~ ProfessionalsPage ~ professionals:", professionals);

  /* ---------- submit de barra de búsqueda ---------- */
  const handleSearch = (e) => {
    e.preventDefault();
    setParams({ service: filters.categoryId, loc: filters.locationId });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white ">
      <HomeHeader />
      <section className="flex-1 py-8">
        {/* -------- Barra de búsqueda -------- */}

        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-3 justify-center max-w-5xl mx-auto px-4 mb-8"
        >
          <AutocompleteSelect
            id="service"
            name="service"
            placeholder={getText("service")}
            options={categoryOptions}
            value={
              categoryOptions.find((opt) => opt.value == filters.categoryId) ||
              null
            }
            onChange={(opt) =>
              setFilters((f) => ({ ...f, categoryId: opt?.value ?? "" }))
            }
            leftIcon={PaintRoller}
          />
          <AutocompleteSelect
            id="location"
            name="location"
            placeholder={getText("selectLocation")}
            options={locationOptions}
            value={
              locationOptions.find((opt) => opt.value == filters.locationId) ||
              null
            }
            onChange={(opt) =>
              setFilters((f) => ({ ...f, locationId: opt?.value ?? "" }))
            }
            leftIcon={MapPin}
          />
          <Button
            type="submit"
            size="md"
            className="bg-violet-900 hover:bg-violet-800 text-white px-6 py-3 rounded-md whitespace-nowrap flex items-center gap-1 h-11"
            startIcon={<Search className="w-4 h-4" />}
          >
            Buscar
          </Button>
        </form>

        {/* -------- Layout principal -------- */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 max-w-5xl mx-auto px-4">
          {/* ----- Sidebar de filtros (desktop) ----- */}
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            className="hidden lg:block"
          />

          {/* ----- Resultados ----- */}
          <div>
            {isLoading ? (
              <p className="text-center py-10">Cargando profesionales…</p>
            ) : professionals.length === 0 ? (
              <p className="text-center py-10">
                No encontramos resultados con esos criterios.
              </p>
            ) : (
              <>
                {/* ---- Toggle de vista ---- */}
                <div className="flex justify-between items-center mb-4 gap-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setView("list")}
                      className={`p-2 rounded-md border ${
                        view === "list"
                          ? "bg-violet-900 text-white"
                          : "text-gray-600"
                      }`}
                      aria-label="Ver como lista"
                    >
                      <List className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setView("grid")}
                      className={`p-2 rounded-md border ${
                        view === "grid"
                          ? "bg-violet-900 text-white"
                          : "text-gray-600"
                      }`}
                      aria-label="Ver en cuadrícula"
                    >
                      <LayoutGrid className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="relative">
                    <CustomSelect
                      id="order"
                      name="order"
                      // label="Ordenar por"
                      placeholder="Ordenar por"
                      options={[
                        { value: "rating_desc", name: "Rating (alto a bajo)" },
                        { value: "rating_asc", name: "Rating (bajo a alto)" },
                        { value: "price_desc", name: "Precio (alto a bajo)" },
                        { value: "price_asc", name: "Precio (bajo a alto)" },
                      ]}
                      value={
                        [
                          {
                            value: "rating_desc",
                            name: "Rating (alto a bajo)",
                          },
                          { value: "rating_asc", name: "Rating (bajo a alto)" },
                          { value: "price_desc", name: "Precio (alto a bajo)" },
                          { value: "price_asc", name: "Precio (bajo a alto)" },
                        ].find((opt) => opt.value == sort) || null
                      }
                      onChange={(opt) => setSort(opt?.value ?? "rating_desc")}
                    />
                  </div>
                </div>

                {/* ---- Lista / Grid ---- */}
                <ul
                  className={
                    view === "grid"
                      ? "grid gap-6 md:grid-cols-2 xl:grid-cols-2"
                      : "flex flex-col gap-6"
                  }
                >
                  {professionals.map((pro) => (
                    <li key={pro.id}>
                      <ProfessionalCard professional={pro} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* ---- Botón / Drawer de filtros en mobile ---- */}
        <FilterSidebar
          filters={filters}
          onChange={setFilters}
          className="lg:hidden"
          mobile
        />
      </section>
      <Footer />
    </div>
  );
}
