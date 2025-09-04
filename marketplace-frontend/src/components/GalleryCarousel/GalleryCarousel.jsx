import { Image as ImageIcon } from "lucide-react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import Carousel from "../Carousel/Carousel";

const GalleryCarousel = ({ photos = [] }) => {
  if (!photos.length) return <p>No hay imágenes.</p>;

  return (
    <Carousel>
      <PhotoProvider>
        {photos.map((src, idx) => (
          <PhotoView key={idx} src={src}>
            <li className="snap-start shrink-0 basis-[85%] sm:basis-1/2 lg:basis-1/3 max-w-xs h-56 ">
              {src ? (
                <img
                  src={src}
                  alt={`portfolio-${idx}`}
                  className="w-full h-full object-cover rounded-md border border-gray-200 dark:border-gray-800"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center rounded-xl bg-gray-100 border">
                  <ImageIcon className="text-gray-400" size={32} />
                </div>
              )}
            </li>
          </PhotoView>
        ))}
      </PhotoProvider>
    </Carousel>
  );
};

export default GalleryCarousel;
