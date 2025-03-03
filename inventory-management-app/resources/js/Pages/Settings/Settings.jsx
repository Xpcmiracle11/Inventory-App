import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import styles from "../../../css/Settings.module.css";
import { usePage, router } from "@inertiajs/react";
import editIcon from "../../../images/edit-icon-dark.svg";
import deleteIcon from "../../../images/delete-icon-light.svg";
import Modal from "../../Components/Modal";

const Settings = () => {
    const { user } = usePage().props;
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [editFormData, setEditFormData] = useState({
        first_name: "",
        last_name: "",
        role: "",
        department: "",
        email: "",
        password: "",
        repeat_password: "",
    });
    const toggleEditModal = () => {
        setEditFormData({
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            role: user.role || "Select an Option",
            department: user.department || "IT",
            email: user.email || "",
            password: user.password || "",
            repeat_password: user.repeat_password || "",
        });
        setEditModalOpen(!isEditModalOpen);
    };
    const closeEditModal = () => {
        setEditModalOpen(false);
    };
    const handleSaveClick = () => {
        let newErrors = {};
        if (editFormData.password !== editFormData.repeat_password) {
            newErrors.password = "Password and repeat password do not match!";
            newErrors.repeat_password =
                "Password and repeat password do not match!";
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        router.put(`/settings/${user.id}`, editFormData, {
            onSuccess: () => {
                setEditModalOpen(false);
                setErrors({});
            },
            onError: () => {},
        });
    };
    const toggleDeleteModal = () => {
        setDeleteModalOpen(!isDeleteModalOpen);
    };
    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
    };
    const handleDeleteClick = () => {
        router.delete(`/settings/${user.id}`, {
            onSuccess: () => {
                setDeleteModalOpen(false);
            },
            onError: () => {},
        });
    };
    return (
        <BrowserRouter>
            <section className={styles.settings}>
                <Sidebar />
                <div className={styles["settings-container"]}>
                    <div className={styles["page-title"]}>
                        <h1 className={styles.title}>Settings</h1>
                    </div>
                    <div className={styles["personal-information-container"]}>
                        <div className={styles["personal-information-card"]}>
                            <div className={styles["information-container"]}>
                                <h1 className={styles["name-label"]}>
                                    {user
                                        ? `${user.first_name} ${user.last_name}`
                                        : "Guest"}
                                </h1>
                                <p className={styles["department-role-label"]}>
                                    {`${user?.department || "IT"} - ${
                                        user?.role || "User"
                                    }`}
                                </p>
                                <p className={styles["department-role-label"]}>
                                    {user?.email || " "}
                                </p>
                            </div>
                            <div className={styles["button-container"]}>
                                <button
                                    className={styles.edit}
                                    onClick={toggleEditModal}
                                >
                                    <img
                                        className={styles["edit-icon"]}
                                        src={editIcon}
                                        alt="Edit"
                                    />
                                </button>
                                <button
                                    className={styles.delete}
                                    onClick={toggleDeleteModal}
                                >
                                    <img
                                        className={styles["delete-icon"]}
                                        src={deleteIcon}
                                        alt="Delete"
                                    />
                                </button>
                            </div>
                        </div>
                        <div className={styles["other-information-card"]}>
                            <div
                                className={
                                    styles["information-label-container"]
                                }
                            >
                                <p className={styles.label}>First Name</p>
                                <h1 className={styles.information}>
                                    {user.first_name}
                                </h1>
                            </div>
                            <div
                                className={
                                    styles["information-label-container"]
                                }
                            >
                                <p className={styles["label"]}>Last Name</p>
                                <h1 className={styles["information"]}>
                                    {user.last_name}
                                </h1>
                            </div>
                            <div
                                className={
                                    styles["information-label-container"]
                                }
                            >
                                <p className={styles["label"]}>
                                    Department and Role
                                </p>
                                <h1 className={styles["information"]}>
                                    {`${user.department} - ${user.role}`}
                                </h1>
                            </div>
                            <div
                                className={
                                    styles["information-label-container"]
                                }
                            >
                                <p className={styles["label"]}>Email</p>
                                <h1 className={styles["information"]}>
                                    {user.email}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
                {isEditModalOpen && (
                    <Modal
                        isOpen={isEditModalOpen}
                        onClose={() => setEditModalOpen(false)}
                        reset={""}
                    >
                        <div
                            className={`${styles["modal-container"]} ${styles["add-modal-container"]}`}
                        >
                            <div className={styles["modal-header"]}>
                                <div
                                    className={styles["modal-title-container"]}
                                >
                                    <h2 className={styles["modal-title"]}>
                                        Edit Profile
                                    </h2>
                                </div>
                                <div
                                    className={styles["modal-close-container"]}
                                >
                                    <button
                                        className={styles["modal-close"]}
                                        onClick={closeEditModal}
                                    >
                                        X
                                    </button>
                                </div>
                            </div>
                            <div className={styles["modal-body"]}>
                                <div
                                    className={styles["modal-input-container"]}
                                >
                                    <p className={styles.label}>First Name</p>
                                    <input
                                        className={styles.input}
                                        value={editFormData.first_name}
                                        type="text"
                                        onChange={(e) =>
                                            setEditFormData((prev) => ({
                                                ...prev,
                                                first_name: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div
                                    className={styles["modal-input-container"]}
                                >
                                    <p className={styles.label}>Last Name</p>
                                    <input
                                        className={styles.input}
                                        value={editFormData.last_name}
                                        type="text"
                                        onChange={(e) =>
                                            setEditFormData((prev) => ({
                                                ...prev,
                                                last_name: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div
                                    className={styles["modal-input-container"]}
                                >
                                    <p className={styles.label}>Role</p>
                                    <select
                                        className={styles.input}
                                        value={editFormData.role}
                                        onChange={(e) =>
                                            setEditFormData((prev) => ({
                                                ...prev,
                                                role: e.target.value,
                                            }))
                                        }
                                    >
                                        <option
                                            value="Select an Option"
                                            disabled
                                        >
                                            Select an Option
                                        </option>
                                        <option value="Moderator">
                                            Moderator
                                        </option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>
                                <div
                                    className={styles["modal-input-container"]}
                                >
                                    <p className={styles.label}>Department</p>
                                    <input
                                        className={styles.input}
                                        value={editFormData.department}
                                        type="text"
                                        onChange={(e) =>
                                            setEditFormData((prev) => ({
                                                ...prev,
                                                department: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div
                                    className={styles["modal-input-container"]}
                                >
                                    <p className={styles.label}>Email</p>
                                    <input
                                        className={styles.input}
                                        value={editFormData.email}
                                        type="email"
                                        onChange={(e) =>
                                            setEditFormData((prev) => ({
                                                ...prev,
                                                email: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div
                                    className={styles["modal-input-container"]}
                                >
                                    <p className={styles.label}>Password</p>
                                    <input
                                        className={`${styles.input} ${
                                            errors.password ? styles.error : ""
                                        }`}
                                        value={editFormData.password}
                                        type="password"
                                        onChange={(e) =>
                                            setEditFormData((prev) => ({
                                                ...prev,
                                                password: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div
                                    className={styles["modal-input-container"]}
                                >
                                    <p className={styles.label}>
                                        Repeat Password
                                    </p>
                                    <input
                                        className={`${styles.input} ${
                                            errors.repeat_password
                                                ? styles.error
                                                : ""
                                        }`}
                                        value={editFormData.repeat_password}
                                        type="password"
                                        onChange={(e) =>
                                            setEditFormData((prev) => ({
                                                ...prev,
                                                repeat_password: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className={styles["add-button-container"]}>
                                    <button
                                        className={styles["add-button"]}
                                        onClick={handleSaveClick}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Modal>
                )}
                {isDeleteModalOpen && (
                    <Modal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setDeleteModalOpen(false)}
                    >
                        <div className={styles["modal-container"]}>
                            <div className={styles["modal-header"]}>
                                <div
                                    className={`${styles["modal-title-container"]} ${styles["modal-delete-title-container"]}`}
                                >
                                    <h2
                                        className={`${styles["modal-title"]} ${styles["modal-delete-title"]}`}
                                    >
                                        Are you sure to delete your profile?
                                    </h2>
                                </div>
                            </div>
                            <div
                                className={
                                    styles["delete-confirmation-container"]
                                }
                            >
                                <button
                                    className={styles["delete-confirmation"]}
                                    onClick={handleDeleteClick}
                                >
                                    Delete
                                </button>
                                <button
                                    className={styles["cancel-confirmation"]}
                                    onClick={closeDeleteModal}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}
            </section>
        </BrowserRouter>
    );
};

export default Settings;
