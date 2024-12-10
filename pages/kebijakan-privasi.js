import banner from "@/styles/Banner.module.css";
import styles from "@/styles/Kebijakan.module.css";
import { useState, useEffect } from "react";

export default function KebijakanPrivasi() {
  const [kebijakans, setKebijakans] = useState([]); // Default sebagai array
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/kebijakan`);
        const data = await response.json();
        if (Array.isArray(data)) { // Pastikan data adalah array
          setKebijakans(data); // Setel data array kebijakan
        } else {
          console.error("Invalid response data format:", data);
        }
      } catch (error) {
        console.error("Error fetching kebijakan:", error);
      }
    };

    fetchData();
  }, [baseUrl]);

  return (
    <>
      <div className={banner.banner}>
        <img
          src="/images/kebijakan-privasi.png"
          alt="Kebijakan Privasi NMW Aesthetic Clinic"
        />
      </div>
      <div className={styles.container}>
        <div className={`${styles.heading_section}`}>
          <h1>
            <font>Kebijakan</font> Privasi
          </h1>
        </div>
        <div className={styles.kebijakan_layout}>
          {kebijakans.map((item, index) => (
            <div
              key={index}
              dangerouslySetInnerHTML={{ __html: item.kebijakan }} // Render HTML dari API
            />
          ))}
        </div>
      </div>
    </>
  );
}
