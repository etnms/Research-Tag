import React from 'react';
import styles from './TagList.module.css';

interface TagListProps {
    tagList: Tag[]
}

const TagList: React.FC<TagListProps> = ({ tagList }) => {

    return (
        <ul>
            {tagList.map((tag: Tag) => (
                <li key={tag.name} className={styles.tag} style={{backgroundColor: `${tag.color}`}}>{tag.name}</li>
            ))}
        </ul>
    );
};

export default TagList;