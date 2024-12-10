import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import banner from "@/styles/Banner.module.css";
import styles from "@/styles/Layanan.module.css";
import Link from "next/link";
import loadingStyles from "@/styles/Loading.module.css";
import { FaWhatsapp } from "react-icons/fa";
import Head from "next/head";

export default function SubJenisLayanan() {
  const router = useRouter();
  const { name, slug, slug_sc } = router.query;
  const [serviceDetail, setServiceDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({ phone: "" });
  const [serviceDetailList, setServiceDetailList] = useState([]);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const storageUrl = process.env.NEXT_PUBLIC_API_STORAGE_URL;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${baseUrl}/setting`);
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        const data = await response.json();
        setSettings(data || { phone: "" });
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, [baseUrl]);

  useEffect(() => {
      if (slug_sc) {
          // Fetching service detail
          const fetchServiceDetail = async () => {
              try {
                  const response = await fetch(`${baseUrl}/stos/${slug_sc}`);
                  if (!response.ok) {
                      throw new Error(`API error: ${response.status} ${response.statusText}`);
                  }
                  const data = await response.json();
                  if (data.data) {
                      setServiceDetail(data.data);
                  } else {
                      console.error("Data format is incorrect:", data);
                  }
              } catch (error) {
                  console.error('Error fetching service detail:', error);
              }
          };

          if (slug) {

            const fetchServiceDetailSub = async () => {
                try {
                    const response = await fetch(`${baseUrl}/service_two/${slug}`);
                    if (!response.ok) {
                        throw new Error(`API error: ${response.status} ${response.statusText}`);
                    }
                    const data = await response.json();
                    if (data.data) {
                        setServiceDetail(data.data);
                        const serviceId = data.data.id; // Ambil id dari response
                        fetchServiceDetailList(serviceId); // Panggil fetchServiceDetailList dengan id
                    } else {
                        console.error("Data format is incorrect:", data);
                    }
                } catch (error) {
                    console.error('Error fetching service detail:', error);
                }
            };

            const fetchServiceDetailList = async (serviceId) => {
                try {
                    const response = await fetch(`${baseUrl}/patient/${serviceId}`);
                    if (!response.ok) {
                        throw new Error(`API error: ${response.status} ${response.statusText}`);
                    }
                    const data = await response.json();
                    if (data.data) {
                        setServiceDetailList(data.data);
                        console.log("Fetched patient data: ", data.data);
                    } else {
                        console.error("Data format is incorrect:", data);
                    }
                } catch (error) {
                    console.error('Error fetching service detail list:', error);
                } finally {
                    setLoading(false); // Set loading false after both API calls are done
                }
            };
            fetchServiceDetailSub();
          }

          // Call the function to fetch the service detail data
          fetchServiceDetail();
          
      } else {
          setLoading(false); // If service is not found, set loading to false
      }
  }, [slug_sc, baseUrl]);

  const formattedPhone = settings.phone?.startsWith("0")
    ? "62" + settings.phone.slice(1)
    : settings.phone;

  if (loading) {
    return (
      <div className={loadingStyles.box}>
        <div className={loadingStyles.content}>
          <img src="/images/logo.svg" alt="Loading logo" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!serviceDetail) {
    return (
      <div className={styles.section_error}>
        <p>Layanan tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <>
        <Head>
            <title>{serviceDetail.title} | NMW Aesthetic Clinic</title>
            <meta name="description" content={serviceDetail.description} />
            <meta property="og:title" content={serviceDetail.title} />
            <meta property="og:description" content={serviceDetail.description} />
            <meta property="og:type" content="Layanan"/>
            <meta name="twitter:title" content={serviceDetail.title} />
            <meta name="twitter:description" content={serviceDetail.description} />
        </Head>
      {/* Banner */}
      <div className={banner.banner}>
        <img
          src={`${storageUrl}/${serviceDetail.image}`}
          alt={serviceDetail.name || "Banner image"}
        />
      </div>

      {/* Section 1 */}
      <div className={`${styles.section_1} ${styles.section_1_sc}`}>
        <div className={styles.section_1_heading}>
          <h1>
            {serviceDetail.title.split(" ")[0]}{" "}
            <font>{serviceDetail.title.split(" ").slice(1).join(" ")}</font>
          </h1>
        </div>
        <div className={styles.section_1_content}>
          <div
            className={styles.service_description}
            dangerouslySetInnerHTML={{
              __html: serviceDetail.description || "Deskripsi tidak tersedia.",
            }}
          />
          <Link
            href={`https://api.whatsapp.com/send?phone=${formattedPhone}`}
            target="_blank"
          >
            <button className={styles.btn_layanan}>
              Buat Janji Temu Sekarang <FaWhatsapp />
            </button>
          </Link>
        </div>
      </div>

      
      <div className={`${styles.section_2} ${styles.section_2_sc}`}> 
          <div className={`${styles.heading_section}`}> 
              <h1>Pasien {serviceDetail.title.split(" ")[0]}{" "}
              <font>{serviceDetail.title.split(" ").slice(1).join(" ")}</font></h1>
          </div>
          <div className={styles.box_galeri_layout}>
          {serviceDetailList.length > 0 ? (
              serviceDetailList.map((galeriPatient) => (
                  <div className={styles.box_galeri} key={galeriPatient.id}>
                      {/* Image Section */}
                      <div className={styles.box_galeri_image}>
                          <img
                              src={`${storageUrl}/${galeriPatient.image}`}
                              alt={galeriPatient.name || "Galeri Image"}
                              loading="lazy"
                          />
                          <div className={styles.button_image}>
                              <button type="button">Sebelum</button>
                              <button type="button">Sesudah</button>
                          </div>
                      </div>

                      {/* Content Section */}
                      <div className={styles.box_galeri_content}>
                          <div className={styles.box_galeri_heading}>
                              <h3>{galeriPatient.name || "Nama Tidak Tersedia"}</h3>
                          </div>
                          <div className={styles.box_galeri_text}>
                              <p>{galeriPatient.description || "Deskripsi tidak tersedia"}</p>
                          </div>
                      </div>

                      {/* Button Section */}
                      <div className={styles.box_galeri_button}>
                          <Link href={`/layanan/${name}/${slug}/${slug_sc}/${galeriPatient.id}`}>
                              <button type="button">
                                  Lihat Gambar {galeriPatient.name || "Galeri"}
                              </button>
                          </Link>
                      </div>
                  </div>
              ))
          ) : (
            <div className={styles.empty}>
                <img src="../../../images/data_empty.png"/>
                <h1>Gambar Segera Hadir</h1>
            </div>
            
          )}

          </div>
      </div>
      

      {/* Section 4 */}
      <div className={styles.section_4}>
        <div className={styles.heading_section_4}>
          <div
            className={`${styles.heading_section} ${styles.heading_section_start}`}
          >
            <h1>
              <font>Dokter </font>
              Kami
            </h1>
          </div>
        </div>
        <div className={styles.section_4_box}>
          <img
            src="/images/dokter_layanan.png"
            alt="Dokter-dokter NMW Aesthetic Clinic"
            className={styles.our_dokter}
          />
          <img
            src="/images/nmw_bg.png"
            alt="Background Dokter"
            className={styles.bg_our_dokter}
          />
          <div className={styles.section_4_content}>
            <p>
              Dokter NMW Aesthetic Clinic adalah dokter terpilih, terlatih secara
              profesional, dan terpercaya untuk melakukan bedah plastik,
              dermatologi, spesialis kulit dan kelamin, serta perawatan kulit
              estetik.
            </p>
            <p>
              Dokter kami telah menjalani pelatihan ekstensif dan memiliki
              keahlian untuk memberikan hasil luar biasa sekaligus memastikan
              keselamatan pasien.
            </p>
            <Link href="/dokter-kami">
              <button>Lihat Lebih Lanjut</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
