import styles from "@/styles/Cabang.module.css"
import banner from "@/styles/Banner.module.css"
import { FaWhatsapp } from "react-icons/fa";
import { SlLocationPin } from "react-icons/sl";
import Link from "next/link";
import loadingStyles from "@/styles/Loading.module.css";
import { useState, useEffect } from "react";
import Head from "next/head";

export default function Cabang(){
    const [branchs, setBranchs] = useState([]);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [loading, setLoading] = useState(true); // Tambahkan state loading

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${baseUrl}/branch`);
                const data = await response.json();
                if (data && data.data) { // Pastikan data dan data.data ada
                setBranchs(data.data); // Setel data objek banner
                } else {
                console.error('Invalid response data format:', data);
                }
            } catch (error) {
                console.error('Error fetching banners:', error);
            } finally {
                setLoading(false);
            }
        }; 
 
        fetchData();
    }, []);

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

    return(
        <>
            <Head>
                <title>Cabang | NMW Aesthetic Clinic</title>
                <meta name="description" content="Alamat Cabang & Kantor NMW Aesthetic Clinic" />
                <meta property="og:title" content="Cabang NMW Aesthetic Clinic" />
                <meta property="og:description" content="Alamat Cabang & Kantor NMW Aesthetic Clinic" />
                <meta property="og:type" content="Cabang NMW Aesthetic Clinic" />
                <meta name="twitter:title" content="Cabang NMW Aesthetic Clinic" />
                <meta name="twitter:description" content="Alamat Cabang & Kantor NMW Aesthetic Clinic" />
                <meta property="og:url" content="{{ url()->current() }}" />
                <meta property="og:image" content="{{ asset('images/cabang-banner.png') }}" />
            </Head>
            <div className={banner.banner}>
                <img src="images/cabang-banner.png" alt="Layanan Nmw Aesthetic Clinic"/>
            </div>
            <div className={styles.container}>
                <div className={`${styles.heading_section}`}>
                    <h1><font>Cabang</font> Kami</h1>
                </div>
                <div className={styles.cabang_layout}>
                    {branchs.map(branch => (
                        <div className={styles.cabang_box} key={branch.id}>
                            <div className={styles.cabang_box_image}>
                                <img src={branch.image} alt={branch.name}/>
                            </div>
                            <div className={styles.cabang_box_content}>
                                <h1>{branch.name}</h1>
                                <div className={styles.cabang_box_text}>
                                    <div className={styles.cabang_box_detail}>
                                        <h3>Alamat</h3>
                                        <p>{branch.address}</p>
                                    </div>
                                    <div className={styles.cabang_box_detail}>
                                        <h3>Operasional</h3>
                                        <p>{branch.operasional[0]}</p>
                                        <p>{branch.operasional[1]}</p>
                                        {/* <p>Sabtu - Minggu : 00.09-17.00</p> */}
                                    </div>
                                    <div className={styles.cabang_box_detail}>
                                        <h3>Telepon</h3>
                                        <p>{branch.phone}</p>
                                    </div>
                                </div>
                                <div className={styles.cabang_box_button}>
                                    <Link href={`https://api.whatsapp.com/send/?phone=${branch.phone}&text=Hallo+admin+NMW+${branch.name}%2C+saya+pasien+baru+ingin+mendaftarkan+dan+melakukan+pembelian+produk+di+E-Commerce+Web+NMW+Aesthetic+Clinic&type=phone_number&app_absent=0`} target="blank_"><button>Pesan Sekarang <FaWhatsapp/></button></Link>
                                    <Link href={branch.location} target="blank_"><button><SlLocationPin/></button></Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}