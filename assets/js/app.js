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

const STORAGE_USER_KEY = "techhouse_user";
const STORAGE_COMMENTS_KEY = "techhouse_comments";

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

const getStoredUser = () => {
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    if (!raw) {
        return null;
    }
    try {
        return JSON.parse(raw);
    } catch (error) {
        return null;
    }
};

const setStoredUser = (user) => {
    if (!user) {
        localStorage.removeItem(STORAGE_USER_KEY);
        return;
    }
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
};

const getStoredComments = () => {
    const raw = localStorage.getItem(STORAGE_COMMENTS_KEY);
    if (!raw) {
        return {};
    }
    try {
        return JSON.parse(raw);
    } catch (error) {
        return {};
    }
};

const saveStoredComments = (data) => {
    localStorage.setItem(STORAGE_COMMENTS_KEY, JSON.stringify(data));
};

const formatCommentDate = (dateValue) => {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
        return "";
    }
    const locale = getLanguage();
    return date.toLocaleDateString(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

const renderComments = (listEl, emptyEl, comments) => {
    if (!listEl) {
        return;
    }
    listEl.innerHTML = "";

    if (!comments.length) {
        if (emptyEl) {
            emptyEl.style.display = "block";
            emptyEl.textContent = t("comments.empty");
        }
        return;
    }

    if (emptyEl) {
        emptyEl.style.display = "none";
    }

    comments.forEach((comment) => {
        const card = document.createElement("article");
        card.className = "comment-card";

        const meta = document.createElement("div");
        meta.className = "comment-meta";

        const author = document.createElement("span");
        author.className = "comment-author";
        author.textContent = comment.name || "User";

        const date = document.createElement("span");
        date.textContent = formatCommentDate(comment.date);

        meta.appendChild(author);
        meta.appendChild(date);

        const text = document.createElement("p");
        text.textContent = comment.text;

        card.appendChild(meta);
        card.appendChild(text);
        listEl.appendChild(card);
    });
};

const buildSampleComments = (product) => {
    if (!product) {
        return [];
    }

    const now = Date.now();
    return [
        {
            id: `sample-${product.id}-1`,
            name: t("comments.sample1.name"),
            text: t("comments.sample1.text", { product: product.name }),
            date: new Date(now - 2 * 86400000).toISOString()
        },
        {
            id: `sample-${product.id}-2`,
            name: t("comments.sample2.name"),
            text: t("comments.sample2.text", { product: product.name }),
            date: new Date(now - 5 * 86400000).toISOString()
        },
        {
            id: `sample-${product.id}-3`,
            name: t("comments.sample3.name"),
            text: t("comments.sample3.text", { product: product.name }),
            date: new Date(now - 9 * 86400000).toISOString()
        }
    ];
};

const initComments = (product) => {
    const listEl = document.getElementById("commentList");
    const emptyEl = document.getElementById("commentEmpty");
    const form = document.getElementById("commentForm");
    const textarea = document.getElementById("commentText");
    const status = document.getElementById("commentStatus");
    const authPrompt = document.getElementById("commentAuth");
    const userLabel = document.getElementById("commentUser");
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

    if (!listEl || !form || !textarea || !product) {
        return;
    }

    const commentsData = getStoredComments();
    const productKey = String(product.id);
    let currentComments = Array.isArray(commentsData[productKey])
        ? commentsData[productKey]
        : [];
    const sampleComments = buildSampleComments(product);

    const getDisplayComments = () => [...currentComments, ...sampleComments];

    const updateAuthState = () => {
        const user = getStoredUser();
        const isLoggedIn = Boolean(user);

        textarea.disabled = !isLoggedIn;
        if (submitBtn) {
            submitBtn.disabled = !isLoggedIn;
        }

        if (authPrompt) {
            authPrompt.style.display = isLoggedIn ? "none" : "block";
        }

        if (userLabel) {
            if (isLoggedIn) {
                userLabel.textContent = t("comments.userLabel", {
                    name: user.name || user.identifier || "User"
                });
                userLabel.style.display = "block";
            } else {
                userLabel.style.display = "none";
            }
        }
    };

    updateAuthState();
    renderComments(listEl, emptyEl, getDisplayComments());

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const user = getStoredUser();
        if (!user) {
            if (status) {
                status.textContent = t("comments.status.loginRequired");
            }
            updateAuthState();
            return;
        }

        const value = textarea.value.trim();
        if (!value) {
            if (status) {
                status.textContent = t("comments.status.empty");
            }
            return;
        }

        const newComment = {
            id: Date.now(),
            name: user.name || user.identifier || "User",
            text: value,
            date: new Date().toISOString()
        };

        currentComments = [newComment, ...currentComments];
        commentsData[productKey] = currentComments;
        saveStoredComments(commentsData);

        renderComments(listEl, emptyEl, getDisplayComments());
        textarea.value = "";
        if (status) {
            status.textContent = t("comments.status.success");
        }
    });
};

const initNavToggle = () => {
    const toggle = document.querySelector("[data-nav-toggle]");
    const drawer = document.querySelector("[data-nav-drawer]");
    if (!toggle || !drawer) {
        return;
    }

    const setOpen = (isOpen) => {
        drawer.classList.toggle("is-open", isOpen);
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    };

    toggle.addEventListener("click", () => {
        const isOpen = drawer.classList.contains("is-open");
        setOpen(!isOpen);
    });

    drawer.addEventListener("click", (event) => {
        const link = event.target.closest("a");
        if (link) {
            setOpen(false);
        }
    });

    document.addEventListener("click", (event) => {
        if (!drawer.classList.contains("is-open")) {
            return;
        }
        if (toggle.contains(event.target) || drawer.contains(event.target)) {
            return;
        }
        setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setOpen(false);
        }
    });
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
    initComments(product);

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

const initAuthForms = () => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        const status = document.getElementById("loginStatus");
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const identifier = document.getElementById("signinEmail")?.value.trim();
            const password = document.getElementById("signinPassword")?.value.trim();

            if (!identifier || !password) {
                if (status) {
                    status.textContent = t("auth.status.fillFields");
                }
                return;
            }

            const name = identifier.includes("@") ? identifier.split("@")[0] : identifier;
            setStoredUser({ name, identifier });
            if (status) {
                status.textContent = t("auth.status.loginSuccess");
            }
        });
    }

    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        const status = document.getElementById("signupStatus");
        signupForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const name = document.getElementById("signupName")?.value.trim();
            const email = document.getElementById("signupEmail")?.value.trim();
            const phone = document.getElementById("signupPhone")?.value.trim();

            if (!name || (!email && !phone)) {
                if (status) {
                    status.textContent = t("auth.status.fillFields");
                }
                return;
            }

            setStoredUser({
                name,
                email: email || null,
                phone: phone || null,
                identifier: email || phone
            });

            if (status) {
                status.textContent = t("auth.status.signupSuccess");
            }
        });
    }
};

document.addEventListener("DOMContentLoaded", () => {
    applyTranslations(getLanguage());
    initLanguageSwitcher();
    initNavToggle();
    initAuthForms();
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
