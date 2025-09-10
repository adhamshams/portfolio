import styles from "./page.module.css";
import Image from "next/image";

export default function BrewBuzz() {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <a href="/desktop">
                    <Image
                        src="/back.webp"
                        alt="Back Button"
                        width={40}
                        height={40}
                    />
                </a>
                <h2>Back</h2>
            </div>
            <div className={styles.hero}>
                
            </div>
        </div>
    );
}
