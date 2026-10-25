import Link from "next/link";
import styles from "./overlay.module.css";

/** Shown instead of the Windows XP pages on phones and tablets. */
export default function Intro() {
  return (
    <div className={styles.container}>
      <div className={styles.header} />
      <div className={styles.content}>
        <div className={styles.message}>
          <p className={styles.title}>This page only works on a computer</p>
          <p>
            My 2025 portfolio is a Windows XP style desktop that needs a mouse and a large screen.
            Open this link on a laptop or desktop computer to try it.
          </p>
          <Link href="/" className={styles.link}>
            Back to the main site
          </Link>
        </div>
      </div>
      <div className={styles.footer} />
    </div>
  );
}
