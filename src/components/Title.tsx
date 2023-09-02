import React from 'react';
import styles from './Title.module.css';

const Title = () => {
    return (
        <div className={styles.title}>
            <h1>Tagger app</h1>
            <h2>This app is designed to help you tag large corpuses of answers from surveys</h2>
        </div>
    );
};

export default Title;