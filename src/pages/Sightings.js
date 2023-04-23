import React, { useState, useEffect } from "react";
import { Table, Button, Checkbox, DatePicker } from "antd";
import axios from "axios";
import moment from 'moment';

import "./Sightings.css";
import SightingDetails from "../Components/SightingDetails";
import { apiUrl } from "../appConfig";

function Sightings() {
  const [sightings, setSightings] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);


  const speciesOptions = [
    { label: "Rosalia alpina", value: "rosalia-alpina" },
    { label: "Osmoderma eremita", value: "osmoderma-eremita" },
    { label: "Morimus funereus", value: "morimus-funereus" },
    { label: "Lucanus cervus", value: "lucanus-cervus" },
    { label: "Cerambyx cerdo", value: "cerambyx-cerdo" },
  ];

  const columns = [
    {
      title: "Specie",
      dataIndex: "species",
      key: "species",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Checkbox.Group
            options={speciesOptions}
            value={selectedKeys}
            onChange={(values) => setSelectedKeys(values)}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                confirm();
              }}
            >
              OK
            </Button>
            <Button size="small" onClick={() => clearFilters()}>
              Reset
            </Button>
          </div>
        </div>
      ),
      onFilter: (value, record) => record.species.includes(value),
    },
    {
      title: "Data observatiei",
      dataIndex: "sighting_date",
      key: "sighting_date",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <DatePicker.RangePicker
            value={selectedKeys[0]}
            onChange={(date) =>
              setSelectedKeys(date ? [date] : [])
            }
            onOk={() => confirm()}
            placeholder={["Start date", "End date"]}
          />
          <Button
            type="primary"
            onClick={() => {
              setSelectedKeys([]);
              clearFilters();
            }}
            style={{ marginTop: 8, marginRight: 8 }}
          >
            Reset
          </Button>
          <Button
            type="primary"
            onClick={() => confirm()}
            style={{ marginTop: 8 }}
          >
            Filter
          </Button>
        </div>
      ),
      onFilter: (value, record) => {
        const [start, end] = value;
        const date = moment(record.sighting_date);
        return date.isSameOrAfter(start, "day") && date.isSameOrBefore(end, "day");
      },
      sorter: (a, b) => {
        return moment(a.sighting_date) - moment(b.sighting_date);
      },
    },
    {
      title: "Nota",
      dataIndex: "notes",
      key: "notes",
    },
    {
      title: "Validat",
      dataIndex: "verified",
      key: "verified",
      render: (verified) => (verified ? "Yes" : "No")
    },
    {
      title: "Actiuni",
      key: "actions",
      render: (text, record) => (
        <>
          <Button onClick={() => handleView(record)}>Detalii</Button>
          &nbsp;
          <Button onClick={() => handleVerify(record)}>{record.verified ? 'Invalideaza' : 'Valideaza'}</Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    axios
      .get(apiUrl + "/sightings")
      .then((response) => {
        setSightings(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleVerify = async (record) => {
    const id = record.id;
    const verified = !record.verified;
    const token = localStorage.getItem("rosalia-web-token");
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    try {
      // Call the API to update the verified status of the sighting
      const response = await axios.patch(apiUrl + `/sightings/${id}/verified`, { verified }, config);
      const updatedSighting = response.data;

      // Update the sightings array in state with the updated sighting
      setSightings(prevSightings => prevSightings.map(sighting => {
        if (sighting.id === updatedSighting.id) {
          return updatedSighting;
        } else {
          return sighting;
        }
      }));
    } catch (error) {
      console.error(error);
      // Display an error message to the user
    }
  };


  const handleView = (record) => {
    setSelectedRecord(record);
    setDetailsModalVisible(true);
  };


  return (
    <div>
      <Table columns={columns} dataSource={sightings} />
      {selectedRecord && (
        <SightingDetails
          record={selectedRecord}
          visible={detailsModalVisible}
          onClose={() => setDetailsModalVisible(false)}
        />
      )}
    </div>
  );
}

export default Sightings;
