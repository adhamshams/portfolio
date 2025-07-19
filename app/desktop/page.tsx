import TaskBar from "@/components/task-bar";
import styles from "./page.module.css";
import Paint from "@/components/paint";
import About from "@/components/about";
import Note from "@/components/note";

export default function Desktop() {
  return (
    <div className={styles.page}>
      <Paint />
      <About />
      <Note />
      <TaskBar />
    </div>
  );
}
