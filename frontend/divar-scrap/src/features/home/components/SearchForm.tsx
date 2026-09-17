import { type FC } from "react";
import styles from "../css/styles.module.css";
// json
import ProvincesData from "../json/ProvincesData.json";
// hooks
import {
  createAllRequiredExcept,
  useForm,
  type IFormInit,
  type ValidationConfig,
} from "@/shared/hooks/useForm";
import { numberSeparate } from "@/utils/utils";
// components
import LoadingDot from "@/shared/loading/LoadingDot";
import DropDown from "@/shared/components/dropDown/DropDown";

const categories = [
  { id: "mobile-phones", label: "موبایل", icon: "📱" },
  { id: "laptop-notebook-macbook", label: "لپتاپ", icon: "💻" },
  { id: "vehicles", label: "خودرو", icon: "🚗" },
  { id: "buy-residential", label: "آپارتمان", icon: "🏢" },
];

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
      errorMessages: {
        required: "دسته‌بندی را انتخاب کنید",
      },
    },
    city: {
      required: true,
      errorMessages: {
        required: "شهر را انتخاب کنید",
      },
    },
    min_price: {
      required: false,
    },
    max_price: {
      required: false,
    },
    force: {
      required: false,
    },
  };

  const {
    values,
    errors,
    validateForm,
    handleChangeKey,
    handleChangeNumber,
    handleChangeBooleanKey,
    handleResetForm,
  } = useForm({
    initialValues,
    validationConfig,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit(values);
  };

  const handleCategorySelect = (categoryId: string) => {
    handleChangeKey(categoryId, "category");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.section}>
        <label className={styles.label}>دسته‌بندی</label>
        {errors && !!errors["category"]?.length && (
          <span className={styles.categoryError}>{errors["category"]}</span>
        )}
        <div className={styles.categories}>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`${styles.categoryCard} ${
                values.category === category.id ? styles.active : ""
              }`}
              onClick={() => handleCategorySelect(category.id)}
            >
              <span className={styles.categoryIcon}>{category.icon}</span>
              <span className={styles.categoryLabel}>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>محدوده قیمت (تومان)</label>
        <div className={styles.priceRange}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>از</label>
            <input
              type="text"
              maxLength={20}
              className={styles.input}
              placeholder="۰"
              name="min_price"
              value={numberSeparate(+values.min_price)}
              onChange={handleChangeNumber}
            />
          </div>
          <div className={styles.rangeSeparator}>—</div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>تا</label>
            <input
              type="text"
              maxLength={20}
              className={styles.input}
              placeholder="۰"
              name="max_price"
              value={numberSeparate(+values.max_price)}
              onChange={handleChangeNumber}
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <DropDown
          label="شهر"
          options={ProvincesData}
          valueKey="id"
          labelKey="title"
          selected={values.city}
          onChange={(value) => handleChangeKey(value, "city")}
          error={errors["city"]}
        />
      </div>

      <div className={styles.conditionsContainer}>
        <div
          className={`${styles.checkSquare} ${
            values["force"] ? styles.checked : ""
          }`}
          onClick={() => handleChangeBooleanKey(!values["force"], "force")}
        >
          <span>✓</span>
        </div>
        <div className={styles.conditionText}>دریافت جدیدترین آگهی‌ها</div>
      </div>

      <div className={styles.formBtnContainer}>
        <button
          type="submit"
          className={styles.submitButton}
          style={{ pointerEvents: isLoading ? "none" : "auto" }}
        >
          <span>{isLoading ? <LoadingDot /> : "جستجو"}</span>
          <span className={styles.buttonIcon}>🔍</span>
        </button>
        <div
          className={`${styles.resetBtn} ${isLoading ? styles.disable : ""}`}
          onClick={handleResetForm}
        >
          <span className={styles.buttonIcon}>⟲</span>
          <span>بازنشانی</span>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
