import { products, featuredIds, categoryLookup } from "./data.js";
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from "./cart.js";
import {
    formatPrice,
    renderProductGrid,
    renderProductDetails,
    renderRelatedProducts,
    renderCartItems,
    renderOrderSummary,
    updateCartCount
} from "./ui.js";
import { initCheckoutValidation } from "./validation.js";
import { applyTranslations, getLanguage, initLanguageSwitcher, t } from "./i18n.js";

const page = document.body.dataset.page || "";
const basePath = document.body.dataset.base || "";
const pageRoot = document.body.dataset.pageRoot || "";

const getQueryParam = (key) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
};

const getActiveCategory = () => {
    const key = getQueryParam("cat");
    if (!key) {
        return null;
    }
    return categoryLookup[key] || null;
};

const setupSearchInput = () => {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) {
        return;
    }

    const query = getQueryParam("q");
    if (query) {
        searchInput.value = query;
    }

    if (page === "home") {
        const grid = document.getElementById("productGrid");
        if (!grid) {
            return;
        }

        const featured = products.filter((product) => featuredIds.includes(product.id));
        renderProductGrid(grid, featured, { basePath, pageRoot });

        searchInput.addEventListener("input", () => {
            const value = searchInput.value.trim().toLowerCase();
            if (!value) {
                renderProductGrid(grid, featured, { basePath, pageRoot });
                return;
            }
            const filtered = products.filter((product) =>
                product.name.toLowerCase().includes(value)
            );
            renderProductGrid(grid, filtered, { basePath, pageRoot });
        });
    }
};

const initHomePage = () => {
    const grid = document.getElementById("productGrid");
    if (!grid) {
        return;
    }
    const featured = products.filter((product) => featuredIds.includes(product.id));
    renderProductGrid(grid, featured, { basePath, pageRoot });
};

const initCategoriesPage = () => {
    const grid = document.getElementById("catalogGrid");
    const resultsCount = document.getElementById("resultsCount");
    const brandFilters = document.getElementById("brandFilters");
    const priceRange = document.getElementById("priceRange");
    const priceValue = document.getElementById("priceValue");
    const ratingFilter = document.getElementById("ratingFilter");
    const sortSelect = document.getElementById("sortSelect");
    const resetFilters = document.getElementById("resetFilters");
    const summary = document.getElementById("categorySummary");

    if (!grid) {
        return;
    }

    const category = getActiveCategory();
    const query = (getQueryParam("q") || "").trim().toLowerCase();

    const baseProducts = category
        ? products.filter((product) => product.category === category.value)
        : [...products];

    if (summary) {
        summary.textContent = category
            ? t("catalog.summaryCategory", { category: t(`category.${category.key}`) })
            : t("catalog.summaryAll");
    }

    const uniqueBrands = Array.from(new Set(baseProducts.map((product) => product.brand)));
    if (brandFilters) {
        brandFilters.innerHTML = "";
        uniqueBrands.forEach((brand) => {
            const label = document.createElement("label");
            label.className = "checklist-item";
            label.innerHTML = `<input type="checkbox" value="${brand}"> <span>${brand}</span>`;
            brandFilters.appendChild(label);
        });
    }

    const maxPrice = Math.max(...baseProducts.map((product) => product.price));
    if (priceRange) {
        priceRange.max = String(maxPrice);
        priceRange.value = String(maxPrice);
    }
    if (priceValue) {
        priceValue.textContent = formatPrice(maxPrice);
    }

    const applyFilters = () => {
        let filtered = [...baseProducts];

        if (query) {
            filtered = filtered.filter((product) => product.name.toLowerCase().includes(query));
        }

        if (brandFilters) {
            const selectedBrands = Array.from(brandFilters.querySelectorAll("input:checked"))
                .map((input) => input.value);
            if (selectedBrands.length) {
                filtered = filtered.filter((product) => selectedBrands.includes(product.brand));
            }
        }

        if (priceRange) {
            const max = Number(priceRange.value);
            filtered = filtered.filter((product) => product.price <= max);
        }

        if (ratingFilter) {
            const minRating = Number(ratingFilter.value);
            if (minRating > 0) {
                filtered = filtered.filter((product) => product.rating >= minRating);
            }
        }

        if (sortSelect) {
            switch (sortSelect.value) {
                case "price-asc":
                    filtered.sort((a, b) => a.price - b.price);
                    break;
                case "price-desc":
                    filtered.sort((a, b) => b.price - a.price);
                    break;
                case "rating-desc":
                    filtered.sort((a, b) => b.rating - a.rating);
                    break;
                case "name-asc":
                    filtered.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                default:
                    break;
            }
        }

        renderProductGrid(grid, filtered, { basePath, pageRoot });
        if (resultsCount) {
            resultsCount.textContent = t("catalog.results", { count: filtered.length });
        }
    };

    if (priceRange && priceValue) {
        priceRange.addEventListener("input", () => {
            priceValue.textContent = formatPrice(Number(priceRange.value));
            applyFilters();
        });
    }

    if (ratingFilter) {
        ratingFilter.addEventListener("change", applyFilters);
    }

    if (sortSelect) {
        sortSelect.addEventListener("change", applyFilters);
    }

    if (brandFilters) {
        brandFilters.addEventListener("change", applyFilters);
    }

    if (resetFilters) {
        resetFilters.addEventListener("click", () => {
            if (brandFilters) {
                brandFilters.querySelectorAll("input").forEach((input) => {
                    input.checked = false;
                });
            }
            if (ratingFilter) {
                ratingFilter.value = "0";
            }
            if (priceRange) {
                priceRange.value = String(maxPrice);
            }
            if (priceValue) {
                priceValue.textContent = formatPrice(maxPrice);
            }
            applyFilters();
        });
    }

    applyFilters();
};

const initProductPage = () => {
    const id = Number(getQueryParam("id"));
    const product = products.find((item) => item.id === id) || products[0];

    renderProductDetails(product, { basePath, pageRoot });

    const related = products
        .filter((item) => item.category === product.category && item.id !== product.id)
        .slice(0, 4);

    const relatedGrid = document.getElementById("relatedGrid");
    renderRelatedProducts(relatedGrid, related, { basePath, pageRoot });
};

const initCartPage = () => {
    const cartItems = getCart();
    const cartContainer = document.getElementById("cartItems");

    renderCartItems(cartContainer, cartItems, products, { basePath });
    renderOrderSummary(cartItems, products);
};

const initCheckoutPage = () => {
    const cartItems = getCart();
    renderOrderSummary(cartItems, products);
    initCheckoutValidation();

    const form = document.getElementById("checkoutForm");
    if (form) {
        form.addEventListener("checkout:success", () => {
            clearCart();
            updateCartCount([]);
            renderOrderSummary([], products);
        });
    }
};

const initGlobalEvents = () => {
    document.addEventListener("click", (event) => {
        const target = event.target.closest("[data-action]");
        if (!target) {
            return;
        }

        if (target.dataset.action === "add-to-cart") {
            const id = Number(target.dataset.id);
            const qtyInputId = target.dataset.qtyInput;
            let qty = 1;
            if (qtyInputId) {
                const input = document.getElementById(qtyInputId);
                if (input) {
                    qty = Number(input.value) || 1;
                }
            }
            const updated = addToCart(id, qty);
            updateCartCount(updated);
        }

        if (target.dataset.action === "remove") {
            const row = target.closest("[data-id]");
            if (!row) {
                return;
            }
            const id = Number(row.dataset.id);
            const updated = removeCartItem(id);
            const cartContainer = document.getElementById("cartItems");
            renderCartItems(cartContainer, updated, products, { basePath });
            renderOrderSummary(updated, products);
            updateCartCount(updated);
        }
    });

    document.addEventListener("change", (event) => {
        const target = event.target;
        if (!target || target.dataset.action !== "qty") {
            return;
        }

        const row = target.closest("[data-id]");
        if (!row) {
            return;
        }

        const id = Number(row.dataset.id);
        const qty = Number(target.value) || 1;
        const updated = updateCartItem(id, qty);
        const cartContainer = document.getElementById("cartItems");
        renderCartItems(cartContainer, updated, products, { basePath });
        renderOrderSummary(updated, products);
        updateCartCount(updated);
    });
};

document.addEventListener("DOMContentLoaded", () => {
    applyTranslations(getLanguage());
    initLanguageSwitcher();
    updateCartCount(getCart());
    setupSearchInput();
    initGlobalEvents();

    switch (page) {
        case "home":
            initHomePage();
            break;
        case "categories":
            initCategoriesPage();
            break;
        case "product":
            initProductPage();
            break;
        case "cart":
            initCartPage();
            break;
        case "checkout":
            initCheckoutPage();
            break;
        default:
            break;
    }
});
