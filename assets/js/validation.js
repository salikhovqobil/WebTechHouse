import { t } from "./i18n.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?\d{9,15}$/;

const setError = (form, fieldId, message) => {
    const errorEl = form.querySelector(`[data-error-for="${fieldId}"]`);
    if (errorEl) {
        errorEl.textContent = message;
    }
};

const validateField = (form, fieldId) => {
    const field = form.querySelector(`#${fieldId}`);
    if (!field) {
        return true;
    }

    const value = field.value.trim();

    switch (fieldId) {
        case "fullName":
            if (value.length < 3) {
                setError(form, fieldId, t("checkout.error.fullName"));
                return false;
            }
            break;
        case "phone":
            if (!phoneRegex.test(value.replace(/\s+/g, ""))) {
                setError(form, fieldId, t("checkout.error.phone"));
                return false;
            }
            break;
        case "email":
            if (!emailRegex.test(value)) {
                setError(form, fieldId, t("checkout.error.email"));
                return false;
            }
            break;
        case "city":
            if (value.length < 2) {
                setError(form, fieldId, t("checkout.error.city"));
                return false;
            }
            break;
        case "address":
            if (value.length < 5) {
                setError(form, fieldId, t("checkout.error.address"));
                return false;
            }
            break;
        case "payment":
            if (!value) {
                setError(form, fieldId, t("checkout.error.payment"));
                return false;
            }
            break;
        default:
            break;
    }

    setError(form, fieldId, "");
    return true;
};

export const initCheckoutValidation = () => {
    const form = document.getElementById("checkoutForm");
    if (!form) {
        return;
    }

    const status = document.getElementById("formStatus");
    const fields = ["fullName", "phone", "email", "city", "address", "payment"];

    const terms = form.querySelector("#terms");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        let isValid = true;
        fields.forEach((fieldId) => {
            if (!validateField(form, fieldId)) {
                isValid = false;
            }
        });

        if (!terms || !terms.checked) {
            setError(form, "terms", t("checkout.error.terms"));
            isValid = false;
        } else {
            setError(form, "terms", "");
        }

        if (status) {
            status.textContent = isValid
                ? t("checkout.status.success")
                : t("checkout.status.error");
        }

        if (isValid) {
            form.reset();
            form.dispatchEvent(new CustomEvent("checkout:success"));
        }
    });

    form.addEventListener("input", (event) => {
        const target = event.target;
        if (!target || !target.id) {
            return;
        }
        if (fields.includes(target.id)) {
            validateField(form, target.id);
        }
        if (target.id === "terms") {
            setError(form, "terms", "");
        }
    });
};
