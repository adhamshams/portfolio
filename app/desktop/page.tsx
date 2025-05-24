import TaskBar from "@/components/task-bar";
import styles from "./page.module.css";
import Paint from "@/components/paint";

export default function Desktop() {
  return (
    <div className={styles.page}>
      <Paint />
      <TaskBar />
    </div>
  );
}
