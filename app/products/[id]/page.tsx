"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  deleteProduct,
  getProduct,
} from "@/services/productService";
import { deleteLocalProduct } from "@/lib/productStore";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const localProducts =
          typeof window !== "undefined"
            ? JSON.parse(
                localStorage.getItem(
                  "localProducts"
                ) || "[]"
              )
            : [];

        const localProduct = localProducts.find(
          (item: any) =>
            String(item.id) === String(params.id)
        );

        if (localProduct) {
          setProduct(localProduct);
          return;
        }

        const data = await getProduct(
          String(params.id)
        );

        setProduct(data);
      } catch (error) {
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params.id]);

  const handleDelete = async () => {
    if (deleting) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      const productId = Number(params.id);

      await deleteProduct(productId);

      deleteLocalProduct(productId);

      router.push("/products");
    } catch (error) {
      setError("Failed to delete product.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="p-8">
        Loading product...
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="p-8">
        <p className="mb-4 text-red-500">
          Product not found.
        </p>

        <button
          onClick={() => router.push("/products")}
          className="rounded bg-black px-4 py-2 text-white"
        >
          Back to Products
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">

        {/* Back */}
        <Link
          href="/products"
          className="mb-6 inline-block hover:underline"
        >
          ← Back to Products
        </Link>

        <div className="rounded-lg bg-white p-6 shadow">

          <div className="grid gap-8 md:grid-cols-2">

            {/* Images */}
            <div>
              <img
                src={
                  product.thumbnail ||
                  product.images?.[0]
                }
                alt={product.title}
                className="mb-4 h-80 w-full rounded-lg object-cover"
              />

              {product.images?.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map(
                    (image: string) => (
                      <img
                        key={image}
                        src={image}
                        alt={product.title}
                        className="h-20 w-full rounded object-cover"
                      />
                    )
                  )}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div>
              <h1 className="mb-4 text-3xl font-bold">
                {product.title}
              </h1>

              <p className="mb-2">
                <strong>Category:</strong>{" "}
                {product.category}
              </p>

              <p className="mb-2">
                <strong>Price:</strong> ₹
                {product.price}
              </p>

              <p className="mb-2">
                <strong>Rating:</strong>{" "}
                {product.rating ?? "N/A"}
              </p>

              <p className="mb-4">
                <strong>Stock:</strong>{" "}
                {product.stock ?? "N/A"}
              </p>

              <p className="mb-6 text-gray-600">
                {product.description}
              </p>

              {/* Actions */}
              <div className="mb-8 flex gap-3">
                <button
                  onClick={() =>
                    router.push(
                      `/products/${params.id}/edit`
                    )
                  }
                  className="rounded bg-blue-600 px-4 py-2 text-white"
                >
                  Edit
                </button>

                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded bg-red-600 px-4 py-2 text-white disabled:opacity-50"
                >
                  {deleting
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>

              {error && (
                <p className="mb-4 text-red-500">
                  {error}
                </p>
              )}

              {/* Reviews */}
              <h2 className="mb-3 text-xl font-bold">
                Reviews
              </h2>

              {product.reviews?.length > 0 ? (
                <div className="space-y-3">
                  {product.reviews.map(
                    (
                      review: any,
                      index: number
                    ) => (
                      <div
                        key={index}
                        className="rounded border p-3"
                      >
                        <p className="font-semibold">
                          {review.reviewerName}
                        </p>

                        <p>
                          Rating:{" "}
                          {review.rating}/5
                        </p>

                        <p className="text-gray-600">
                          {review.comment}
                        </p>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-gray-500">
                  No reviews available.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}