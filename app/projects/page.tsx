import Link from "next/link";
import styles from "./page.module.css";

export default function About() {
  return (
    <div className={styles.page}>
      <nav className={styles.header}>
        <Link href="/">HOME</Link>
        <Link href="/about">ABOUT</Link>
        <Link href="/projects" className={styles.active}>PROJECTS</Link>
      </nav>
      <div className={styles.content}>
        
      </div>
    </div>
  );
}
