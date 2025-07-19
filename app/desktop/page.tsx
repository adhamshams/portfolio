import TaskBar from "@/components/task-bar";
import styles from "./page.module.css";
import Paint from "@/components/paint";
import About from "@/components/about";
import Note from "@/components/note";
import Image from "next/image";

export default function Desktop() {
  return (
    <div className={styles.page}>
      <Image
        src="/background.jpg"
        alt="Background"
        className={styles.backgroundImage}
        fill
        priority
      />
      <Paint />
      <About />
      <Note />
      <TaskBar />
    </div>
  );
}
