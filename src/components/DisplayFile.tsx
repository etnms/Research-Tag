import React from "react";
import Line from "./Line";
import styles from "./DisplayFile.module.scss";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updateLinesObject } from "../features/lineObjectSlice";

interface DisplayFileProps {
  saveJSON: Function;
}

const DisplayFile: React.FC<DisplayFileProps> = ({ saveJSON }) => {
  const linesObject: LinesObject[] = useAppSelector((state) => state.linesObject.value);
  const dispatch = useAppDispatch();

  const addTag = (index: number, tag: string) => {
    // Get copy of array
    const updatedLines: LinesObject[] = [...linesObject];

    // Get item
    const lineToChange: LinesObject | undefined = linesObject.find(
      (item) => item.index === index
    );

    // Add tags to item
    const updatedItem = { ...updatedLines[index] };
    lineToChange?.tags.push(tag);

    // Update the array with the modified item
    updatedLines[index] = updatedItem;

    // Update the state with the modified array and save
    dispatch(updateLinesObject(updatedLines));
    saveJSON();
  };
  return (
    <div className={styles["item-list"]}>
      {linesObject.map((lineObject: LinesObject) => (
        <Line
          line={lineObject.line}
          tags={lineObject.tags}
          index={lineObject.index}
          addTag={addTag}
          saveJSON={saveJSON}
        />
      ))}
    </div>
  );
};

export default DisplayFile;
