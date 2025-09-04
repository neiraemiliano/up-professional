import Skeleton from "./Skeleton";

const ProfessionalCardSkeleton = () => {
  return (
    <article className="relative bg-white border-2 border-gray-200 rounded-2xl p-4 sm:p-5 shadow-lg overflow-hidden animate-pulse">
      {/* Background Pattern Placeholder */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-200 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-200 rounded-full translate-y-12 -translate-x-12"></div>
      </div>

      {/* Popular Badge Placeholder */}
      <div className="absolute top-3 right-3">
        <Skeleton width="w-16" height="h-6" className="rounded-full" />
      </div>

      {/* Favorite Button Placeholder */}
      <div className="absolute top-3 left-3">
        <Skeleton variant="circular" width="w-8" height="h-8" />
      </div>

      <header className="flex items-center gap-4 mb-4 relative z-10 mt-6">
        <div className="relative">
          {/* Avatar with gradient border placeholder */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 p-0.5">
            <Skeleton 
              variant="rectangular" 
              width="w-full" 
              height="h-full" 
              className="rounded-2xl" 
            />
          </div>
          
          {/* Status indicator placeholder */}
          <div className="absolute -bottom-1 -right-1">
            <Skeleton variant="circular" width="w-5" height="h-5" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <Skeleton width="w-36" height="h-5" className="mb-2" />
          <Skeleton width="w-28" height="h-4" className="mb-1" />
          <Skeleton width="w-32" height="h-3" />
        </div>
      </header>

      {/* Trust indicators placeholders */}
      <div className="flex flex-wrap gap-2 mb-4 relative z-10">
        <Skeleton width="w-20" height="h-6" className="rounded-full" />
        <Skeleton width="w-24" height="h-6" className="rounded-full" />
        <Skeleton width="w-28" height="h-6" className="rounded-full" />
      </div>

      {/* Description placeholder */}
      <div className="space-y-2 mb-4 relative z-10">
        <Skeleton width="w-full" height="h-4" />
        <Skeleton width="w-5/6" height="h-4" />
        <Skeleton width="w-4/5" height="h-4" />
      </div>

      {/* Stats placeholders */}
      <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Skeleton variant="circular" width="w-4" height="h-4" />
            <Skeleton width="w-8" height="h-5" />
          </div>
          <Skeleton width="w-16" height="h-3" />
        </div>
        
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Skeleton variant="circular" width="w-4" height="h-4" />
            <Skeleton width="w-8" height="h-5" />
          </div>
          <Skeleton width="w-20" height="h-3" />
        </div>
      </div>

      {/* Pricing placeholder */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div>
          <Skeleton width="w-10" height="h-3" className="mb-1" />
          <Skeleton width="w-20" height="h-7" />
        </div>
        <div className="text-right">
          <Skeleton width="w-12" height="h-3" className="mb-1" />
          <div className="flex items-center gap-1">
            <Skeleton variant="circular" width="w-4" height="h-4" />
            <Skeleton width="w-16" height="h-3" />
          </div>
        </div>
      </div>

      {/* Contact buttons placeholders */}
      <div className="grid grid-cols-2 gap-2 relative z-10">
        <Skeleton width="w-full" height="h-12" className="rounded-xl" />
        <Skeleton width="w-full" height="h-12" className="rounded-xl" />
      </div>

      {/* Urgent service button placeholder */}
      <div className="mt-3 relative z-10">
        <Skeleton width="w-full" height="h-12" className="rounded-xl" />
      </div>

      {/* View profile link placeholder */}
      <div className="mt-4 text-center relative z-10">
        <Skeleton width="w-32" height="h-4" className="mx-auto" />
      </div>
    </article>
  );
};

export default ProfessionalCardSkeleton;