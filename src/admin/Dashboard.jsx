import React from "react";
import { Col, Container, Row } from "reactstrap";
import "../styles/dashboard.css";
import Helmet from "../components/Helmet/Helmet";
import useGetData from "../custom-hooks/useGetData";
import { motion } from "framer-motion";
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
    <Helmet title={"Dashboard"}>
      <section className="dashboard__section">
        <Container>
          <Row>
          <Col lg="12">
            <h4 className="fw-bold mb-5 head__title">Dashboard</h4>
          </Col>
            <Col lg="3" md="6">
              <motion.div whileHover={{ scale: 1.1 }} className="revenue__box">
                <div className='card__content'>
                  <h5>Doanh thu</h5>
                  <span>1.000.000.000đ</span>
                </div>
                <div className="dashboard__icon">
                  <i className="ri-exchange-dollar-line"></i>
                </div>
              </motion.div>
            </Col>
            <Col lg="3" md="6">
              <motion.div whileHover={{ scale: 1.1 }} className="order__box">
                <div className='card__content'>
                  <h5>Lợi nhuận</h5>
                  <span>1.000.000.000đ</span>
                </div>
                <div className="dashboard__icon">
                  <i className="ri-task-line"></i>
                </div>
              </motion.div>
            </Col>
            <Col lg="3" md="6">
              <motion.div whileHover={{ scale: 1.1 }} className="products__box">
                <div className='card__content'>
                  <h5>Sản phẩm</h5>
                  <span>{products.length}</span>
                </div>
                <div className="dashboard__icon">
                  <i className="ri-product-hunt-line"></i>
                </div>
              </motion.div>
            </Col>
            <Col lg="3" md="6">
              <motion.div whileHover={{ scale: 1.1 }} className="users__box">
                <div className='card__content'>
                  <h5>Người dùng</h5>
                  <span>{users.length}</span>
                </div>
                <div className="dashboard__icon">
                  <i className="ri-account-circle-line"></i>
                </div>
              </motion.div>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col className="lg-6 barchart">
              <BarChart
                width={600}
                height={350}
                data={data}
                margin={{
                  top: 15,
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
            <Col className="lg-6 linechart ">
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
    </Helmet>
  );
};

export default Dashboard;
