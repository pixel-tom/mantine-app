import React, { useEffect, useState } from "react";
import { Alert } from "@mantine/core";
import {
  IconCheck,
  IconX,
  IconInfoCircle,
  IconLoader,
} from "@tabler/icons-react";

interface ToastProps {
  show: boolean;
  message: string;
  type: "success" | "error" | "info" | "loading";
  onClose: () => void;
}

const CustomToast: React.FC<ToastProps> = ({
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
      setTimeout(() => setIsVisible(false), 300);
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

  let color = "";
  let icon = <IconInfoCircle />;
  let textColor = "text-black";

  switch (type) {
    case "success":
      color = "#11FA98";
      icon = <IconCheck />;
      textColor = "text-gray-200";
      break;
    case "error":
      color = "red";
      icon = <IconX />;
      textColor = "text-gray-300";
      break;
    case "loading":
      color = "gray";
      icon = <IconLoader className="animate-spin" />;
      textColor = "text-gray-300";
      break;
  }

  return (
    <div
      className={`fixed bottom-4 right-4 items-center z-50`}
      style={{ height: "100px", width: "300px" }}
    >
      {isVisible && (
        <Alert
          variant="filled"
          color={color}
          title={type.charAt(0).toUpperCase() + type.slice(1)}
          icon={icon}
          c="white"
        >
          <p className={`${textColor}`}>{message}</p>
        </Alert>
      )}
    </div>
  );
};

export default CustomToast;
