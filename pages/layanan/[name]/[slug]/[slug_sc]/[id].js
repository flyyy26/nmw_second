import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import banner from "@/styles/Banner.module.css";
import styles from "@/styles/Layanan.module.css";
import Link from "next/link";
import loadingStyles from "@/styles/Loading.module.css";
import { FaWhatsapp } from "react-icons/fa";
import Head from "next/head";

export default function Patient() {
  const router = useRouter();
  const { slug_sc, id } = router.query;
  const [serviceDetail, setServiceDetail] = useState(null);
  const [patientDetail, setPatientDetail] = useState(null); // Changed to object
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({ phone: "" });

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
    const fetchDetails = async () => {
      try {
        setLoading(true);

        // Fetch service detail if slug_sc exists
        if (slug_sc) {
          const responseService = await fetch(`${baseUrl}/stos/${slug_sc}`);
          if (!responseService.ok) {
            throw new Error(`Error API: ${responseService.status} ${responseService.statusText}`);
          }
          const dataService = await responseService.json();
          if (dataService.data) {
            setServiceDetail(dataService.data); // Set service details
          } else {
            console.error("Data layanan tidak ditemukan:", dataService);
          }
        }

        // Fetch patient details if id exists
        if (id) {
          const responsePatient = await fetch(`${baseUrl}/detail_patient/${id}`);
          if (!responsePatient.ok) {
            throw new Error(`API error: ${responsePatient.status} ${responsePatient.statusText}`);
          }
          const dataPatient = await responsePatient.json();
          if (dataPatient && dataPatient.data) {
            setPatientDetail(dataPatient.data); // Set patient details
            console.log("Pasien: ", dataPatient.data); // Display patient data in console
          } else {
            console.error("Data pasien tidak ditemukan:", dataPatient);
          }
        }
      } catch (error) {
        console.error('Error saat mengambil data:', error);
      } finally {
        setLoading(false); // Ensure loading is set to false after fetch
      }
    };

    fetchDetails(); // Call the function to fetch data
  }, [slug_sc, id, baseUrl]);

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
            <title>{patientDetail.name} | NMW Aesthetic Clinic</title>
            <meta name="description" content={patientDetail.description} />
            <meta property="og:title" content={patientDetail.name} />
            <meta property="og:description" content={patientDetail.description} />
            <meta property="og:type" content="Layanan"/>
            <meta name="twitter:title" content={patientDetail.name} />
            <meta name="twitter:description" content={patientDetail.description} />
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
             {patientDetail.name.split(" ")[0]}{" "}
            <font>{patientDetail.name.split(" ").slice(1).join(" ")}</font>
          </h1>
        </div>
        <div className={styles.section_1_content}>
          <div
            className={styles.service_description}
            dangerouslySetInnerHTML={{
              __html: patientDetail.description || "Deskripsi tidak tersedia.",
            }}
          />
          <p>Hasil individu bervariasi <br/> <br/>
          Dibawah ini adalah gambar sebelum dan sesudah pasien yang melalukan tindakan operasi Blepharoplasty di NMW Bedah Plastik. Harap diperhatikan bahwa setiap hasil pasien sebelum dan sesudah berbeda. Silahkan hubungi Customer Service kami apabila ingin bertanya lebih lanjut.</p>
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

      {/* Section 2 - Pasien */}
      <div className={`${styles.section_2} ${styles.section_2_sc} ${styles.section_2_patient}`}>
        <div className={styles.patient_galeri_layout}>
          {/* Map over the patient data */}
          {patientDetail ? (
            <>
            <div className={styles.box_galeri} key={patientDetail.id}>
              {/* Gambar Pasien */}
              <div className={styles.box_galeri_image}>
                <img
                  src={`${storageUrl}/${patientDetail.image}`}
                  alt={patientDetail.name || "Galeri Image"}
                  loading="lazy"
                />
                <div className={styles.button_image}>
                  <button type="button">Sebelum</button>
                  <button type="button">Sesudah</button>
                </div>
              </div>
            </div>
            <div className={styles.box_galeri} key={patientDetail.id}>
              {/* Gambar Pasien */}
              <div className={styles.box_galeri_image}>
                <img
                  src={`${storageUrl}/${patientDetail.image2}`}
                  alt={patientDetail.name || "Galeri Image"}
                  loading="lazy"
                />
                <div className={styles.button_image}>
                  <button type="button">Sebelum</button>
                  <button type="button">Sesudah</button>
                </div>
              </div>
            </div>
            </>
          ) : (
            <p>Data pasien tidak tersedia.</p>
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
