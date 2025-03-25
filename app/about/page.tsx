import Link from "next/link";
import styles from "./page.module.css";

export default function About() {
  return (
    <div className={styles.page}>
      <nav className={styles.header}>
        <Link href="/">HOME</Link>
        <Link href="/about" className={styles.active}>ABOUT</Link>
        <Link href="/projects">PROJECTS</Link>
      </nav>
      <div className={styles.content}>
        
      </div>
    </div>
  );
}
