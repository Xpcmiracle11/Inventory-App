import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import Modal from "../../Components/Modal";
import styles from "../../../css/Category.module.css";
import { useForm, usePage, router, Link } from "@inertiajs/react";
import CreatableSelect from "react-select/creatable";
import deleteIcon from "../../../images/delete-icon-light.svg";
import editIcon from "../../../images/edit-icon-dark.svg";
import saveIcon from "../../../images/save-icon-dark.svg";
import cancelIcon from "../../../images/cancel-icon-light.svg";
import addIcon from "../../../images/add-icon.svg";
import removeIcon from "../../../images/minus-icon.svg";
const Category = () => {
    const {
        suppliers,
        equipments,
        user,
        categories,
        years,
        sort: initialSort,
        search: initialSearch,
    } = usePage().props;
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [categoryId, setCategoryId] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [search, setSearch] = useState(initialSearch || "");
    const [sort, setSort] = useState(initialSort || "Default");
    const searchInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const handleSortChange = (e) => {
        const value = e.target.value;
        setSort(value);
        router.get(
            "/category",
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
                "/category",
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
        equipment_name: "",
        item_type: "Select an Option",
    });
    const [errors, setErrors] = useState({});
    const validatedFields = () => {
        const newErrors = {};
        if (!data.equipment_name.trim()) {
            newErrors.equipment_name = "This field is required.";
        }
        if (data.item_type === "Select an Option") {
            newErrors.item_type = "This field is required.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const equipmentOptions = usePage().props.equipments.map((equipment) => ({
        value: equipment.equipment_name,
        label: equipment.equipment_name,
    }));
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validatedFields()) {
            setAddModalOpen(false);
            reset();
            post("/category");
        }
    };
    const [editRowId, setEditRowId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        equipment_name: "",
        item_type: "",
    });
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prevdata) => ({
            ...prevdata,
            [name]: value,
        }));
    };
    useEffect(() => {}, [editFormData]);
    const handleEditClick = (category) => {
        setEditRowId(category.id);
        setEditFormData({
            equipment_name: category.equipment_name || "Select an Option",
            item_type: category.item_type || "Select an Option",
        });
    };
    const handleSaveClick = () => {
        router.put(`/category/${editRowId}`, editFormData, {
            onSuccess: () => {
                setEditRowId(null);
            },
            onError: () => {},
        });
    };
    const toggleDeleteModal = (id) => {
        setCategoryId(id);
        setDeleteModalOpen(!isDeleteModalOpen);
    };
    const closeDeleteModal = () => {
        setCategoryId(null);
        setDeleteModalOpen(false);
    };
    const handleDeleteClick = () => {
        if (categoryId) {
            router.delete(`/category/${categoryId}`, {
                onSuccess: () => {
                    setCategoryId(null);
                    setDeleteModalOpen(false);
                },
                onError: () => {},
            });
        }
    };
    const [selectedCategoryData, setSelectedCategoryData] = useState({
        category_id: "",
        equipment_name: "",
        quantity: "",
        brand: "",
        model: "",
        item_type: "",
    });
    const [rows, setRows] = useState([
        {
            brand: "",
            model: "",
            serial_number: "",
            supplier: "Select an Option",
        },
    ]);
    const toggleConfirmModal = (id) => {
        const categoryList = categories.data || [];
        const category = categoryList.find((item) => item.id === id);
        if (category) {
            setSelectedCategoryData({
                category_id: category.id || "",
                equipment_name: category.equipment_name || "",
                item_type: category.item_type || "",
            });
        }
        setCategoryId(id);
        setSelectedCategory(category || null);
        setConfirmModalOpen(!isConfirmModalOpen);
    };
    const closeConfirmModal = () => {
        setCategoryId(null);
        setConfirmModalOpen(false);
        setRows([
            {
                brand: "",
                model: "",
                serial_number: "",
                supplier: "Select an Option",
            },
        ]);
        setFieldErrors({});
    };
    const handleAddRow = () => {
        setRows([
            ...rows,
            {
                brand: "",
                model: "",
                serial_number: "",
                supplier: "Select an Option",
            },
        ]);
    };
    const handleRemoveRow = (index) => {
        if (rows.length > 1) {
            setRows(rows.filter((_, i) => i !== index));
        }
    };
    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const updatedRows = [...rows];
        updatedRows[index][name] = value;
        setRows(updatedRows);
        setFieldErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            if (value.trim()) {
                delete newErrors[`${name}-${index}`];
            }
            return newErrors;
        });
    };
    const [fieldErrors, setFieldErrors] = useState({});
    const handleSubmitStocks = () => {
        let newErrors = {};

        rows.forEach((row, index) => {
            if (!row.brand.trim())
                newErrors[`brand-${index}`] = "Brand is required.";
            if (!row.model.trim())
                newErrors[`model-${index}`] = "Model is required.";
            if (!row.serial_number.trim())
                newErrors[`serial_number-${index}`] =
                    "Serial Number is required.";
            if (!row.supplier.trim() || row.supplier === "Select an Option")
                newErrors[`supplier-${index}`] = "Supplier is required.";
        });
        if (!selectedCategoryData.category_id)
            newErrors.category = "Category is required.";
        if (!selectedCategoryData.equipment_name)
            newErrors.equipment_name = "Equipment Name is required.";
        if (!selectedCategoryData.item_type)
            newErrors.item_type = "Item Type is required.";
        if (Object.keys(newErrors).length > 0) {
            setFieldErrors(newErrors);
            return;
        }
        setFieldErrors({});
        const submissionData = rows.map((row) => ({
            category_id: selectedCategoryData.category_id,
            equipment_name: selectedCategoryData.equipment_name,
            item_type: selectedCategoryData.item_type,
            ...row,
        }));
        router.post(`/category/${categoryId}`, { stocksData: submissionData });
        setCategoryId(null);
        setConfirmModalOpen(false);
        setRows([
            {
                brand: "",
                model: "",
                serial_number: "",
                supplier: "Select an Option",
            },
        ]);
        setFieldErrors({});
    };
    return (
        <BrowserRouter>
            <section className={styles.category}>
                <Sidebar />
                <div className={styles["category-container"]}>
                    <div className={styles["page-title"]}>
                        <h1 className={styles.title}>Category</h1>
                    </div>
                    <div className={styles["filter-container"]}>
                        <div className={styles["button-container"]}>
                            <button
                                className={styles.add}
                                onClick={toggleAddModal}
                            >
                                Add Category
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
                                    <th className={styles.th}>
                                        Equipment Name
                                    </th>
                                    <th className={styles.th}>Item Type</th>
                                    <th className={styles.th}>Date</th>
                                    <th
                                        className={`${styles.th} ${styles["action-th"]}`}
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={styles.tbody}>
                                {categories.data.map((category) => (
                                    <tr
                                        onClick={() =>
                                            toggleConfirmModal(category.id)
                                        }
                                        className={`${styles.btr} ${styles["category-btr"]}`}
                                        key={category.id}
                                    >
                                        {editRowId === category.id ? (
                                            <>
                                                <td
                                                    className={styles.td}
                                                    data-label="Equipment:"
                                                >
                                                    <CreatableSelect
                                                        options={
                                                            equipmentOptions
                                                        }
                                                        value={
                                                            equipmentOptions.find(
                                                                (opt) =>
                                                                    opt.value ===
                                                                    editFormData.equipment_name
                                                            ) || {
                                                                value: editFormData.equipment_name,
                                                                label: editFormData.equipment_name,
                                                            }
                                                        }
                                                        onChange={(
                                                            selectedOption
                                                        ) =>
                                                            setEditFormData({
                                                                ...editFormData,
                                                                equipment_name:
                                                                    selectedOption
                                                                        ? selectedOption.value
                                                                        : "",
                                                            })
                                                        }
                                                        onInputChange={(
                                                            inputValue,
                                                            { action }
                                                        ) => {
                                                            if (
                                                                action ===
                                                                "input-change"
                                                            ) {
                                                                setEditFormData(
                                                                    {
                                                                        ...editFormData,
                                                                        equipment_name:
                                                                            inputValue,
                                                                    }
                                                                );
                                                            }
                                                        }}
                                                        className={`${
                                                            styles.input
                                                        } ${
                                                            errors.equipment_name
                                                                ? styles.error
                                                                : ""
                                                        }`}
                                                        isClearable={false}
                                                        createOptionPosition="first"
                                                        styles={{
                                                            control: (
                                                                base,
                                                                state
                                                            ) => ({
                                                                ...base,
                                                                backgroundColor:
                                                                    state.isFocused
                                                                        ? "#f5f5f5"
                                                                        : "#f5f5f5",
                                                                borderColor:
                                                                    state.isFocused
                                                                        ? "#36454f"
                                                                        : "#36454f",
                                                                boxShadow:
                                                                    state.isFocused
                                                                        ? "0 0 3px #36454f"
                                                                        : "none",
                                                                outline: "none",
                                                                ":hover": {
                                                                    borderColor:
                                                                        "#36454f",
                                                                },
                                                            }),
                                                            option: (
                                                                base,
                                                                {
                                                                    isSelected,
                                                                    isFocused,
                                                                    isActive,
                                                                }
                                                            ) => ({
                                                                ...base,
                                                                backgroundColor:
                                                                    isSelected
                                                                        ? "#36454f"
                                                                        : isFocused
                                                                        ? "#f5f5f5"
                                                                        : isActive
                                                                        ? "#d9d9d9"
                                                                        : "white",
                                                                color: isSelected
                                                                    ? "white"
                                                                    : "black",
                                                            }),
                                                            singleValue: (
                                                                base,
                                                                state
                                                            ) => ({
                                                                ...base,
                                                                color: "#36454f",
                                                                fontWeight:
                                                                    "normal;",
                                                            }),
                                                        }}
                                                    />
                                                </td>
                                                <td
                                                    className={styles.td}
                                                    data-label="Item Type:"
                                                >
                                                    <select
                                                        className={`${
                                                            styles.input
                                                        } ${
                                                            errors.equipment_name
                                                                ? styles.error
                                                                : ""
                                                        }`}
                                                        name="item_type"
                                                        value={
                                                            editFormData.item_type ||
                                                            ""
                                                        }
                                                        onChange={
                                                            handleEditChange
                                                        }
                                                    >
                                                        <option
                                                            value="Select an Option"
                                                            disabled
                                                        >
                                                            Select an Option
                                                        </option>
                                                        <option value="Input Device">
                                                            Input Device
                                                        </option>
                                                        <option value="Output Device">
                                                            Output Device
                                                        </option>
                                                        <option value="Storage Device">
                                                            Storage Device
                                                        </option>
                                                        <option value="Networking Peripherals">
                                                            Networking
                                                            Peripherals
                                                        </option>
                                                        <option value="Power and Cooling Peripherals">
                                                            Power and Cooling
                                                            Peripherals
                                                        </option>
                                                    </select>
                                                </td>
                                                <td
                                                    className={styles.td}
                                                    data-label="Date:"
                                                >
                                                    {new Date(
                                                        category.date
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
                                                    data-label="Action:"
                                                >
                                                    <div
                                                        className={`${styles.td} ${styles["action-container"]}`}
                                                    >
                                                        <button
                                                            className={
                                                                styles[
                                                                    "edit-action"
                                                                ]
                                                            }
                                                            onClick={(
                                                                event
                                                            ) => {
                                                                event.stopPropagation();
                                                                handleSaveClick;
                                                            }}
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
                                                            onClick={(
                                                                event
                                                            ) => {
                                                                event.stopPropagation();
                                                                setEditRowId(
                                                                    null
                                                                );
                                                            }}
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
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td
                                                    className={`${styles.td} ${styles["checkbox-container"]}`}
                                                    data-label="Equipment:"
                                                >
                                                    {category.equipment_name}
                                                </td>

                                                <td
                                                    className={styles.td}
                                                    data-label="Item Type:"
                                                >
                                                    {category.item_type}
                                                </td>
                                                <td
                                                    className={styles.td}
                                                    data-label="Date:"
                                                >
                                                    {new Date(
                                                        category.date
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
                                                    data-label="Action:"
                                                >
                                                    <div
                                                        className={`${styles.td} ${styles["action-container"]}`}
                                                    >
                                                        <button
                                                            className={
                                                                styles[
                                                                    "edit-action"
                                                                ]
                                                            }
                                                            onClick={(
                                                                event
                                                            ) => {
                                                                event.stopPropagation();
                                                                handleEditClick(
                                                                    category
                                                                );
                                                            }}
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
                                                            onClick={(
                                                                event
                                                            ) => {
                                                                event.stopPropagation();
                                                                toggleDeleteModal(
                                                                    category.id
                                                                );
                                                            }}
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
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className={styles.pagination}>
                            <div className={styles["pagination-container"]}>
                                {categories.links
                                    .filter((link, index) => {
                                        const currentPage =
                                            categories.current_page;
                                        const totalPages =
                                            categories.links.length - 2;
                                        if (
                                            index === 0 ||
                                            index ===
                                                categories.links.length - 1
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
                                            Add Category
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
                                            Equipment
                                        </p>
                                        <CreatableSelect
                                            options={equipmentOptions}
                                            value={
                                                equipmentOptions.find(
                                                    (opt) =>
                                                        opt.value ===
                                                        data.equipment_name
                                                ) || {
                                                    value: data.equipment_name,
                                                    label: data.equipment_name,
                                                }
                                            }
                                            onChange={(selectedOption) =>
                                                setData(
                                                    "equipment_name",
                                                    selectedOption
                                                        ? selectedOption.value
                                                        : ""
                                                )
                                            }
                                            onInputChange={(
                                                inputValue,
                                                { action }
                                            ) => {
                                                if (action === "input-change") {
                                                    setData(
                                                        "equipment_name",
                                                        inputValue
                                                    );
                                                }
                                            }}
                                            placeholder="Type or select equipment..."
                                            className={`${styles.input} ${
                                                errors.equipment_name
                                                    ? styles.error
                                                    : ""
                                            }`}
                                            isClearable={false}
                                            createOptionPosition="first"
                                            styles={{
                                                control: (base, state) => ({
                                                    ...base,
                                                    backgroundColor:
                                                        state.isFocused
                                                            ? "#f5f5f5"
                                                            : "#f5f5f5",
                                                    borderColor: state.isFocused
                                                        ? "#36454f"
                                                        : "#36454f",
                                                    boxShadow: state.isFocused
                                                        ? "0 0 3px #36454f"
                                                        : "none",
                                                    outline: "none",
                                                    ":hover": {
                                                        borderColor: "#36454f",
                                                    },
                                                }),
                                                option: (
                                                    base,
                                                    {
                                                        isSelected,
                                                        isFocused,
                                                        isActive,
                                                    }
                                                ) => ({
                                                    ...base,
                                                    backgroundColor: isSelected
                                                        ? "#36454f"
                                                        : isFocused
                                                        ? "#f5f5f5"
                                                        : isActive
                                                        ? "#d9d9d9"
                                                        : "white",
                                                    color: isSelected
                                                        ? "white"
                                                        : "black",
                                                }),
                                                singleValue: (base, state) => ({
                                                    ...base,
                                                    color: "#36454f",
                                                    fontWeight: "normal;",
                                                }),
                                            }}
                                        />
                                    </div>
                                    <div
                                        className={
                                            styles["modal-input-container"]
                                        }
                                    >
                                        <p className={styles.label}>
                                            Item Type
                                        </p>
                                        <select
                                            className={`${styles.input} ${
                                                errors.item_type
                                                    ? styles.error
                                                    : ""
                                            }`}
                                            value={data.item_type}
                                            onChange={(e) =>
                                                setData(
                                                    "item_type",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option
                                                value="Select an Option"
                                                disabled
                                            >
                                                Select an Option
                                            </option>
                                            <option value="Input Device">
                                                Input Device
                                            </option>
                                            <option value="Output Device">
                                                Output Device
                                            </option>
                                            <option value="Storage Device">
                                                Storage Device
                                            </option>
                                            <option value="Networking Peripherals">
                                                Networking Peripherals
                                            </option>
                                            <option value="Power and Cooling Peripherals">
                                                Power and Cooling Peripherals
                                            </option>
                                        </select>
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
                    {isConfirmModalOpen && selectedCategory && (
                        <Modal
                            isOpen={isConfirmModalOpen}
                            onClose={closeConfirmModal}
                            setCheckedOrder={closeConfirmModal}
                        >
                            <div
                                className={`${styles["modal-container"]} ${styles["modal-confirm-container"]}`}
                            >
                                <div className={styles["modal-header"]}>
                                    <div
                                        className={
                                            styles["modal-title-container"]
                                        }
                                    >
                                        <h2 className={styles["modal-title"]}>
                                            {selectedCategory.equipment_name}
                                        </h2>
                                        <p
                                            className={
                                                styles["modal-sub-title"]
                                            }
                                        >
                                            Item Type:{" "}
                                            {selectedCategory.item_type}
                                        </p>
                                    </div>
                                    <div
                                        className={
                                            styles["modal-close-container"]
                                        }
                                    >
                                        <button
                                            className={styles["modal-close"]}
                                            onClick={closeConfirmModal}
                                        >
                                            X
                                        </button>
                                    </div>
                                </div>
                                <div className={styles["modal-body"]}>
                                    {rows.map((row, index) => (
                                        <div
                                            key={index}
                                            className={`${styles["modal-input-container"]} ${styles["modal-confirm-input-container"]}`}
                                        >
                                            <div
                                                className={
                                                    styles["input-container"]
                                                }
                                            >
                                                <p className={styles.label}>
                                                    Brand
                                                </p>
                                                <input
                                                    className={`${
                                                        styles.input
                                                    } ${
                                                        fieldErrors[
                                                            `brand-${index}`
                                                        ]
                                                            ? styles.error
                                                            : ""
                                                    }`}
                                                    type="text"
                                                    name="brand"
                                                    value={row.brand}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            index,
                                                            e
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div
                                                className={
                                                    styles["input-container"]
                                                }
                                            >
                                                <p className={styles.label}>
                                                    Model
                                                </p>
                                                <input
                                                    className={`${
                                                        styles.input
                                                    } ${
                                                        fieldErrors[
                                                            `model-${index}`
                                                        ]
                                                            ? styles.error
                                                            : ""
                                                    }`}
                                                    type="text"
                                                    name="model"
                                                    value={row.model}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            index,
                                                            e
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div
                                                className={
                                                    styles["input-container"]
                                                }
                                            >
                                                <p className={styles.label}>
                                                    Serial Number
                                                </p>
                                                <input
                                                    className={`${
                                                        styles.input
                                                    } ${
                                                        fieldErrors[
                                                            `serial_number-${index}`
                                                        ]
                                                            ? styles.error
                                                            : ""
                                                    }`}
                                                    type="text"
                                                    name="serial_number"
                                                    value={row.serial_number}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            index,
                                                            e
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div
                                                className={
                                                    styles["input-container"]
                                                }
                                            >
                                                <p className={styles.label}>
                                                    Supplier
                                                </p>
                                                <select
                                                    className={`${
                                                        styles.input
                                                    } ${
                                                        fieldErrors[
                                                            `supplier-${index}`
                                                        ]
                                                            ? styles.error
                                                            : ""
                                                    }`}
                                                    name="supplier"
                                                    value={row.supplier}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            index,
                                                            e
                                                        )
                                                    }
                                                >
                                                    <option
                                                        value="Select an Option"
                                                        disabled
                                                    >
                                                        Select an Option
                                                    </option>
                                                    {suppliers.data.map(
                                                        (supplier) => (
                                                            <option
                                                                key={
                                                                    supplier.id
                                                                }
                                                                value={
                                                                    supplier.supplier_name
                                                                }
                                                            >
                                                                {
                                                                    supplier.supplier_name
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </div>
                                            <div
                                                className={`${
                                                    styles[
                                                        "add-remove-button-container"
                                                    ]
                                                }
                                                ${
                                                    rows.length > 1
                                                        ? styles[
                                                              "space-between"
                                                          ]
                                                        : styles["align-end"]
                                                }`}
                                            >
                                                {rows.length > 1 && (
                                                    <button
                                                        className={
                                                            styles["remove-row"]
                                                        }
                                                        onClick={() =>
                                                            handleRemoveRow(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <img
                                                            className={
                                                                styles[
                                                                    "remove-icon"
                                                                ]
                                                            }
                                                            src={removeIcon}
                                                            alt="Remove"
                                                        />
                                                    </button>
                                                )}
                                                {index === rows.length - 1 && (
                                                    <button
                                                        className={
                                                            styles["add-row"]
                                                        }
                                                        onClick={handleAddRow}
                                                        disabled={
                                                            !row.brand ||
                                                            !row.model ||
                                                            !row.serial_number ||
                                                            !row.supplier
                                                        }
                                                    >
                                                        <img
                                                            className={
                                                                styles[
                                                                    "add-icon"
                                                                ]
                                                            }
                                                            src={addIcon}
                                                            alt="Add"
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div
                                    className={`${styles["delete-confirmation-container"]} ${styles["confirm-submit-stocks"]}`}
                                >
                                    <button
                                        className={`${styles["delete-confirmation"]} ${styles["stocks-confirmation"]}`}
                                        onClick={handleSubmitStocks}
                                    >
                                        Confirm
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

export default Category;
