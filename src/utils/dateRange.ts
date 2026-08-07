const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getPast30DaysDateRange = (today = new Date()) => {
  const end = new Date(today);
  const start = new Date(end);
  start.setDate(start.getDate() - 29);

  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  };
};
