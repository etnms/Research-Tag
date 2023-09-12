import React from 'react';
import styles from "./FilterLine.module.scss";

interface FilterLineProps {
    line: string;
}
const FilterLine: React.FC<FilterLineProps> = ({line}) => {
    return (
        <li className={styles.line}>
            {line}
        </li>
    );
};

export default FilterLine;