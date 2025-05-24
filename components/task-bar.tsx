import styles from "./task-bar.module.css";
import Image from "next/image";

export default function TaskBar() {
  return (
    <div className={styles.container}>
        <div className={styles.startContainer}>
          <Image src={"/sun.webp"} alt="sun" width={25} height={25} />
          <h2>Start</h2>
        </div>
        <div className={styles.timeContainer}>
          <h2>
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </h2>
        </div>
      </div>
  );
}
