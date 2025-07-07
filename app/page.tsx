import Link from "next/link";
import styles from "./page.module.css";
import Image from "next/image";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.header} />
      <div className={styles.content}>
        <div className={styles.metaData}>
          <Image src="/sun.webp" alt="sun" width={65} height={65} />
          <h2>Portfolio 01&apos;</h2>
          <p>To begin, click your user name</p>
        </div>
        <div className={styles.seperator} />
        <Link href="/desktop" className={styles.usernameContainer}>
          <Image src="/user.jpg" alt="user" width={65} height={65} />
          <p>Adham Shams</p>
        </Link>
      </div>
      <div className={styles.footer}>
        <div className={styles.turnOffContainer}>
          <Link href="/off">
            <Image src="/off-icon.png" alt="turn-off" width={48} height={48} />
          </Link>
          <h2>Turn off portfolio</h2>
        </div>
        <p>
          After you log in, feel free to snoop through my work.
          <br />I won’t tell.
        </p>
      </div>
    </div>
  );
}
