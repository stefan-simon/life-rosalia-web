import { useState } from 'react';
import { Checkbox, DatePicker, Select, Button, Collapse, Space } from 'antd';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Panel } = Collapse;

const FilterPanel = ({ onApplyFilters, onResetFilters, speciesOptions, userOptions }) => {
  const [speciesFilters, setSpeciesFilters] = useState([]);
  const [dateRangeFilters, setDateRangeFilters] = useState([]);
  const [userFilters, setUserFilters] = useState([]);
  const [verifiedFilters, setVerifiedFilters] = useState(false);

  const handleResetFilters = () => {
    setSpeciesFilters([]);
    setDateRangeFilters([]);
    setUserFilters([]);
    setVerifiedFilters(false);
    onResetFilters();
  };
  const handleApplyFilters = () => {
    onApplyFilters(speciesFilters, userFilters, verifiedFilters, dateRangeFilters);
  };

  return (
    <Collapse>
      <Panel header="Cautare avansata" key="1">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div>
            <h4 style={{ marginLeft: 0 }}>Specii:</h4>
            {speciesOptions.map((option) => (
              <Checkbox
                key={option.value}
                checked={speciesFilters.includes(option.value)}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setSpeciesFilters((filters) => {
                    if (checked) {
                      return [...filters, option.value];
                    } else {
                      return filters.filter((filter) => filter !== option.value);
                    }
                  });
                }}
              >
                {option.label}
              </Checkbox>
            ))}
          </div>
          <div>
            <h4 style={{ marginLeft: 0 }}>Interval de date:</h4>
            <RangePicker
              value={dateRangeFilters}
              onChange={(dates) => setDateRangeFilters(dates)}
            />
          </div>
          <div>
            <h4 style={{ marginLeft: 0 }}>Utilizator:</h4>
            <Select
              mode="multiple"
              value={userFilters}
              onChange={(values) => setUserFilters(values)}
              style={{ width: '100%' }}
            >
              {userOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <h4 style={{ marginLeft: 0 }}>Verificat:</h4>
            <Checkbox
              checked={verifiedFilters}
              onChange={(e) => setVerifiedFilters(e.target.checked)}
            >
              Da
            </Checkbox>
          </div>
          <div style={{ marginTop: '20px' }}>
            <Space>
              <Button type="primary" onClick={handleApplyFilters}>
                Aplica filtru
              </Button>
              <Button onClick={handleResetFilters}>
                Reseteaza filtrele
              </Button>
            </Space>
          </div>
        </div>
      </Panel>
    </Collapse>
  );
};

export default FilterPanel;
