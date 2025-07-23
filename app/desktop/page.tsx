import styles from "./page.module.css";
import Paint from "@/components/paint";
import About from "@/components/about";
import Projects from "@/components/projects";
import Minesweeper from "@/components/minesweeper";
import Note from "@/components/note";
import TaskBar from "@/components/task-bar";

import Image from "next/image";
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
        <Projects />
        <Minesweeper />
        <Note />
        <TaskBar />
      </div>
    </ZIndexProvider>
  );
}
