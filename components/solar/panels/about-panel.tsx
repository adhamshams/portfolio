import { aboutParagraphs, aboutTitle, contact } from '@/data/about';
import styles from './panels.module.css';

export default function AboutPanel() {
  return (
    <>
      <h1 className={styles.title}>
        <span className={styles.code}>ABT 056</span>
        {aboutTitle}
      </h1>
      <div className={styles.box}>
        {aboutParagraphs.map((paragraph, index) => (
          <p key={index} className={styles.paragraph}>
            {paragraph.startsWith('TODO') && <span className={styles.todo}>[todo]</span>}
            {paragraph}
          </p>
        ))}
      </div>
      <div className={styles.links}>
        <a className={styles.link} href={`mailto:${contact.email}`}>
          {contact.email}
        </a>
        <a className={styles.link} href={contact.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a className={styles.link} href={contact.resume} target="_blank" rel="noopener noreferrer">
          Resume (PDF)
        </a>
      </div>
    </>
  );
}
