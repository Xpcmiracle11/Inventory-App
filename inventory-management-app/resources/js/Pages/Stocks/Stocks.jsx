import React, { useState, useRef } from "react";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import styles from "../../../css/Stocks.module.css";
import { usePage, router, Link } from "@inertiajs/react";
const Stocks = () => {
    const {
        equipments,
        user,
        stocks,
        years,
        equipmentSort: initialEquipmentSort,
        sort: initialSort,
        search: initialSearch,
    } = usePage().props;
    const [search, setSearch] = useState(initialSearch || "");
    const [sort, setSort] = useState(initialSort || "Default");
    const [equipmentSort, setEquipmentSort] = useState(
        initialEquipmentSort || "All"
    );
    const searchInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const handleSortChange = (e) => {
        const value = e.target.value;
        setSort(value);
        router.get(
            "/stocks",
            { equipmentSort, search, sort: value },
            { preserveState: true, replace: true }
        );
    };
    const handleEquipmentSortChange = (e) => {
        const value = e.target.value;
        setEquipmentSort(value);
        router.get(
            "/stocks",
            { search, sort, equipmentSort: value },
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
                "/stocks",
                { search: value, sort, equipmentSort },
                { preserveState: true }
            );
        }, 400);
    };
    return (
        <BrowserRouter>
            <section className={styles.stocks}>
                <Sidebar />
                <div className={styles["stocks-container"]}>
                    <div className={styles["page-title"]}>
                        <h1 className={styles.title}>Stocks</h1>
                    </div>
                    <div className={styles["filter-container"]}>
                        <div className={styles["search-container"]}>
                            <input
                                className={styles.search}
                                type="text"
                                ref={searchInputRef}
                                value={search}
                                onChange={handleSearchChange}
                                placeholder="Search serial number here..."
                            />
                        </div>
                        <div className={styles["equipment-sort-container"]}>
                            <select
                                className={styles.sort}
                                value={equipmentSort}
                                onChange={handleEquipmentSortChange}
                            >
                                <option value="All">All</option>
                                {equipments?.map((equipment_name) => (
                                    <option
                                        key={equipment_name}
                                        value={equipment_name}
                                    >
                                        {equipment_name}
                                    </option>
                                ))}
                            </select>
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
                                    <th className={styles.th}>Equipment</th>
                                    <th className={styles.th}>Brand</th>
                                    <th className={styles.th}>Model</th>
                                    <th className={styles.th}>Serial Number</th>
                                    <th className={styles.th}>Supplier</th>
                                    <th className={styles.th}>Date </th>
                                </tr>
                            </thead>
                            <tbody className={styles.tbody}>
                                {stocks.data.map((stock, index) => (
                                    <tr className={styles.btr} key={stock.id}>
                                        <td
                                            className={styles.td}
                                            data-label="Equipment:"
                                        >
                                            {index + 1} {". "}
                                            {stock.equipment_name}
                                        </td>
                                        <td
                                            className={styles.td}
                                            data-label="Brand:"
                                        >
                                            {stock.brand}
                                        </td>
                                        <td
                                            className={styles.td}
                                            data-label="Model:"
                                        >
                                            {stock.model}
                                        </td>
                                        <td
                                            className={styles.td}
                                            data-label="Serial Number:"
                                        >
                                            {stock.serial_number}
                                        </td>
                                        <td
                                            className={styles.td}
                                            data-label="Supplier:"
                                        >
                                            {stock.supplier}
                                        </td>
                                        <td
                                            className={styles.td}
                                            data-label="Date:"
                                        >
                                            {new Date(
                                                stock.date
                                            ).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className={styles.pagination}>
                            <div className={styles["pagination-container"]}>
                                {stocks.links
                                    .filter((link, index) => {
                                        const currentPage = stocks.current_page;
                                        const totalPages =
                                            stocks.links.length - 2;
                                        if (
                                            index === 0 ||
                                            index === stocks.links.length - 1
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
                </div>
            </section>
        </BrowserRouter>
    );
};

export default Stocks;
