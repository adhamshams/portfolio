import styles from "./page.module.css";
import Paint from "@/components/paint/paint";
import Gallery from "@/components/gallery/gallery";
import BrewBuzz from "@/components/project-01/folder";
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
        <Gallery />
        <BrewBuzz />
        <Minesweeper />
        <Note />
        <TaskBar />
      </div>
    </ZIndexProvider>
  );
}
