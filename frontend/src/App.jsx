import { useEffect, useState } from "react";

import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from "./services/productApi";

function App() {

    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(5);

    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        stock: ""
    });

    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    // ==========================
    // FETCH PRODUCTS
    // ==========================

    const fetchProducts = async () => {
        try {
            setLoading(true);

            const data = await getProducts(page, limit);

            setProducts(data.products);
            setTotalProducts(data.totalProducts);
            setTotalPages(data.totalPages);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page]);

    // ==========================
    // INPUT CHANGE
    // ==========================

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // ==========================
    // CREATE / UPDATE
    // ==========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const product = {
                name: formData.name,
                price: Number(formData.price),
                stock: Number(formData.stock)
            };

            if (editingId) {

                await updateProduct(editingId, product);

                setEditingId(null);

            } else {

                await createProduct(product);

            }

            setFormData({
                name: "",
                price: "",
                stock: ""
            });

            fetchProducts();

        } catch (error) {
            alert(error.message);
        }
    };

    // ==========================
    // EDIT
    // ==========================

    const handleEdit = (product) => {

        setEditingId(product._id);

        setFormData({
            name: product.name,
            price: product.price,
            stock: product.stock
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // ==========================
    // DELETE
    // ==========================

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) return;

        try {

            await deleteProduct(id);

            if (products.length === 1 && page > 1) {
                setPage(page - 1);
            } else {
                fetchProducts();
            }

        } catch (error) {
            alert(error.message);
        }
    };

    // ==========================
    // CANCEL EDIT
    // ==========================

    const handleCancel = () => {

        setEditingId(null);

        setFormData({
            name: "",
            price: "",
            stock: ""
        });
    };

    // ==========================
    // STATISTICS
    // ==========================

    const totalStock = products.reduce(
        (total, product) => total + product.stock,
        0
    );

    const totalValue = products.reduce(
        (total, product) =>
            total + product.price * product.stock,
        0
    );

    return (
        <div className="min-h-screen bg-slate-50">

            {/* NAVBAR */}

            <nav className="border-b bg-white">

                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Product<span className="text-indigo-600">Hub</span>
                        </h1>

                        <p className="text-sm text-slate-500">
                            Product Management Dashboard
                        </p>
                    </div>

                    <div className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600">
                        Admin Panel
                    </div>

                </div>

            </nav>


            {/* MAIN */}

            <main className="mx-auto max-w-7xl px-6 py-8">

                {/* HEADER */}

                <div className="mb-8">

                    <h2 className="text-3xl font-bold text-slate-900">
                        Product Management
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Create, manage and track your products easily.
                    </p>

                </div>


                {/* STAT CARDS */}

                <div className="mb-8 grid gap-5 md:grid-cols-3">

                    <div className="rounded-2xl border bg-white p-6 shadow-sm">

                        <p className="text-sm font-medium text-slate-500">
                            Total Products
                        </p>

                        <h3 className="mt-2 text-3xl font-bold text-slate-900">
                            {totalProducts}
                        </h3>

                    </div>


                    <div className="rounded-2xl border bg-white p-6 shadow-sm">

                        <p className="text-sm font-medium text-slate-500">
                            Current Stock
                        </p>

                        <h3 className="mt-2 text-3xl font-bold text-indigo-600">
                            {totalStock}
                        </h3>

                    </div>


                    <div className="rounded-2xl border bg-white p-6 shadow-sm">

                        <p className="text-sm font-medium text-slate-500">
                            Stock Value
                        </p>

                        <h3 className="mt-2 text-3xl font-bold text-emerald-600">
                            ₹{totalValue.toLocaleString("en-IN")}
                        </h3>

                    </div>

                </div>


                {/* PRODUCT FORM */}

                <div className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">

                    <div className="mb-5">

                        <h3 className="text-xl font-bold text-slate-900">
                            {editingId
                                ? "Update Product"
                                : "Add New Product"}
                        </h3>

                        <p className="text-sm text-slate-500">
                            Enter product information below.
                        </p>

                    </div>


                    <form
                        onSubmit={handleSubmit}
                        className="grid gap-4 md:grid-cols-4"
                    >

                        <input
                            type="text"
                            name="name"
                            placeholder="Product name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="rounded-xl border px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />

                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            className="rounded-xl border px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />

                        <input
                            type="number"
                            name="stock"
                            placeholder="Stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            min="0"
                            className="rounded-xl border px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />


                        <div className="flex gap-2">

                            <button
                                type="submit"
                                className="flex-1 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
                            >
                                {editingId ? "Update" : "Add Product"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="rounded-xl border px-5 py-3 font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                            )}

                        </div>

                    </form>

                </div>


                {/* PRODUCT TABLE */}

                <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

                    <div className="flex items-center justify-between border-b px-6 py-5">

                        <div>
                            <h3 className="text-xl font-bold text-slate-900">
                                Products
                            </h3>

                            <p className="text-sm text-slate-500">
                                Manage your inventory
                            </p>
                        </div>

                    </div>


                    {loading ? (

                        <div className="p-10 text-center text-slate-500">
                            Loading products...
                        </div>

                    ) : products.length === 0 ? (

                        <div className="p-10 text-center text-slate-500">
                            No products found.
                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-slate-50">

                                    <tr>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                            #
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                            Product
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                            Price
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                                            Stock
                                        </th>

                                        <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y">

                                    {products.map((product, index) => (

                                        <tr
                                            key={product._id}
                                            className="transition hover:bg-slate-50"
                                        >

                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {(page - 1) * limit + index + 1}
                                            </td>

                                            <td className="px-6 py-4">

                                                <div className="font-semibold text-slate-900">
                                                    {product.name}
                                                </div>

                                                <div className="text-xs text-slate-400">
                                                    ID: {product._id.slice(-6)}
                                                </div>

                                            </td>

                                            <td className="px-6 py-4 font-medium text-slate-700">
                                                ₹{product.price.toLocaleString("en-IN")}
                                            </td>

                                            <td className="px-6 py-4">

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        product.stock > 0
                                                            ? "bg-emerald-50 text-emerald-600"
                                                            : "bg-red-50 text-red-600"
                                                    }`}
                                                >
                                                    {product.stock} units
                                                </span>

                                            </td>

                                            <td className="px-6 py-4 text-right">

                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="mr-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}


                    {/* PAGINATION */}

                    {totalPages > 0 && (

                        <div className="flex items-center justify-between border-t px-6 py-5">

                            <p className="text-sm text-slate-500">
                                Page <span className="font-semibold">{page}</span> of{" "}
                                <span className="font-semibold">{totalPages}</span>
                            </p>


                            <div className="flex gap-2">

                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                    className="rounded-lg border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
                                >
                                    Previous
                                </button>


                                {Array.from(
                                    { length: totalPages },
                                    (_, index) => index + 1
                                ).map((pageNumber) => (

                                    <button
                                        key={pageNumber}
                                        onClick={() => setPage(pageNumber)}
                                        className={`rounded-lg px-4 py-2 text-sm font-medium ${
                                            page === pageNumber
                                                ? "bg-indigo-600 text-white"
                                                : "border text-slate-600 hover:bg-slate-50"
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>

                                ))}


                                <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage(page + 1)}
                                    className="rounded-lg border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
                                >
                                    Next
                                </button>

                            </div>

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
}

export default App;