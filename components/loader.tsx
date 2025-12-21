import { useState, useEffect } from "react";
import styles from "./loader.module.css";

export default function Loader() {

    return (
        <div className={styles.container}>
            <h5>ADHAMOS v5.0.3</h5>
            <p>ASBIOS (C) 2001 Adham Shams Inc.</p>
            <p className={styles.top}>Checking RAM: 16384K Detected</p>
            <p>Loading Kernel: shams_core.sys</p>
            <h5 className={styles.top}>[Boot sequence initiated]</h5>
            <div className={styles.hardwareInfo}>
                <p className={styles.settingHeader}>STARTING SERVICES (0/3)...</p>
                <div className={styles.settingRow}>
                    <p>- service 0183</p>
                    <p className={styles.running}>... initializing</p>
                </div>
                <div className={styles.settingRow}>
                    <p>- the sun 23021</p>
                    <p className={styles.running}>... initializing</p>
                </div>
                <div className={styles.settingRow}>
                    <p>- computer 203021</p>
                    <p className={styles.running}>... initializing</p>
                </div>
            </div>
            <p className={styles.timestamp}>{new Date().toDateString()}</p>
        </div>
    );
}
