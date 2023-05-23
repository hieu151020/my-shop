import React from "react";
import { Col, Container, Row } from "reactstrap";
import "../styles/dashboard.css";
import useGetData from "../custom-hooks/useGetData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
const Dashboard = () => {
  const { data: products } = useGetData("products");
  const { data: users } = useGetData("users");

  const data = [
    { name: "T1",  revenue: 2400, amt: 2400 },
    { name: "T2",  revenue: 1398, amt: 2210 },
    { name: "T3",  revenue: 9800, amt: 2290 },
    { name: "T4",  revenue: 3908, amt: 2000 },
    { name: "T5",  revenue: 4800, amt: 2181 },
    { name: "T6",  revenue: 3800, amt: 2500 },
    { name: "T7",  revenue: 4300, amt: 2100 },
    { name: "T8",  revenue: 4300, amt: 2100 },
    { name: "T9",  revenue: 4300, amt: 2100 },
    { name: "T10",  revenue: 4300, amt: 2100 },
    { name: "T11",  revenue: 4300, amt: 2100 },
    { name: "T12",  revenue: 4300, amt: 2100 },
  ];
  return (
    <>
      <section className="dashboard__section">
        <Container>
          <Row>
          <Col lg="12">
            <h4 className="fw-bold mb-5">Dashboard</h4>
          </Col>
            <Col lg="3" md="6">
              <div className="revenue__box">
                <div className='card__content'>
                  <h5>Total Sales</h5>
                  <span>1.000.000.000đ</span>
                </div>
                <div className="dashboard__icon">
                  <i class="ri-exchange-dollar-line"></i>
                </div>
              </div>
            </Col>
            <Col lg="3" md="6">
              <div className="order__box">
                <div className='card__content'>
                  <h5>Orders</h5>
                  <span>1.000.000.000đ</span>
                </div>
                <div className="dashboard__icon">
                  <i class="ri-task-line"></i>
                </div>
              </div>
            </Col>
            <Col lg="3" md="6">
              <div className="products__box">
                <div className='card__content'>
                  <h5>Total Products</h5>
                  <span>{products.length}</span>
                </div>
                <div className="dashboard__icon">
                  <i class="ri-product-hunt-line"></i>
                </div>
              </div>
            </Col>
            <Col lg="3" md="6">
              <div className="users__box">
                <div className='card__content'>
                  <h5>Total Users</h5>
                  <span>{users.length}</span>
                </div>
                <div className="dashboard__icon">
                  <i class="ri-account-circle-line"></i>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col className="lg-6 ">
              <BarChart
                width={600}
                height={350}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" label={{ value: 'Tháng', position: 'insideBottomRight', offset: -10}}/>
                <YAxis label={{ value: 'VNĐ', angle: -90, position: 'insideLeft'}}/>
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </Col>
            <Col className="lg-6">
              <LineChart width={600} height={350} data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
                <Tooltip />
                <Legend />
              </LineChart>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Dashboard;
