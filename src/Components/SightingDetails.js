import React from "react";
import { Modal, Typography, Carousel } from "antd";
import { apiUrl } from "../appConfig";
import "./SightingDetails.css";

const { Title, Text } = Typography;

function SightingDetails({ record, visible, onClose }) {
  const pictures = [];
  if (record.picture1) {
    pictures.push(apiUrl + '/image/' + record.picture1);
  }
  if (record.picture2) {
    pictures.push(apiUrl + '/image/' + record.picture2);
  }
  if (record.picture3) {
    pictures.push(apiUrl + '/image/' + record.picture3);
  }

  return (
    <Modal
      title="Sighting Details"
      visible={visible}
      onCancel={onClose}
      footer={null}
      className="custom-modal"
    >
      <div className="sighting-details-container">
        <div className="sighting-details-info">
          <Title level={4}>Species:</Title>
          <Text>{record.species}</Text>
          <br />
          <br />
          <Title level={4}>Sighting Date:</Title>
          <Text>{record.sighting_date}</Text>
          <br />
          <br />
          <Title level={4}>Notes:</Title>
          <Text>{record.notes}</Text>
          <br />
          <br />
        </div>
        <div className="sighting-details-images">
          <Carousel className="sighting-details-carousel">
            {pictures.map((image, index) => (
              <div key={index}>
                <img
                  src={image}
                  alt=""
                  className="sighting-details-image"
                />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </Modal>
  );
}

export default SightingDetails;
