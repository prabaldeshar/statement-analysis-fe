"use client"

import { ChartPie } from "../../components/chart-pie";
import { ChartArea } from "../../components/chart-area";
import { ChartBar } from "../../components/chart-bar";

import { useEffect, useState } from "react";
import { ChartLine } from "../../components/chart-line";

export default function Home() {
  const [categoryBarChartData, setCategoryBarChartData] = useState([]);
  const [paymentMethodBarChartData, setPaymentMethodBarChartData] = useState([]);
  const [expensesLineChartData, setExpensesLineChartData] = useState([]);

  const chartData = [
    { date: "January", amount: 186 },
    { date: "February", amount: 305 },
    { date: "March", amount: 237 },
    { date: "April", amount: 73 },
    { date: "May", amount: 209 },
    { date: "June", amount: 214 },
  ]

  useEffect(() => {
    fetch("http://localhost:8000/expenses/category/")
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error: Status ${response.status}`)
        }
        return response.json()
      })
      .then(data => {
        console.log("Fetched data: ", data);
        setCategoryBarChartData(data);
      })
      .catch(error => console.log("Error fetching expenses:", error));
  }, [])

  useEffect(() => {
    fetch("http://localhost:8000/expenses/payment-method/")
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error: Status ${response.status}`)
        }
        return response.json()
      })
      .then(data => {
        console.log("Fetched Payment method data: ", data);
        setPaymentMethodBarChartData(data);
      })
      .catch(error => console.log("Error fetching expenses:", error));
  }, [])

  useEffect(() => {
    fetch("http://localhost:8000/expenses/")
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error: Status ${response.status}`)
        }
        return response.json()
      })
      .then(data => {
        console.log("Fetched Payment method data: ", data);
        setExpensesLineChartData(data);
      })
      .catch(error => console.log("Error fetching expenses:", error));
  }, [])

  console.log(`category data ${categoryBarChartData}`)
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        <ChartBar chartData={categoryBarChartData} title="Bar Chart - Category" dataKey="category"/>
        <ChartBar chartData={paymentMethodBarChartData} title="Bar Chart - Payment Method" dataKey="payment_method"/>
        <ChartLine chartData={expensesLineChartData} XAxisDataKey="date" LineDataKey="amount"/>
        <ChartArea />
      </div>
    </div>
  );
}
