import React, { useState } from "react";
import { Input, Button, message, Space } from "antd";
import axios from "axios";
import { apiUrl } from "../appConfig";

const ResetPassword = () => {
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    try {
      const response = await axios.post(apiUrl + "/reset-password", { email });
      message.success(response.data.message);
    } catch (error) {
      message.error(error.response.data.error);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
    <Space direction="vertical">
      <h2>Resetare / Schimbare parola</h2>
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button onClick={handleResetPassword}>Trimite</Button>
      </Space>
    </div>
  );
};

export default ResetPassword;
