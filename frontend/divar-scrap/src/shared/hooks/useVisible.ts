import { useState } from "react";

interface IInitialValue {
  [key: string]: boolean;
}

export const useVisible = (
  initialValue: IInitialValue = { defaultKey: false }
) => {
  const [open, setVisible] = useState<IInitialValue>(initialValue);

  const handleVisible = (key: string) => {
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleVisibleType = (key: string, type: boolean) => {
    setVisible((prev) => ({ ...prev, [key]: type }));
  };

  const handleVisibleReset = () => {
    setVisible({ defaultKey: false });
  };

  return { open, handleVisible, handleVisibleType, handleVisibleReset };
};
