import api from "@/lib/axios";

const ADDED_PRODUCTS_KEY = "addedProducts";
const UPDATED_PRODUCTS_KEY = "updatedProducts";
const DELETED_PRODUCTS_KEY = "deletedProductIds";

type ProductData = {
  title: string;
  price: number;
  category: string;
  description: string;
  thumbnail?: string;
};

// Get locally added products
const getAddedProducts = (): any[] => {
  if (typeof window === "undefined") return [];

  return JSON.parse(
    localStorage.getItem(ADDED_PRODUCTS_KEY) || "[]"
  );
};

// Get locally updated products
const getUpdatedProducts = (): Record<string, any> => {
  if (typeof window === "undefined") return {};

  return JSON.parse(
    localStorage.getItem(UPDATED_PRODUCTS_KEY) || "{}"
  );
};

// Get locally deleted product IDs
const getDeletedProductIds = (): number[] => {
  if (typeof window === "undefined") return [];

  return JSON.parse(
    localStorage.getItem(DELETED_PRODUCTS_KEY) || "[]"
  );
};

export const getProducts = async (
  limit: number,
  skip: number,
  search?: string,
  category?: string,
  sortBy?: string,
  order?: string
) => {
  let endpoint = "/products";

  const params = new URLSearchParams();

  params.set("limit", String(limit));
  params.set("skip", String(skip));

  if (search) {
    endpoint = "/products/search";
    params.set("q", search);
  } else if (category) {
    endpoint = `/products/category/${encodeURIComponent(category)}`;
  }

  if (sortBy) {
    params.set("sortBy", sortBy);
    params.set("order", order || "asc");
  }

  const response = await api.get(`${endpoint}?${params.toString()}`);

  let products = response.data.products || [];

  // Get local changes
  const addedProducts = getAddedProducts();
  const updatedProducts = getUpdatedProducts();
  const deletedProductIds = getDeletedProductIds();

  // Combine API products + locally added products
  products = [...products, ...addedProducts];

  // Apply locally updated products
  products = products.map((product: any) => {
    return updatedProducts[String(product.id)]
      ? {
          ...product,
          ...updatedProducts[String(product.id)],
        }
      : product;
  });

  // Remove locally deleted products
  products = products.filter(
    (product: any) => !deletedProductIds.includes(Number(product.id))
  );

  return {
    ...response.data,
    products,
  };
};

export const getCategories = async () => {
  const response = await api.get("/products/categories");

  return response.data;
};

export const getProduct = async (id: string) => {
  const addedProducts = getAddedProducts();
  const updatedProducts = getUpdatedProducts();
  const deletedProductIds = getDeletedProductIds();

  // If locally deleted, treat it as unavailable
  if (deletedProductIds.includes(Number(id))) {
    throw new Error("Product not found");
  }

  // Check locally added products first
  const addedProduct = addedProducts.find(
    (product: any) => Number(product.id) === Number(id)
  );

  if (addedProduct) {
    return updatedProducts[String(id)]
      ? {
          ...addedProduct,
          ...updatedProducts[String(id)],
        }
      : addedProduct;
  }

  // Otherwise get the product from DummyJSON
  const response = await api.get(`/products/${id}`);

  const product = response.data;

  // Apply local edit if it exists
  if (updatedProducts[String(id)]) {
    return {
      ...product,
      ...updatedProducts[String(id)],
    };
  }

  return product;
};

export const addProduct = async (product: ProductData) => {
  const response = await api.post("/products/add", product);

  const addedProducts = getAddedProducts();

  // DummyJSON uses simulated IDs.
  // Generate our own unique local ID to avoid conflicts.
  const localProduct = {
    ...response.data,
    ...product,
    id: -Date.now(),
  };

  addedProducts.push(localProduct);

  localStorage.setItem(
    ADDED_PRODUCTS_KEY,
    JSON.stringify(addedProducts)
  );

  return localProduct;
};

export const updateProduct = async (
  id: string,
  product: ProductData
) => {
  const addedProducts = getAddedProducts();

  // Check if this is a locally added product
  const localProduct = addedProducts.find(
    (item: any) => Number(item.id) === Number(id)
  );

  if (localProduct) {
    // Update the locally added product directly
    const updatedLocalProducts = addedProducts.map(
      (item: any) =>
        Number(item.id) === Number(id)
          ? {
              ...item,
              ...product,
              id: Number(id),
            }
          : item
    );

    localStorage.setItem(
      ADDED_PRODUCTS_KEY,
      JSON.stringify(updatedLocalProducts)
    );

    return {
      ...localProduct,
      ...product,
      id: Number(id),
    };
  }

  // Otherwise, update the product through DummyJSON
  const response = await api.put(`/products/${id}`, product);

  const updatedProducts = getUpdatedProducts();

  updatedProducts[id] = {
    ...response.data,
    ...product,
    id: Number(id),
  };

  localStorage.setItem(
    UPDATED_PRODUCTS_KEY,
    JSON.stringify(updatedProducts)
  );

  return {
    ...response.data,
    ...product,
    id: Number(id),
  };
};
export const deleteProduct = async (id: number) => {
  const addedProducts = getAddedProducts();

  // Check if this is a locally added product
  const isLocalProduct = addedProducts.some(
    (product: any) => Number(product.id) === Number(id)
  );

  // If it is a local product
  if (isLocalProduct) {
    const updatedAddedProducts = addedProducts.filter(
      (product: any) => Number(product.id) !== Number(id)
    );

    localStorage.setItem(
      ADDED_PRODUCTS_KEY,
      JSON.stringify(updatedAddedProducts)
    );

    return {
      id,
      isDeleted: true,
    };
  }

  // Otherwise, delete the product through DummyJSON
  const response = await api.delete(`/products/${id}`);

  const deletedProductIds = getDeletedProductIds();

  if (!deletedProductIds.includes(id)) {
    deletedProductIds.push(id);
  }

  localStorage.setItem(
    DELETED_PRODUCTS_KEY,
    JSON.stringify(deletedProductIds)
  );

  return response.data;
};