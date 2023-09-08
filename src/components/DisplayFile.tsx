import React from "react";
import Line from "./Line";
import styles from "./DisplayFile.module.scss";
import { useAppSelector } from "../app/hooks";

interface DisplayFileProps {
  saveJSON: Function;
}

const DisplayFile: React.FC<DisplayFileProps> = ({ saveJSON }) => {
  const linesObject: LinesObject[] = useAppSelector((state) => state.linesObject.value);

  return (
    <div className={styles["item-list"]}>
      {linesObject.map((lineObject: LinesObject) => (
        <Line
          line={lineObject.line}
          tags={lineObject.tags}
          index={lineObject.index}
          saveJSON={saveJSON}
        />
      ))}
    </div>
  );
};

export default DisplayFile;
