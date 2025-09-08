'use client'
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { useMemo, useState } from "react";

const AllProducts = () => {

    const { products } = useAppContext();

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [query, setQuery] = useState("");

    const categories = useMemo(() => {
        const unique = new Set(products.map((p) => p.category).filter(Boolean));
        return ["All", ...Array.from(unique)];
    }, [products]);

    const filteredProducts = useMemo(() => {
        const min = minPrice === "" ? Number.NEGATIVE_INFINITY : Number(minPrice);
        const max = maxPrice === "" ? Number.POSITIVE_INFINITY : Number(maxPrice);
        const q = query.trim().toLowerCase();

        return products.filter((p) => {
            const inCategory = selectedCategory === "All" || p.category === selectedCategory;
            const price = Number(p.offerPrice ?? p.price ?? 0);
            const inPrice = price >= min && price <= max;
            const inQuery = q === "" || p.name.toLowerCase().includes(q) || (p.description ?? "").toLowerCase().includes(q);
            return inCategory && inPrice && inQuery;
        });
    }, [products, selectedCategory, minPrice, maxPrice, query]);

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
                <div className="flex flex-col items-end pt-12 w-full">
                    <p className="text-2xl font-medium">All products</p>
                    <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
                </div>

                <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input
                        type="text"
                        placeholder="Search products"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full md:col-span-2 px-3 py-2 border border-gray-300 rounded"
                    />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    >
                        {categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <div className="flex gap-3">
                        <input
                            type="number"
                            min={0}
                            step="0.01"
                            placeholder="Min price"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                        <input
                            type="number"
                            min={0}
                            step="0.01"
                            placeholder="Max price"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
                    {filteredProducts.map((product, index) => <ProductCard key={index} product={product} />)}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AllProducts;
