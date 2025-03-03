import React, { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import styles from "../../css/Sidebar.module.css";
import logo from "../../images/light-inventory-logo.svg";
import links from "../Components/nav.json";
import { useLocation } from "react-router-dom";
import Modal from "../Components/Modal";
import dashboardIcon from "../../images/dashboard-icon.svg";
import stocksIcon from "../../images/stocks-icon.svg";
import plottingIcon from "../../images/plotting-icon.svg";
import defectiveIcon from "../../images/defective-icon.svg";
import settingsIcon from "../../images/settings-icon.svg";
import logoutIcon from "../../images/logout-icon.svg";
import userIcon from "../../images/user-icon.svg";
import categoryIcon from "../../images/category-icon.svg";
import supplierIcon from "../../images/supplier-icon.svg";

const icons = {
    dashboard: dashboardIcon,
    supplier: supplierIcon,
    category: categoryIcon,
    stocks: stocksIcon,
    defective: defectiveIcon,
    plotting: plottingIcon,
    users: userIcon,
    settings: settingsIcon,
    logout: logoutIcon,
};

const Sidebar = () => {
    const { user } = usePage().props;
    const isAdmin = user?.role === "Admin";

    const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(
        () => JSON.parse(localStorage.getItem("sidebarCollapsed")) || false
    );
    useEffect(() => {
        localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
    }, [isCollapsed]);
    const toggleLogoutModal = () => setLogoutModalOpen(!isLogoutModalOpen);
    const closeLogoutModal = () => setLogoutModalOpen(false);
    const handleLogout = () => router.post("/logout");
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);
    const location = useLocation();
    const filteredLinks = links.filter(
        (link) => link.name !== "Users" || isAdmin
    );
    return (
        <aside
            className={`${styles.sidebar} ${
                isCollapsed ? styles.collapsed : ""
            }`}
        >
            <div className={styles["sidebar-header"]}>
                <div className={styles["logo-container"]}>
                    <img className={styles.logo} src={logo} alt="Logo" />
                </div>
                <div className={styles["title-container"]}>
                    {!isCollapsed && <h1 className={styles.title}>InTrack</h1>}
                </div>
            </div>
            <div className={styles["sidebar-navigation"]}>
                <nav className={styles["links-container"]}>
                    {filteredLinks.map((link) => (
                        <ul
                            className={`${styles.links} ${
                                location.pathname === link.path
                                    ? styles["active-link"]
                                    : ""
                            }`}
                            key={link.name}
                        >
                            <li className={styles["list-container"]}>
                                <a
                                    className={styles.list}
                                    href={!link.children ? link.path : "#"}
                                >
                                    <img
                                        className={styles.icon}
                                        src={icons[link.icon] || ""}
                                        alt={link.name}
                                    />
                                    {!isCollapsed && (
                                        <p className={styles["list-name"]}>
                                            {link.name}
                                        </p>
                                    )}
                                </a>
                            </li>
                        </ul>
                    ))}
                    <ul className={styles.links}>
                        <li className={styles["list-container"]}>
                            <a
                                className={styles.list}
                                onClick={toggleLogoutModal}
                            >
                                <img
                                    className={styles.icon}
                                    src={logoutIcon}
                                    alt="Log-out"
                                />
                                {!isCollapsed && (
                                    <p className={styles["list-name"]}>
                                        Log-out
                                    </p>
                                )}
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className={styles["collapse-button-container"]}>
                <button
                    className={styles["collapse-button"]}
                    onClick={toggleCollapse}
                >
                    {isCollapsed ? ">" : "<"}
                </button>
            </div>
            {isLogoutModalOpen && (
                <Modal
                    isOpen={isLogoutModalOpen}
                    onClose={() => setLogoutModalOpen(false)}
                >
                    <div className={styles["modal-container"]}>
                        <div className={styles["modal-header"]}>
                            <div
                                className={`${styles["modal-title-container"]} ${styles["modal-logout-title-container"]}`}
                            >
                                <h2
                                    className={`${styles["modal-title"]} ${styles["modal-logout-title"]}`}
                                >
                                    Are you sure you want to log-out?
                                </h2>
                            </div>
                        </div>
                        <div
                            className={styles["logout-confirmation-container"]}
                        >
                            <button
                                className={styles["logout-confirmation"]}
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                            <button
                                className={styles["cancel-confirmation"]}
                                onClick={closeLogoutModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </aside>
    );
};
export default Sidebar;
