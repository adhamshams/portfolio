import TaskBar from "@/components/task-bar";
import styles from "./page.module.css";
import Paint from "@/components/paint";
import About from "@/components/about";
import Note from "@/components/note";
import Image from "next/image";
import Minesweeper from "@/components/minesweeper";
import { ZIndexProvider } from "@/contexts/ZIndexContext";

export default function Desktop() {
  return (
    <ZIndexProvider>
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
        <Minesweeper />
        <Note />
        <TaskBar />
      </div>
    </ZIndexProvider>
  );
}
