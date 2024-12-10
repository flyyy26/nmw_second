import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import banner from "@/styles/Banner.module.css";
import styles from "@/styles/Layanan.module.css";
import Link from 'next/link';
import { FaWhatsapp } from "react-icons/fa";
import loadingStyles from "@/styles/Loading.module.css";
import not from "@/styles/Not.module.css";
import Head from 'next/head';

export default function Layanan() {
    const router = useRouter();
    const { name, } = router.query;
    const [serviceDetail, setServiceDetail] = useState(null);
    const [services, setServices] = useState([]);
    const [galeriPatients, setGaleriPatients] = useState([]);
    const [typeServices, setTypeServices] = useState([]);
    const [subServices, setSubServices] = useState([]);
    const [subTwoServices, setSubTwoServices] = useState([]);
    const [loading, setLoading] = useState(true); // Tambahkan state loading
    const [showPopup, setShowPopup] = useState(false);

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const storageUrl = process.env.NEXT_PUBLIC_API_STORAGE_URL;

    // Fetch data layanan lainnya
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch(`${baseUrl}/service`);
                const data = await response.json();
                if (data && data.data) {
                    setServices(data.data); // Simpan layanan di state services
                }
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        fetchServices();
    }, [baseUrl]);

    // Fetch detail layanan berdasarkan nama
    useEffect(() => {
        if (name && services.length > 0) {
            const matchedService = services.find(service =>
                service.name.replace(/\s+/g, '-').toLowerCase() === name
            );

            if (matchedService) {
                // Fetching service detail
                const fetchServiceDetail = async () => {
                    try {
                        const response = await fetch(`${baseUrl}/service_detail/${matchedService.id}`);
                        if (!response.ok) {
                            throw new Error(`API error: ${response.status} ${response.statusText}`);
                        }
                        const data = await response.json();
                        if (data && data.data) {
                            setServiceDetail(data.data);
                        } else {
                            console.error('Data format is incorrect:', data);
                        }
                    } catch (error) {
                        console.error('Error fetching service detail:', error);
                    }
                };

                console.log("matched : " + matchedService.id)

                // Fetching related services
                const fetchTypeServices = async () => {
                    try {
                        const response = await fetch(`${baseUrl}/service_one?id=${matchedService.id}`);
                        if (!response.ok) {
                            throw new Error(`API error: ${response.status} ${response.statusText}`);
                        }
                        const data = await response.json();
                        if (data && data.data) {
                            setTypeServices({
                                template: data.template || "1", // Default template
                                services: data.data,          // Related services
                            });
                        } else {
                            console.error('Data format is incorrect:', data);
                        }
                    } catch (error) {
                        console.error('Error fetching related services:', error);
                    }
                };

                                         

                // Fetching Related Services
                const fetchSubService = async () => {
                    try {
                        const response = await fetch(`${baseUrl}/sub_service_list/${matchedService.id}`);
                        if (!response.ok) {
                            throw new Error(`API error: ${response.status} ${response.statusText}`);
                        }
                        const data = await response.json();
                        if (data?.data) {
                            setSubServices(data.data);
                        } else {
                            console.error('Data format is incorrect:', data);
                        }
                    } catch (error) {
                        console.error('Error fetching related services:', error);
                    }
                };

                // Fetching Patient Gallery
                const fetchGaleriPasien = async () => {
                    try {
                        const response = await fetch(`${baseUrl}/patient_galeri?id=${matchedService.id}`);
                        if (!response.ok) {
                            throw new Error(`API error: ${response.status} ${response.statusText}`);
                        }
                        const data = await response.json();
                        if (data?.data) {
                            setGaleriPatients(data.data);
                        } else {
                            console.error('Data format is incorrect:', data);
                        }
                    } catch (error) {
                        console.error('Error fetching patient gallery:', error);
                    }
                };


                // Run all the fetch functions sequentially
                const fetchAllData = async () => { 
                    await fetchServiceDetail();
                    await fetchTypeServices();
                    await fetchGaleriPasien();
                    await fetchSubService();
                    
                    setLoading(false); // All data fetched, stop loading
                };

                fetchAllData();
            } else {
                setLoading(false); // If service is not found
            }
        }
    }, [name, services, baseUrl]);

        useEffect(() => {
            const fetchSubTwoService = async () => {
                try {
                    const response = await fetch(`${baseUrl}/service_two_id/`);
                    const data = await response.json();
                    if (data && data.data) {
                        setSubTwoServices(data.data);
                    }
                } catch (error) {
                    console.error('Error fetching services or details:', error);
                }
            };
        
            fetchSubTwoService();
          }, [baseUrl]);

    if (loading) {
        return (
            <>
                <div className={loadingStyles.box}>
                    <div className={loadingStyles.content}>
                        <img src="../images/logo.svg"/>
                        <span>Loading</span>
                    </div>
                </div>
            </>
        );
    }

    if (!serviceDetail) {
        return <p>Layanan tidak ditemukan.</p>; // Pesan error jika layanan tidak ditemukan
    }

    return (
        <>
            <Head>
                <title>{serviceDetail.name} | NMW Aesthetic Clinic</title>
                <meta name="description" content={serviceDetail.description} />
                <meta property="og:title" content={serviceDetail.name} />
                <meta property="og:description" content={serviceDetail.description} />
                <meta property="og:type" content="Layanan" />
                <meta name="twitter:title" content={serviceDetail.name} />
                <meta name="twitter:description" content={serviceDetail.description} />
            </Head>
            <div className={banner.banner}>
                <img src={`${storageUrl}/${serviceDetail.image}`} alt={serviceDetail.name} />
            </div>
            <div className={styles.section_1}>
                <div className={styles.section_1_heading}>
                    <h1>
                        <font>{serviceDetail.name.split(' ')[0]} </font> 
                        {serviceDetail.name.split(' ').slice(1).join(' ')}
                    </h1>

                    <Link href={`https://api.whatsapp.com/send?phone=${serviceDetail.phone}`} target="blank_"><button className={styles.btn_layanan}>Buat Janji Temu Sekarang <FaWhatsapp/></button></Link>
                </div>
                <div className={styles.section_1_content}>
                    <div className={styles.service_description} dangerouslySetInnerHTML={{ __html: serviceDetail.description }} />
                </div>
            </div>

            {galeriPatients.length > 0 && (
                <div className={styles.section_2}>
                    <div className={styles.heading_section}>
                        <h1>
                            <font>Galeri</font> Bedah Plastik
                        </h1>
                    </div>
                    <div className={styles.box_galeri_layout}>
                    {galeriPatients.map((galeriPatient) => {
                            // Cari subService terkait menggunakan matchedService.id
                        const relatedSubService = subServices.find(
                            (service) => service.id
                        );

                        return (
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
                                        <h1>{relatedSubService?.title || "Judul Tidak Tersedia"}</h1>
                                        <h3>{galeriPatient.name || "Nama Tidak Tersedia"}</h3>
                                    </div>
                                    <div className={styles.box_galeri_text}>
                                        <p>{galeriPatient.description || "Deskripsi tidak tersedia"}</p>
                                    </div>
                                </div>

                                {/* Button Section */}
                                <div className={styles.box_galeri_button}>
                                    <Link href={`/layanan/plastic-surgery/${encodeURIComponent(subTwoServices.title.replace(/\s+/g, '-').toLowerCase())}/${encodeURIComponent(relatedSubService.title.replace(/\s+/g, '-').toLowerCase())}/${galeriPatient.id}`}>
                                        <button type="button">
                                            Lihat Gambar {galeriPatient.name || "Galeri"}
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                    </div>
                </div>
            )}


            {typeServices.services && typeServices.services.length > 0 && (
                <div className={styles.section_3}>
                    <div className={`${styles.heading_section}`}>
                        <h1>
                            <font>Jenis</font> Layanan
                        </h1>
                    </div>

                    {typeServices.template === "2" && (
                        <div className={styles.box_service_layout}>
                            {typeServices.services.map((typeService) => (
                                <div className={styles.box_service} key={typeService.id}>
                                    <div className={styles.box_service_image}>
                                        <img
                                            src={`${storageUrl}/${typeService.image2}`}
                                            alt={typeService.title}
                                        />
                                    </div>
                                    <div className={styles.box_service_content}>
                                        <h1>{typeService.title}</h1>
                                        <p
                                            className={styles.service_description}
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    typeService.description === "-"
                                                        ? "Klik lihat detail untuk mendapatkan informasi selengkapnya tentang layanan ini"
                                                        : typeService.description,
                                            }}
                                        />
                                    </div>
                                    <div className={styles.box_service_btn}>
                                        <Link href={`/layanan/${name}/${typeService.slug}`} >
                                            <button>Lihat Detail</button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {typeServices.template === "1" && (
                        <div className={styles.box_galeri_layout}>
                            {typeServices.services.map((typeService) => (
                                <Link href={`/layanan/${name}/${typeService.slug}`} key={typeService.id}>
                                    <div className={styles.box_galeri}>
                                        <div className={styles.box_galeri_image}>
                                            <div className={styles.box_galeri_overlay}></div>
                                            <img
                                                src={`${storageUrl}/${typeService.image}`}
                                                alt={typeService.title}
                                            />
                                            <div
                                                className={`${styles.button_image} ${styles.button_image_sc}`}
                                            >
                                                <button>{typeService.title}</button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}


            <div className={styles.section_4}>
                <div className={styles.heading_section_4}>
                <div className={`${styles.heading_section} ${styles.heading_section_start}`}>
                    <h1><font>Dokter</font> Kami</h1>
                </div>
                </div>
                <div className={styles.section_4_box}>
                    <img src="../images/dokter_layanan.png" alt="Dokter-dokter NMW Aesthetic Clinic" className={styles.our_dokter} />
                    <img src="../images/nmw_bg.png" alt="Dokter-dokter NMW Aesthetic Clinic" className={styles.bg_our_dokter} />
                    <div className={styles.section_4_content}>
                        <p>Dokter NMW Aesthetic Clinic adalah dokter terpilih, terlatih secara profesional, dan terpercaya untuk melakukanbedah plastik, dermatologi, spesialis kulit dan kelamin dan perawatan kulit ekstetika.</p>
                        <p>Dokter kami telah menjalani pelatihan ekstensif dan memiliki keahlian untuk memberikan hasil luar biasa sekaligus memastikan keselamatan pasien.</p>
                        <Link href={'/dokter-kami'}><button>Lihat Lebih Lanjut</button></Link>
                    </div>
                </div>
            </div>
        </>
    );
}
