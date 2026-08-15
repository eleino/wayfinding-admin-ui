import { initApp } from "@api/init";
import { useQuery } from "@tanstack/react-query";

export const useAppInit = () => {
  const query = useQuery({
    queryKey: ["appInit"],
    queryFn: initApp,
    staleTime: 20 * 60 * 1000,
  });
  return query;
};

export const useLanguages = (options = {}) =>
  useQuery({
    queryKey: ["appInit"],
    queryFn: initApp,
    select: (data) => data.languages,
    ...options,
  });
