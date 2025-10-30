// hooks/useThreadFetcher.ts
/*import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getThreads } from "@/store/slices/threadSlice";

export const useThreadFetcher = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { context, currentPage, status } = useSelector((state: RootState) => state.thread);

  useEffect(() => {
    if (context && status === "idle") {
      dispatch(
        getThreads({
          topLevelOnly: true,
          page: currentPage,
          limit: 5,
        })
      );
    }
  }, [dispatch, context, currentPage, status]);
};*/