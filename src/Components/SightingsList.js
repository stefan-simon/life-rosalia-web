import React from "react";
import { Table, Button, Tag, Space, Tooltip } from "antd";
import { InfoCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined } from "@ant-design/icons";

import moment from 'moment';
import { isValidator, speciesNames } from "../utils";

function SightingsList({ displayActions=true, hasFilter = false, sightings = [], onDetailsClick, onValidateClick, onDeleteClick = () => { }, onRowClick = () => { } }) {

  const columns = [
    {
      title: "Specie",
      dataIndex: "species",
      key: "species",
      sorter: (a, b) => {
        return a.species - b.species;
      },
      render: (text, record) => (
        <>
          {speciesNames[record.species]}
        </>
      )
    },
    {
      title: "Data observatiei",
      dataIndex: "sighting_date",
      key: "sighting_date",
      sorter: (a, b) => {
        return moment(a.sighting_date) - moment(b.sighting_date);
      },
      render: (text, record) => {
        const date = moment.utc(record.sighting_date);
        return (
          <>
            {date && date.local().format("DD/MM/YYYY h:mm A")}
          </>
        )
      }
    },
    {
      title: "Nota",
      dataIndex: "notes",
      key: "notes",
    },
    {
      title: "Utilizator",
      dataIndex: "user_name",
      key: "user_name",
      sorter: (a, b) => {
        return a.user_name - b.user_name;
      },
    },
    {
      title: "Validat",
      dataIndex: "verified",
      key: "verified",
      sorter: (a, b) => {
        return a.verified - b.verified;
      },
      render: (verified) => (
        verified
          ? <Tag color="success">Validat</Tag>
          : <Tag color="warning">Nevalidat</Tag>
      )
    },
    {
      title: "Actiuni",
      key: "actions",
      render: (text, record) => (
        <>
          <Space>
            <Tooltip title="Detalii">
              <Button type="default" onClick={() => onDetailsClick(record)} icon={<InfoCircleOutlined />} />
            </Tooltip>
            {displayActions && isValidator() && (
              <>
                <Tooltip title={record.verified ? "Invalideaza" : "Valideaza"}>
                  <Button onClick={() => onValidateClick(record)} type={record.verified ? "default" : "primary"} danger={record.verified} icon={record.verified ? <CloseCircleOutlined /> : <CheckCircleOutlined />} />
                </Tooltip>
                <Tooltip title="Sterge">
                  <Button danger onClick={() => onDeleteClick(record)} type="primary" icon={<DeleteOutlined />} />
                </Tooltip>
              </>
            )}
          </Space>
        </>
      ),
    },

  ];

  return (
    <div>
      <Table rowKey="id" showSorterTooltip={hasFilter} columns={columns} dataSource={sightings} onRow={(record) => {
        return {
          onClick: () => {
            onRowClick(record);
          },
        };
      }} />
    </div>
  );
}

export default SightingsList;
