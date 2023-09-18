import React from 'react';
import styles from "./Loader.module.scss";

interface LoaderProps {
    title: string;
}
const Loader: React.FC<LoaderProps> = ({title}) => {
    return (
        <div className={styles["loader-container"]}>
          <p>{title}</p>
          <span className={styles.loader}></span>
        </div>
    );
};

export default Loader;