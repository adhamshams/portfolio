import { projects } from '@/data/projects';
import styles from './panels.module.css';

export default function ProjectsPanel() {
  return (
    <>
      <h1 className={styles.title}>
        <span className={styles.code}>PRJ 038</span>
        Projects
      </h1>
      {projects.map((project, index) => (
        <article key={project.id} className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.code}>{`PRJ ${String(index + 1).padStart(3, '0')}`}</span>
            <h2 className={styles.cardTitle}>{project.title}</h2>
          </div>
          <div className={styles.cardBody}>
            <p className={styles.role}>{project.role}</p>
            <p className={styles.paragraph}>{project.summary}</p>
            <div className={styles.chips}>
              {project.stack.map((item) => (
                <span key={item} className={styles.chip}>
                  {item}
                </span>
              ))}
            </div>
            <div className={styles.links}>
              {project.links.map((link) => (
                <a key={link.href} className={styles.link} href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </article>
      ))}
    </>
  );
}
