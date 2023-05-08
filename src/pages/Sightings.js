import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./Sightings.css";
import { apiUrl } from "../appConfig";
import SightingsList from "../Components/SightingsList";
import SightingDetails from "../Components/SightingDetails";
import FilterPanel from "../Components/FiltrePanel";
import { speciesIds } from "../utils";
import { Button, message } from "antd";

function Sightings() {
  const navigate = useNavigate();

  const [sightings, setSightings] = useState([]);
  const [usersList, setUsersList] = useState([]);

  const [filteredSightings, setFilteredSightings] = useState([]);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  // fetch the sightings and the users list
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("rosalia-web-token");
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get(apiUrl + '/users', config);
      setUsersList(response.data.map((user) => {
        return {
          value: user.id,
          label: user.name
        }
      }));
    };

    fetchUsers();

    axios
      .get(apiUrl + "/sightings")
      .then((response) => {
        setSightings(response.data);
        setFilteredSightings(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleApplyFilters = (selectedSpecies, selectedUsers, verified, intervalDate) => {
    let filteredSightings = sightings;

    if (selectedSpecies.length > 0) {
      filteredSightings = filteredSightings.filter(sighting => selectedSpecies.includes(sighting.species));
    }

    if (selectedUsers.length > 0) {
      filteredSightings = filteredSightings.filter(sighting => selectedUsers.includes(sighting.user_id));
    }

    if (verified) {
      filteredSightings = filteredSightings.filter(sighting => sighting.verified === true);
    }

    if (intervalDate.length === 2) {
      filteredSightings = filteredSightings.filter(sighting => {
        const sightingDate = new Date(sighting.date);
        return sightingDate >= intervalDate[0] && sightingDate <= intervalDate[1];
      });
    }

    setFilteredSightings(filteredSightings);
  };

  const handleResetFilters = () => {
    setFilteredSightings(sightings);
  };


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

      // Display success message
      message.success(`Inregistrarea a fost ${verified ? 'validata' : 'invalidata'}.`);

    } catch (error) {
      console.error(error);
      // Display an error message to the user
      message.error(`Erare la ${verified ? 'validarea' : 'invalidarea'} inregistrarii.`);
    }
  };

  const handleDisplayInMap = (selectedSpecies, selectedUsers, verified, intervalDate) => {
    navigate("/maps", { state: { filteredSightings } });
  };


  const handleView = (record) => {
    setSelectedRecord(record);
    setDetailsModalVisible(true);
  };


  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <FilterPanel
          speciesOptions={speciesIds}
          userOptions={usersList}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
      </div>
      <div style={{ marginBottom: 16, textAlign: 'left' }}>
        <Button type="primary" onClick={handleDisplayInMap}>
          Afiseaza observatiile in harta
        </Button>
      </div>
      <SightingsList sightings={filteredSightings} onDetailsClick={handleView} onValidateClick={handleVerify} />
      <SightingDetails record={selectedRecord} visible={detailsModalVisible} onClose={() => setDetailsModalVisible(false)} />
    </div>
  );
}

export default Sightings;
