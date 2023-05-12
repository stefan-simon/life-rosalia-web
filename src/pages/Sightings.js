import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./Sightings.css";
import { apiUrl } from "../appConfig";
import SightingsList from "../Components/SightingsList";
import SightingDetails from "../Components/SightingDetails";
import FilterPanel from "../Components/FiltrePanel";
import { isAdmin, speciesIds } from "../utils";
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
    const token = localStorage.getItem("rosalia-web-token");
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const fetchUsers = async () => {
      const response = await axios.get(apiUrl + '/users', config);
      setUsersList(response.data.map((user) => {
        return {
          value: user.user_code,
          label: user.name
        }
      }));
    };

    fetchUsers();

    const sightingsAPI = isAdmin() ? "/all-sightings" : "/sightings";

    axios
      .get(apiUrl + sightingsAPI, config)
      .then((response) => {
        setSightings(response.data);
        setFilteredSightings(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleApplyFilters = (selectedSpecies, selectedUsers, verified, intervalDate) => {
    console.log(selectedSpecies, selectedUsers, verified, intervalDate);
    let filteredSightings = sightings;

    if (selectedSpecies.length > 0) {
      filteredSightings = filteredSightings.filter(sighting => selectedSpecies.includes(sighting.species));
    }

    if (selectedUsers.length > 0) {
      filteredSightings = filteredSightings.filter(sighting => {
        return selectedUsers.includes(sighting.user_code)
      });
    }

    if (verified) {
      filteredSightings = filteredSightings.filter(sighting => sighting.verified === true);
    }

    if (intervalDate.length === 2) {
      filteredSightings = filteredSightings.filter(sighting => {
        const sightingDate = new Date(sighting.sighting_date);
        return sightingDate >= intervalDate[0] && sightingDate <= intervalDate[1];
      });
    }

    setFilteredSightings(filteredSightings);
  };

  const handleResetFilters = () => {
    setFilteredSightings(sightings);
  };

  const handleDisplayInMap = (selectedSpecies, selectedUsers, verified, intervalDate) => {
    navigate("/maps", { state: { filteredSightings } });
  };


  const handleView = (record) => {
    setSelectedRecord(record);
    setDetailsModalVisible(true);
  };

  const handleVerify = (record) => {
    const id = record.id;
    const token = localStorage.getItem("rosalia-web-token");
    const newVerified = !record.verified;
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    axios
      .patch(apiUrl + `/sightings/${id}`, { verified: newVerified }, config)
      .then((response) => {
        // Update the verified field in the sightings array in state
        setSightings(prevSightings => prevSightings.map(sighting => {
          if (sighting.id === id) {
            return {
              ...sighting,
              verified: newVerified
            };
          }
          return sighting;
        }));
        // Update the verified field in the filtered sightings array in state
        setFilteredSightings(prevSightings => prevSightings.map(sighting => {
          if (sighting.id === id) {
            return {
              ...sighting,
              verified: newVerified
            };
          }
          return sighting;
        }));
        // Display success message
        message.success("Inregistrarea a fost actualizata cu succes.");
      })
      .catch((error) => {
        console.log(error);
        // Display an error message to the user
        message.error("Eroare la verificarea inregistrarii.");
      });
  };

  const handleDelete = (record) => {
    const id = record.id;
    const token = localStorage.getItem("rosalia-web-token");
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    axios
      .delete(apiUrl + `/sightings/${id}`, config)
      .then((response) => {
        // Remove the deleted sighting from the sightings array in state
        setSightings(prevSightings => prevSightings.filter(sighting => sighting.id !== id));
        // Remove the deleted sighting from the filtered sightings array in state
        setFilteredSightings(prevSightings => prevSightings.filter(sighting => sighting.id !== id));
        // Display success message
        message.success("Inregistrarea a fost stearsa cu succes.");
      })
      .catch((error) => {
        console.log(error);
        // Display an error message to the user
        message.error("Eroare la stergerea inregistrarii.");
      });
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
      <SightingsList sightings={filteredSightings} onDetailsClick={handleView} onValidateClick={handleVerify} onDeleteClick={handleDelete} />
      <SightingDetails record={selectedRecord} visible={detailsModalVisible} onClose={() => setDetailsModalVisible(false)} />
    </div>
  );
}

export default Sightings;
