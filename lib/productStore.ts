const STORAGE_KEY = "localProducts";

export const getLocalProducts = () => {
  if (typeof window === "undefined") {
    return [];
  }

  const data = localStorage.getItem(STORAGE_KEY);

  return data ? JSON.parse(data) : [];
};

export const saveLocalProduct = (product: any) => {
  const products = getLocalProducts();

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...products, product])
  );
};

export const updateLocalProduct = (product: any) => {
  const products = getLocalProducts();

  const updatedProducts = products.map((item: any) =>
    item.id === product.id ? product : item
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedProducts)
  );
};

export const deleteLocalProduct = (id: number) => {
  const products = getLocalProducts();

  const updatedProducts = products.filter(
    (item: any) => item.id !== id
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedProducts)
  );
};