import TaskBar from "@/components/task-bar";
import styles from "./page.module.css";
import Paint from "@/components/paint";
// import About from "@/components/about";

export default function Desktop() {
  return (
    <div className={styles.page}>
      <Paint />
      <TaskBar />
      {/* <About /> */}
    </div>
  );
}
