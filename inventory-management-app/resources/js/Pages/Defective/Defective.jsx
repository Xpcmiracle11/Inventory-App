import React, { useRef, useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import Modal from "../../Components/Modal";
import styles from "../../../css/Defective.module.css";
import { useForm, usePage, router, Link } from "@inertiajs/react";
import CreatableSelect from "react-select/creatable";
import deleteIcon from "../../../images/delete-icon-light.svg";
import editIcon from "../../../images/edit-icon-dark.svg";
import addIcon from "../../../images/add-icon.svg";
import removeIcon from "../../../images/minus-icon.svg";
const Defective = () => {
    const {
        user,
        defectives,
        years,
        months,
        weeks,
        stocks,
        moderators,
        yearSort: initialYearSort,
        monthSort: initialMonthSort,
        weekSort: initialWeekSort,
        search: initialSearch,
    } = usePage().props;
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [defectiveId, setDefectiveId] = useState(null);
    const [search, setSearch] = useState(initialSearch || "");
    const [yearSort, setYearSort] = useState(initialYearSort || "Default");
    const [monthSort, setMonthSort] = useState(initialMonthSort || "Default");
    const [weekSort, setWeekSort] = useState(initialWeekSort || "Default");
    const [selectedDefective, setSelectedDefective] = useState(null);
    const [errors, setErrors] = useState({});
    const [selectedItems, setSelectedItems] = useState([""]);
    const searchInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const handleYearSortChange = (e) => {
        const value = e.target.value;
        setYearSort(value);
        router.get(
            "/defective",
            { search, yearSort: value },
            { preserveState: true, replace: true }
        );
    };
    const handleMonthSortChange = (e) => {
        const value = e.target.value;
        setMonthSort(value);
        router.get("/defective", {
            search,
            yearSort,
            monthSort: value,
            weekSort,
        });
    };
    const handleWeekSortChange = (e) => {
        const value = e.target.value;
        setWeekSort(value);
        router.get("/defective", {
            search,
            yearSort,
            monthSort,
            weekSort: value,
        });
    };
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
            router.get(
                "/defective",
                { search: value, yearSort },
                { preserveState: true }
            );
        }, 400);
    };
    const toggleAddModal = () => {
        setAddModalOpen(!isAddModalOpen);
    };
    const closeAddModal = () => {
        setAddModalOpen(false);
        setSelectedItems([""]);
        setErrors({});
        reset();
    };
    const { data, setData, post, reset, processing } = useForm({
        item_id: [],
        managers_name: "",
        cluster: "",
        floor: "",
        area: "",
        incident_details: "",
        person_incharge: "Select an Option",
        status: "Select an Option",
        note: "",
    });
    const floorOptions = [
        {
            value: "3rd Floor",
            areas: ["IT Office", "HR Office", "Finance Office"],
        },
        {
            value: "4th Floor",
            areas: [
                "2",
                "General Manager's Office",
                "Data Room",
                "Training Room",
                "QGC",
            ],
        },
        { value: "5th Floor", areas: ["1", "2"] },
        { value: "6th Floor", areas: ["1", "2"] },
        { value: "7th Floor", areas: ["1", "2"] },
    ];
    const getAreasByFloor = (floor) => {
        const floorData = floorOptions.find((f) => f.value === floor);
        return floorData ? floorData.areas : [];
    };
    const validatedFields = () => {
        const newErrors = {};
        if (
            data.item_id.length === 0 ||
            data.item_id.includes("Select an Option")
        ) {
            newErrors.item_id = "At least one item must be selected";
        }
        if (!data.managers_name.trim()) {
            newErrors.managers_name = "This field is required";
        }
        if (!data.cluster.trim()) {
            newErrors.cluster = "This field is required";
        }
        if (data.floor === "Select an Option") {
            newErrors.floor = "This field is required";
        }
        if (data.area === "Select an Option") {
            newErrors.area = "This field is required";
        }
        if (!data.incident_details.trim()) {
            newErrors.incident_details = "This field is required";
        }
        if (data.person_incharge === "Select an Option") {
            newErrors.person_incharge = "This field is required";
        }
        if (data.status === "Select an Option") {
            newErrors.status = "This field is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleItemChange = (index, selectedOption) => {
        const updatedItems = [...selectedItems];
        updatedItems[index] = selectedOption;
        setSelectedItems(updatedItems);
        setData(
            "item_id",
            updatedItems.map((item) => item?.value)
        );
    };
    const handleAddSelect = () => {
        if (selectedItems.includes("")) return;
        setSelectedItems([...selectedItems, ""]);
    };
    const handleRemoveSelect = (index) => {
        if (selectedItems.length === 1) return;
        const updatedItems = [...selectedItems];
        updatedItems.splice(index, 1);
        setSelectedItems(updatedItems);
        setData("item_id", updatedItems);
    };
    const isAddDisabled =
        selectedItems.includes("") || selectedItems.length >= stocks.length;
    const getFilteredStocks = (selectedIndex) => {
        return stocks.filter(
            (stock) =>
                !selectedItems.includes(stock.id) ||
                selectedItems[selectedIndex] === stock.id
        );
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validatedFields()) {
            setAddModalOpen(false);
            setSelectedItems([""]);
            reset();
            post("/defective");
        }
    };
    const toggleViewModal = (id) => {
        const defectivesList = defectives.data || [];
        const defective = defectivesList.find(
            (item) => item.defective_id === id
        );
        setDefectiveId(id);
        setSelectedDefective(defective || null);
        setViewModalOpen(!isViewModalOpen);
    };
    const closeViewModal = () => {
        setDefectiveId(null);
        setViewModalOpen(false);
    };
    const [editFormData, setEditFormData] = useState({
        item_id: "Select an Option",
        managers_name: "",
        cluster: "",
        floor: "Select an Option",
        area: "Select an Option",
        incident_details: "",
        person_incharge: "Select an Option",
        status: "Select an Option",
        note: "",
    });
    const toggleEditModal = (id) => {
        const defectivesList = defectives.data || [];
        const defective = defectivesList.find(
            (item) => item.defective_id === id
        );
        if (defective) {
            setEditFormData({
                item_id: defective.item_id || "Select an Option",
                quantity: defective.defectives_quantity || "",
                managers_name: defective.managers_name || "",
                cluster: defective.cluster || "",
                floor: defective.floor || "Select an Option",
                area: defective.area || "Select an Option",
                incident_details: defective.incident_details || "",
                person_incharge:
                    defective.person_incharge || "Select an Option",
                status: defective.status || "Select an Option",
                note: defective.note || "",
            });
        }
        setDefectiveId(id);
        setSelectedDefective(defective || null);
        setEditModalOpen(!isEditModalOpen);
    };
    const closeEditModal = () => {
        setDefectiveId(null);
        setEditModalOpen(false);
    };
    const handleSaveClick = () => {
        router.put(`/defective/${defectiveId}`, editFormData, {
            onSuccess: () => {
                setDefectiveId(null);
                setEditModalOpen(false);
            },
            onError: () => {},
        });
    };
    const toggleDeleteModal = (id) => {
        setDefectiveId(id);
        setDeleteModalOpen(!isDeleteModalOpen);
    };
    const closeDeleteModal = () => {
        setDefectiveId(null);
        setDeleteModalOpen(false);
        setSelectedItems("");
    };
    const handleDeleteClick = () => {
        if (defectiveId) {
            router.delete(`/defective/${defectiveId}`, {
                onSuccess: () => {
                    setDefectiveId(null);
                    setDeleteModalOpen(false);
                },
                onError: () => {},
            });
        }
    };
    const handleDownloadDefectives = async () => {
        if (isProcessing) return;
        setIsProcessing(true);

        try {
            const queryParams = new URLSearchParams({
                yearSort: yearSort || "",
                monthSort: monthSort || "",
                weekSort: weekSort || "",
            }).toString();

            const response = await fetch(`/defective/export?${queryParams}`, {
                method: "GET",
                headers: {
                    Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                },
            });

            if (!response.ok) throw new Error("Failed to download file");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "defectives_report.xlsx";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Download failed:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <BrowserRouter>
            <section className={styles.defective}>
                <Sidebar />
                <div className={styles["defective-container"]}>
                    <div className={styles["page-title"]}>
                        <h1 className={styles.title}>Defective</h1>
                    </div>
                    <div className={styles["filter-container"]}>
                        <div className={styles["button-container"]}>
                            <button
                                className={styles.add}
                                onClick={toggleAddModal}
                            >
                                Add Defectives
                            </button>
                            <button
                                className={styles.add}
                                onClick={handleDownloadDefectives}
                                disabled={isProcessing}
                            >
                                {isProcessing
                                    ? "Downloading..."
                                    : "Download Defectives"}
                            </button>
                        </div>
                        <div className={styles["sort-container"]}>
                            <input
                                className={styles.search}
                                type="text"
                                ref={searchInputRef}
                                value={search}
                                onChange={handleSearchChange}
                                placeholder="Search here..."
                            />
                            <select
                                className={styles.sort}
                                value={yearSort}
                                onChange={handleYearSortChange}
                            >
                                <option value="Default">Default</option>
                                {years?.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                            <select
                                className={styles.sort}
                                onChange={handleMonthSortChange}
                                value={monthSort}
                                disabled={yearSort === "Default"}
                            >
                                <option value="Default">Default</option>
                                {months
                                    ?.filter(
                                        ({ year }) =>
                                            yearSort === "Default" ||
                                            year == yearSort
                                    )
                                    .map(({ number, name, year }) => (
                                        <option
                                            key={`${year}-${number}`}
                                            value={number}
                                        >
                                            {name}
                                        </option>
                                    ))}
                            </select>
                            <select
                                className={styles.sort}
                                onChange={handleWeekSortChange}
                                value={weekSort}
                                disabled={
                                    monthSort === "Default" ||
                                    yearSort === "Default"
                                }
                            >
                                <option value="Default">Default Week</option>
                                {weeks
                                    ?.filter(
                                        ({ year, month }) =>
                                            (yearSort === "Default" ||
                                                year == yearSort) &&
                                            (monthSort === "Default" ||
                                                month == monthSort)
                                    )
                                    .map(({ number, name, year, month }) => (
                                        <option
                                            key={`${year}-${month}-${number}`}
                                            value={number}
                                        >
                                            {name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>
                    <div className={styles["table-container"]}>
                        <table className={styles.table}>
                            <thead className={styles.thead}>
                                <tr className={styles.htr}>
                                    <th className={styles.th}>Item</th>
                                    <th className={styles.th}>Cluster</th>
                                    <th className={styles.th}>Area</th>
                                    <th className={styles.th}>Floor</th>
                                    <th className={styles.th}>In-Charge</th>
                                    <th className={styles.th}>Status</th>
                                    <th className={styles.th}>Date</th>
                                    <th
                                        className={`${styles.th} ${styles["action-th"]}`}
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={styles.tbody}>
                                {defectives.data.map((defective, index) => (
                                    <tr
                                        className={`${styles.btr} ${styles["defective-btr"]}`}
                                        key={defective.defective_id}
                                        onClick={() =>
                                            toggleViewModal(
                                                defective.defective_id
                                            )
                                        }
                                    >
                                        <td
                                            className={styles.td}
                                            data-label=" Item:"
                                        >
                                            {" "}
                                            {index + 1} {". "}
                                            {defective.equipment_name}
                                            {" SN: "}
                                            {defective.serial_number}
                                        </td>
                                        <td
                                            className={styles.td}
                                            data-label="Cluster:"
                                        >
                                            {defective.cluster}
                                        </td>
                                        <td
                                            className={styles.td}
                                            data-label="Area:"
                                        >
                                            {defective.area}
                                        </td>
                                        <td
                                            className={styles.td}
                                            data-label="Floor:"
                                        >
                                            {defective.floor}
                                        </td>
                                        <td
                                            className={styles.td}
                                            data-label="In-Charge:"
                                        >
                                            {defective.person_incharge}
                                        </td>
                                        <td
                                            className={styles.td}
                                            data-label="Status:"
                                        >
                                            {defective.status}
                                        </td>
                                        <td
                                            className={styles.td}
                                            data-label="Date:"
                                        >
                                            {new Date(
                                                defective.date
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
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    toggleEditModal(
                                                        defective.defective_id
                                                    );
                                                }}
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
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    toggleDeleteModal(
                                                        defective.defective_id
                                                    );
                                                }}
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
                                {defectives.links
                                    .filter((link, index) => {
                                        const currentPage =
                                            defectives.current_page;
                                        const totalPages =
                                            defectives.links.length - 2;
                                        if (
                                            index === 0 ||
                                            index ===
                                                defectives.links.length - 1
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
                            <div
                                className={`${styles["modal-container"]} ${styles["add-modal-container"]}`}
                            >
                                <div className={styles["modal-header"]}>
                                    <div
                                        className={
                                            styles["modal-title-container"]
                                        }
                                    >
                                        <h2 className={styles["modal-title"]}>
                                            Add Defectives
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
                                        <p className={styles.label}>Status</p>
                                        <select
                                            className={`${styles.input} ${
                                                errors.status
                                                    ? styles.error
                                                    : ""
                                            }`}
                                            value={data.status}
                                            onChange={(e) =>
                                                setData(
                                                    "status",
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
                                            <option value="Replaced">
                                                Replaced
                                            </option>
                                            <option value="Provided">
                                                Provided
                                            </option>
                                            <option value="Pull Out">
                                                Pull Out
                                            </option>
                                        </select>
                                    </div>
                                    <div
                                        className={
                                            styles[
                                                "modal-add-defective-container"
                                            ]
                                        }
                                    >
                                        <p className={styles.label}>Equiment</p>
                                        {selectedItems.map(
                                            (selectedItem, index) => {
                                                const availableStocks =
                                                    getFilteredStocks(
                                                        index
                                                    ).filter((stock) => {
                                                        return (
                                                            !selectedItems.some(
                                                                (item) =>
                                                                    item &&
                                                                    item.value ===
                                                                        stock.id
                                                            ) ||
                                                            (selectedItem &&
                                                                selectedItem.value ===
                                                                    stock.id)
                                                        );
                                                    });

                                                return (
                                                    <div
                                                        key={index}
                                                        className={
                                                            styles["item-row"]
                                                        }
                                                    >
                                                        <CreatableSelect
                                                            className={`${
                                                                styles.input
                                                            } ${
                                                                styles[
                                                                    "item-defective"
                                                                ]
                                                            } ${
                                                                errors.item_id
                                                                    ? styles.error
                                                                    : ""
                                                            }`}
                                                            options={availableStocks.map(
                                                                (stock) => ({
                                                                    value: stock.id,
                                                                    label: `${stock.equipment_name} (SN: ${stock.serial_number})`,
                                                                })
                                                            )}
                                                            value={
                                                                selectedItem ||
                                                                null
                                                            }
                                                            onChange={(
                                                                selectedOption
                                                            ) => {
                                                                handleItemChange(
                                                                    index,
                                                                    selectedOption
                                                                );
                                                            }}
                                                            onCreateOption={(
                                                                inputValue
                                                            ) => {
                                                                if (
                                                                    !inputValue.trim()
                                                                )
                                                                    return;
                                                                handleItemChange(
                                                                    index,
                                                                    {
                                                                        value: inputValue,
                                                                        label: inputValue,
                                                                    }
                                                                );
                                                            }}
                                                            placeholder={false}
                                                            createOptionPosition="first"
                                                            isClearable={false}
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
                                                                    outline:
                                                                        "none",
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
                                                        {selectedItems.length >
                                                            1 && (
                                                            <button
                                                                className={
                                                                    styles[
                                                                        "remove-serial-button"
                                                                    ]
                                                                }
                                                                onClick={() =>
                                                                    handleRemoveSelect(
                                                                        index
                                                                    )
                                                                }
                                                                type="button"
                                                            >
                                                                <img
                                                                    className={
                                                                        styles[
                                                                            "remove-serial-icon"
                                                                        ]
                                                                    }
                                                                    src={
                                                                        removeIcon
                                                                    }
                                                                    alt="Remove"
                                                                />
                                                            </button>
                                                        )}
                                                        {index ===
                                                            selectedItems.length -
                                                                1 &&
                                                            availableStocks.length >
                                                                0 && (
                                                                <button
                                                                    className={
                                                                        styles[
                                                                            "add-serial-button"
                                                                        ]
                                                                    }
                                                                    onClick={
                                                                        handleAddSelect
                                                                    }
                                                                    type="button"
                                                                >
                                                                    <img
                                                                        className={
                                                                            styles[
                                                                                "add-serial-icon"
                                                                            ]
                                                                        }
                                                                        src={
                                                                            addIcon
                                                                        }
                                                                        alt="Add"
                                                                    />
                                                                </button>
                                                            )}
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                    <div
                                        className={
                                            styles["modal-input-container"]
                                        }
                                    >
                                        <p className={styles.label}>
                                            Manager's Name
                                        </p>
                                        <input
                                            className={`${styles.input} ${
                                                errors.managers_name
                                                    ? styles.error
                                                    : ""
                                            }`}
                                            value={data.managers_name}
                                            type="text"
                                            onChange={(e) =>
                                                setData(
                                                    "managers_name",
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
                                        <p className={styles.label}>Cluster</p>
                                        <input
                                            className={`${styles.input} ${
                                                errors.cluster
                                                    ? styles.error
                                                    : ""
                                            }`}
                                            value={data.cluster}
                                            type="text"
                                            onChange={(e) =>
                                                setData(
                                                    "cluster",
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
                                        <p className={styles.label}>Floor</p>
                                        <select
                                            className={`${styles.input} ${
                                                errors.floor ? styles.error : ""
                                            }`}
                                            value={data.floor || ""}
                                            onChange={(e) => {
                                                setData(
                                                    "floor",
                                                    e.target.value
                                                );
                                                setData("area", "");
                                            }}
                                        >
                                            <option value="" disabled>
                                                Select an Option
                                            </option>
                                            {floorOptions.map((floor) => (
                                                <option
                                                    key={floor.value}
                                                    value={floor.value}
                                                >
                                                    {floor.value}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div
                                        className={
                                            styles["modal-input-container"]
                                        }
                                    >
                                        <p className={styles.label}>Area</p>
                                        <select
                                            className={`${styles.input} ${
                                                errors.area ? styles.error : ""
                                            }`}
                                            value={data.area || ""}
                                            onChange={(e) =>
                                                setData("area", e.target.value)
                                            }
                                            disabled={!data.floor}
                                        >
                                            <option value="" disabled>
                                                Select an Option
                                            </option>
                                            {getAreasByFloor(data.floor).map(
                                                (area) => (
                                                    <option
                                                        key={area}
                                                        value={area}
                                                    >
                                                        {area}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                    <div
                                        className={
                                            styles["modal-input-container"]
                                        }
                                    >
                                        <p className={styles.label}>
                                            Incident Details
                                        </p>
                                        <input
                                            className={`${styles.input} ${
                                                errors.incident_details
                                                    ? styles.error
                                                    : ""
                                            }`}
                                            value={data.incident_details}
                                            type="text"
                                            onChange={(e) =>
                                                setData(
                                                    "incident_details",
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
                                            Person In-Charge
                                        </p>
                                        <select
                                            className={`${styles.input} ${
                                                errors.person_incharge
                                                    ? styles.error
                                                    : ""
                                            }`}
                                            value={data.person_incharge}
                                            onChange={(e) =>
                                                setData(
                                                    "person_incharge",
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
                                            {moderators.data.map(
                                                (moderator) => (
                                                    <option
                                                        key={moderator.id}
                                                        value={`${moderator.first_name} ${moderator.last_name}`}
                                                    >
                                                        {moderator.first_name}{" "}
                                                        {moderator.last_name}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                    <div
                                        className={
                                            styles["modal-input-container"]
                                        }
                                    >
                                        <p className={styles.label}>Note</p>
                                        <textarea
                                            className={`${styles.input} ${
                                                errors.model ? styles.error : ""
                                            }`}
                                            value={data.note}
                                            rows="4"
                                            onChange={(e) =>
                                                setData("note", e.target.value)
                                            }
                                        ></textarea>
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
                    {isViewModalOpen && selectedDefective && (
                        <Modal
                            isOpen={isViewModalOpen}
                            onClose={() => setViewModalOpen(false)}
                            reset={reset}
                            setErrors={setErrors}
                        >
                            <div
                                className={`${styles["modal-container"]} ${styles["modal-defective-container"]}`}
                            >
                                <div className={styles["modal-header"]}>
                                    <div
                                        className={
                                            styles["modal-title-container"]
                                        }
                                    >
                                        <h2 className={styles["modal-title"]}>
                                            Defective Info
                                        </h2>
                                    </div>
                                    <div
                                        className={
                                            styles["modal-close-container"]
                                        }
                                    >
                                        <button
                                            className={styles["modal-close"]}
                                            onClick={closeViewModal}
                                        >
                                            X
                                        </button>
                                    </div>
                                </div>
                                <div
                                    className={`${styles["modal-body"]} ${styles["modal-item-body"]}`}
                                >
                                    <div
                                        className={
                                            styles["modal-item-container"]
                                        }
                                    >
                                        <h5 className={styles["item-label"]}>
                                            Equipment Name:
                                        </h5>
                                        <p className={styles.item}>
                                            {selectedDefective.equipment_name}{" "}
                                            (SN:{" "}
                                            {selectedDefective.serial_number})
                                        </p>
                                    </div>
                                    <div
                                        className={
                                            styles["modal-item-container"]
                                        }
                                    >
                                        <h5 className={styles["item-label"]}>
                                            Manager's Name:
                                        </h5>
                                        <p className={styles.item}>
                                            {selectedDefective.managers_name}
                                        </p>
                                    </div>
                                    <div
                                        className={
                                            styles["modal-item-container"]
                                        }
                                    >
                                        <h5 className={styles["item-label"]}>
                                            Cluster:
                                        </h5>
                                        <p className={styles.item}>
                                            {selectedDefective.cluster}
                                        </p>
                                    </div>
                                    <div
                                        className={
                                            styles["modal-item-container"]
                                        }
                                    >
                                        <h5 className={styles["item-label"]}>
                                            Floor:
                                        </h5>
                                        <p className={styles.item}>
                                            {selectedDefective.floor}
                                        </p>
                                    </div>
                                    <div
                                        className={
                                            styles["modal-item-container"]
                                        }
                                    >
                                        <h5 className={styles["item-label"]}>
                                            Area:
                                        </h5>
                                        <p className={styles.item}>
                                            {selectedDefective.area}
                                        </p>
                                    </div>
                                    <div
                                        className={
                                            styles["modal-item-container"]
                                        }
                                    >
                                        <h5 className={styles["item-label"]}>
                                            Incident Details
                                        </h5>
                                        <p className={styles.item}>
                                            {selectedDefective.incident_details}
                                        </p>
                                    </div>
                                    <div
                                        className={
                                            styles["modal-item-container"]
                                        }
                                    >
                                        <h5 className={styles["item-label"]}>
                                            Person In-Charge:
                                        </h5>
                                        <p className={styles.item}>
                                            {selectedDefective.person_incharge}
                                        </p>
                                    </div>
                                    <div
                                        className={
                                            styles["modal-item-container"]
                                        }
                                    >
                                        <h5 className={styles["item-label"]}>
                                            Status:
                                        </h5>
                                        <p className={styles.item}>
                                            {selectedDefective.status}
                                        </p>
                                    </div>
                                    <div
                                        className={
                                            styles["modal-item-container"]
                                        }
                                    >
                                        <h5 className={styles["item-label"]}>
                                            Note:
                                        </h5>
                                        <p className={styles.item}>
                                            {selectedDefective.note}
                                        </p>
                                    </div>
                                    <div
                                        className={
                                            styles["modal-item-container"]
                                        }
                                    >
                                        <h5 className={styles["item-label"]}>
                                            Date:
                                        </h5>
                                        <p className={styles.item}>
                                            {new Date(
                                                selectedDefective.date
                                            ).toLocaleDateString("eng-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    )}
                    {isEditModalOpen && selectedDefective && (
                        <Modal
                            isOpen={isEditModalOpen}
                            onClose={() => setEditModalOpen(false)}
                            reset={reset}
                            setErrors={setErrors}
                        >
                            <div
                                className={`${styles["modal-container"]} ${styles["add-modal-container"]}`}
                            >
                                <div className={styles["modal-header"]}>
                                    <div
                                        className={
                                            styles["modal-title-container"]
                                        }
                                    >
                                        <h2 className={styles["modal-title"]}>
                                            Edit Defective
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
                                            Equipment
                                        </p>
                                        <select
                                            className={`${styles.input} ${
                                                errors.item_id
                                                    ? styles.error
                                                    : ""
                                            }`}
                                            value={editFormData.item_id}
                                            onChange={(e) =>
                                                setEditFormData({
                                                    ...editFormData,
                                                    item_id: e.target.value,
                                                })
                                            }
                                        >
                                            <option
                                                value="Select an Option"
                                                disabled
                                            >
                                                Select an Option
                                            </option>
                                            <option
                                                value={editFormData.item_id}
                                            >
                                                {defectives.data.find(
                                                    (defective) =>
                                                        defective.stock_id ===
                                                        editFormData.item_id
                                                )
                                                    ? `${
                                                          defectives.data.find(
                                                              (defective) =>
                                                                  defective.stock_id ===
                                                                  editFormData.item_id
                                                          ).equipment_name
                                                      } (SN: ${
                                                          defectives.data.find(
                                                              (defective) =>
                                                                  defective.stock_id ===
                                                                  editFormData.item_id
                                                          ).serial_number
                                                      })`
                                                    : "Select an Option"}
                                            </option>
                                            {stocks.map((stock) => (
                                                <option
                                                    key={stock.serial_number}
                                                    value={stock.id}
                                                >
                                                    {stock.equipment_name} (SN:{" "}
                                                    {stock.serial_number})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div
                                        className={
                                            styles["modal-input-container"]
                                        }
                                    >
                                        <p className={styles.label}>
                                            Manager's Name
                                        </p>
                                        <input
                                            className={`${styles.input} ${
                                                errors.managers_name
                                                    ? styles.error
                                                    : ""
                                            }`}
                                            value={editFormData.managers_name}
                                            type="text"
                                            onChange={(e) =>
                                                setEditFormData({
                                                    ...editFormData,
                                                    managers_name:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div
                                        className={
                                            styles["modal-input-container"]
                                        }
                                    >
                                        <p className={styles.label}>Cluster</p>
                                        <input
                                            className={`${styles.input} ${
                                                errors.cluster
                                                    ? styles.error
                                                    : ""
                                            }`}
                                            value={editFormData.cluster}
                                            type="text"
                                            onChange={(e) =>
                                                setEditFormData({
                                                    ...editFormData,
                                                    cluster: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div
                                        className={
                                            styles["modal-input-container"]
                                        }
                                    >
                                        <p className={styles.label}>Floor</p>
                                        <select
                                            className={`${styles.input} ${
                                                errors.floor ? styles.error : ""
                                            }`}
                                            value={editFormData.floor}
                                            onChange={(e) =>
                                                setEditFormData({
                                                    ...editFormData,
                                                    floor: e.target.value,
                                                })
                                            }
                                        >
                                            <option
                                                value="Select an Option"
                                                disabled
                                            >
                                                Select an Option
                                            </option>
                                            <option value="3rd Floor">
                                                3rd Floor
                                            </option>
                                            <option value="4th Floor">
                                                4th Floor
                                            </option>
                                            <option value="5th Floor">
                                                5th Floor
                                            </option>
                                            <option value="6th Floor">
                                                6th Floor
                                            </option>
                                            <option value="7th Floor">
                                                7th Floor
                                            </option>
                                        </select>
                                    </div>
                                    <div
                                        className={
                                            styles["modal-input-container"]
                                        }
                                    >
                                        <p className={styles.label}>Area</p>
                                        <select
                                            className={`${styles.input} ${
                                                errors.area ? styles.error : ""
                                            }`}
                                            value={editFormData.area}
                                            onChange={(e) =>
                                                setEditFormData({
                                                    ...editFormData,
                                                    area: e.target.value,
                                                })
                                            }
                                        >
                                            <option
                                                value="Select an Option"
                                                disabled
                                            >
                                                Select an Option
                                            </option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="5th Floor">
                                                5th Floor
                                            </option>
                                            <option value="HR Office">
                                                HR Office
                                            </option>
                                            <option value="IT Office">
                                                IT Office
                                            </option>
                                            <option value="Finance Office">
                                                Finance Office
                                            </option>
                                            <option value="Recruitment Office">
                                                Recruitment Office
                                            </option>
                                            <option value="General Manager's Office">
                                                General Manager's Office
                                            </option>
                                            <option value="Data Office">
                                                Data Office
                                            </option>
                                            <option value="Training Room">
                                                Training Room
                                            </option>
                                            <option value="QGC">QGC</option>
                                        </select>
                                    </div>
                                    <div
                                        className={
                                            styles["modal-input-container"]
                                        }
                                    >
                                        <p className={styles.label}>
                                            Incident Details
                                        </p>
                                        <input
                                            className={`${styles.input} ${
                                                errors.incident_details
                                                    ? styles.error
                                                    : ""
                                            }`}
                                            value={
                                                editFormData.incident_details
                                            }
                                            type="text"
                                            onChange={(e) =>
                                                setEditFormData({
                                                    ...editFormData,
                                                    incident_details:
                                                        e.target.value,
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
                                            Person In-Charge
                                        </p>
                                        <select
                                            className={`${styles.input} ${
                                                errors.person_incharge
                                                    ? styles.error
                                                    : ""
                                            }`}
                                            value={editFormData.person_incharge}
                                            onChange={(e) =>
                                                setEditFormData({
                                                    ...editFormData,
                                                    person_incharge:
                                                        e.target.value,
                                                })
                                            }
                                        >
                                            <option
                                                value="Select an Option"
                                                disabled
                                            >
                                                Select an Option
                                            </option>
                                            {moderators.data.map(
                                                (moderator) => (
                                                    <option
                                                        key={moderator.id}
                                                        value={`${moderator.first_name} ${moderator.last_name}`}
                                                    >
                                                        {moderator.first_name}{" "}
                                                        {moderator.last_name}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                    <div
                                        className={
                                            styles["modal-input-container"]
                                        }
                                    >
                                        <p className={styles.label}>Status</p>
                                        <select
                                            className={`${styles.input} ${
                                                errors.status
                                                    ? styles.error
                                                    : ""
                                            }`}
                                            value={editFormData.status}
                                            onChange={(e) =>
                                                setEditFormData({
                                                    ...editFormData,
                                                    status: e.target.value,
                                                })
                                            }
                                        >
                                            <option
                                                value="Select an Option"
                                                disabled
                                            >
                                                Select an Option
                                            </option>
                                            <option value="Replaced">
                                                Replaced
                                            </option>
                                            <option value="Provided">
                                                Provided
                                            </option>
                                            <option value="Swapped">
                                                Swapped
                                            </option>
                                            <option value="Pull Out">
                                                Pull Out
                                            </option>
                                        </select>
                                    </div>
                                    <div
                                        className={
                                            styles["modal-input-container"]
                                        }
                                    >
                                        <p className={styles.label}>Note</p>
                                        <textarea
                                            className={`${styles.input} ${
                                                errors.model ? styles.error : ""
                                            }`}
                                            value={editFormData.note}
                                            rows="4"
                                            onChange={(e) =>
                                                setEditFormData({
                                                    ...editFormData,
                                                    note: e.target.value,
                                                })
                                            }
                                        ></textarea>
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
                                            Are you sure to delete this
                                            defective data?
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

export default Defective;
