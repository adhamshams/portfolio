'use client';

import { FiFileText, FiLinkedin, FiMail } from 'react-icons/fi';
import { aboutParagraphs, contact } from '@/data/about';
import { sunTexts } from '@/data/intro';
import PanelText from './panel-text';
import styles from './panels.module.css';

/** The star carries the introduction, the about copy and the ways to reach me. */
export default function SunIntro() {
  const lines = [
    ...sunTexts,
    ...aboutParagraphs.map((content) => ({ type: 'paragraph' as const, content })),
  ];

  return (
    <>
      <PanelText lines={lines} code="SOL 001" />
      <div className={styles.links}>
        <a className={styles.link} href={`mailto:${contact.email}`}>
          <FiMail className={styles.linkIcon} aria-hidden="true" />
          {contact.email}
        </a>
        <a className={styles.link} href={contact.linkedin} target="_blank" rel="noopener noreferrer">
          <FiLinkedin className={styles.linkIcon} aria-hidden="true" />
          LinkedIn
        </a>
        <a className={styles.link} href={contact.resume} target="_blank" rel="noopener noreferrer">
          <FiFileText className={styles.linkIcon} aria-hidden="true" />
          Resume (PDF)
        </a>
      </div>
    </>
  );
}
