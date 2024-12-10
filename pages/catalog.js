import banner from "@/styles/Banner.module.css"
import styles from "@/styles/Catalog.module.css"
import Link from "next/link";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function Catalog(){
    const [catalogs, setCatalogs] = useState([]);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const storageUrl = process.env.NEXT_PUBLIC_API_STORAGE_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${baseUrl}/catalog`);
                const data = await response.json();
                if (data && data.data) { // Pastikan data dan data.data ada
                setCatalogs(data.data); // Setel data objek banner
                } else {
                console.error('Invalid response data format:', data);
                }
            } catch (error) {
                console.error('Error fetching banners:', error);
            }
        };
 
        fetchData();
    }, []);

    return(
        <>
            <Head>
                <title>Katalog | NMW Aesthetic Clinic</title>
                <meta name="description" content="Lihat dan download katalog NMW Aesthetic Clinic" />
                <meta property="og:title" content="Katalog" />
                <meta property="og:description" content="Lihat dan download katalog NMW Aesthetic Clinic" />
                <meta property="og:type" content="Katalog" />
                <meta name="twitter:title" content="Katalog" />
                <meta name="twitter:description" content="Lihat dan download katalog NMW Aesthetic Clinic" />
                <meta property="og:url" content="{{ url()->current() }}" />
                <meta property="og:image" content="{{ asset('images/catalogue-banner.png') }}" />
            </Head>
            <div className={banner.banner}>
                <img src="images/catalogue-banner.png" alt="Layanan Nmw Aesthetic Clinic"/>
            </div>
            <div className={styles.container}>
                <div className={`${styles.heading_section}`}>
                    <h1><font>Katalog</font> Harga</h1>
                </div>
                <div className={styles.box_galeri_layout}>
                    {catalogs.map(catalog => (
                        <div className={styles.box_galeri} key={catalog.id}>
                            <div className={styles.box_galeri_image}>
                                <img src={`${storageUrl}/${catalog.image}`} alt={catalog.title}/>
                            </div>
                            <div className={styles.box_galeri_content}>
                                <div className={styles.box_galeri_heading}>
                                    <h1>{catalog.title}</h1>
                                </div>
                                <div className={styles.box_galeri_text}>
                                    <p>Terakhir Diperbaharui</p>
                                    <p>{new Date(catalog.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>
                            <div className={styles.box_galeri_button}>
                                <Link href={`${storageUrl}/${catalog.document}`} target="blank_"><button>Unduh</button></Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.section_4}>
                <div className={styles.heading_section_4}>
                    <div className={`${styles.heading_section} ${styles.heading_section_start}`}>
                        <h1><font>Dokter </font>Kami</h1>
                    </div>
                </div>
                <div className={styles.section_4_box}>
                <img src="images/nmw_dokter.png" alt="Dokter-dokter NMW Aesthetic Clinic" className={styles.our_dokter} />
                <img src="images/blink_orange.svg" className={styles.section_icon_5} />
                <img src="images/blink_grey.svg" className={styles.section_icon_6} />
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