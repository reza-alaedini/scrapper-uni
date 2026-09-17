import { persianToEnglishNumber } from "@/utils/utils";
import React from "react";
import { useEffect, useState } from "react";

export interface IFormInit {
  [key: string]: string | number | boolean | string[];
}

export type FormValues = Record<
  string,
  string | boolean | number | null | string[] | number[]
>;

export type BuiltInValidator = {
  mobile: RegExp;
  email: RegExp;
  password: (value: string) => boolean;
  sheba: RegExp;
  bank_account: RegExp;
  bank_card: RegExp;
};

export type ValidationRule =
  | keyof BuiltInValidator
  | { pattern: RegExp }
  | { minLength: number }
  | { maxLength: number }
  | { custom: (value: any, allValues: FormValues) => boolean };

export type FieldErrorMessages = {
  required?: string;
  invalid?: string;
};

export type ValidationConfig<T extends FormValues> = {
  [K in keyof T]?: {
    rules?: ValidationRule[];
    errorMessages?: FieldErrorMessages;
    required?: boolean | ((values: T) => boolean);
    validateOnChange?: boolean;
  };
};

export interface UseFormOptions<T extends FormValues> {
  initialValues: T;
  validationConfig?: ValidationConfig<T>;
  update?: boolean;
}

export const createAllRequiredExcept = <T extends FormValues>(
  initialValues: T,
  exceptions: (keyof T)[] = []
): ValidationConfig<T> => {
  const config: ValidationConfig<T> = {};

  Object.keys(initialValues).forEach((key) => {
    const fieldKey = key as keyof T;
    if (!exceptions.includes(fieldKey)) {
      config[fieldKey] = { required: true };
    }
  });

  return config;
};

export const useForm = <T extends FormValues>({
  initialValues,
  validationConfig = {},
  update = false,
}: UseFormOptions<T>) => {
  useEffect(() => {
    if (update) {
      setValues(initialValues);
      setPrevValues(initialValues);
    }
  }, [update]);

  const [prevValues, setPrevValues] = useState<T>(initialValues);
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const builtInValidators: BuiltInValidator = {
    mobile: /^09[0-9]{9}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: (value: string) => value?.length >= 6,
    sheba: /^IR[\d\u06F0-\u06F9]{24}$/i,
    bank_account: /^[\d\u06F0-\u06F9]{12,}$/,
    bank_card: /^[\d\u06F0-\u06F9]{16,}$/,
  };

  const isEmpty = (value: any): boolean => {
    return (
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0)
    );
  };

  const validateConfirmPassword = (value: string): boolean => {
    return values.password === value;
  };

  const validateField = (name: keyof T, value: any): string | null => {
    const fieldConfig = validationConfig[name];
    if (!fieldConfig) return null;

    const { rules = [], required = false, errorMessages = {} } = fieldConfig;

    const isRequired =
      typeof required === "function" ? required(values) : required;

    if (isRequired && isEmpty(value)) {
      return errorMessages.required || `فیلد اجباری است`;
    }

    if (isEmpty(value) && !isRequired) {
      return null;
    }

    for (const rule of rules) {
      let isValid = true;
      let defaultErrorMessage =
        errorMessages.invalid ||
        `مقدار وارد شده برای ${String(name)} معتبر نیست`;

      if (typeof rule === "string" && rule in builtInValidators) {
        const validator = builtInValidators[rule];

        if (typeof validator === "function") {
          isValid = validator(value);
        } else {
          isValid = validator.test(value);
        }

        if (rule === "password" && String(name).includes("confirm")) {
          isValid = validateConfirmPassword(value);
          defaultErrorMessage =
            errorMessages.invalid || "تکرار رمز عبور با رمز عبور مطابقت ندارد";
        }
      } else if (typeof rule === "object") {
        if ("pattern" in rule) {
          isValid = rule.pattern.test(value);
        } else if ("minLength" in rule) {
          isValid = String(value).length >= rule.minLength;
          defaultErrorMessage =
            errorMessages.invalid ||
            `حداقل ${rule.minLength} کاراکتر وارد کنید`;
        } else if ("maxLength" in rule) {
          isValid = String(value).length <= rule.maxLength;
          defaultErrorMessage =
            errorMessages.invalid ||
            `حداکثر ${rule.maxLength} کاراکتر مجاز است`;
        } else if ("custom" in rule) {
          isValid = rule.custom(value, values);
        }
      }

      if (!isValid) {
        return defaultErrorMessage;
      }
    }

    return null;
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    const fieldName = name as keyof T;
    const newValue =
      value.trim() === "" && prevValues[fieldName] === null ? null : value;

    const fieldConfig = validationConfig[fieldName];
    const shouldValidateOnChange = fieldConfig?.validateOnChange ?? false;

    let errorMessage: string | null = null;

    if (shouldValidateOnChange) {
      errorMessage = validateField(fieldName, newValue);
    } else {
      if (errors[fieldName] && !isEmpty(newValue)) {
        errorMessage = null;
      } else if (errors[fieldName]) {
        errorMessage = errors[fieldName];
      }
    }

    setValues((prev) => ({ ...prev, [fieldName]: newValue } as T));
    setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
  };

  const handleChangeNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const fieldName = name as keyof T;
    const convertedValue = persianToEnglishNumber(value);
    const cleanValue = convertedValue.replace(/[^0-9]/g, "");
    const newValue =
      value.trim() === "" && prevValues[fieldName] === null ? null : cleanValue;

    const fieldConfig = validationConfig[fieldName];
    const shouldValidateOnChange = fieldConfig?.validateOnChange ?? false;

    let errorMessage: string | null = null;

    if (shouldValidateOnChange) {
      errorMessage = validateField(fieldName, newValue);
    } else {
      if (errors[fieldName] && !isEmpty(newValue)) {
        errorMessage = null;
      } else if (errors[fieldName]) {
        errorMessage = errors[fieldName];
      }
    }

    setValues((prev) => ({ ...prev, [fieldName]: newValue } as T));
    setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
  };

  const handleChangeKey = (value: string | boolean | number, key: keyof T) => {
    const newValue =
      typeof value === "string" &&
      value.trim() === "" &&
      prevValues[key] === null
        ? null
        : value;

    const fieldConfig = validationConfig[key];
    const shouldValidateOnChange = fieldConfig?.validateOnChange ?? false;

    let errorMessage: string | null = null;

    if (shouldValidateOnChange) {
      errorMessage = validateField(key, newValue);
    } else {
      if (errors[key] && !isEmpty(newValue)) {
        errorMessage = null;
      } else if (errors[key]) {
        errorMessage = errors[key];
      }
    }

    setValues((prev) => ({ ...prev, [key]: newValue } as T));
    setErrors((prev) => ({ ...prev, [key]: errorMessage }));
  };

  const handleChangeBooleanKey = (value: boolean, key: keyof T) => {
    const newValues = { ...values, [key]: value } as T;
    setValues(newValues);

    const newErrors: any = { ...errors };

    Object.keys(validationConfig).forEach((fieldKey) => {
      const fieldName = fieldKey as keyof T;
      const fieldConfig = validationConfig[fieldName];

      if (fieldConfig?.required && typeof fieldConfig.required === "function") {
        newErrors[fieldName] = null;
      }
    });

    setErrors(newErrors);
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: Partial<Record<keyof T, string>> = {};

    Object.keys(values).forEach((key) => {
      const fieldKey = key as keyof T;
      const errorMessage = validateField(fieldKey, values[fieldKey]);
      newErrors[fieldKey] = errorMessage || undefined;
      if (errorMessage) {
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const getUpdatedData = (): Partial<T> => {
    const updatedData: Partial<T> = {};
    Object.keys(values).forEach((key) => {
      const fieldKey = key as keyof T;
      if (prevValues[fieldKey] !== values[fieldKey]) {
        updatedData[fieldKey] = values[fieldKey];
      }
    });
    return updatedData;
  };

  const handleResetForm = (initial?: any) => {
    setValues(initial || initialValues);
    setErrors({});
  };

  const handleResetError = () => {
    setErrors({});
  };

  const getFieldError = (fieldName: keyof T): string | undefined => {
    return errors[fieldName] || undefined;
  };

  const hasFieldError = (fieldName: keyof T): boolean => {
    return !!errors[fieldName];
  };

  return {
    values,
    errors,
    validateForm,
    handleChange,
    handleChangeNumber,
    handleChangeKey,
    handleChangeBooleanKey,
    handleResetForm,
    handleResetError,
    getUpdatedData,
    getFieldError,
    hasFieldError,
  };
};
