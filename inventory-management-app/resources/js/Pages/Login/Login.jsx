import React from "react";
import styles from "../../../css/Login.module.css";
import loginIcon from "../../../images/light-inventory-logo.svg";
import emailIcon from "../../../images/email-icon.svg";
import passwordIcon from "../../../images/password-icon.svg";
import { useForm } from "@inertiajs/react";

const Login = () => {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
    });

    const handleLogin = (e) => {
        e.preventDefault();
        post("/login");
    };
    return (
        <section className={styles["login-container"]}>
            <form className={styles["form-container"]} onSubmit={handleLogin}>
                <div className={styles["icon-container"]}>
                    <img className={styles.icon} src={loginIcon} alt="Login" />
                </div>
                <div className={styles["caption-container"]}>
                    <h1 className={styles.caption}>Welcome Back!</h1>
                </div>
                <div className={styles["input-label-container"]}>
                    <div
                        className={`${styles["input-container"]} ${styles["first-container"]}`}
                    >
                        <input
                            className={styles.input}
                            type="email"
                            required
                            placeholder="Email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                        />
                        <div className={styles["label-container"]}>
                            <img
                                className={styles["label-icon"]}
                                src={emailIcon}
                                alt="Email"
                            />
                            <label className={styles.label}>Email</label>
                        </div>
                    </div>
                    <div
                        className={`${styles["input-container"]} ${styles["second-container"]}`}
                    >
                        <input
                            className={styles.input}
                            type="password"
                            required
                            placeholder="Password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />
                        <div className={styles["label-container"]}>
                            <img
                                className={styles["label-icon"]}
                                src={passwordIcon}
                                alt="Password"
                            />
                            <label className={styles.label}>Password</label>
                        </div>
                    </div>
                    {errors.password && (
                        <p className={styles.error}>{errors.password}</p>
                    )}
                </div>
                <div className={styles["button-container"]}>
                    <button className={styles.button} disabled={processing}>
                        {processing ? "Signing-in..." : "Sign-in"}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default Login;
