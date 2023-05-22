import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Radio } from "antd";
import { apiUrl } from "../appConfig";

const UsersList = () => {
  const [users, setUsers] = useState([]);

  const userStatus = [
    {
      label: "Activ",
      value: true,
    },
    {
      label: "Inactiv",
      value: false,
    },
  ]

  const userRole = [
    {
      label: "User",
      value: "user",
    },
    {
      label: "Control",
      value: "validator",
    },
    {
      label: "Admin",
      value: "admin",
    },
  ]
  
  const statusFilters = [
    { text: 'Active', value: true },
    { text: 'Inactive', value: false },
  ];

  const roleFilters = [
    { text: 'User', value: 'user' },
    { text: 'Control', value: 'validator' },
    { text: 'Admin', value: 'admin' },
  ];

  useEffect(() => {
    const token = localStorage.getItem("rosalia-web-token");
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    axios.get(apiUrl + "/all-users", config).then((response) => {
      setUsers(response.data);
    });
  }, []);

  const handleChangeUserStatus = (userId, active) => {
    const token = localStorage.getItem("rosalia-web-token");
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    axios.post(apiUrl + `/users/${userId}/activate`, { active }, config).then((response) => {
      if (response.status === 200) {
        setUsers(users.map((user) => {
          if (user.id === userId) {
            user.active = active;
          }
          return user;
        }));
      }
    });
  };

  // the user role can be: user, validator, admin
  const handleChangeUserRole = (userId, role) => {
    const token = localStorage.getItem("rosalia-web-token");
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    axios.post(apiUrl + `/users/${userId}/role`, { role }, config).then((response) => {
      if (response.status === 200) {
        setUsers(users.map((user) => {
          if (user.id === userId) {
            user.role = role;
          }
          return user;
        }));
      }
    });
  };

  return (
    <div>
      <Table
        columns={[
          {
            title: "ID",
            dataIndex: "id",
            key: "id",
          },
          {
            title: "User Code",
            dataIndex: "user_code",
            key: "user_code",
          },
          {
            title: "Email",
            dataIndex: "email",
            key: "email",
            sorter: (a, b) => a.email.localeCompare(b.email),
          },
          {
            title: "Name",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
          },
          {
            title: "Status",
            dataIndex: "status",
            key: "active",
            filters: statusFilters, // Add filter options
            onFilter: (value, record) => record.active === value,
            render: (_, record) => (
              <Radio.Group
                key={record.active}
                options={userStatus}
                value={record.active}
                optionType="button"
                buttonStyle="solid"
                onChange={(e) => handleChangeUserStatus(record.id, e.target.value)}
              />
            ),
          },
          {
            title: "Role",
            dataIndex: "role",
            key: "role",
            filters: roleFilters, // Add filter options
            onFilter: (value, record) => record.role === value,
            render: (_, record) => (
              <Radio.Group
                key={record.role}
                options={userRole}
                value={record.role}
                optionType="button"
                buttonStyle="solid"
                onChange={(e) => handleChangeUserRole(record.id, e.target.value)}
              />
            ),
          },
        ]}
        dataSource={users}
        rowKey="id"
      />
    </div>
  );
};

export default UsersList;
