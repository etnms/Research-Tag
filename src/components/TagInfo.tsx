import React, { useState } from 'react';
import styles from './TagInfo.module.scss';
import { useAppSelector } from '../app/hooks';


const TagInfo: React.FC = () => {
  const [tagInfo, setTagInfo] = useState<{ [tag: string]: number }>({});

  const linesObject: LinesObject[] = useAppSelector(state => state.linesObject.value);

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
