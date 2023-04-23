import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import Sightings from "./Sightings";
import Maps from "./Maps";
import Login from "./Login";
import { isAuthenticated } from "../utils";
import { useEffect, useState } from "react";

const { Header, Content } = Layout;

function Logout(props) {
  localStorage.removeItem("rosalia-web-token");
  props.setAuthenticated(false);
  return <Navigate to="/login" />;
}

function LandingPage() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  return (
    <Router>
      <Layout>
        <Header>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[]}
          >
            {authenticated ? (
              <>
                <Menu.Item key="sightings">
                  <Link to="/">Inregistrari</Link>
                </Menu.Item>
                <Menu.Item key="maps">
                  <Link to="/maps">Harta</Link>
                </Menu.Item>
                <Menu.Item key="logout" style={{ float: "right" }}>
                  <Link to="/logout">Logout</Link>
                </Menu.Item>
              </>
            ) : (
              <Menu.Item key="login" style={{ float: "right" }}>
                <Link to="/login">Login</Link>
              </Menu.Item>
            )}
          </Menu>
        </Header>
        <Content style={{ padding: "12px" }}>
          <div className="site-layout-content">
            <Routes>
              <Route
                path="/"
                element={
                  authenticated ? (
                    <Sightings />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/maps"
                element={
                  authenticated ? (
                    <Maps />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
              <Route path="/logout" element={<Logout setAuthenticated={setAuthenticated} />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Router>
  );
}

export default LandingPage;
