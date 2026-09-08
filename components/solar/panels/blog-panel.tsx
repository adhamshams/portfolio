import { blogNote, blogTitle } from '@/data/blog';
import styles from './panels.module.css';

export default function BlogPanel() {
  return (
    <>
      <h1 className={styles.title}>
        <span className={styles.code}>BLG 056</span>
        {blogTitle}
      </h1>
      <div className={styles.box}>
        <p className={styles.paragraph}>{blogNote}</p>
      </div>
    </>
  );
}
