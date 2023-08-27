import React from 'react';
import Line from './Line';

interface DisplayFileProps {
    lines: string[],
    tagList: string[],
}
const DisplayFile: React.FC<DisplayFileProps> = ({ lines, tagList }) => {

    return (
        <div>
            <div>
                {lines.map((line: string, index: number) => (
                    <Line tagList={tagList} line={line} index={index}/>      
                ))}
            </div>
        </div>
    );
};

export default DisplayFile;