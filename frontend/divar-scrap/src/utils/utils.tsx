import { toast } from "react-toastify";
import Icon from "@/shared/icons/Icon";

// toast
let lastToastId: any = null;
const ToastSuccess = (
  message: string = "عملیات با موفقیت انجام شد",
  autoCloseTime: number = 2500
) => {
  if (lastToastId) {
    toast.dismiss(lastToastId);
  }
  const toastId = toast.success(message, {
    position: "top-center",
    closeOnClick: true,
    closeButton: false,
    hideProgressBar: true,
    autoClose: autoCloseTime,
    icon: () => (
      <Icon
        name="tick-circle"
        isFill={false}
        isStroke={true}
        strokeWidth="2"
        color="#00ad3aff"
        size={"20"}
      />
    ),
    style: {
      direction: "rtl",
      zIndex: 9999,
      fontSize: "0.9rem",
      border: "1px solid #3aba7cff",
      backgroundColor: "#d8e9dbff",
      color: "#000",
      whiteSpace: "pre-line",
      minHeight: "3rem",
      lineHeight: 1.5,
      fontFamily: "vazir-bold",
    },
  });

  lastToastId = toastId;
};

const ToastWarn = (
  message: string = "مشکلی در انجام عملیات رخ داده است",
  height: string = "3rem"
) => {
  if (lastToastId) {
    toast.dismiss(lastToastId);
  }

  const toastId = toast.warn(message, {
    position: "top-center",
    closeOnClick: true,
    closeButton: false,
    hideProgressBar: true,
    autoClose: 2500,
    icon: () => <Icon name="exclamation-circle" color="#000" size={"24"} />,
    style: {
      direction: "rtl",
      zIndex: 9999,
      fontSize: "0.85rem",
      backgroundColor: "rgba(255, 213, 129, 1)",
      border: "1px solid #f3af28ff",
      color: "#000",
      minHeight: height,
      lineHeight: 1.5,
      fontFamily: "vazir-bold",
    },
  });

  lastToastId = toastId;
};
const ToastInfo = (
  message: string = "مشکلی در انجام عملیات رخ داده است",
  height: string = "5rem",
  duration: number = 4000
) => {
  if (lastToastId) {
    toast.dismiss(lastToastId);
  }

  const htmlMessage = message.replace(/\n/g, "<br />");

  const toastId = toast.warn(
    <div dangerouslySetInnerHTML={{ __html: htmlMessage }} />,
    {
      position: "top-center",
      closeOnClick: true,
      closeButton: false,
      hideProgressBar: true,
      autoClose: duration,
      icon: () => (
        <Icon name="exclamation-circle" color="#2190ffff" size={"20"} />
      ),
      style: {
        direction: "rtl",
        zIndex: 9999,
        fontSize: "0.85rem",
        backgroundColor: "#e6f3ffff",
        border: "1px solid #369affff",
        color: "#000",
        minHeight: height,
        lineHeight: 1.9,
        fontFamily: "vazir-bold",
        paddingInlineStart: "20rem",
        minWidth: "20rem",
      },
    }
  );

  lastToastId = toastId;
};

const ToastDanger = (message: string = "عملیات با خطا مواجه شد.") => {
  if (lastToastId) {
    toast.dismiss(lastToastId);
  }

  const toastId = toast.error(message, {
    position: "top-center",
    closeOnClick: true,
    closeButton: false,
    hideProgressBar: true,
    autoClose: 2500,
    icon: () => (
      <Icon
        name="error-circle"
        isFill={false}
        isStroke={true}
        strokeWidth="2"
        color="#e11900"
        size={"26"}
      />
    ),
    style: {
      direction: "rtl",
      zIndex: 9999,
      fontSize: "0.85rem",
      color: "#000",
      backgroundColor: "#FFEFED",
      border: "1px solid #feb7adff",
      minHeight: "3rem",
      lineHeight: 1.5,
      fontFamily: "vazir-bold",
    },
  });

  lastToastId = toastId;
};

const ToastNotification = (options: { title: string; body?: string }) => {
  if (lastToastId) {
    toast.dismiss(lastToastId);
  }
  const toastId = toast.info(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        justifyContent: "center",
      }}
    >
      <div style={{ fontWeight: "vazir-bold", color: "#000" }}>
        {options.title}
      </div>
      {options?.body && (
        <div style={{ color: "#8e8e8eff" }}>{options.body}</div>
      )}
    </div>,
    {
      position: "top-right",
      closeOnClick: true,
      closeButton: false,
      hideProgressBar: true,
      icon: () => (
        <Icon
          name="bell"
          isFill={false}
          isStroke={true}
          strokeWidth="2"
          color="#00ad3aff"
          size={"20"}
        />
      ),

      style: {
        direction: "rtl",
        fontFamily: "vazir",
        fontSize: "1rem",
        color: "#0A37B5",
        borderRadius: "12px",
        backgroundColor: "#e6f3ffff",
        border: "1px solid #369affff",
        height: "5rem",
      },
    }
  );

  lastToastId = toastId;
};

// set maxLength 60 for single line text
const truncateText = (text: string, maxLength: number) => {
  if (text?.length > maxLength) {
    return text?.substring(0, maxLength - 3) + "...";
  } else {
    return text;
  }
};
const numberSeparate = (value: number | undefined) => {
  if (value !== undefined && value !== null) {
    const cleanValue = value.toString().replace(/[^\d]/g, "");
    const number = Number(cleanValue).toLocaleString();
    return number;
  }
  return;
};
const convertNumber = (str: string) => {
  const persianNumbers = "۰۱۲۳۴۵۶۷۸۹";
  const englishNumbers = "0123456789";
  return str?.replace(
    /[۰-۹]/g,
    (char) => englishNumbers[persianNumbers.indexOf(char)]
  );
};

const clearStringHtml = (content: string) => {
  const textContent = content?.replace(/<[^>]*>/g, "").trim();
  return textContent;
};

const isDatePassed = (dateString: string): boolean => {
  const givenDate = new Date(dateString);
  const now = new Date();
  return givenDate < now;
};

const isValidTimeSelection = (
  selectedTime: { date: string } | null | undefined,
  selectedExactTime: { date: string } | null | undefined
): boolean => {
  if (!selectedTime?.date && !selectedExactTime?.date) {
    return false;
  }

  const dateToCheck = selectedTime?.date || selectedExactTime?.date;
  return dateToCheck ? !isDatePassed(dateToCheck) : false;
};

const persianToEnglishNumber = (str: string) => {
  const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const englishNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  return str.replace(
    /[۰-۹]/g,
    (char) => englishNumbers[persianNumbers.indexOf(char)]
  );
};

const calculatePercentage = (total: number, current: number) => {
  return Number(((current / total) * 100).toFixed());
};

const cleanObject = <T extends Record<string, any>>(obj: T): Partial<T> => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (
      value !== null &&
      value !== undefined &&
      !(typeof value === "string" && value.trim() === "") &&
      !(Array.isArray(value) && value.length === 0)
    ) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as Partial<T>);
};

const convertToFormData = (obj: Record<string, any>): FormData => {
  const formData = new FormData();

  const appendFormData = (data: any, parentKey?: string) => {
    if (data === null || data === undefined || data === "") return;

    if (data instanceof File) {
      formData.append(parentKey!, data);
    } else if (Array.isArray(data)) {
      data.forEach((value, index) => {
        const key = parentKey ? `${parentKey}` : `${index}`;
        appendFormData(value, key);
      });
    } else if (typeof data === "object" && !(data instanceof Date)) {
      Object.keys(data).forEach((key) => {
        const value = data[key];
        const newKey = parentKey ? `${parentKey}[${key}]` : key;
        appendFormData(value, newKey);
      });
    } else {
      formData.append(parentKey!, data);
    }
  };

  Object.keys(obj).forEach((key) => {
    appendFormData(obj[key], key);
  });

  return formData;
};

const ToastCleaner = () => {
  if (lastToastId) {
    toast.dismiss(lastToastId);
    lastToastId = null;
  }
};

export {
  ToastSuccess,
  ToastWarn,
  ToastDanger,
  ToastNotification,
  ToastCleaner,
  ToastInfo,
  truncateText,
  numberSeparate,
  convertNumber,
  isDatePassed,
  isValidTimeSelection,
  persianToEnglishNumber,
  clearStringHtml,
  calculatePercentage,
  cleanObject,
  convertToFormData,
};
