import React, { useEffect, useMemo, useState } from "react";
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useFomatDate from "../custom-hooks/useFomatDate";

const data = [
  { name: "T1", revenue: 0, amt: 2400 },
  { name: "T2", revenue: 0, amt: 2210 },
  { name: "T3", revenue: 0, amt: 2290 },
  { name: "T4", revenue: 0, amt: 2000 },
  { name: "T5", revenue: 0, amt: 2181 },
  { name: "T6", revenue: 0, amt: 2500 },
  { name: "T7", revenue: 0, amt: 2100 },
  { name: "T8", revenue: 0, amt: 2100 },
  { name: "T9", revenue: 0, amt: 2100 },
  { name: "T10", revenue: 0, amt: 2100 },
  { name: "T11", revenue: 0, amt: 2100 },
  { name: "T12", revenue: 0, amt: 2100 },
];

const dataPro = [
  { name: "T1", product: 0, amt: 2400 },
  { name: "T2", product: 0, amt: 2210 },
  { name: "T3", product: 0, amt: 2290 },
  { name: "T4", product: 0, amt: 2000 },
  { name: "T5", product: 0, amt: 2181 },
  { name: "T6", product: 0, amt: 2500 },
  { name: "T7", product: 0, amt: 2100 },
  { name: "T8", product: 0, amt: 2100 },
  { name: "T9", product: 0, amt: 2100 },
  { name: "T10", product: 0, amt: 2100 },
  { name: "T11", product: 0, amt: 2100 },
  { name: "T12", product: 0, amt: 2100 },
];

const Dashboard = () => {
  const [revenue, setRevenue] = useState(0);
  const [profit, setProfit] = useState(0);
  const { data: products } = useGetData("products");
  const { data: revenueData } = useGetData("revenue");
  const { data: users } = useGetData("users");

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [revenueDate, setRevenueDate] = useState([]);

  useEffect(() => {
    const totalRevenue = revenueData.reduce((acc, cur) => {
      return acc + cur.total;
    }, 0);
    setRevenue(totalRevenue);
  }, [revenueData]);

  useEffect(()=>{
    products.forEach((item) => {
      const [day, month, year] = item.createAt.split("/");
      const monthObj = dataPro.find(
        (monthItem) => monthItem.name === `T${parseInt(month)}`
      );
      if (monthObj) {
        monthObj.product += 1;
      }
    });
  },[])

  useEffect(()=>{
    const arrDate = [];
    const monthSelected = (selectedDate.getMonth() + 1)
      .toString()
      .padStart(2, "0");
    const daySelected = selectedDate.getDate().toString().padStart(2, "0");

    revenueData.forEach((item) => {
      // Tách ngày tháng từ trường successAt
      const [day, month, year] = item.successAt.split("/");

      if (day === daySelected && month === monthSelected) {
        arrDate.push(item);
      }
      // if (month === monthSelected) {
      //   arrDate.push(order);
      // }
      setRevenueDate(arrDate);
    });
  },[selectedDate])

  useEffect(() => {
    let sum = 0;
    revenueData.forEach((item) => {
      // Tách ngày tháng từ trường successAt
      const [day, month, year] = item.successAt.split("/");

      item.item.forEach((item) => {
        sum += Number(item.price) * 0.15 * Number(item.quantity);
      });
      setProfit(sum);

      const monthObj = data.find(
        (monthItem) => monthItem.name === `T${parseInt(month)}`
      );
      if (monthObj) {
        monthObj.revenue += item.total;
      }
    });
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  console.log(revenueDate);

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
                <div className="card__content">
                  <h5>Doanh thu</h5>
                  <span>{revenue.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="dashboard__icon">
                  <i className="ri-exchange-dollar-line"></i>
                </div>
              </motion.div>
            </Col>
            <Col lg="3" md="6">
              <motion.div whileHover={{ scale: 1.1 }} className="order__box">
                <div className="card__content">
                  <h5>Đơn hàng hoàn thành</h5>
                  <span>{revenueData.length}</span>
                </div>
                <div className="dashboard__icon">
                  <i className="ri-task-line"></i>
                </div>
              </motion.div>
            </Col>
            <Col lg="3" md="6">
              <motion.div whileHover={{ scale: 1.1 }} className="products__box">
                <div className="card__content">
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
                <div className="card__content">
                  <h5>Tài khoản</h5>
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
              {/* <div>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yy"
                />0
              </div> */}
              <BarChart
                width={600}
                height={350}
                data={dataPro}
                margin={{
                  top: 15,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  label={{
                    value: "Tháng",
                    position: "insideBottomRight",
                    offset: -10,
                  }}
                />
                <YAxis
                  label={{
                    value: "Sản phẩm",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="product" fill="#8884d8" />
              </BarChart>
            </Col>
            <Col className="lg-6 linechart ">
              <LineChart
                width={600}
                height={350}
                data={data}
                margin={{
                  top: 15,
                  right: 30,
                  left: 30,
                  bottom: 5,
                }}
              >
                <XAxis
                  dataKey="name"
                  label={{
                    value: "Tháng",
                    position: "insideBottomRight",
                    offset: -10,
                  }}
                />
                <YAxis
                  label={{ value: "VNĐ", angle: -90, position: "insideLeft" }}
                />
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
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
