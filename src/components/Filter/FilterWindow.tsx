import React, { useState } from "react";
import Filter from "./Filter";
import styles from "./FilterWindow.module.scss";
import FilterLine from "./FilterLine";

const FilterWindow: React.FC = () => {
  const [filteredResults, setFilteredResults] = useState<LinesObject[]>([]);
  return (
    <div className={styles.container}>
      <Filter
        filteredResults={filteredResults}
        setFilteredResults={setFilteredResults}
      />
      <ul>
        {filteredResults.map((linesObject: LinesObject) => (
          <FilterLine line={linesObject.line} key={linesObject.index + "filter"}/>
        ))}
      </ul>
    </div>
  );
};

export default FilterWindow;
