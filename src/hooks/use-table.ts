"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type SetStateAction,
} from "react";

export type TablePaginationParams = {
  limit: number;
  offset: number;
};

export type TableFetchResult<TData> = {
  data: TData[];
  total: number;
};

type TableQuery<TParams extends TablePaginationParams> = Omit<
  TParams,
  keyof TablePaginationParams
>;

export type UseTableOptions<
  TData,
  TParams extends TablePaginationParams,
> = {
  fetch: (params: TParams) => Promise<TableFetchResult<TData>>;
  sort?: Partial<TableQuery<TParams>>;
  filter?: Partial<TableQuery<TParams>>;
  initialPage?: number;
  initialPageSize?: number;
  autoFetch?: boolean;
  debounceMs?: number;
};

export function useTable<TData, TParams extends TablePaginationParams>({
  fetch: fetcher,
  sort: initialSort,
  filter: initialFilter,
  initialPage = 1,
  initialPageSize = 10,
  autoFetch = true,
  debounceMs = 0,
}: UseTableOptions<TData, TParams>) {
  type Query = TableQuery<TParams>;

  const [page, setPageState] = useState(Math.max(1, initialPage));
  const [pageSize, setPageSizeState] = useState(
    Math.max(1, initialPageSize),
  );
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<TData[]>([]);
  const [sort, setSortState] = useState<Partial<Query>>(
    () => initialSort ?? {},
  );
  const [filter, setFilterState] = useState<Partial<Query>>(
    () => initialFilter ?? {},
  );
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState<unknown>(null);
  const latestRequestId = useRef(0);

  const setPage = useCallback((nextPage: SetStateAction<number>) => {
    setPageState((currentPage) => {
      const resolvedPage =
        typeof nextPage === "function" ? nextPage(currentPage) : nextPage;
      return Math.max(1, resolvedPage);
    });
  }, []);

  const setPageSize = useCallback((nextPageSize: SetStateAction<number>) => {
    setPageSizeState((currentPageSize) => {
      const resolvedPageSize =
        typeof nextPageSize === "function"
          ? nextPageSize(currentPageSize)
          : nextPageSize;
      return Math.max(1, resolvedPageSize);
    });
    setPageState(1);
  }, []);

  const setSort = useCallback((nextSort: SetStateAction<Partial<Query>>) => {
    setSortState(nextSort);
    setPageState(1);
  }, []);

  const setFilter = useCallback(
    (nextFilter: SetStateAction<Partial<Query>>) => {
      setFilterState(nextFilter);
      setPageState(1);
    },
    [],
  );

  const fetchData = useCallback(
    async (overrides?: Partial<Query>) => {
      const requestId = ++latestRequestId.current;
      const params = {
        ...sort,
        ...filter,
        ...overrides,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      } as TParams;

      setIsLoading(true);
      setError(null);

      try {
        const result = await fetcher(params);

        if (requestId !== latestRequestId.current) return result;

        setData(result.data);
        setTotal(result.total);

        const lastPage = Math.max(1, Math.ceil(result.total / pageSize));
        if (page > lastPage) setPageState(lastPage);

        return result;
      } catch (requestError) {
        if (requestId === latestRequestId.current) setError(requestError);
        throw requestError;
      } finally {
        if (requestId === latestRequestId.current) setIsLoading(false);
      }
    },
    [fetcher, filter, page, pageSize, sort],
  );

  useEffect(() => {
    if (!autoFetch) return;

    const timeoutId = window.setTimeout(() => {
      void fetchData().catch(() => undefined);
    }, debounceMs);

    return () => window.clearTimeout(timeoutId);
  }, [autoFetch, debounceMs, fetchData]);

  return {
    page,
    pageSize,
    total,
    data,
    sort,
    filter,
    isLoading,
    error,
    setPage,
    setPageSize,
    setSort,
    setFilter,
    fetchData,
  };
}
