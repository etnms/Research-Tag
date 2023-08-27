import React from 'react';

interface LineProps {
    tagList: string[],
    line: string,
    index: number,
}
const Line: React.FC<LineProps> = ({ tagList, line, index }) => {

    const addTagLine = () => {

    }

    return (
        <li key={index}>{line}
            <select>{tagList.map(
                (tag: string) => (<option value={tag} key={`${tag}-option`}>{tag}
                </option>))}
            </select>
            <button onClick={() => addTagLine()}>Add tag</button>
        </li>
    );
};

export default Line;