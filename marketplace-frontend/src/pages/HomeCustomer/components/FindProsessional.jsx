import { MapPin, PaintRoller, Search } from "lucide-react";
import {
  initialValues,
  validationSchema,
} from "../../../config/forms/searchProfessional";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import Button from "../../../components/template/ui/button/Button";
import { useCategories } from "../../../hooks/api/categories";
import AutocompleteSelect from "../../../components/Select/AutocompleteSelect";
import { useLocations } from "../../../hooks/api/locations";
import { getText } from "../../../config/texts/texts";

const FindProsessional = () => {
  const navigate = useNavigate();

  const { data: categories = [] } = useCategories();
  const { data: locations = [] } = useLocations();

  const optionsCategory = categories.map((category) => ({
    value: category.id,
    name: category.name,
  }));

  const optionsLocation = locations.map((location) => ({
    value: location.id,
    name: `${location.city}, ${location.province}, ${location.country}`,
  }));

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: ({ service, location }) => {
      const params = new URLSearchParams({ service, loc: location }).toString();
      navigate(`/search?${params}`);
    },
  });

  return (
    <section className="relative  bg-white py-20" id="buscar">
      {/* Grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[length:60px_60px] bg-grid-violet-100"
      />

      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
          Encontrá al
          <br className="sm:hidden" /> profesional ideal
          <br /> para tu proyecto
        </h2>
        <p className="max-w-2xl mx-auto text-lg mb-10">
          Más de{" "}
          <span className="font-semibold text-violet-900">
            10.000 profesionales verificados
          </span>{" "}
          listos para ayudarte.
        </p>

        {/* Search bar */}
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col sm:flex-row gap-3 justify-center max-w-5xl mx-auto text-start"
        >
          <AutocompleteSelect
            id="service"
            name="service"
            placeholder={getText("service")}
            value={formik.values.service}
            onChange={(opt) => formik.setFieldValue("service", opt.value)}
            onBlur={formik.handleBlur}
            className={"w-2xl"}
            options={optionsCategory}
            error={formik.touched.service}
            hint={formik.touched.service && formik.errors.service}
            leftIcon={PaintRoller}
          />
          <AutocompleteSelect
            id="location"
            name="location"
            placeholder={getText("selectLocation")}
            options={optionsLocation}
            value={formik.values.location}
            onChange={(opt) => formik.setFieldValue("location", opt.value)}
            error={formik.touched.location}
            hint={formik.touched.location && formik.errors.location}
            leftIcon={MapPin}
          />
          <Button
            type="submit"
            size="md"
            className="bg-violet-900 hover:bg-violet-800 text-white px-6 py-3 rounded-md whitespace-nowrap flex items-center gap-1 transition-colors h-11"
            startIcon={<Search className="w-4 h-4" />}
          >
            Buscar profesional
          </Button>
        </form>
      </div>
    </section>
  );
};

export default FindProsessional;
