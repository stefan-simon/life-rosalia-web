import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "antd";
import { apiUrl } from "../appConfig";

function SetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    const token = new URLSearchParams(window.location.search).get("token");
    const response = await fetch(apiUrl + "/set-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        password,
      }),
    });
    const result = await response.json();
    if (result.success) {
      navigate("/login");
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Set New Password</h2>
      <form onSubmit={handleSetPassword}>
        <input type="hidden" name="token" value={new URLSearchParams(window.location.search).get("token")} />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button type="primary" htmlType="submit">
          Set Password
        </Button>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </form>
    </div>
  );
}

export default SetPassword;
