import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { login } from "../utils";

function Login(props) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    const token = await login(values.username, values.password);
    setLoading(false);

    if (token) {
      localStorage.setItem("rosalia-web-token", token);
      props.setAuthenticated(true);
      navigate("/");
    } else {
      message.error("Invalid username or password");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <Form onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="username"
          rules={[{ required: true, message: "Introduceti adresa de email!" }]}
        >
          <Input disabled={loading} />
        </Form.Item>

        <Form.Item
          label="Parola"
          name="password"
          rules={[{ required: true, message: "Introduceti parola!" }]}
        >
          <Input.Password disabled={loading} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Log in
          </Button>
        </Form.Item>
      </Form>
      <Button type="link" onClick={() => navigate("/reset-password")}>Resetare parola</Button>
    </div>
  );
}

export default Login;
