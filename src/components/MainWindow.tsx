import React, { useEffect } from "react";
import { useState } from "react";
import {
  BaseDirectory,
  createDir,
  readTextFile,
  writeFile,
} from "@tauri-apps/api/fs";
import TagInfo from "./TagInfo";
import styles from "./MainWindow.module.scss";
import Menu from "./Menu";
import TabMenu from "./TabMenu";
import { useAppSelector } from "../app/hooks";
import FileManagement from "./FileManagement";
import FilterWindow from "./FilterWindow";
import ExportWindow from "./ExportWindow";

const MainWindow = () => {
  const [pageIndex, setPageIndex] = useState<number>(0);

  const linesObject: LinesObject[] = useAppSelector(
    (state) => state.linesObject.value
  );
  const fileName: string = useAppSelector((state) => state.fileNames.fileName);

  useEffect(() => {
    // Whenever the linesObject state changes, save it to JSON
    saveJSON();
  }, [linesObject]);

  const readFile = async (path: string | null) => {
    if (path !== null) {
      await readTextFile(path!);
    }
  };

  const updateJSONFile = async (lineObject: LinesObject[]) => {
    try {
      writeJSONFile(lineObject);
    } catch (err) {
      console.log(err);
    }
  };

  const writeJSONFile = async (lineObject: LinesObject[]) => {
    //const dir = await dirname(filepath!);
    try {
      const filePath = `TaggerAppData/data/${fileName}.tdf`;
      await writeFile(
        {
          path: filePath,
          // path: `${dir}/${fileName}.json`,
          contents: `${JSON.stringify(lineObject, null, 2)}`,
        },
        { dir: BaseDirectory.Document }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const saveJSON = () => {
    updateJSONFile(linesObject);
  };

  const switchTabs = (index: number) => {
    switch (index) {
      case 0:
        return <FileManagement saveJSON={saveJSON} />;
      case 1:
        return <TagInfo />;
      case 2:
        return <FilterWindow />;
      case 3:
        return <ExportWindow />;
    }
  };
  return (
    <div className={styles["app-wrapper"]}>
      <Menu projectName={fileName!} />
      <div className={styles["container-wrapper"]}>
        <div className={styles.container}>
          <TabMenu setPageIndex={setPageIndex} />
          {switchTabs(pageIndex)}
        </div>
      </div>
    </div>
  );
};

export default MainWindow;
