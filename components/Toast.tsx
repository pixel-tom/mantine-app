import React, { useEffect, useState } from "react";
import { CgSpinnerAlt } from "react-icons/cg";
import { Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

interface ToastState {
  show: boolean;
  message: string;
  details: string;
  type: "success" | "error" | "info" | "loading";
}

const CustomToast: React.FC<ToastState & { onClose: () => void }> = ({
  show,
  message,
  type,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else if (!show && isVisible) {
      setTimeout(() => setIsVisible(false), 300); // Delay to allow animation to complete
    }
  }, [show, isVisible]);

  useEffect(() => {
    if (isVisible && (type === "success" || type === "error")) {
      const timer = setTimeout(() => {
        onClose();
        setIsVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, type, onClose]);

  let backgroundColor = "bg-green-500";
  if (type === "error") backgroundColor = "bg-red-500";
  if (type === "loading") backgroundColor = "bg-blue-500";

  const animationClass = isVisible
    ? "translate-y-0 opacity-100"
    : "translate-y-full opacity-0";

    const icon = <IconInfoCircle />;

  return (
    <>
      <div
        className={` fixed bottom-4 right-4 items-center `}
        style={{ height: "100px", width: "300px" }}
      >
        {isVisible && (
          <Alert variant="filled" color="blue" title="Alert" icon={icon}>
          {message}
        </Alert>
        )}
      </div>
    </>
  );
};

export default CustomToast;
