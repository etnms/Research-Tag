import React from "react";
import Line from "./Line";
import styles from "./DisplayFile.module.scss";
import { useAppSelector } from "../app/hooks";


const DisplayFile: React.FC = () => {
  const linesObject: LinesObject[] = useAppSelector(
    (state) => state.linesObject.value
  );

  return (
    <ul className={styles["item-list"]}>
      {linesObject.map((lineObject: LinesObject) => (
        <Line
          line={lineObject.line}
          tags={lineObject.tags}
          index={lineObject.index}
        />
      ))}
    </ul>
  );
};

export default DisplayFile;
