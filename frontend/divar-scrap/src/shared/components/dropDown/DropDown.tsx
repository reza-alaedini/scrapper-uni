import { useState, useEffect, useRef } from "react";
import styles from "./styles.module.css";
import Icon from "@/shared/icons/Icon";

interface DropDownProps<T> {
  label?: string;
  error?: string;
  options: T[];
  selected?: string | number | boolean | null;
  onChange?: (value: string | number | boolean) => void;
  placeholder?: string;
  disabled?: boolean;
  valueKey?: keyof T;
  labelKey?: keyof T;
  isLoading?: boolean;
  needSearch?: boolean;
}

const DropDown = <T extends Record<string, any>>({
  label,
  error,
  options = [],
  selected,
  onChange,
  placeholder = "انتخاب کنید",
  disabled = false,
  valueKey = "value",
  labelKey = "label",
  isLoading = false,
  needSearch = false,
}: DropDownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleSelect = (value: string | number | boolean) => {
    value !== placeholder && onChange?.(value);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Close dropdown if click is outside of the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add an empty option for the default placeholder
  const augmentedOptions = [
    { [valueKey]: "", [labelKey]: placeholder } as T,
    ...options,
  ];

  const filteredOptions = augmentedOptions.filter((option) =>
    String(option[labelKey]).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOptionLabel =
    selected !== undefined && selected !== null
      ? augmentedOptions.find((o) => o[valueKey] === selected)?.[labelKey] ||
        placeholder
      : placeholder;

  return (
    <div
      ref={dropdownRef}
      className={`${styles.dropdownWrapper} ${disabled ? styles.disabled : ""}`}
    >
      {label && (
        <div className={styles.labelContainer}>
          <label className={styles.dropdownLabel}>{label}</label>
          {error && (
            <div className={styles.errorContainer}>
              <span className={styles.error}>{error}</span>
            </div>
          )}
        </div>
      )}
      <div
        className={`${styles.dropdownControl} ${isOpen ? styles.open : ""} ${
          error ? styles.errorDropdown : ""
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={styles.dropdownSelected}>{selectedOptionLabel}</span>
        <Icon name="Angle-down" color="#000000" size="15" />
      </div>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {needSearch && (
            <div className={styles.searchContainer}>
              <Icon name="Search" size="19.3" color="#000000" />
              <input
                type="text"
                placeholder="جستجو..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
          {filteredOptions.length >= 1 &&
            filteredOptions.map((option) => (
              <div
                key={String(option[valueKey])}
                className={`${styles.dropdownItem} ${
                  selected === option[valueKey] ? styles.selected : ""
                }`}
                onClick={() => handleSelect(option[valueKey])}
              >
                {option[labelKey]}
              </div>
            ))}
          {(augmentedOptions.length === 1 || isLoading) && (
            <div className={styles.dropdownItem}>در حال بارگذاری...</div>
          )}
        </div>
      )}
    </div>
  );
};

export default DropDown;
