// components/shared/LoadingSpinner.tsx

import { Skeleton } from "./ui/skeleton";
const LoadingThread = () => {
  
  return (
    <div className="mx-auto flex max-w-3xl flex-col space-y-6 px-10 py-20 min-h-[100vh]">
      <Skeleton className="h-8 w-1/4 rounded-md bg-gray-700" />
      
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-4 border border-gray-800 p-4 rounded-md">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full bg-gray-700" />
            <Skeleton className="h-4 w-32 bg-gray-700 rounded" />
          </div>
          <Skeleton className="h-4 w-full bg-gray-700 rounded" />
          <Skeleton className="h-4 w-3/4 bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  );
}

export default LoadingThread;