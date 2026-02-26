export const discountPercent = (comparePrice: number, price: number) => {
  const hasDiscount = comparePrice && comparePrice > price;
  return hasDiscount ? Math.round(((comparePrice - price) / comparePrice) * 100) : null;
};
