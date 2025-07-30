import styles from "./overlay.module.css";

export default function Intro() {
  return (
    <div className={styles.container}>
      <div className={styles.header} />
      <div className={styles.content}>
        <p>pls use a desktop device to access my portfolio<br/>sorry :<span>&#40;</span></p>
      </div>
      <div className={styles.footer} />
    </div>
  );
}
