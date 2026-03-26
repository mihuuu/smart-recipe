import { useState } from "react";
import { ToastContainer, Toast } from "react-bootstrap";
import { HiOutlineX } from "react-icons/hi";

interface MyToastProps {
  show: boolean;
  message: string;
  variant: string;
  onClose: () => void;
}

export const MyToast = ({ show, message, variant, onClose }: MyToastProps) => {
  return (
    <ToastContainer
      style={{
        top: "100px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <Toast show={show} onClose={onClose} delay={3000} autohide bg={variant}>
        <Toast.Body className="text-white d-flex justify-content-between align-items-center">
          <span style={{ fontWeight: 500 }}>{message}</span>
          <HiOutlineX
            className="ms-2"
            style={{ fontSize: "1.2rem", cursor: "pointer" }}
            onClick={onClose}
          />
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

interface UseToastReturn {
  ToastComponent: () => JSX.Element;
  showToast: (msg: string, toastVariant?: string) => void;
}

// eslint-disable-next-line
export function useToast(): UseToastReturn {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");

  const showToast = (msg: string, toastVariant = "success") => {
    setMessage(msg);
    setVariant(toastVariant);
    setShow(true);
  };

  const closeToast = () => {
    setShow(false);
  };

  const ToastComponent = () => (
    <MyToast
      show={show}
      message={message}
      variant={variant}
      onClose={closeToast}
    />
  );

  return { ToastComponent, showToast };
}
