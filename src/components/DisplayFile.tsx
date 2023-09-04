import React from 'react';
import Line from './Line';
import { LinesObject } from '../types/LinesObject';
import styles from './DisplayFile.module.scss';

interface DisplayFileProps {
    tagList: Tag[],
    linesObject: LinesObject[],
    setLinesObject: Function,
    saveJSON: Function
}

const DisplayFile: React.FC<DisplayFileProps> = ({ linesObject, tagList, setLinesObject, saveJSON }) => {

    const addTag = (index: number, tag: string) => {

        // Get copy of array
        const updatedLines: LinesObject[] = [...linesObject];

        // Get item
        const lineToChange: LinesObject | undefined = linesObject.find(item => item.index === index);

        // Add tags to item
        const updatedItem = { ...updatedLines[index] };
        lineToChange?.tags.push(tag)

        // Update the array with the modified item
        updatedLines[index] = updatedItem;

        // Update the state with the modified array and save
        setLinesObject(updatedLines);
        saveJSON();
    }
    return (
        <div className={styles['item-list']}>
            {linesObject.map((lineObject: LinesObject) => (
                <Line tagList={tagList} line={lineObject.line} tags={lineObject.tags} index={lineObject.index} addTag={addTag} />
            ))}
        </div>
    );
};

export default DisplayFile;