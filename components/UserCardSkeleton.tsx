// components/UserCardSkeleton.tsx
import { Skeleton } from "./ui/skeleton";

const UserCardSkeleton = ({button= false}) => {
  return (
    <div className="flex items-center gap-4 rounded-md bg-dark-2 p-4 shadow-md">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex flex-col space-y-2 w-full">
        <Skeleton className="h-4 w-1/3 rounded" />
        <Skeleton className="h-3 w-1/4 rounded" /> 
      </div>
      {button && <Skeleton className="h-10 w-15 rounded-xl" />}
    </div>
  );
};

export default UserCardSkeleton;
