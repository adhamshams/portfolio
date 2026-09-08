import { work } from '@/data/work';
import styles from './panels.module.css';

export default function WorkPanel() {
  return (
    <>
      <h1 className={styles.title}>
        <span className={styles.code}>EXP 076</span>
        Professional Experience
      </h1>
      <ol className={styles.timeline}>
        {work.map((entry) => (
          <li key={entry.id} className={`${styles.entry} ${entry.todo ? styles.entryTodo : ''}`}>
            <p className={styles.period}>{entry.period}</p>
            <h2 className={styles.entryHeader}>
              {entry.todo && <span className={styles.todo}>[todo]</span>}
              {entry.role} · {entry.company}
            </h2>
            <p className={styles.paragraph}>{entry.summary}</p>
            {entry.bullets && (
              <ul className={styles.bullets}>
                {entry.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </>
  );
}
