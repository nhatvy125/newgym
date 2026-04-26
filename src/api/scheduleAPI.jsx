import classApi from "./classAPI";
import { useState, useEffect } from "react";

const Schedule = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await classApi.getAll();
        setClasses(response.data); // Giả sử BE trả về data trong field data
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      }
    };
    fetchClasses();
  }, []);

  return (
    <div>
      {/* Map qua biến classes để render ra giao diện lịch học */}
      {classes.map((item) => (
        <div key={item.id}>{item.className}</div>
      ))}
    </div>
  )
};