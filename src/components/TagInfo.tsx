import React, { useEffect, useState } from "react";
import styles from "./TagInfo.module.scss";
import { useAppSelector } from "../app/hooks";

const TagInfo: React.FC = () => {
  const [tagInfo, setTagInfo] = useState<{ [tag: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);

  const linesObject: LinesObject[] = useAppSelector(
    (state) => state.linesObject.value
  );
  const sortedKeys = Object.keys(tagInfo).sort();
  const totalTags = Object.values(tagInfo).reduce(
    (acc: number, count: number) => acc + count,
    0
  );

  useEffect(() => {
    getTagInfo();
  }, []);

  const getTagInfo = () => {
    const newTaginfo: { [tag: string]: number } = {};
    linesObject.forEach((linesObject: LinesObject) => {
      // Iterate through the tags of each line
      linesObject.tags.forEach((tag: string) => {
        // If the tag is already in tagInfo, increment its count by 1
        if (newTaginfo[tag]) {
          newTaginfo[tag]++;
        } else {
          // If the tag is not in tagInfo, initialize it with a count of 1
          newTaginfo[tag] = 1;
        }
      });
    });
    setTagInfo(newTaginfo);
    setIsLoading(false); // Data loading is complete
  };

  return (
    <div className={styles.container}>
      {isLoading ? (
        <p>Loading...</p>
      ) : sortedKeys.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <table className={styles.tagTable}>
          <thead>
            <tr>
              <th>Tag</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {sortedKeys.map((tag: string) => (
              <tr key={`${tag}-info`}>
                <td>{tag}</td>
                <td>{tagInfo[tag]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <table className={styles.tagTable}>
        <thead>
          <tr>
            <th>Total</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total tags</td>
            <td>{totalTags}</td>
          </tr>
          <tr>
            <td>Total lines</td>
            <td>{linesObject.length}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TagInfo;
