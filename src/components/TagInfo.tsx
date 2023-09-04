import React, { useState } from 'react';
import { LinesObject } from '../types/LinesObject';
import styles from './TagInfo.module.scss';

interface TagInfoprops {
  linesObject: LinesObject[];
}
const TagInfo: React.FC<TagInfoprops> = ({ linesObject }) => {
  const [tagInfo, setTagInfo] = useState<{ [tag: string]: number }>({});

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
    console.log(tagInfo);
  };

  return (
    <div>
      <div>
        {Object.keys(tagInfo).map((tag: string) => (
          <p key={`${tag}-info`}>
            {tag}: {tagInfo[tag]}
          </p>
        ))}
      </div>
      <button onClick={() => getTagInfo()} className={styles.button}>Display tag information</button>
    </div>
  );
};

export default TagInfo;
