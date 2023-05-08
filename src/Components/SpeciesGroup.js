import React, { useState } from 'react';
import { Checkbox } from 'antd';
import { speciesIds } from '../utils';

// I need to add additional properties to speciesIds

function SpeciesGroup({ onChange }) {
  const [checkedList, setCheckedList] = useState(speciesIds.map(opt => opt.value));

  const handleCheck = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;

    let ckeckedSpecies = [];

    if (checked) {
      ckeckedSpecies = [...checkedList, value];
    } else {
      ckeckedSpecies = checkedList.filter(item => item !== value);
    }
    setCheckedList(ckeckedSpecies);
    onChange(ckeckedSpecies);
  }
  // I need to return a list of checkboxes with the speciesIds and if the value is in the checklist, it should be checked
  return (<>
    {speciesIds.map(opt => (
      <div>
        <Checkbox
          value={opt.value}
          checked={checkedList.includes(opt.value)}
          onChange={handleCheck}>{opt.label}</Checkbox>
      </div>
    ))}
  </>
  );
}

export default SpeciesGroup;
