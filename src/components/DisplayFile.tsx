import React, { useEffect } from "react";
import Line from "./Line";
import styles from "./DisplayFile.module.scss";
import { useAppSelector } from "../app/hooks";


const DisplayFile: React.FC = () => {
  const linesObject: LinesObject[] = useAppSelector(
    (state) => state.linesObject.value
  );
    useEffect(() => console.log(linesObject))
  return (
    <ul className={styles["item-list"]}>
      {linesObject.map((lineObject: LinesObject) => (
        <Line
          line={lineObject.line}
          tags={lineObject.tags}
          index={lineObject.index}
          key={lineObject.index + lineObject.line}
        />
      ))}
    </ul>
  );
};

export default DisplayFile;
