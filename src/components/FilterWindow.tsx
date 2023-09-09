import React, {useState} from 'react';
import Filter from './Filter';

const FilterWindow: React.FC = () => {

    const [filteredResults, setFilteredResults] = useState<LinesObject[]>([])
    return (
        <div>
            <Filter filteredResults={filteredResults} setFilteredResults={setFilteredResults}/>
            {filteredResults.map((linesObject: LinesObject) => <p>{linesObject.line}</p>)}
        </div>
    );
};

export default FilterWindow;