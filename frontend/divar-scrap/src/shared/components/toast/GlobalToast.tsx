import { createPortal } from "react-dom";
import { ToastContainer } from "react-toastify";
import { FadeTransition } from "./FadeTransition";

const GlobalToast = () => {
  return createPortal(
    <ToastContainer transition={FadeTransition} limit={3} />,
    document.body
  );
};

export default GlobalToast;
