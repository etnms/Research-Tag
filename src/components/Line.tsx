import React, {useState} from 'react';

interface LineProps {
    tagList: string[],
    line: string,
    tags: string[],
    index: number,
    addTagsTest: Function
}
const Line: React.FC<LineProps> = ({ tagList, line, tags, index, addTagsTest }) => {

    const [selectedTag, setSelectedTag] = useState<string>('');

    const handleTagSelection = () => {
        const tagValue = (document.querySelector(`select[name='select-tag-${index}'`) as HTMLSelectElement).value;
        setSelectedTag(tagValue);
    }

    return (
        <li key={index}>{line}
            <select name={`select-tag-${index}`} onChange={() => handleTagSelection()}>{tagList.map(
                (tag: string) => (<option value={tag} key={`${tag}-option`}>{tag}
                </option>))}
            </select>
            <div>
                {tags.map((tag: string) => (<span>{tag}</span>))}
            </div>
            <button onClick={() => addTagsTest(index, selectedTag)}>Add tag</button>
        </li>
    );
};

export default Line;