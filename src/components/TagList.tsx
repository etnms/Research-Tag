import React from 'react';

interface TagListProps {
    tagList: string[]
}

const TagList: React.FC<TagListProps> = ({ tagList }) => {
    return (
        <ul>
            {tagList.map((tag: string) => (
                <li key={tag}>{tag}</li>
            ))}
        </ul>
    );
};

export default TagList;