import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import Modal from "../../Components/Modal";
import styles from "../../../css/Supplier.module.css";
import deleteIcon from "../../../images/delete-icon-light.svg";
import editIcon from "../../../images/edit-icon-dark.svg";
import saveIcon from "../../../images/save-icon-dark.svg";
import cancelIcon from "../../../images/cancel-icon-light.svg";
import { usePage, Link, useForm, router } from "@inertiajs/react";
const Supplier = () => {
    const {
        user,
        years,
        suppliers,
        sort: initialSort,
        search: initialSearch,
    } = usePage().props;
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [supplierId, setSupplierId] = useState(null);
    const [search, setSearch] = useState(initialSearch || "");
    const [sort, setSort] = useState(initialSort || "Default");
    const searchInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const handleSortChange = (e) => {
        const value = e.target.value;
        setSort(value);
        router.get(
            "/supplier",
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
            router.get(
                "/supplier",
                { search: value, sort },
                { preserveState: true }
            );
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
        supplier_name: "",
        address: "",
        phone_number: "09",
        email: "",
    });
    const [errors, setErrors] = useState({});
    const validatedFields = () => {
        const newErrors = {};
        if (!data.supplier_name.trim()) {
            newErrors.supplier_name = "This field is required.";
        }
        if (!data.address.trim()) {
            newErrors.address = "This field is required.";
        }
        if (!data.phone_number.trim()) {
            newErrors.phone_number = "This field is required.";
        }
        if (!data.email.trim()) {
            newErrors.email = "This field is required.";
        } else if (!data.email.includes("@")) {
            newErrors.email = "Invalid email format.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data);
        console.log;
        if (validatedFields()) {
            setAddModalOpen(false);
            reset();
            post("/supplier");
        }
    };
    const [editRowId, setEditRowId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        supplier_name: "",
        address: "",
        phone_number: "",
        email: "",
    });
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        if (name === "phone_number") {
            const numericValue = value.replace(/\D/g, "");
            if (numericValue.length > 11) return;

            setEditFormData((prevdata) => ({
                ...prevdata,
                [name]: numericValue,
            }));
        } else {
            setEditFormData((prevdata) => ({
                ...prevdata,
                [name]: value,
            }));
        }
    };
    useEffect(() => {}, [editFormData]);
    const handleEditClick = (supplier) => {
        setEditRowId(supplier.id);
        setEditFormData({
            supplier_name: supplier.supplier_name || "",
            address: supplier.address || "",
            phone_number: supplier.phone_number || "",
            email: supplier.email || "",
        });
    };
    const handleSaveClick = () => {
        router.put(`/supplier/${editRowId}`, editFormData, {
            onSuccess: () => {
                setEditRowId(null);
            },
            onError: () => {},
        });
    };
    const toggleDeleteModal = (id) => {
        setSupplierId(id);
        setDeleteModalOpen(!isDeleteModalOpen);
    };
    const closeDeleteModal = () => {
        setSupplierId(null);
        setDeleteModalOpen(false);
    };
    const handleDeleteClick = () => {
        if (supplierId) {
            router.delete(`/supplier/${supplierId}`, {
                onSuccess: () => {
                    setSupplierId(null);
                    setDeleteModalOpen(false);
                },
                onError: () => {},
            });
        }
    };
    return (
        <BrowserRouter>
            <div className={styles.supplier}>
                <Sidebar />
                <div className={styles["supplier-container"]}>
                    <div className={styles["page-title"]}>
                        <h1 className={styles.title}>Supplier</h1>
                    </div>
                    <div className={styles["filter-container"]}>
                        <div className={styles["button-container"]}>
                            <button
                                className={styles.add}
                                onClick={toggleAddModal}
                            >
                                Add Supplier
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
                                    <th className={styles.th}>Supplier Name</th>
                                    <th className={styles.th}>
                                        Supplier Address
                                    </th>
                                    <th className={styles.th}>
                                        Contact Number
                                    </th>
                                    <th className={styles.th}>Email</th>
                                    <th className={styles.th}>Date Added</th>
                                    <th className={styles.th}>Action</th>
                                </tr>
                            </thead>
                            <tbody className={styles.tbody}>
                                {suppliers.data.map((supplier, index) => (
                                    <tr
                                        className={styles.btr}
                                        key={supplier.id}
                                    >
                                        {editRowId === supplier.id ? (
                                            <>
                                                <td
                                                    className={styles.td}
                                                    data-label="Supplier"
                                                >
                                                    <input
                                                        className={`${styles.input} ${styles["edit-input"]}`}
                                                        name="supplier_name"
                                                        type="text"
                                                        value={
                                                            editFormData.supplier_name ||
                                                            ""
                                                        }
                                                        onChange={
                                                            handleEditChange
                                                        }
                                                    />
                                                </td>
                                                <td
                                                    className={styles.td}
                                                    data-label="Address"
                                                >
                                                    <input
                                                        className={`${styles.input} ${styles["edit-input"]}`}
                                                        name="address"
                                                        type="text"
                                                        value={
                                                            editFormData.address ||
                                                            ""
                                                        }
                                                        onChange={
                                                            handleEditChange
                                                        }
                                                    />
                                                </td>
                                                <td
                                                    className={styles.td}
                                                    data-label="Contact"
                                                >
                                                    <input
                                                        className={`${styles.input} ${styles["edit-input"]}`}
                                                        name="phone_number"
                                                        type="text"
                                                        pattern="[0-9]*"
                                                        inputMode="numeric"
                                                        value={
                                                            editFormData.phone_number ||
                                                            ""
                                                        }
                                                        onChange={
                                                            handleEditChange
                                                        }
                                                    />
                                                </td>
                                                <td
                                                    className={styles.td}
                                                    data-label="Email"
                                                >
                                                    <input
                                                        className={`${styles.input} ${styles["edit-input"]}`}
                                                        name="email"
                                                        type="email"
                                                        value={
                                                            editFormData.email ||
                                                            ""
                                                        }
                                                        onChange={
                                                            handleEditChange
                                                        }
                                                    />
                                                </td>
                                                <td
                                                    className={styles.td}
                                                    data-label="Date"
                                                >
                                                    {new Date(
                                                        supplier.date
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </td>
                                                <td
                                                    className={`${styles.td} ${styles["action-container"]}`}
                                                >
                                                    <button
                                                        className={
                                                            styles[
                                                                "edit-action"
                                                            ]
                                                        }
                                                        onClick={
                                                            handleSaveClick
                                                        }
                                                    >
                                                        <img
                                                            className={
                                                                styles[
                                                                    "edit-icon"
                                                                ]
                                                            }
                                                            src={saveIcon}
                                                            alt="Edit"
                                                        />
                                                    </button>
                                                    <button
                                                        className={
                                                            styles[
                                                                "delete-action"
                                                            ]
                                                        }
                                                        onClick={() =>
                                                            setEditRowId(null)
                                                        }
                                                    >
                                                        <img
                                                            className={
                                                                styles[
                                                                    "delete-icon"
                                                                ]
                                                            }
                                                            src={cancelIcon}
                                                            alt="Delete"
                                                        />
                                                    </button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td
                                                    className={styles.td}
                                                    data-label="Address"
                                                >
                                                    {index + 1}
                                                    {". "}
                                                    {supplier.supplier_name}
                                                </td>
                                                <td
                                                    className={styles.td}
                                                    data-label="Address"
                                                >
                                                    {supplier.address}
                                                </td>
                                                <td
                                                    className={styles.td}
                                                    data-label="Contact"
                                                >
                                                    {supplier.phone_number}
                                                </td>
                                                <td
                                                    className={styles.td}
                                                    data-label="Email"
                                                >
                                                    {supplier.email}
                                                </td>
                                                <td
                                                    className={styles.td}
                                                    data-label="Date"
                                                >
                                                    {new Date(
                                                        supplier.date
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </td>
                                                <td
                                                    className={`${styles.td} ${styles["action-container"]}`}
                                                >
                                                    <button
                                                        className={
                                                            styles[
                                                                "edit-action"
                                                            ]
                                                        }
                                                        onClick={() =>
                                                            handleEditClick(
                                                                supplier
                                                            )
                                                        }
                                                    >
                                                        <img
                                                            className={
                                                                styles[
                                                                    "edit-icon"
                                                                ]
                                                            }
                                                            src={editIcon}
                                                            alt="Edit"
                                                        />
                                                    </button>
                                                    <button
                                                        className={
                                                            styles[
                                                                "delete-action"
                                                            ]
                                                        }
                                                        onClick={() =>
                                                            toggleDeleteModal(
                                                                supplier.id
                                                            )
                                                        }
                                                    >
                                                        <img
                                                            className={
                                                                styles[
                                                                    "delete-icon"
                                                                ]
                                                            }
                                                            src={deleteIcon}
                                                            alt="Delete"
                                                        />
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className={styles.pagination}>
                            <div className={styles["pagination-container"]}>
                                {suppliers.links
                                    .filter((link, index) => {
                                        const currentPage =
                                            suppliers.current_page;
                                        const totalPages =
                                            suppliers.links.length - 2;
                                        if (
                                            index === 0 ||
                                            index === suppliers.links.length - 1
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
                                            Add Supplier
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
                                            Supplier Name
                                        </p>
                                        <input
                                            className={`${styles.input} ${
                                                errors.supplier_name
                                                    ? styles.error
                                                    : ""
                                            }`}
                                            type="text"
                                            value={data.supplier_name}
                                            onChange={(e) =>
                                                setData(
                                                    "supplier_name",
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
                                        <p className={styles.label}>Address</p>
                                        <input
                                            className={`${styles.input} ${
                                                errors.address
                                                    ? styles.error
                                                    : ""
                                            }`}
                                            type="text"
                                            value={data.address}
                                            onChange={(e) =>
                                                setData(
                                                    "address",
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
                                            Phone Number
                                        </p>
                                        <input
                                            className={`${styles.input} ${
                                                errors.phone_number
                                                    ? styles.error
                                                    : ""
                                            }`}
                                            type="text"
                                            pattern="[0-9]*"
                                            inputMode="numeric"
                                            value={data.phone_number}
                                            onChange={(e) => {
                                                let value =
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        ""
                                                    );
                                                if (!value.startsWith("09")) {
                                                    value = "09";
                                                }
                                                if (value.length > 11) {
                                                    value = value.slice(0, 11);
                                                }
                                                setData("phone_number", value);
                                            }}
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
                                            Are you sure to delete this
                                            equipment?
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
            </div>
        </BrowserRouter>
    );
};

export default Supplier;
