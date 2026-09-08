import type { TextLine } from '@/data/intro';
import styles from './panels.module.css';

interface PanelTextProps {
  lines: TextLine[];
  /** Tiny code line printed above the title tile. */
  code?: string;
}

/** Panel copy: title lines as tiles, paragraphs inside one bordered box. */
export default function PanelText({ lines, code }: PanelTextProps) {
  const titles = lines.filter((line) => line.type === 'title');
  const paragraphs = lines.filter((line) => line.type === 'paragraph');

  return (
    <>
      {titles.map((line, index) => (
        <h1 key={index} className={styles.title}>
          {code && <span className={styles.code}>{code}</span>}
          {line.content}
        </h1>
      ))}
      {paragraphs.length > 0 && (
        <div className={styles.box}>
          {paragraphs.map((line, index) => (
            <p key={index} className={styles.paragraph}>
              {line.content}
            </p>
          ))}
        </div>
      )}
    </>
  );
}
