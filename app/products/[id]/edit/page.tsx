"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getProduct,
  updateProduct,
} from "@/services/productService";
import { updateLocalProduct } from "@/lib/productStore";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProduct(
          String(params.id)
        );

        setTitle(data.title || "");
        setPrice(String(data.price || ""));
        setCategory(data.category || "");
        setDescription(data.description || "");
      } catch (error) {
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params.id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (saving) return;

    if (
      !title.trim() ||
      !price ||
      !category.trim() ||
      !description.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (Number(price) <= 0) {
      setError("Price must be greater than 0.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const data = await updateProduct(
        String(params.id),
        {
          title: title.trim(),
          price: Number(price),
          category: category.trim(),
          description: description.trim(),
        }
      );

      updateLocalProduct(data);

      router.push(`/products/${params.id}`);
    } catch (error) {
      setError("Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="p-8">
        Loading product...
      </main>
    );
  }

  if (error && !title) {
    return (
      <main className="p-8">
        <p className="mb-4 text-red-500">
          {error}
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
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow">
        <h1 className="mb-6 text-2xl font-bold">
          Edit Product
        </h1>

        {error && (
          <p className="mb-4 text-red-500">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Product title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="w-full rounded border p-3"
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            className="w-full rounded border p-3"
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="w-full rounded border p-3"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows={5}
            className="w-full rounded border p-3"
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/products/${params.id}`
                )
              }
              className="rounded border px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}