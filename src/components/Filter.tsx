import React, { useEffect, useState } from "react";
import { useAppSelector } from "../app/hooks";

const Filter: React.FC = () => {
  const tagList = useAppSelector((state) => state.tagList.value);

  const [currentFilters, setCurrentFilters] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  useEffect(() => {
    if (selectedFilter === "" && tagList.length !== 0) {
      setSelectedFilter(tagList[0].name);
    }
  }, []);

  const addFilter = (value: string) => {
    if (currentFilters.find((filterValue: string) => filterValue === value))
      return;
    setCurrentFilters([...currentFilters, value]);
  };

  const removeFilter = (value: string) => {
    const newFilters = currentFilters.filter((item: string) => item !== value);
    setCurrentFilters(newFilters);
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(event.currentTarget.value);
  };

  return tagList.length !== 0 ? (
    <div>
      <h3>Filter by tag</h3>
      <select onChange={(event) => handleChange(event)}>
        {tagList.map((tag: Tag) => (
          <option>{tag.name}</option>
        ))}
      </select>
      <button onClick={() => addFilter(selectedFilter)}>Add filter</button>
      {currentFilters.length === 0 ? null : (
        <div>
          <h4>Current filters:</h4>
          <ul>
            {currentFilters.map((filter: string) => (
              <li>
                {filter}{" "}
                <button onClick={() => removeFilter(filter)}>
                  Remove filter
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  ) : null;
};

export default Filter;
