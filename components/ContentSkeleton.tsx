import { Skeleton } from "./ui/skeleton";
 

const ContentSkeleton = ({
  items = 3,
  avatar = true,
  title = true,
  lines = 2,
  className = "px-5 py-10 min-h-[100vh]",
}) => {
  return (
    <div   className={` mx-auto flex flex-col space-y-6 ${className}`}>
      {title && <Skeleton className="h-8 w-1/4 rounded-md bg-gray-700" />}

      {[...Array(items)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col space-y-4 border border-gray-800 p-4 rounded-md"
        >
          <div className="flex items-center space-x-4">
            {avatar && <Skeleton className="h-10 w-10 rounded-full bg-gray-700" />}
            <Skeleton className="h-4 w-32 bg-gray-700 rounded" />
          </div>

          {[...Array(lines)].map((_, j) => (
            <Skeleton
              key={j}
              className={`h-4 ${j === lines - 1 ? "w-3/4" : "w-full"} bg-gray-700 rounded`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ContentSkeleton;
