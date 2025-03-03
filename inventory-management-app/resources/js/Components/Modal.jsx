import React from "react";
import styles from "../../css/Modal.module.css";

const Modal = ({
    isOpen,
    children,
    onClose,
    reset,
    setErrors,
    setCheckedOrder,
}) => {
    if (!isOpen) return null;

    const handleClickOutside = (e) => {
        if (e.target.classList.contains(styles.modal)) {
            onClose();
            if (reset) reset();
            if (setErrors) setErrors({});
            if (setCheckedOrder) setCheckedOrder();
        }
    };

    return (
        <div className={styles.modal} onClick={handleClickOutside}>
            {children}
        </div>
    );
};

export default Modal;
