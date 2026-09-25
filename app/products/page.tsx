
"use client";

import { Suspense,useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  getCategories,
  getProducts,
} from "@/services/productService";

function ProductsPageContent() {  const router = useRouter();
  const searchParams = useSearchParams();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    } else {
      setIsAuthenticated(true);
    }

    setAuthChecking(false);
  }, [router]);

  const rawPage = Number(searchParams.get("page"));
  const rawLimit = Number(searchParams.get("limit"));

  const page =
    Number.isInteger(rawPage) && rawPage > 0
      ? rawPage
      : 1;

  const limit = [10, 20, 50].includes(rawLimit)
    ? rawLimit
    : 10;

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const order = searchParams.get("order") || "asc";

  const [categories, setCategories] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState(search);

  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Used to prevent older API requests from overwriting newer results
  const requestIdRef = useRef(0);

  const totalPages = Math.ceil(total / limit);

  // Update URL
  const updateUrl = (
    newPage: number,
    newLimit: number,
    newSearch: string,
    newCategory: string,
    newSortBy: string,
    newOrder: string
  ) => {
    const params = new URLSearchParams();

    params.set("page", String(newPage));
    params.set("limit", String(newLimit));

    if (newSearch) {
      params.set("search", newSearch);
    }

    if (newCategory) {
      params.set("category", newCategory);
    }

    if (newSortBy) {
      params.set("sortBy", newSortBy);
      params.set("order", newOrder);
    }

    router.push(`/products?${params.toString()}`);
  };

  // Load categories
  useEffect(() => {
    if (!isAuthenticated) return;

    getCategories()
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, [isAuthenticated]);

  // Keep search input synchronized with URL
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Search debounce
  useEffect(() => {
    if (!isAuthenticated) return;

    if (searchInput === search) {
      return;
    }

    const timer = setTimeout(() => {
      updateUrl(
        1,
        limit,
        searchInput,
        "",
        sortBy,
        order
      );
    }, 700);

    return () => clearTimeout(timer);
  }, [
    isAuthenticated,
    searchInput,
    search,
    limit,
    sortBy,
    order,
  ]);

  // Load products
  const loadProducts = async () => {
    const requestId = ++requestIdRef.current;

    try {
      setLoading(true);
      setError("");

      const data = await getProducts(
        limit,
        (page - 1) * limit,
        search,
        category,
        sortBy,
        order
      );

      // Ignore old API responses
      if (requestId !== requestIdRef.current) {
        return;
      }

      const combinedProducts = [...data.products];

      setProducts(combinedProducts);
      setTotal(data.total || 0);

      const calculatedTotalPages = Math.ceil(
        (data.total || 0) / limit
      );

      if (
        calculatedTotalPages > 0 &&
        page > calculatedTotalPages
      ) {
        updateUrl(
          calculatedTotalPages,
          limit,
          search,
          category,
          sortBy,
          order
        );
      }
    } catch (error) {
      // Ignore errors from old requests
      if (requestId !== requestIdRef.current) {
        return;
      }

      setError("Failed to load products.");
    } finally {
      // Only the latest request controls loading state
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    loadProducts();
  }, [
    isAuthenticated,
    page,
    limit,
    search,
    category,
    sortBy,
    order,
  ]);

  const changePage = (newPage: number) => {
    updateUrl(
      newPage,
      limit,
      search,
      category,
      sortBy,
      order
    );
  };

  const changeLimit = (newLimit: number) => {
    updateUrl(
      1,
      newLimit,
      search,
      category,
      sortBy,
      order
    );
  };

  const changeCategory = (newCategory: string) => {
    updateUrl(
      1,
      limit,
      "",
      newCategory,
      sortBy,
      order
    );

    setSearchInput("");
  };

  const changeSort = (newSortBy: string) => {
    updateUrl(
      1,
      limit,
      search,
      category,
      newSortBy,
      order
    );
  };

  const changeOrder = (newOrder: string) => {
    updateUrl(
      1,
      limit,
      search,
      category,
      sortBy,
      newOrder
    );
  };

  // Do not render products while authentication is being checked
  if (authChecking || !isAuthenticated) {
    return null;
  }

  if (error) {
    return (
      <main className="p-8">
        <p className="mb-4 text-red-500">
          {error}
        </p>

        <button
          onClick={loadProducts}
          className="rounded bg-black px-4 py-2 text-white"
        >
          Retry
        </button>
      </main>
    );
  }

  const startItem =
    total === 0
      ? 0
      : (page - 1) * limit + 1;

  const endItem = Math.min(
    page * limit,
    total
  );

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Loading indicator */}
        {loading && (
          <div className="mb-4 text-sm text-gray-500">
            Updating products...
          </div>
        )}

        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">
            Products
          </h1>

          <div className="flex gap-2">
            <button
              onClick={() =>
                router.push("/products/add")
              }
              className="rounded bg-green-600 px-4 py-2 text-white"
            >
              Add Product
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/login");
              }}
              className="rounded bg-red-500 px-4 py-2 text-white"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-3">

          {/* Search */}
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) =>
              setSearchInput(e.target.value)
            }
            className="rounded border bg-white p-2"
          />

          {/* Category */}
          <select
            value={category}
            onChange={(e) =>
              changeCategory(e.target.value)
            }
            className="rounded border bg-white p-2"
          >
            <option value="">
              All Categories
            </option>

            {categories.map((item: any) => (
              <option
                key={item.slug || item.name}
                value={item.slug || item.name}
              >
                {item.name || item}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) =>
              changeSort(e.target.value)
            }
            className="rounded border bg-white p-2"
          >
            <option value="">
              Sort By
            </option>

            <option value="price">
              Price
            </option>

            <option value="rating">
              Rating
            </option>

            <option value="title">
              Title
            </option>
          </select>

          {/* Order */}
          <select
            value={order}
            onChange={(e) =>
              changeOrder(e.target.value)
            }
            className="rounded border bg-white p-2"
          >
            <option value="asc">
              Ascending
            </option>

            <option value="desc">
              Descending
            </option>
          </select>

          {/* Page Size */}
          <select
            value={limit}
            onChange={(e) =>
              changeLimit(
                Number(e.target.value)
              )
            }
            className="rounded border bg-white p-2"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Showing Count */}
        <div className="mb-4">
          <p>
            Showing {startItem}–{endItem} of{" "}
            {total}
          </p>
        </div>

        {/* Products */}
       {loading ? (
  <div className="rounded bg-white p-8 text-center">
    Loading products...
  </div>
) : products.length === 0 ? (
  <div className="rounded bg-white p-8 text-center">
    No products found.
  </div>
) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto rounded-lg bg-white md:block">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="p-4 text-left">
                      Image
                    </th>

                    <th className="p-4 text-left">
                      Title
                    </th>

                    <th className="p-4 text-left">
                      Category
                    </th>

                    <th className="p-4 text-left">
                      Price
                    </th>

                    <th className="p-4 text-left">
                      Rating
                    </th>

                    <th className="p-4 text-left">
                      Stock
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b"
                    >
                      <td className="p-4">
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="h-12 w-12 rounded object-cover"
                        />
                      </td>

                      <td className="p-4">
                        <Link
                          href={`/products/${product.id}`}
                          className="font-medium hover:underline"
                        >
                          {product.title}
                        </Link>
                      </td>

                      <td className="p-4">
                        {product.category}
                      </td>

                      <td className="p-4">
                        ₹{Math.round(product.price)}
                      </td>

                      <td className="p-4">
                        {product.rating ?? "N/A"}
                      </td>

                      <td className="p-4">
                        {product.stock ?? "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="grid gap-4 md:hidden">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="rounded-lg bg-white p-4 shadow"
                >
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="mb-3 h-40 w-full rounded object-cover"
                  />

                  <h2 className="font-bold">
                    {product.title}
                  </h2>

                  <p>
                    Category: {product.category}
                  </p>

                  <p>
                    Price: ₹{Math.round(product.price)}
                  </p>

                  <p>
                    Rating:{" "}
                    {product.rating ?? "N/A"}
                  </p>

                  <p>
                    Stock:{" "}
                    {product.stock ?? "N/A"}
                  </p>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
<div className="mt-6 flex flex-wrap items-center justify-center gap-2">

  <button
    disabled={page <= 1}
    onClick={() => changePage(page - 1)}
    className="rounded border bg-white px-4 py-2 disabled:opacity-40"
  >
    Previous
  </button>

  {Array.from(
    { length: totalPages },
    (_, index) => index + 1
  )
    .filter((pageNumber) => {
      if (totalPages <= 7) return true;

      return (
        pageNumber === 1 ||
        pageNumber === totalPages ||
        Math.abs(pageNumber - page) <= 1
      );
    })
    .map((pageNumber, index, visiblePages) => (
      <span key={pageNumber} className="flex items-center gap-2">
        {index > 0 &&
          pageNumber - visiblePages[index - 1] > 1 && (
            <span className="px-1 text-gray-500">
              ...
            </span>
          )}

        <button
          onClick={() => changePage(pageNumber)}
          className={`rounded border px-3 py-2 ${
            pageNumber === page
              ? "bg-black text-white"
              : "bg-white"
          }`}
        >
          {pageNumber}
        </button>
      </span>
    ))}

  <button
    disabled={
      page >= totalPages ||
      totalPages === 0
    }
    onClick={() => changePage(page + 1)}
    className="rounded border bg-white px-4 py-2 disabled:opacity-40"
  >
    Next
  </button>

</div>
      </div>
    </main>
  );
}
export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsPageContent />
    </Suspense>
  );
}