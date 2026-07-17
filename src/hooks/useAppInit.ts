import { initApp } from "@api/init";
import { useQuery } from "@tanstack/react-query";

export const useAppInit = () => {
  const query = useQuery({
    queryKey: ["appInit"],
    queryFn: initApp,
    staleTime: 10 * 60 * 1000,
    retry: 3,
  });
  return query;
};

export const useLanguages = () =>
  useQuery({
    queryKey: ["appInit"],
    queryFn: initApp,
    select: (data) => data.languages,
    staleTime: 10 * 60 * 1000,
  });
