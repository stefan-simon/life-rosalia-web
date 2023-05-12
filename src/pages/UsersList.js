import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button } from "antd";
import { apiUrl } from "../appConfig";

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("rosalia-web-token");
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    axios.get(apiUrl + "/all-users", config).then((response) => {
      console.log(response.data);
      setUsers(response.data);
    });
  }, []);

  const handleChangeUserStatus = (userId, active) => {
    const token = localStorage.getItem("rosalia-web-token");
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    axios.post(apiUrl +  `/users/${userId}/activate`, { active }, config).then((response) => {
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

  const handleInactivateUser = (userId) => {
    handleChangeUserStatus(userId, false);
  };

  const handleActivateUser = (userId) => {
    handleChangeUserStatus(userId, true);
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
          },
          {
            title: "Name",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Role",
            dataIndex: "role",
            key: "role",
          }, 
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (_, record) => (
              <span>{record.active ? "Active" : "Inactive"}</span>
            ),
          },
          {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
              <div>
                {record.active ? (
                  <Button size="small" onClick={() => handleInactivateUser(record.id)}>
                    Inactivate
                  </Button>
                ) : (
                  <Button size="small" onClick={() => handleActivateUser(record.id)}>
                    Activate
                  </Button>
                )}
              </div>

            ),
          },
        ]}
        dataSource={users}
      />
    </div>
  );
};

export default UsersList;
