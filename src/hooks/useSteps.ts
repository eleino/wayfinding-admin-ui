import { fetchStepById } from "@api/steps";
import { useQuery } from "@tanstack/react-query";

export const useGetStepById = (id: number | null, options = {}) => {
  if (!id) {
    throw new Error("Step ID is required to fetch a specific step.");
  }
  const query = useQuery({ queryKey: ["step", id], queryFn: () => fetchStepById(id), ...options });
  return query;
}