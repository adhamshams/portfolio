import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <video src="me.mp4" width="854" height="480" autoPlay loop muted playsInline preload="none" />
      <h1>coming soon</h1>
    </div>
  );
}
