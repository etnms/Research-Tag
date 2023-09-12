import React, { useState } from "react";
import Filter from "./Filter";
import styles from "./FilterWindow.module.scss";

const FilterWindow: React.FC = () => {
  const [filteredResults, setFilteredResults] = useState<LinesObject[]>([]);
  return (
    <div className={styles.container}>
      <Filter
        filteredResults={filteredResults}
        setFilteredResults={setFilteredResults}
      />
      {filteredResults.map((linesObject: LinesObject) => (
        <p>{linesObject.line}</p>
      ))}
    </div>
  );
};

export default FilterWindow;
