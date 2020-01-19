const isProductionMode = (): boolean => process.env.NODE_ENV !== "development";

export { isProductionMode };
