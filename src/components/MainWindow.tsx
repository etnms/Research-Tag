import React, { useEffect } from "react";
import { useState } from "react";
import { BaseDirectory, writeFile } from "@tauri-apps/api/fs";
import TagInfo from "./TagInfo";
import styles from "./MainWindow.module.scss";
import Menu from "./Menu";
import TabMenu from "./TabMenu";
import { useAppSelector } from "../app/hooks";
import FileManagement from "./FileManagement";
import FilterWindow from "./Filter/FilterWindow";
import ExportWindow from "./ExportWindow";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { saveJSON } from "../utils/directoryFunctions";

const MainWindow: React.FC = () => {
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [isMenuSmall, setIsMenuSmall] = useState<boolean>(false);

  const linesObject: LinesObject[] = useAppSelector(
    (state) => state.linesObject.value
  );
  const fileName: string = useAppSelector((state) => state.fileNames.fileName);

  useEffect(() => {
    // Whenever the linesObject state changes, save it to JSON
    saveJSON(linesObject, fileName);
  }, [linesObject]);


  const toggleMenuSize = () => {
    setIsMenuSmall(!isMenuSmall);
  };

  const switchTabs = (index: number) => {
    switch (index) {
      case 0:
        return <FileManagement />;
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
      <Menu
        projectName={fileName!}
        isMenuSmall={isMenuSmall}
        toggleMenuSize={toggleMenuSize}
      />
      {isMenuSmall? <button onClick={() => toggleMenuSize()} className={styles["toggle-button"]}><MenuOpenIcon/></button> : null}
      <div className={`${styles["container-wrapper"]} ${isMenuSmall? styles["container-wrapper-full"] : ""}`}>
        <div className={styles.container}>
          <TabMenu setPageIndex={setPageIndex} />
          {switchTabs(pageIndex)}
        </div>
      </div>
    </div>
  );
};

export default MainWindow;
