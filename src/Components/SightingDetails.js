import React from "react";
import { Modal, Carousel } from "antd";
import { apiUrl } from "../appConfig";
import "./SightingDetails.css";
import { UserOutlined, InfoCircleOutlined, CalendarOutlined } from "@ant-design/icons";
import { Checkbox } from "antd";
import { speciesNames } from "../utils";
import moment from "moment";

function SightingDetails({ record, visible, onClose }) {
  if (!record) {
    return null;
  }
  const date = moment.utc(record.sighting_date);
  const formattedDate = date.local().format("DD/MM/YYYY h:mm A")
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
      title="Detalii observație"
      open={visible}
      onCancel={onClose}
      footer={null}
      className="custom-modal"
    >
      <div className="sighting-details-container">
        <div className="sighting-details-info">
          <UserOutlined /> {record.user_name} <br />
          {record.verified ? <Checkbox checked disabled /> : <Checkbox disabled />}  Verificat <br />
          <InfoCircleOutlined /> {speciesNames[record.species]} <br />
          <CalendarOutlined /> {formattedDate} <br />
          {record.notes}
        </div>
        <div className="sighting-details-images">
          <Carousel className="sighting-details-carousel">
            {pictures.map((image, index) => (
              <div key={index} id={`containter-${index}`} className="image-container">
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
