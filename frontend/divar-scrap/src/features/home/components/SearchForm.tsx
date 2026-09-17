import { type FC } from "react";
import ProvincesData from "../json/ProvincesData.json";
import {
  createAllRequiredExcept,
  useForm,
  type IFormInit,
  type ValidationConfig,
} from "@/shared/hooks/useForm";
import { numberSeparate } from "@/utils/utils";
import styles from "../css/styles.module.css";

const categories = [
  { id: "mobile-phones", label: "موبایل", icon: "phone" },
  { id: "laptop-notebook-macbook", label: "لپ‌تاپ", icon: "laptop" },
  { id: "vehicles", label: "خودرو", icon: "car" },
  { id: "buy-residential", label: "آپارتمان", icon: "building" },
] as const;

const CategoryIcon = ({ name }: { name: (typeof categories)[number]["icon"] }) => {
  const commonProps = {
    viewBox: "0 0 24 24",
    "aria-hidden": true,
    focusable: false,
  } as const;

  if (name === "phone") {
    return (
      <svg {...commonProps}>
        <rect x="7" y="2.5" width="10" height="19" rx="2" />
        <path d="M10 5h4M11 18.5h2" />
      </svg>
    );
  }

  if (name === "laptop") {
    return (
      <svg {...commonProps}>
        <rect x="4.5" y="4" width="15" height="11" rx="1.5" />
        <path d="M2.5 18h19l-1 2h-17l-1-2Z" />
      </svg>
    );
  }

  if (name === "car") {
    return (
      <svg {...commonProps}>
        <path d="m5 10 2-4h10l2 4 2 2v5H3v-5l2-2Z" />
        <path d="M6 17v2M18 17v2M7 13h.1M17 13h.1" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M5 21V4h10v17M15 9h4v12M8 8h4M8 12h4M8 16h4M3 21h18" />
    </svg>
  );
};

interface IForm extends IFormInit {
  category: string;
  min_price: string;
  max_price: string;
  city: string;
  force: boolean;
}

interface IProps {
  onSubmit: (data: IForm) => void;
  isLoading?: boolean;
}

const SearchForm: FC<IProps> = ({ onSubmit, isLoading = false }) => {
  const initialValues = {
    category: "",
    min_price: "",
    max_price: "",
    city: "",
    force: false,
  };

  const validationConfig: ValidationConfig<IForm> = {
    ...createAllRequiredExcept(initialValues),
    category: {
      required: true,
      errorMessages: { required: "یک دسته‌بندی انتخاب کنید" },
    },
    city: {
      required: true,
      errorMessages: { required: "شهر را انتخاب کنید" },
    },
    min_price: { required: false },
    max_price: { required: false },
    force: { required: false },
  };

  const {
    values,
    errors,
    validateForm,
    handleChangeKey,
    handleChangeNumber,
    handleChangeBooleanKey,
    handleResetForm,
  } = useForm({ initialValues, validationConfig });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    onSubmit(values);
  };

  return (
    <form id="search-form" className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.formHeading}>
        <div>
          <h2>فیلترهای جست‌وجو</h2>
          <p>دسته و شهر الزامی هستند.</p>
        </div>
        <span className={styles.filterGlyph} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
        </span>
      </div>

      <fieldset className={styles.formFields} disabled={isLoading}>
        <fieldset
          className={styles.section}
          aria-describedby={errors.category ? "category-error" : undefined}
        >
          <legend className={styles.label}>
            دسته‌بندی <span aria-hidden="true">*</span>
          </legend>
          <div className={styles.categories}>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`${styles.categoryCard} ${
                  values.category === category.id ? styles.active : ""
                }`}
                aria-pressed={values.category === category.id}
                onClick={() => handleChangeKey(category.id, "category")}
              >
                <span className={styles.categoryIcon}>
                  <CategoryIcon name={category.icon} />
                </span>
                <span className={styles.categoryLabel}>{category.label}</span>
              </button>
            ))}
          </div>
          {errors.category && (
            <span id="category-error" className={styles.fieldError} role="alert">
              {errors.category}
            </span>
          )}
        </fieldset>

        <div className={styles.section}>
          <div className={styles.labelRow}>
            <span className={styles.label}>محدوده قیمت</span>
            <span className={styles.optionalLabel}>اختیاری · تومان</span>
          </div>
          <div className={styles.priceRange}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="min-price">
                حداقل قیمت
              </label>
              <input
                id="min-price"
                type="text"
                inputMode="numeric"
                maxLength={20}
                className={styles.input}
                placeholder="مثلاً ۱۰٬۰۰۰٬۰۰۰"
                name="min_price"
                value={
                  values.min_price ? numberSeparate(Number(values.min_price)) : ""
                }
                onChange={handleChangeNumber}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="max-price">
                حداکثر قیمت
              </label>
              <input
                id="max-price"
                type="text"
                inputMode="numeric"
                maxLength={20}
                className={styles.input}
                placeholder="مثلاً ۳۰٬۰۰۰٬۰۰۰"
                name="max_price"
                value={
                  values.max_price ? numberSeparate(Number(values.max_price)) : ""
                }
                onChange={handleChangeNumber}
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.labelRow}>
            <label className={styles.label} htmlFor="city">
              شهر <span aria-hidden="true">*</span>
            </label>
            {errors.city && (
              <span id="city-error" className={styles.fieldError} role="alert">
                {errors.city}
              </span>
            )}
          </div>
          <div className={styles.selectWrap}>
            <select
              id="city"
              className={`${styles.select} ${errors.city ? styles.inputError : ""}`}
              value={values.city}
              aria-invalid={Boolean(errors.city)}
              aria-describedby={errors.city ? "city-error" : undefined}
              onChange={(event) => handleChangeKey(event.target.value, "city")}
            >
              <option value="">انتخاب شهر</option>
              {ProvincesData.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.title}
                </option>
              ))}
            </select>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m7 10 5 5 5-5" />
            </svg>
          </div>
        </div>

        <label className={styles.conditionRow}>
          <input
            type="checkbox"
            checked={values.force}
            onChange={(event) =>
              handleChangeBooleanKey(event.target.checked, "force")
            }
          />
          <span className={styles.checkSquare} aria-hidden="true">
            <svg viewBox="0 0 20 20">
              <path d="m5 10 3 3 7-7" />
            </svg>
          </span>
          <span>
            <strong>دریافت تازه‌ترین آگهی‌ها</strong>
            <small>اطلاعات ذخیره‌شده نادیده گرفته و crawl دوباره اجرا شود.</small>
          </span>
        </label>

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className={styles.submitSpinner} aria-hidden="true" />
                در حال جست‌وجو
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="10.5" cy="10.5" r="6.5" />
                  <path d="m15.5 15.5 5 5" />
                </svg>
                شروع جست‌وجو
              </>
            )}
          </button>
          <button
            type="button"
            className={styles.resetBtn}
            onClick={handleResetForm}
            disabled={isLoading}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7v5h5" />
              <path d="M6.1 17a8 8 0 1 0 .2-10.2L4 9" />
            </svg>
            پاک کردن
          </button>
        </div>
      </fieldset>
    </form>
  );
};

export default SearchForm;
