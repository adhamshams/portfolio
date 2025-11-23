"use client";
import styles from "./task-bar.module.css";
import Image from "next/image";
import { useState } from "react";

export default function TaskBar() {
  const [showStartMenu, setShowStartMenu] = useState(false);

  return (
    <div className={styles.container}>
        <div 
          className={styles.startContainer}
          onMouseEnter={() => setShowStartMenu(true)}
          onMouseLeave={() => setShowStartMenu(false)}
        >
          <Image src={"/sun.webp"} alt="sun" width={25} height={25} />
          <h2>Start</h2>
          
          {showStartMenu && (
            <div className={styles.startMenu}>
              <div className={styles.startMenuHeader}>
                  <Image src={"/user.jpg"} alt="Profile" width={60} height={60} className={styles.profileImage} />
                  <div className={styles.userInfo}>
                    <h2>Adham Shams</h2>
                    <p>CSE Graduate</p>
                  </div>
              </div>
              
              <div className={styles.startMenuContent}>
                <a href="mailto:hello@adhamshams.com" className={styles.menuItem}>
                  <Image src={"/mail.webp"} alt="Email" width={25} height={25} />
                  <span>hello@adhamshams.com</span>
                </a>

                <a href="https://www.linkedin.com/in/adhamshams" target="_blank" rel="noopener noreferrer" className={styles.menuItem}>
                  <Image src={"/internet.webp"} alt="LinkedIn" width={25} height={25} />
                  <span>LinkedIn Profile</span>
                </a>
                
                <div className={styles.menuSeparator}></div>
                
                <a href="/user" className={styles.menuItem}>
                  <Image src={"/switch.webp"} alt="About" width={25} height={25} />
                  <span>Switch User</span>
                </a>
              </div>
            </div>
          )}
        </div>
        <div className={styles.timeContainer}>
          <h2>
            13:01 PM
          </h2>
        </div>
      </div>
  );
}
