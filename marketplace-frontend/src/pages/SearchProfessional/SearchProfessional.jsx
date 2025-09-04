import {
  LayoutGrid,
  List,
  MapPin,
  PaintRoller,
  Search,
  Filter,
  SortAsc,
  Users,
  Clock,
  Star,
  Zap,
  Shield,
  TrendingUp,
  Eye,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useLocation } from "react-router";
import AutocompleteSelect from "../../components/Select/AutocompleteSelect";
import CustomSelect from "../../components/Select/CustomSelect";
import Button from "../../components/template/ui/button/Button";
import { getText } from "../../config/texts/texts";
import { useCategories } from "../../hooks/api/categories";
import { useLocations } from "../../hooks/api/locations";
import { useSearchProfessionals } from "../../hooks/api/professionals";
import Pagination from "../../components/Pagination/Pagination";
import FilterSidebar from "./components/FilterSidebar";
import ProfessionalCard from "./components/ProfessionalCard";
import ProfessionalCardSkeleton from "../../components/Skeleton/ProfessionalCardSkeleton";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import SearchSuggestions from "../../components/SearchSuggestions/SearchSuggestions";
import VoiceInput from "../../components/VoiceInput/VoiceInput";

export default function ProfessionalsPage() {
  /* ---------- leer query params ---------- */
  const [params, setParams] = useSearchParams();
  const location = useLocation();

  const [filters, setFilters] = useState({
    categoryId: params.get("service") ?? "",
    locationId: params.get("loc") ?? "",
    description: params.get("desc") ?? "",
    minRating: params.get("rating") ? parseInt(params.get("rating")) : 0,
    maxPrice: params.get("price") ? parseInt(params.get("price")) : null,
    isVerified: params.get("verified") === "true",
    isUrgent: params.get("urgent") === "true",
    respondsQuickly: params.get("quick") === "true",
  });

  const [sort, setSort] = useState(params.get("sort") ?? "rating_desc");
  const [view, setView] = useState(
    localStorage.getItem("professionals_view") ?? "grid"
  );
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(
    parseInt(params.get("page")) || 1
  );

  // Analytics y métricas
  const [viewedProfessionals, setViewedProfessionals] = useState(new Set());
  const [searchTime] = useState(Date.now());

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

  /* ---------- profesionales con paginación ---------- */
  const {
    data: professionalData,
    isLoading,
    error,
  } = useSearchProfessionals({
    ...filters,
    order: sort,
    q: searchQuery,
    page: currentPage,
    limit: 12,
  });

  const professionals = professionalData?.data || [];
  const pagination = professionalData?.pagination || null;

  // Persiste preferencia de vista
  useEffect(() => {
    localStorage.setItem("professionals_view", view);
  }, [view]);

  // Sincroniza parámetros URL con filtros
  useEffect(() => {
    const newParams = {};
    if (filters.categoryId) newParams.service = filters.categoryId;
    if (filters.locationId) newParams.loc = filters.locationId;
    if (filters.description) newParams.desc = filters.description;
    if (filters.minRating > 0) newParams.rating = filters.minRating.toString();
    if (filters.maxPrice) newParams.price = filters.maxPrice.toString();
    if (filters.isVerified) newParams.verified = "true";
    if (filters.isUrgent) newParams.urgent = "true";
    if (filters.respondsQuickly) newParams.quick = "true";
    if (sort !== "rating_desc") newParams.sort = sort;
    if (searchQuery) newParams.q = searchQuery;
    if (currentPage > 1) newParams.page = currentPage.toString();

    setParams(newParams, { replace: true });
  }, [filters, sort, searchQuery, currentPage, setParams]);

  /* ---------- estadísticas y métricas ---------- */
  const stats = useMemo(() => {
    const totalProfessionals = pagination?.totalItems || 0;
    const currentPageCount = professionals.length;
    const verifiedCount = professionals.filter((p) => p.isVerified).length;
    const avgRating =
      professionals.reduce((acc, p) => acc + (p.avgRating || 0), 0) /
        currentPageCount || 0;
    const quickResponseCount = professionals.filter(
      (p) => p.respondsQuickly
    ).length;

    return {
      total: totalProfessionals,
      currentPageCount,
      verified: verifiedCount,
      avgRating: avgRating.toFixed(1),
      quickResponse: quickResponseCount,
      verifiedPercentage: currentPageCount
        ? Math.round((verifiedCount / currentPageCount) * 100)
        : 0,
    };
  }, [professionals, pagination]);

  /* ---------- breadcrumbs ---------- */
  const selectedCategory = categories.find((c) => c.id == filters.categoryId);
  const selectedLocation = locations.find((l) => l.id == filters.locationId);

  const breadcrumbItems = [
    { label: "Buscar profesionales", href: "/search" },
    ...(selectedCategory ? [{ label: selectedCategory.name }] : []),
    ...(selectedLocation ? [{ label: selectedLocation.city }] : []),
  ];

  /* ---------- handlers mejorados ---------- */
  const handleSearch = (e) => {
    e.preventDefault();
    // Analytics tracking
    if (window.gtag) {
      window.gtag("event", "search_professionals", {
        category: selectedCategory?.name,
        location: selectedLocation?.city,
        search_term: searchQuery,
      });
    }
  };

  // const handleFilterChange = (newFilters) => {
  //   setFilters(prev => ({ ...prev, ...newFilters }));
  // };

  const handleClearFilters = () => {
    setFilters({
      categoryId: "",
      locationId: "",
      description: "",
      minRating: 0,
      maxPrice: null,
      isVerified: false,
      isUrgent: false,
      respondsQuickly: false,
    });
    setSearchQuery("");
    setCurrentPage(1);
    setParams({});
  };

  const handleVoiceInput = (transcript) => {
    setSearchQuery(transcript);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  return (
    <>
      <section className="flex-1 bg-gradient-to-br from-orange-50 via-white to-red-50 min-h-screen">
        {/* Header mejorado */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <Breadcrumbs items={breadcrumbItems} />

            {/* Header con estadísticas */}
            <div className="mt-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {selectedCategory
                    ? `${selectedCategory.name}s`
                    : "Profesionales"}
                  {selectedLocation && ` en ${selectedLocation.city}`}
                </h1>
                {!isLoading && (
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-orange-500" />
                      <span className="font-semibold text-orange-700">
                        {stats.total} profesionales
                      </span>
                    </div>
                    {stats.verified > 0 && (
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span className="font-semibold text-green-700">
                          {stats.verifiedPercentage}% verificados
                        </span>
                      </div>
                    )}
                    {stats.avgRating > 0 && (
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-yellow-700">
                          {stats.avgRating}★ promedio
                        </span>
                      </div>
                    )}
                    {stats.quickResponse > 0 && (
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-orange-500" />
                        <span className="font-semibold text-orange-700">
                          {stats.quickResponse} responden rápido
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quick filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    handleFilterChange({ isVerified: !filters.isVerified })
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    filters.isVerified
                      ? "bg-green-100 text-green-700 border-2 border-green-300"
                      : "bg-gray-100 text-gray-600 border-2 border-transparent hover:border-green-200"
                  }`}
                >
                  <Shield className="w-4 h-4 inline mr-1" />
                  Solo verificados
                </button>
                <button
                  onClick={() =>
                    handleFilterChange({
                      respondsQuickly: !filters.respondsQuickly,
                    })
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    filters.respondsQuickly
                      ? "bg-orange-100 text-orange-700 border-2 border-orange-300"
                      : "bg-gray-100 text-gray-600 border-2 border-transparent hover:border-orange-200"
                  }`}
                >
                  <Zap className="w-4 h-4 inline mr-1" />
                  Respuesta rápida
                </button>
                <button
                  onClick={() =>
                    handleFilterChange({ isUrgent: !filters.isUrgent })
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    filters.isUrgent
                      ? "bg-red-100 text-red-700 border-2 border-red-300"
                      : "bg-gray-100 text-gray-600 border-2 border-transparent hover:border-red-200"
                  }`}
                >
                  <Clock className="w-4 h-4 inline mr-1" />
                  Urgente
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* -------- Barra de búsqueda mejorada -------- */}
        <div className="bg-white shadow-lg border-b">
          <form onSubmit={handleSearch} className="max-w-7xl mx-auto px-4 py-6">
            {/* Barra de búsqueda avanzada - Mobile */}
            <div className="block lg:hidden space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <AutocompleteSelect
                  id="service-mobile"
                  name="service"
                  placeholder={getText("service")}
                  options={categoryOptions}
                  value={
                    categoryOptions.find(
                      (opt) => opt.value == filters.categoryId
                    ) || null
                  }
                  onChange={(opt) =>
                    handleFilterChange({ categoryId: opt?.value ?? "" })
                  }
                  leftIcon={PaintRoller}
                  className="text-base h-12"
                />
                <AutocompleteSelect
                  id="location-mobile"
                  name="location"
                  placeholder={getText("selectLocation")}
                  options={locationOptions}
                  value={
                    locationOptions.find(
                      (opt) => opt.value == filters.locationId
                    ) || null
                  }
                  onChange={(opt) =>
                    handleFilterChange({ locationId: opt?.value ?? "" })
                  }
                  leftIcon={MapPin}
                  className="text-base h-12"
                />
              </div>

              {/* Búsqueda por texto con voz - Mobile */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nombre, especialidad, descripción..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-4 pr-16 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200 text-gray-700"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <VoiceInput onTranscript={handleVoiceInput} />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 text-base font-semibold h-12 shadow-lg hover:shadow-xl transition-all duration-300"
                  startIcon={<Search className="w-5 h-5" />}
                >
                  Buscar profesionales
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  size="lg"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl flex items-center gap-2 h-12 border-2 border-gray-200"
                >
                  <Filter className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Barra de búsqueda avanzada - Desktop */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-12 gap-4 items-end">
                {/* Campos principales */}
                <div className="col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Servicio
                  </label>
                  <AutocompleteSelect
                    id="service-desktop"
                    name="service"
                    placeholder={getText("service")}
                    options={categoryOptions}
                    value={
                      categoryOptions.find(
                        (opt) => opt.value == filters.categoryId
                      ) || null
                    }
                    onChange={(opt) =>
                      handleFilterChange({ categoryId: opt?.value ?? "" })
                    }
                    leftIcon={PaintRoller}
                    className="h-12"
                  />
                </div>

                <div className="col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ubicación
                  </label>
                  <AutocompleteSelect
                    id="location-desktop"
                    name="location"
                    placeholder={getText("selectLocation")}
                    options={locationOptions}
                    value={
                      locationOptions.find(
                        (opt) => opt.value == filters.locationId
                      ) || null
                    }
                    onChange={(opt) =>
                      handleFilterChange({ locationId: opt?.value ?? "" })
                    }
                    leftIcon={MapPin}
                    className="h-12"
                  />
                </div>

                <div className="col-span-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Búsqueda libre
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar por nombre, especialidad, descripción..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-12 pl-4 pr-16 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200 text-gray-700"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <VoiceInput onTranscript={handleVoiceInput} />
                    </div>
                  </div>
                </div>

                <div className="col-span-2 flex gap-2">
                  <Button
                    type="submit"
                    size="md"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-3 rounded-xl whitespace-nowrap flex items-center justify-center gap-2 font-semibold h-12 shadow-lg hover:shadow-xl transition-all duration-300"
                    startIcon={<Search className="w-5 h-5" />}
                  >
                    Buscar
                  </Button>
                </div>
              </div>

              {/* Búsquedas sugeridas */}
              {selectedCategory && (
                <div className="mt-4">
                  <SearchSuggestions
                    category={selectedCategory.name}
                    onSelect={(suggestion) => setSearchQuery(suggestion)}
                  />
                </div>
              )}

              {/* Filtros activos */}
              {(Object.values(filters).some(
                (v) => v && v !== "" && v !== 0 && v !== false
              ) ||
                searchQuery) && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Filtros activos:
                  </span>
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium border border-orange-200">
                      Búsqueda: "{searchQuery}"
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="ml-1 hover:text-orange-900 hover:bg-orange-200 rounded-full w-5 h-5 flex items-center justify-center text-xs transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Limpiar todos
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* -------- Layout principal -------- */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 max-w-5xl mx-auto px-4 py-8">
          {/* ----- Sidebar de filtros (desktop) ----- */}
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            className="hidden lg:block"
          />

          {/* ----- Resultados ----- */}
          <div>
            {isLoading ? (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-2">
                {[...Array(6)].map((_, index) => (
                  <ProfessionalCardSkeleton key={index} />
                ))}
              </div>
            ) : error ? (
              <ErrorMessage
                type="network"
                onRetry={() => window.location.reload()}
              />
            ) : professionals.length === 0 ? (
              <ErrorMessage
                type="no-results"
                message="Intenta cambiando los filtros de búsqueda o amplía el área de cobertura."
                actionLabel="Limpiar filtros"
                onAction={() => {
                  setFilters({
                    categoryId: "",
                    locationId: "",
                    minRating: 0,
                    maxPrice: null,
                  });
                  setParams({});
                }}
              />
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
                          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-300"
                          : "text-gray-600 border-gray-300 hover:border-orange-300 hover:bg-orange-50"
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
                          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-300"
                          : "text-gray-600 border-gray-300 hover:border-orange-300 hover:bg-orange-50"
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
                      ? "grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-2"
                      : "flex flex-col gap-4 sm:gap-6"
                  }
                >
                  {professionals.map((pro) => (
                    <li key={pro.id}>
                      <ProfessionalCard professional={pro} />
                    </li>
                  ))}
                </ul>

                {/* Paginación */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      totalItems={pagination.totalItems}
                      itemsPerPage={pagination.itemsPerPage}
                      onPageChange={handlePageChange}
                      showInfo={true}
                    />
                  </div>
                )}
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
    </>
  );
}
