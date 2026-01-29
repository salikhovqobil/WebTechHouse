import { t } from "./i18n.js";

const categoryKeyMap = {
    Kitchen: "Kitchen",
    Cleaning: "Cleaning",
    Climate: "Climate",
    "TV & Audio": "TV",
    Computers: "Computers",
    "Small Appliances": "Appliances"
};

const getCategoryLabel = (value) => {
    const key = categoryKeyMap[value];
    return key ? t(`category.${key}`) : value;
};

export const formatPrice = (value) => {
    const number = Number(value) || 0;
    const formatted = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return `${formatted} ${t("currency.label")}`;
};

export const buildRatingStars = (rating) => {
    const full = Math.floor(rating);
    let stars = "";
    for (let i = 0; i < 5; i += 1) {
        stars += i < full ? "&#9733;" : "&#9734;";
    }
    return stars;
};

export const updateCartCount = (cart) => {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll(".cart-count").forEach((badge) => {
        badge.textContent = String(count);
    });
};

export const createProductCard = (product, { basePath = "", pageRoot = "" } = {}) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const productUrl = `${pageRoot}product.html?id=${product.id}`;
    const imgSrc = `${basePath}${product.img}`;
    const ratingLabel = t("product.ratingAria", { rating: product.rating.toFixed(1) });

    card.innerHTML = `
        <a class="product-media" href="${productUrl}">
            <img src="${imgSrc}" alt="${product.name}">
        </a>
        <div class="product-body">
            <p class="product-brand">${product.brand}</p>
            <h3 class="product-title"><a href="${productUrl}">${product.name}</a></h3>
            <div class="product-rating" aria-label="${ratingLabel}">
                <span class="rating">${buildRatingStars(product.rating)}</span>
                <span>${product.rating.toFixed(1)}</span>
            </div>
            <div class="product-meta">
                <span class="price">${formatPrice(product.price)}</span>
                <button class="btn btn-outline" type="button" data-action="add-to-cart" data-id="${product.id}">${t("buttons.addToCart")}</button>
            </div>
        </div>
    `;

    return card;
};

export const renderProductGrid = (container, items, options) => {
    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (!items.length) {
        const empty = document.createElement("div");
        empty.className = "empty-state";
        empty.style.display = "block";
        empty.innerHTML = `<h3>${t("empty.products.title")}</h3><p>${t("empty.products.text")}</p>`;
        container.appendChild(empty);
        return;
    }

    items.forEach((product) => {
        container.appendChild(createProductCard(product, options));
    });
};

export const renderProductDetails = (product, { basePath = "" } = {}) => {
    if (!product) {
        return;
    }

    const image = document.getElementById("productImage");
    const brand = document.getElementById("productBrand");
    const name = document.getElementById("productName");
    const rating = document.getElementById("productRating");
    const price = document.getElementById("productPrice");
    const description = document.getElementById("productDescription");
    const specs = document.getElementById("productSpecs");
    const thumbnails = document.getElementById("productThumbnails");

    if (image) {
        image.src = `${basePath}${product.img}`;
        image.alt = product.name;
    }
    if (brand) {
        brand.textContent = product.brand;
    }
    if (name) {
        name.textContent = product.name;
    }
    if (rating) {
        rating.innerHTML = `<span class="rating">${buildRatingStars(product.rating)}</span><span>${product.rating.toFixed(1)}</span>`;
        rating.setAttribute("aria-label", t("product.ratingAria", { rating: product.rating.toFixed(1) }));
    }
    if (price) {
        price.textContent = formatPrice(product.price);
    }
    if (description) {
        description.textContent = product.description;
    }
    if (specs) {
        specs.innerHTML = "";
        product.specs.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            specs.appendChild(li);
        });
    }
    if (thumbnails) {
        thumbnails.innerHTML = "";
        for (let i = 0; i < 3; i += 1) {
            const thumb = document.createElement("img");
            thumb.src = `${basePath}${product.img}`;
            thumb.alt = `${product.name} ${i + 1}`;
            thumbnails.appendChild(thumb);
        }
    }

    const addButton = document.querySelector('[data-action="add-to-cart"]');
    if (addButton) {
        addButton.dataset.id = String(product.id);
    }

    const breadcrumb = document.getElementById("productBreadcrumb");
    if (breadcrumb) {
        breadcrumb.textContent = `${t("product.breadcrumb.home")} / ${getCategoryLabel(product.category)} / ${product.name}`;
    }
};

export const renderRelatedProducts = (container, items, options) => {
    renderProductGrid(container, items, options);
};

export const calculateTotals = (cart, products) => {
    const subtotal = cart.reduce((sum, item) => {
        const product = products.find((entry) => entry.id === item.id);
        if (!product) {
            return sum;
        }
        return sum + product.price * item.qty;
    }, 0);

    const shipping = subtotal > 1000000 ? 0 : subtotal === 0 ? 0 : 50000;
    const discount = subtotal > 4000000 ? 150000 : 0;
    const total = subtotal + shipping - discount;

    return { subtotal, shipping, discount, total };
};

export const renderOrderSummary = (cart, products) => {
    const subtotalEl = document.getElementById("summarySubtotal");
    const shippingEl = document.getElementById("summaryShipping");
    const discountEl = document.getElementById("summaryDiscount");
    const totalEl = document.getElementById("summaryTotal");

    const totals = calculateTotals(cart, products);

    if (subtotalEl) {
        subtotalEl.textContent = formatPrice(totals.subtotal);
    }
    if (shippingEl) {
        shippingEl.textContent = formatPrice(totals.shipping);
    }
    if (discountEl) {
        discountEl.textContent = formatPrice(totals.discount);
    }
    if (totalEl) {
        totalEl.textContent = formatPrice(totals.total);
    }
};

export const renderCartItems = (container, cart, products, { basePath = "" } = {}) => {
    if (!container) {
        return;
    }

    container.innerHTML = "";

    const emptyState = document.getElementById("cartEmpty");
    if (!cart.length) {
        if (emptyState) {
            emptyState.style.display = "block";
        }
        return;
    }

    if (emptyState) {
        emptyState.style.display = "none";
    }

    cart.forEach((item) => {
        const product = products.find((entry) => entry.id === item.id);
        if (!product) {
            return;
        }

        const row = document.createElement("div");
        row.className = "cart-row";
        row.dataset.id = String(product.id);

        row.innerHTML = `
            <img src="${basePath}${product.img}" alt="${product.name}">
            <div>
                <h4>${product.name}</h4>
                <p class="muted">${product.brand}</p>
            </div>
            <div class="cart-item-price">${formatPrice(product.price)}</div>
            <div class="cart-item-qty">
                <input type="number" min="1" value="${item.qty}" data-action="qty">
            </div>
            <div class="cart-item-total">${formatPrice(product.price * item.qty)}</div>
            <button class="btn btn-outline" type="button" data-action="remove">${t("cart.remove")}</button>
        `;

        container.appendChild(row);
    });
};
