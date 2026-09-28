const API_URL = "http://localhost:5000/api/products";

export const getProducts = async (page = 1, limit = 5) => {
    const response = await fetch(
        `${API_URL}?page=${page}&limit=${limit}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    return response.json();
};

export const createProduct = async (product) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });

    if (!response.ok) {
        throw new Error("Failed to create product");
    }

    return response.json();
};

export const updateProduct = async (id, product) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });

    if (!response.ok) {
        throw new Error("Failed to update product");
    }

    return response.json();
};

export const deleteProduct = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Failed to delete product");
    }

    return response.json();
};