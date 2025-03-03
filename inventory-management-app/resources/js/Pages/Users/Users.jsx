import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import Modal from "../../Components/Modal";
import styles from "../../../css/Users.module.css";
import { useForm, usePage, router, Link } from "@inertiajs/react";
import deleteIcon from "../../../images/delete-icon-light.svg";
import editIcon from "../../../images/edit-icon-dark.svg";
const Users = () => {
    const {
        user,
        users,
        years,
        sort: initialSort,
        search: initialSearch,
    } = usePage().props;
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [userId, setUserId] = useState(null);
    const [search, setSearch] = useState(initialSearch || "");
    const [sort, setSort] = useState(initialSort || "Default");
    const [selectedUser, setSelectedUser] = useState(null);
    const searchInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const handleSortChange = (e) => {
        const value = e.target.value;
        setSort(value);
        router.get(
            "/users",
            { search, sort: value },
            { preserveState: true, replace: true }
        );
    };
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
            router.get("/users", { search: value }, { preserveState: true });
        }, 400);
    };
    const toggleAddModal = () => {
        setAddModalOpen(!isAddModalOpen);
    };
    const closeAddModal = () => {
        setAddModalOpen(false);
        reset();
        setErrors({});
    };
    const { data, setData, post, reset, processing } = useForm({
        first_name: "",
        last_name: "",
        role: "Select an Option",
        department: "IT",
        email: "",
        password: "",
        repeat_password: "",
    });
    const [errors, setErrors] = useState({});
    const validatedFields = () => {
        const newErrors = {};
        if (!data.first_name.trim()) {
            newErrors.first_name = "This field is required.";
        }
        if (!data.last_name.trim()) {
            newErrors.last_name = "This field is required.";
        }
        if (data.role === "Select an Option") {
            newErrors.role = "This field is required.";
        }
        if (!data.department.trim()) {
            newErrors.department = "This field is required.";
        }
        if (!data.email.trim()) {
            newErrors.email = "This field is required.";
        } else if (!data.email.includes("@")) {
            newErrors.email = "Invalid email format.";
        }
        if (!data.password.trim()) {
            newErrors.password = "This field is required.";
        } else if (!data.repeat_password.trim()) {
            newErrors.repeat_password = "This field is required";
        } else if (data.password !== data.repeat_password) {
            newErrors.password = "Password and repeat password do not match!";
            newErrors.repeat_password =
                "Password and repeat password do not match!";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validatedFields()) {
            setAddModalOpen(false);
            reset();
            setErrors({});
            post("/users");
        }
    };
    const [editFormData, setEditFormData] = useState({
        first_name: "",
        last_name: "",
        role: "Select an Option",
        department: "IT",
        email: "",
        password: "",
        repeat_password: "",
    });
    const toggleEditModal = (id) => {
        const clientsList = users.data || [];
        const client = clientsList.find((item) => item.id === id);
        if (client) {
            setEditFormData({
                first_name: client.first_name || "",
                last_name: client.last_name || "",
                role: client.role || "Select an Option",
                department: client.department || "IT",
                email: client.email || "",
                password: client.password || "",
                repeat_password: client.password || "",
            });
        }
        setUserId(id);
        setSelectedUser(client || null);
        setEditModalOpen(!isEditModalOpen);
    };
    const closeEditModal = () => {
        setUserId(null);
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
        router.put(`/users/${userId}`, editFormData, {
            onSuccess: () => {
                setUserId(null);
                setEditModalOpen(false);
                setErrors({});
            },
            onError: () => {},
        });
    };
    const toggleDeleteModal = (id) => {
        setUserId(id);
        setDeleteModalOpen(!isDeleteModalOpen);
    };
    const closeDeleteModal = () => {
        setUserId(null);
        setDeleteModalOpen(false);
    };
    const handleDeleteClick = () => {
        if (userId) {
            router.delete(`/users/${userId}`, {
                onSuccess: () => {
                    setUserId(null);
                    setDeleteModalOpen(false);
                },
                onError: () => {},
            });
        }
    };
    return (
        <BrowserRouter>
            <section className={styles.users}>
                <Sidebar />
                <div className={styles["users-container"]}>
                    <div className={styles["page-title"]}>
                        <h1 className={styles.title}>Users</h1>
                    </div>
                    <div className={styles["filter-container"]}>
                        <div className={styles["button-container"]}>
                            <button
                                className={styles.add}
                                onClick={toggleAddModal}
                            >
                                Add Users
                            </button>
                        </div>
                        <div className={styles["search-container"]}>
                            <input
                                className={styles.search}
                                type="text"
                                ref={searchInputRef}
                                value={search}
                                onChange={handleSearchChange}
                                placeholder="Search here..."
                            />
                        </div>
                        <div className={styles["sort-container"]}>
                            <select
                                className={styles.sort}
                                value={sort}
                                onChange={handleSortChange}
                            >
                                <option value="Default">Default</option>
                                {years?.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className={styles["table-container"]}>
                        <table className={styles.table}>
                            <thead className={styles.thead}>
                                <tr className={styles.htr}>
                                    <th className={styles.th}>Name</th>
                                    <th className={styles.th}>Role</th>
                                    <th className={styles.th}>Department</th>
                                    <th className={styles.th}>Email</th>
                                    <th className={styles.th}>Date Created</th>
                                    <th
                                        className={`${styles.th} ${styles["action-th"]}`}
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={styles.tbody}>
                                {users.data.map((client, index) => (
                                    <tr className={styles.btr} key={client.id}>
                                        <td
                                            className={styles.td}
                                            data-label="Name:"
                                        >
                                            {" "}
                                            {index + 1}
                                            {". "}
                                            {client.first_name}{" "}
                                            {client.last_name}
                                        </td>
                                        <td
                                            className={styles.td}
                                            data-label="Role:"
                                        >
                                            {client.role}
                                        </td>
                                        <td
                                            className={styles.td}
                                            data-label="Department:"
                                        >
                                            {client.department}
                                        </td>
                                        <td
                                            className={styles.td}
                                            data-label="Email:"
                                        >
                                            {client.email}
                                        </td>
                                        <td
                                            className={styles.td}
                                            data-label="Date Created:"
                                        >
                                            {new Date(
                                                client.date
                                            ).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </td>
                                        <td
                                            className={`${styles.td} ${styles["action-container"]}`}
                                            data-label="Action:"
                                        >
                                            <button
                                                className={
                                                    styles["edit-action"]
                                                }
                                                onClick={() =>
                                                    toggleEditModal(client.id)
                                                }
                                            >
                                                <img
                                                    className={
                                                        styles["edit-icon"]
                                                    }
                                                    src={editIcon}
                                                    alt="Edit"
                                                />
                                            </button>
                                            <button
                                                className={
                                                    styles["delete-action"]
                                                }
                                                onClick={() =>
                                                    toggleDeleteModal(client.id)
                                                }
                                            >
                                                <img
                                                    className={
                                                        styles["delete-icon"]
                                                    }
                                                    src={deleteIcon}
                                                    alt="Delete"
                                                />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className={styles.pagination}>
                            <div className={styles["pagination-container"]}>
                                {users.links
                                    .filter((link, index) => {
                                        const currentPage = users.current_page;
                                        const totalPages =
                                            users.links.length - 2;
                                        if (
                                            index === 0 ||
                                            index === users.links.length - 1
                                        )
                                            return true;
                                        if (currentPage === 1)
                                            return index <= 3;
                                        if (currentPage === totalPages)
                                            return index >= totalPages - 2;
                                        return (
                                            index >= currentPage - 1 &&
                                            index <= currentPage + 1
                                        );
                                    })
                                    .map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || ""}
                                            className={`${
                                                styles["pagination-link"]
                                            } ${
                                                link.active ? styles.active : ""
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        ></Link>
                                    ))}
                            </div>
                        </div>
                    </div>
                    {isAddModalOpen && (
                        <Modal
                            isOpen={isAddModalOpen}
                            onClose={toggleAddModal}
                            reset={reset}
                            setErrors={setErrors}
                        >
                            <div className={styles["modal-container"]}>
                                <div className={styles["modal-header"]}>
                                    <div
                                        className={
                                            styles["modal-title-container"]
                                        }
                                    >
                                        <h2 className={styles["modal-title"]}>
                                            Add Users
                                        </h2>
                                    </div>
                                    <div
                                        className={
                                            styles["modal-close-container"]
                                        }
                                    >
                                        <button
                                            className={styles["modal-close"]}
                                            onClick={closeAddModal}
                                        >
                                            X
                                        </button>
                                    </div>
                                </div>
                                <form
                                    className={styles["modal-body"]}
                                    onSubmit={handleSubmit}
                                >
                                    <div
                                        className={
                                            styles["modal-input-container"]
                                        }
                                    >
                                        <p className={styles.label}>
                                            First Name
                                        </p>
                                        <input
                                            className={`${styles.input} ${
                                                errors.first_name
                                                    ? styles.error
                                                    : ""
                                            }`}
                                            type="text"
                                            value={data.first_name}
                                            onChange={(e) =>
                                                setData(
                                                    "first_name",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div
                                        className={
                                            styles["modal-input-container"]
                                        }
                                    >
                                        <p className={styles.label}>
                                            Last Name
                                        </p>
                                        <input
                                            className={`${styles.input} ${
                                                errors.last_name
                                                    ? styles.error
                                                    : ""
                                            }`}
                                            type="text"
                                            value={data.last_name}
                                            onChange={(e) =>
                                                setData(
                                                    "last_name",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div
                                        className={
                                            styles["modal-input-container"]
                                        }
                                    >
                                        <p className={styles.label}>Role</p>
                                        <select
                                            className={`${styles.input} ${
                                                errors.role ? styles.error : ""
                                            }`}
                                            value={data.role}
                                            onChange={(e) =>
                                                setData("role", e.target.value)
                                            }
                                        >
                                            <option
                                                value="Select an Option"
                                                disabled
                                            >
                                                Select an Option
                                            </option>
                                            <option value="Admin">Admin</option>
                                            <option value="Moderator">
                                                Moderator
                                            </option>
                                        </select>
                                    </div>
                                    <div
                                        className={
                                            styles["modal-input-container"]
                                        }
                                    >
                                        <p className={styles.label}>
                                            Department
                                        </p>
                                        <input
                                            className={`${styles.input} ${
                                                errors.department
                                                    ? styles.error
                                                    : ""
                                            }`}
                                            type="text"
                                            value={data.department}
                                            onChange={(e) =>
                                                setData(
                                                    "department",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div
                                        className={
                                            styles["modal-input-container"]
                                        }
                                    >
                                        <p className={styles.label}>Email</p>
                                        <input
                                            className={`${styles.input} ${
                                                errors.email ? styles.error : ""
                                            }`}
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                        />
                                    </div>
                                    <div
                                        className={
                                            styles["modal-input-container"]
                                        }
                                    >
                                        <p className={styles.label}>Password</p>
                                        <input
                                            className={`${styles.input} ${
                                                errors.password
                                                    ? styles.error
                                                    : ""
                                            }`}
                                            type="password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div
                                        className={
                                            styles["modal-input-container"]
                                        }
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
                                            type="password"
                                            value={data.repeat_password}
                                            onChange={(e) =>
                                                setData(
                                                    "repeat_password",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div
                                        className={
                                            styles["add-button-container"]
                                        }
                                    >
                                        <button
                                            className={styles["add-button"]}
                                            type="submit"
                                        >
                                            {processing
                                                ? "Processing..."
                                                : "Submit"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </Modal>
                    )}
                    {isEditModalOpen && selectedUser && (
                        <Modal
                            isOpen={isEditModalOpen}
                            onClose={() => setEditModalOpen(false)}
                            reset={reset}
                            setErrors={setErrors}
                        >
                            <div className={styles["modal-container"]}>
                                <div className={styles["modal-header"]}>
                                    <div
                                        className={
                                            styles["modal-title-container"]
                                        }
                                    >
                                        <h2 className={styles["modal-title"]}>
                                            Edit User
                                        </h2>
                                    </div>
                                    <div
                                        className={
                                            styles["modal-close-container"]
                                        }
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
                                        className={
                                            styles["modal-input-container"]
                                        }
                                    >
                                        <p className={styles.label}>
                                            First Name
                                        </p>
                                        <input
                                            className={`${styles.input} ${
                                                errors.first_name
                                                    ? styles.error
                                                    : ""
                                            }`}
                                            value={editFormData.first_name}
                                            type="text"
                                            onChange={(e) =>
                                                setEditFormData({
                                                    ...editFormData,
                                                    first_name: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div
                                        className={
                                            styles["modal-input-container"]
                                        }
                                    >
                                        <p className={styles.label}>
                                            Last Name
                                        </p>
                                        <input
                                            className={`${styles.input} ${
                                                errors.last_name
                                                    ? styles.error
                                                    : ""
                                            }`}
                                            value={editFormData.last_name}
                                            type="text"
                                            onChange={(e) =>
                                                setEditFormData({
                                                    ...editFormData,
                                                    last_name: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div
                                        className={
                                            styles["modal-input-container"]
                                        }
                                    >
                                        <p className={styles.label}>Role</p>
                                        <select
                                            className={`${styles.input} ${
                                                errors.role ? styles.error : ""
                                            }`}
                                            value={editFormData.role}
                                            onChange={(e) =>
                                                setEditFormData({
                                                    ...editFormData,
                                                    role: e.target.value,
                                                })
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
                                        className={
                                            styles["modal-input-container"]
                                        }
                                    >
                                        <p className={styles.label}>
                                            Department
                                        </p>
                                        <input
                                            className={`${styles.input} ${
                                                errors.department
                                                    ? styles.error
                                                    : ""
                                            }`}
                                            value={editFormData.department}
                                            type="text"
                                            onChange={(e) =>
                                                setEditFormData({
                                                    ...editFormData,
                                                    department: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div
                                        className={
                                            styles["modal-input-container"]
                                        }
                                    >
                                        <p className={styles.label}>Email</p>
                                        <input
                                            className={`${styles.input} ${
                                                errors.email ? styles.error : ""
                                            }`}
                                            value={editFormData.email}
                                            type="email"
                                            onChange={(e) =>
                                                setEditFormData({
                                                    ...editFormData,
                                                    email: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div
                                        className={
                                            styles["modal-input-container"]
                                        }
                                    >
                                        <p className={styles.label}>Password</p>
                                        <input
                                            className={`${styles.input} ${
                                                errors.password
                                                    ? styles.error
                                                    : ""
                                            }`}
                                            value={editFormData.password}
                                            type="password"
                                            onChange={(e) =>
                                                setEditFormData({
                                                    ...editFormData,
                                                    password: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div
                                        className={
                                            styles["modal-input-container"]
                                        }
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
                                                setEditFormData({
                                                    ...editFormData,
                                                    repeat_password:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div
                                        className={
                                            styles["add-button-container"]
                                        }
                                    >
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
                            reset={reset}
                            setErrors={setErrors}
                        >
                            <div className={styles["modal-container"]}>
                                <div className={styles["modal-header"]}>
                                    <div
                                        className={`${styles["modal-title-container"]} ${styles["modal-delete-title-container"]}`}
                                    >
                                        <h2
                                            className={`${styles["modal-title"]} ${styles["modal-delete-title"]}`}
                                        >
                                            Are you sure to delete this user?
                                        </h2>
                                    </div>
                                </div>
                                <div
                                    className={
                                        styles["delete-confirmation-container"]
                                    }
                                >
                                    <button
                                        className={
                                            styles["delete-confirmation"]
                                        }
                                        onClick={handleDeleteClick}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className={
                                            styles["cancel-confirmation"]
                                        }
                                        onClick={closeDeleteModal}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </Modal>
                    )}
                </div>
            </section>
        </BrowserRouter>
    );
};
export default Users;
