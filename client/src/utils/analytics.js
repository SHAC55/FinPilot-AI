// src/utils/analytics.js
import dayjs from "dayjs";

export const prepareMonthlyData = (transactions) => {
  const grouped = {};

  transactions.forEach((t) => {
    const month = dayjs(t.date).format("MMM YYYY");

    if (!grouped[month]) {
      grouped[month] = { month, income: 0, expense: 0 };
    }

    if (t.type === "income") {
      grouped[month].income += Number(t.amount);
    } else {
      grouped[month].expense += Number(t.amount);
    }
  });

  return Object.values(grouped);
};

export const prepareCategoryData = (transactions) => {
  const grouped = {};

  transactions.forEach((t) => {
    const category = t.category || "Other";

    if (!grouped[category]) {
      grouped[category] = 0;
    }

    grouped[category] += Number(t.amount);
  });

  return Object.entries(grouped).map(([name, value]) => ({ name, value }));
};
