import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import banner from "@/styles/Banner.module.css";
import styles from "@/styles/Layanan.module.css";
import Link from 'next/link';
import loadingStyles from "@/styles/Loading.module.css";
import { FaWhatsapp } from "react-icons/fa";
import Head from 'next/head';

export default function JenisLayanan() {
    const router = useRouter();
    const { name, slug } = router.query;
    const [serviceDetail, setServiceDetail] = useState(null);
    const [serviceDetailList, setServiceDetailList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const storageUrl = process.env.NEXT_PUBLIC_API_STORAGE_URL;
    
    
    useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await fetch(`${baseUrl}/setting`);
              const data = await response.json();
              console.log('Fetched data:', data);  // Log the entire response

              if (data && data.social_media) {
                  setSettings(data); // Set the entire response object to settings
              } else {
                  console.error('No social_media data found:', data);
              }
          } catch (error) {
              console.error('Error fetching settings:', error);
          }
      };

      fetchData();
    }, []);

    useEffect(() => { 
        if (slug) {
            // Fetching service detail
            const fetchServiceDetail = async () => {
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
                        if (data.data.sensitive_content === 1) {
                            setShowPopup(true);  // Show the popup if sensitive_content is 0
                        }
                    } else {
                        console.error("Data format is incorrect:", data);
                    }
                } catch (error) {
                    console.error('Error fetching service detail:', error);
                }
            };
        
            const fetchServiceDetailList = async (serviceId) => {
                try {
                    const response = await fetch(`${baseUrl}/sub_service_list/${serviceId}`);
                    if (!response.ok) {
                        throw new Error(`API error: ${response.status} ${response.statusText}`);
                    }
                    const data = await response.json();
                    if (data.data) {
                        setServiceDetailList(data.data);
                    } else {
                        console.error("Data format is incorrect:", data);
                    }
                } catch (error) {
                    console.error('Error fetching service detail list:', error);
                } finally {
                    setLoading(false); // Set loading false after both API calls are done
                }
            };
        
            // Call the function to fetch the service detail data
            fetchServiceDetail();
            fetchServiceDetailList();
        } else {
            setLoading(false); // If service is not found, set loading to false
        }
    }, [slug, baseUrl]);
      

    const formattedPhone = settings.phone && settings.phone.startsWith('0')
    ? '62' + settings.phone.slice(1)  // Replace the first 0 with 62
    : settings.phone;

    // Handle closing the modal
    const closeModal = () => {
        setShowPopup(false);  // Close the modal
    };

    // Handle the "back" action if user is under 18
    const handleBack = () => {
        router.back();
    };

    if (loading) {
        return (
            <div className={loadingStyles.box}>
                <div className={loadingStyles.content}>
                    <img src="../../images/logo.svg" alt="Loading" />
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
                <meta property="og:title" content={serviceDetail.title}/>
                <meta property="og:description" content={serviceDetail.description} />
                <meta property="og:type" content="Layanan"/>
                <meta name="twitter:title" content={serviceDetail.title}/>
                <meta name="twitter:description" content={serviceDetail.description} />
            </Head>
            <div className={banner.banner}>
                <img
                    src={`${storageUrl}/${serviceDetail.image}`}
                    alt={serviceDetail.name}
                />
            </div>

            <div className={`${styles.section_1} ${styles.section_1_sc}`}>
                <div className={styles.section_1_heading}>
                    <h1 >
                        {serviceDetail.title.split(' ')[0]}{" "}
                        <font>{serviceDetail.title.split(' ').slice(1).join(' ')}</font>
                    </h1>
                </div>
                <div className={styles.section_1_content}>
                    <div
                        className={styles.service_description}
                        dangerouslySetInnerHTML={{
                            __html: serviceDetail.description || "Deskripsi tidak tersedia.",
                        }}
                    />
                    <Link href={`https://api.whatsapp.com/send?phone=${formattedPhone}`} target='blank_' ><button className={styles.btn_layanan}>Buat Janji Temu Sekarang <FaWhatsapp/></button></Link>
                </div>
            </div>

            {showPopup && (
                <div className={`${styles.modal} ${showPopup ? styles.active : ""}`}>
                    <div className={styles.overlay_modal}></div>
                    <div className={styles.modal_content}>
                        <h1>Verifikasi Usia</h1>
                        <p>
                            Situs web ini berisi materi yang dibatasi usia yang mengandung unsur dewasa. 
                            Dengan ini Anda menyatakan bahwa Anda setidaknya berusia 18 tahun atau lebih, 
                            untuk mengakses situs web dan Anda setuju untuk melihat konten ini.
                        </p>
                        <div className={styles.button_layout}>
                            <button onClick={closeModal}>Saya sudah diatas 18 Tahun</button>
                            <button onClick={handleBack}>Saya masih dibawah 18 Tahun</button>
                        </div>
                        <p>ⓒ PT.HUB 2024</p>
                    </div>
                </div>
            )}

            {serviceDetailList.length > 0 && (
                <div className={styles.section_3}> 
                    <div className={`${styles.box_service_layout} ${styles.box_service_layout_sc}`}>
                        {
                            serviceDetailList.map((serviceDetailListing) => (
                                <div className={styles.box_service} key={serviceDetailListing.id}>
                                    <div className={styles.box_service_content}>
                                        <h1>{serviceDetailListing.title}</h1>
                                        <p>{serviceDetailListing.description}</p>
                                    </div>
                                    <div className={styles.box_service_btn}>
                                        <Link href={`/layanan/${name}/${slug}/${serviceDetailListing.slug}`}><button>Lihat Gambar</button></Link>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}


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
                        src="../../images/dokter_layanan.png"
                        alt="Dokter-dokter NMW Aesthetic Clinic"
                        className={styles.our_dokter}
                    />
                    <img
                        src="../../images/nmw_bg.png"
                        alt="Background Dokter"
                        className={styles.bg_our_dokter}
                    />
                    <div className={styles.section_4_content}>
                        <p>
                            Dokter NMW Aesthetic Clinic adalah dokter terpilih, terlatih secara profesional,
                            dan terpercaya untuk melakukan bedah plastik, dermatologi, spesialis
                            kulit dan kelamin, serta perawatan kulit estetik.
                        </p>
                        <p>
                            Dokter kami telah menjalani pelatihan ekstensif dan memiliki keahlian
                            untuk memberikan hasil luar biasa sekaligus memastikan keselamatan
                            pasien.
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
