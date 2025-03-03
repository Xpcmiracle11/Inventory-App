import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import { BrowserRouter } from "react-router-dom";
import styles from "../../../css/Dashboard.module.css";
import stocksIcon from "../../../images/inventory-icon.svg";
import defectiveIcon from "../../../images/shredder-icon.svg";
import { usePage, router } from "@inertiajs/react";
import Chart from "react-apexcharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Modal from "../../Components/Modal";

const Dashboard = () => {
    const {
        stocks,
        defectives,
        years,
        months,
        weeks,
        user,
        defectiveCount,
        stockCount,
        defectiveData,
        floorAreaDefectiveData,
        floorDefectiveData,
        equipmentFloorAreaDefectiveData,
        yearSort: initialYearSort,
        monthSort: initialMonthSort,
        weekSort: initialWeekSort,
    } = usePage().props;
    const [yearSort, setYearSort] = useState(initialYearSort || "Default");
    const [monthSort, setMonthSort] = useState(initialMonthSort || "Default");
    const [weekSort, setWeekSort] = useState(initialMonthSort || "Default");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isViewStocksModalOpen, setViewStockModalOpen] = useState(false);
    const [isViewDefectivesModalOpen, setViewDefectivesModalOpen] =
        useState(false);
    const [defectiveBarChartConfig, setDefectiveBarChartConfig] = useState({
        options: {},
        series: [],
    });
    const [defectivePieChartConfig, setDefectivePieChartConfig] = useState({
        options: {},
        series: [],
    });
    const [defectiveTreemapChartConfig, setDefectiveTreemapChartConfig] =
        useState({
            options: {},
            series: [],
        });
    const [defectiveHeatmapConfig, setDefectiveHeatmapConfig] = useState({
        options: {},
        series: [],
    });
    const handleYearSortChange = (e) => {
        const value = e.target.value;
        setYearSort(value);
        if (value === "Default") {
            setMonthSort("Default");
        }
        router.get(
            "/dashboard",
            { yearSort: value, monthSort },
            { preserveState: true, replace: true }
        );
    };
    const handleMonthSortChange = (e) => {
        const value = e.target.value;
        setMonthSort(value);
        router.get(
            "/dashboard",
            { yearSort, monthSort: value },
            { preserveState: true, replace: true }
        );
    };
    const handleWeekSortChange = (e) => {
        const value = e.target.value;
        setWeekSort(value);
        router.get(
            "/dashboard",
            { yearSort, monthSort, weekSort: value },
            { preserveState: true, replace: true }
        );
    };
    useEffect(() => {
        if (defectiveData && defectiveData.length > 0) {
            const allPeriods = defectiveData.map((item) => Number(item.period));
            const minPeriod = Math.min(...allPeriods);
            const maxPeriod = Math.max(...allPeriods);

            if (isNaN(minPeriod) || isNaN(maxPeriod)) return;

            const formattedData = {
                categories: Array.from(
                    { length: maxPeriod - minPeriod + 1 },
                    (_, i) => minPeriod + i
                ),
                quantities: Array.from(
                    { length: maxPeriod - minPeriod + 1 },
                    (_, i) => {
                        const period = minPeriod + i;
                        const existing = defectiveData.find(
                            (item) => Number(item.period) === period
                        );
                        return existing ? Number(existing.total_quantity) : 0;
                    }
                ),
            };

            setDefectiveBarChartConfig(defectiveBarChart(formattedData));
        } else {
            setDefectiveBarChartConfig(
                defectiveBarChart({ categories: [], quantities: [] })
            );
        }
    }, [defectiveData]);
    const defectiveBarChart = (data) => {
        return {
            options: {
                chart: {
                    type: "bar",
                    height: 350,
                    toolbar: { show: false },
                },
                xaxis: { categories: data.categories },
                tooltip: { enabled: false },
                plotOptions: {
                    bar: {
                        colors: {
                            ranges: [{ from: 0, to: 1000, color: "#36454f" }],
                        },
                    },
                },
                colors: ["#36454f"],
            },
            series: [
                {
                    name: "Defective Quantity",
                    data: data.quantities,
                },
            ],
        };
    };
    useEffect(() => {
        if (floorAreaDefectiveData) {
            const allLabels = floorAreaDefectiveData.map(
                (item) => `${item.floor} - ${item.area}`
            );
            const formattedData = {
                labels: allLabels,
                values: allLabels.map((label) => {
                    const existing = floorAreaDefectiveData.find(
                        (item) => `${item.floor} - ${item.area}` === label
                    );
                    return existing ? Number(existing.total_quantity) : 0;
                }),
            };
            setDefectivePieChartConfig(defectivePieChart(formattedData));
        }
    }, [floorAreaDefectiveData]);
    const defectivePieChart = (data) => {
        return {
            options: {
                chart: {
                    type: "donut",
                    height: 300,
                },
                labels: data.labels,
                colors: [
                    "#B2BEB5",
                    "#7393B3",
                    "#36454F",
                    "#A9A9A9",
                    "#6082B6",
                    "#808080",
                    "#818589",
                    "#D3D3D3",
                    "#899499",
                    "#E5E4E2",
                    "#8A9A5B",
                    "#C0C0C0",
                    "#708090",
                    "#848884",
                    "#71797E",
                    "#3F3944",
                ],
                legend: {
                    position: "bottom",
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val, { seriesIndex, w }) {
                        return w.config.series[seriesIndex];
                    },
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return val + " pcs";
                        },
                    },
                },
                responsive: [
                    {
                        breakpoint: 1199,
                        options: {
                            chart: {
                                height: 250,
                            },
                            legend: {
                                position: "bottom",
                            },
                        },
                    },
                    {
                        breakpoint: 991,
                        options: {
                            chart: {
                                height: 300,
                            },
                            legend: {
                                position: "bottom",
                            },
                        },
                    },
                    {
                        breakpoint: 767,
                        options: {
                            chart: {
                                height: 250,
                            },
                            legend: {
                                position: "bottom",
                            },
                        },
                    },
                    {
                        breakpoint: 575,
                        options: {
                            chart: {
                                height: 250,
                            },
                            legend: {
                                position: "bottom",
                            },
                        },
                    },
                ],
            },
            series: data.values,
        };
    };
    useEffect(() => {
        if (floorDefectiveData) {
            const allFloors = floorDefectiveData.map((item) => `${item.floor}`);
            const formattedData = allFloors.map((floor) => {
                const existing = floorDefectiveData.find(
                    (item) => `${item.floor}` === floor
                );
                return {
                    x: floor,
                    y: existing ? Number(existing.total_quantity) : 0,
                };
            });

            setDefectiveTreemapChartConfig(
                defectiveTreemapChart(formattedData)
            );
        }
    }, [floorDefectiveData]);
    const defectiveTreemapChart = (data) => {
        return {
            options: {
                chart: {
                    type: "treemap",
                    height: 400,
                    toolbar: { show: false },
                },
                dataLabels: {
                    enabled: true,
                    formatter: (val, opt) => {
                        return `${
                            opt.w.config.series[0].data[opt.dataPointIndex].x
                        }\n : ${
                            opt.w.config.series[0].data[opt.dataPointIndex].y
                        }`;
                    },
                    style: {
                        fontSize: "14px",
                        fontWeight: "400",
                        colors: ["#ffffff"],
                        fontFamily: "Mukta Vaani, serif",
                    },
                },
                colors: ["#36454F", "#808080", "#B2BEB5", "#708090", "#3F3944"],
                legend: { show: false },
                tooltip: {
                    enabled: true,
                    y: {
                        formatter: (val) => `${val}`,
                    },
                },
            },
            series: [
                {
                    name: "Defective Items",
                    data: data,
                },
            ],
        };
    };
    useEffect(() => {
        if (equipmentFloorAreaDefectiveData) {
            const floorAreas = [
                ...new Set(
                    equipmentFloorAreaDefectiveData.map(
                        (item) => `${item.floor} - ${item.area}`
                    )
                ),
            ];
            const equipmentNames = [
                ...new Set(
                    equipmentFloorAreaDefectiveData.map(
                        (item) => item.equipment_name
                    )
                ),
            ];
            const groupedData = {};
            equipmentNames.forEach((equipment) => {
                groupedData[equipment] = floorAreas.map((floorArea) => ({
                    x: floorArea,
                    y: 0,
                }));
            });
            equipmentFloorAreaDefectiveData.forEach((item) => {
                const key = `${item.floor} - ${item.area}`;
                if (groupedData[item.equipment_name]) {
                    const index = floorAreas.indexOf(key);
                    if (index !== -1) {
                        groupedData[item.equipment_name][index].y = Number(
                            item.total_defectives
                        );
                    }
                }
            });
            const formattedData = Object.keys(groupedData).map((equipment) => ({
                name: equipment,
                data: groupedData[equipment],
            }));
            const maxDefectives = Math.max(
                ...equipmentFloorAreaDefectiveData.map(
                    (item) => item.total_defectives
                ),
                1
            );
            const colorRanges = [
                {
                    from: 0,
                    to: Math.floor(maxDefectives * 0.25),
                    color: "#808080",
                    name: "Low",
                },
                {
                    from: Math.floor(maxDefectives * 0.26),
                    to: Math.floor(maxDefectives * 0.5),
                    color: "#708090",
                    name: "Medium",
                },
                {
                    from: Math.floor(maxDefectives * 0.51),
                    to: Math.floor(maxDefectives * 0.75),
                    color: "#B2BEB5",
                    name: "High",
                },
                {
                    from: Math.floor(maxDefectives * 0.76),
                    to: maxDefectives,
                    color: "#36454F",
                    name: "Critical",
                },
            ];
            setDefectiveHeatmapConfig(
                defectiveHeatmapChart(formattedData, floorAreas, colorRanges)
            );
        }
    }, [equipmentFloorAreaDefectiveData]);
    const defectiveHeatmapChart = (data, floorAreas, colorRanges) => {
        return {
            options: {
                chart: {
                    type: "heatmap",
                    height: 400,
                    toolbar: { show: false },
                },
                plotOptions: {
                    heatmap: {
                        shadeIntensity: 0.5,
                        colorScale: {
                            ranges: colorRanges,
                        },
                    },
                },
                dataLabels: {
                    enabled: true,
                    style: {
                        fontSize: "12px",
                        fontWeight: "bold",
                        colors: ["#000"],
                    },
                },
                xaxis: {
                    type: "category",
                    categories: floorAreas,
                },
                legend: { show: false },
            },
            series: data,
        };
    };
    const handleDownloadAllGraphs = async () => {
        setIsProcessing(true);
        try {
            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.width;
            let yOffset = 10;
            const filterContainer = document.querySelector(
                `.${styles["filter-container"]}`
            );
            if (filterContainer) {
                const canvas = await html2canvas(filterContainer, {
                    scale: 2,
                    useCORS: true,
                });
                const imgData = canvas.toDataURL("image/png");
                const imgWidth = pageWidth - 20;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                pdf.addImage(imgData, "PNG", 10, yOffset, imgWidth, imgHeight);
                yOffset += imgHeight + 5;
            }
            const graphContainers = document.querySelectorAll(
                `.${styles["defective-stocks-card"]}, 
             .${styles["bar-chart-card"]}, 
             .${styles["pie-chart-card"]}, 
             .${styles["funnel-chart-card"]}, 
             .${styles["heatmap-chart-card"]}`
            );
            for (let i = 0; i < graphContainers.length; i++) {
                const graph = graphContainers[i];
                const canvas = await html2canvas(graph, {
                    scale: 2,
                    useCORS: true,
                });
                const imgData = canvas.toDataURL("image/png");
                const imgWidth = pageWidth - 20;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                if (yOffset + imgHeight > pdf.internal.pageSize.height - 10) {
                    pdf.addPage();
                    yOffset = 10;
                }

                pdf.addImage(imgData, "PNG", 10, yOffset, imgWidth, imgHeight);
                yOffset += imgHeight + 5;
            }
            pdf.save("dashboard-report.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert(
                "An error occurred while generating the PDF. Please try again."
            );
        } finally {
            setIsProcessing(false);
        }
    };
    const toggleViewStocksModal = () => {
        setViewStockModalOpen(!isViewStocksModalOpen);
    };
    const closeViewStocksModal = () => {
        setViewStockModalOpen(false);
    };
    const toggleViewDefectivesModal = () => {
        setViewDefectivesModalOpen(!isViewDefectivesModalOpen);
    };
    const closeViewDefectivesModal = () => {
        setViewDefectivesModalOpen(false);
    };
    return (
        <BrowserRouter>
            <div className={styles.dashboard}>
                <Sidebar />
                <div className={styles["dashboard-container"]}>
                    <div className={styles["page-title"]}>
                        <h1 className={styles.title}>Dashboard</h1>
                    </div>
                    <div className={styles["filter-container"]}>
                        <div className={styles["button-container"]}>
                            <button
                                className={styles["download-reports"]}
                                onClick={handleDownloadAllGraphs}
                                disabled={isProcessing}
                            >
                                <p>
                                    {isProcessing
                                        ? "Downloading Reports..."
                                        : "Download Reports"}
                                </p>
                            </button>
                        </div>
                        <div className={styles["sort-container"]}>
                            <select
                                className={styles.sort}
                                onChange={handleYearSortChange}
                                value={yearSort}
                            >
                                <option value="Default">Default Year</option>
                                {years?.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles["sort-container"]}>
                            <select
                                className={styles.sort}
                                onChange={handleMonthSortChange}
                                value={monthSort}
                                disabled={yearSort === "Default"}
                            >
                                <option value="Default">Default Month</option>
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
                        </div>
                        <div className={styles["sort-container"]}>
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
                    <div className={styles["charts-container"]}>
                        <div className={styles["first-chart-container"]}>
                            <div className={styles["defective-stocks-card"]}>
                                <div
                                    className={
                                        styles["defective-stocks-content"]
                                    }
                                >
                                    <p
                                        className={`${styles["content-label"]} ${styles["first-chart-content-label"]}`}
                                        onClick={toggleViewStocksModal}
                                    >
                                        Total Stocks
                                    </p>
                                    <h1 className={styles["content-text"]}>
                                        {stockCount}
                                    </h1>
                                </div>
                                <div
                                    className={styles["defective-stocks-icon"]}
                                >
                                    <img
                                        className={styles.icon}
                                        src={stocksIcon}
                                        alt="Stocks"
                                    />
                                </div>
                            </div>
                            <div className={styles["defective-stocks-card"]}>
                                <div
                                    className={
                                        styles["defective-stocks-content"]
                                    }
                                >
                                    <p
                                        className={`${styles["content-label"]} ${styles["first-chart-content-label"]}`}
                                        onClick={toggleViewDefectivesModal}
                                    >
                                        Total Defectives
                                    </p>
                                    <h1 className={styles["content-text"]}>
                                        {defectiveCount}
                                    </h1>
                                </div>
                                <div
                                    className={styles["defective-stocks-icon"]}
                                >
                                    <img
                                        className={styles.icon}
                                        src={defectiveIcon}
                                        alt="Stocks"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles["second-chart-container"]}>
                            <div className={styles["bar-chart-card"]}>
                                <p className={styles["content-label"]}>
                                    Defectives Trend Analysis
                                </p>
                                <Chart
                                    options={defectiveBarChartConfig.options}
                                    series={defectiveBarChartConfig.series}
                                    type="bar"
                                    height={350}
                                />
                            </div>
                            <div className={styles["pie-chart-card"]}>
                                <p className={styles["content-label"]}>
                                    Defectives by Floor & Area
                                </p>
                                <Chart
                                    options={defectivePieChartConfig.options}
                                    series={defectivePieChartConfig.series}
                                    type="donut"
                                    height={350}
                                />
                            </div>
                        </div>
                        <div className={styles["third-chart-container"]}>
                            <div className={styles["funnel-chart-card"]}>
                                <p className={styles["content-label"]}>
                                    Defectives by Floor Comparison
                                </p>
                                <Chart
                                    options={
                                        defectiveTreemapChartConfig.options
                                    }
                                    series={defectiveTreemapChartConfig.series}
                                    type="treemap"
                                    height={350}
                                />
                            </div>
                            <div className={styles["heatmap-chart-card"]}>
                                <p className={styles["content-label"]}>
                                    Defectives by Equipment in Floor & Area
                                </p>
                                <Chart
                                    options={defectiveHeatmapConfig.options}
                                    series={defectiveHeatmapConfig.series}
                                    type="heatmap"
                                    height={350}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={isViewStocksModalOpen}
                    onClose={() => setViewStockModalOpen(false)}
                >
                    <div className={styles["modal-container"]}>
                        <div className={styles["modal-header"]}>
                            <div className={styles["modal-title-container"]}>
                                <h2 className={styles["modal-title"]}>
                                    Stocks
                                </h2>
                            </div>
                            <div className={styles["modal-close-container"]}>
                                <button
                                    className={styles["modal-close"]}
                                    onClick={closeViewStocksModal}
                                >
                                    X
                                </button>
                            </div>
                        </div>
                        <div className={styles["modal-body"]}>
                            {stocks.map((stock, index) => (
                                <div
                                    key={stock.equipment_name}
                                    className={styles["modal-item-container"]}
                                >
                                    <p className={styles["modal-item"]}>
                                        {index + 1}.&nbsp;
                                        {stock.equipment_name} -{" "}
                                        <strong>
                                            {stock.total_count}{" "}
                                            {stock.total_count === 1
                                                ? "unit"
                                                : "units"}
                                        </strong>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Modal>
                <Modal
                    isOpen={isViewDefectivesModalOpen}
                    onClose={() => setViewDefectivesModalOpen(false)}
                >
                    <div className={styles["modal-container"]}>
                        <div className={styles["modal-header"]}>
                            <div className={styles["modal-title-container"]}>
                                <h2 className={styles["modal-title"]}>
                                    Defectives
                                </h2>
                            </div>
                            <div className={styles["modal-close-container"]}>
                                <button
                                    className={styles["modal-close"]}
                                    onClick={closeViewDefectivesModal}
                                >
                                    X
                                </button>
                            </div>
                        </div>
                        <div className={styles["modal-body"]}>
                            {defectives.map((defective, index) => (
                                <div
                                    key={defective.equipment_name}
                                    className={styles["modal-item-container"]}
                                >
                                    <p className={styles["modal-item"]}>
                                        {index + 1}.&nbsp;
                                        {defective.equipment_name} -{" "}
                                        <strong>
                                            {defective.total_count}{" "}
                                            {defective.total_count === 1
                                                ? "unit"
                                                : "units"}
                                        </strong>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Modal>
            </div>
        </BrowserRouter>
    );
};
export default Dashboard;
