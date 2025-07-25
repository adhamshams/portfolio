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
                <div className={styles.userSection}>
                  <Image src={"/user.jpg"} alt="Profile" width={48} height={48} className={styles.profileImage} />
                  <div className={styles.userInfo}>
                    <h3>Adham Shams</h3>
                    <p>Full Stack Developer @ Botit</p>
                  </div>
                </div>
              </div>
              
              <div className={styles.startMenuContent}>
                <a href="mailto:hello@adhamshams.com" className={styles.menuItem}>
                  <Image src={"/mail.png"} alt="Email" width={16} height={16} />
                  <span>hello@adhamshams.com</span>
                </a>

                <a href="https://www.linkedin.com/in/adhamshams" className={styles.menuItem}>
                  <Image src={"/world.png"} alt="LinkedIn" width={16} height={16} />
                  <span>LinkedIn Profile</span>
                </a>
                
                <div className={styles.menuSeparator}></div>
                
                <a href="/" className={styles.menuItem}>
                  <Image src={"/logout.png"} alt="About" width={16} height={16} />
                  <span>Sign Out</span>
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
