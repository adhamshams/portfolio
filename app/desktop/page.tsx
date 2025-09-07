import styles from "./page.module.css";
import Paint from "@/components/paint/paint";
import About from "@/components/about/about";
import BrewBuzz from "@/components/project-01/project";
import Minesweeper from "@/components/minesweeper/minesweeper";
import Note from "@/components/note/note";
import TaskBar from "@/components/task-bar/task-bar";

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
          loading="eager"
        />
        <Paint />
        <About />
        <BrewBuzz />
        <Minesweeper />
        <Note />
        <TaskBar />
      </div>
    </ZIndexProvider>
  );
}
