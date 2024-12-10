import banner from "@/styles/Banner.module.css"
import styles from "@/styles/Award.module.css"
import { useState, useEffect } from 'react';
import Head from "next/head";

export default function Achievment(){

    const [achievments, setAchievments] = useState([]);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const storageUrl = process.env.NEXT_PUBLIC_API_STORAGE_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${baseUrl}/achievment`);
                const data = await response.json();
                if (data && data.data) { // Pastikan data dan data.data ada
                setAchievments(data.data); // Setel data objek banner
                } else {
                console.error('Invalid response data format:', data);
                }
            } catch (error) {
                console.error('Error fetching banners:', error);
            }
        };
 
        fetchData();
    }, []);


    const [isOpen, setIsOpen] = useState(false);
    const [popupImage, setPopupImage] = useState("");

    const handleImageClick = (src) => {
        setPopupImage(src);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    return(
        <>
            <Head>
                <title>Achievment | NMW Aesthetic Clinic</title>
                <meta name="description" content="Lihat daftar penghargaan yang telah diraih oleh NMW Aesthetic Clinic sebagai bukti komitmen kami dalam memberikan layanan kesehatan terbaik dan profesional." />
                <meta property="og:title" content="Achievment NMW Aesthetic Clinic" />
                <meta property="og:description" content="NMW Aesthetic Clinic dengan bangga mempersembahkan penghargaan yang telah kami terima atas dedikasi dan kualitas layanan kami di dunia medis." />
                <meta property="og:type" content="Achievment Website"/>
                <meta name="twitter:title" content="Achievment NMW Aesthetic Clinic" />
                <meta name="twitter:description" content="Lihat daftar penghargaan yang telah diraih oleh NMW Aesthetic Clinic sebagai bukti komitmen kami dalam memberikan layanan kesehatan terbaik dan profesional." />
                <meta property="og:url" content="{{ url()->current() }}" />
                <meta property="og:image" content="{{ asset('images/banner_award.png') }}" />
            </Head>
            <div className={banner.banner}>
                <img src="images/banner_award.png" alt="Layanan Nmw Aesthetic Clinic"/>
            </div>
            <div className={styles.container}>
                <div className={`${styles.heading_section}`}>
                    <h1><font>Penghargaan</font> Kami</h1>
                </div>
                <div className={styles.cabang_layout}>
                    {achievments.map(achievment => (
                    <div className={styles.cabang_box} key={achievment.id}>
                        <div 
                            className={styles.cabang_box_image} 
                            onClick={() => handleImageClick(`${storageUrl}/${achievment.image}`)}
                            >
                            <img src={`${storageUrl}/${achievment.image}`} alt={achievment.heading} />
                        </div>
                        <div className={styles.cabang_box_content}>
                            <h1>{achievment.heading}</h1>
                            <div className={styles.cabang_box_text}>
                            <div 
                                dangerouslySetInnerHTML={{ __html: achievment.description }} 
                                />
                            </div>
                        </div>
                    </div>
                    ))}

                    {/* Modal Popup */}
                    {isOpen && (
                        <div className={styles.modal}>
                            <div className={styles.overlay_modal} onClick={closeModal}></div>
                            <div className={styles.modal_content}>
                                <span className={styles.close} onClick={closeModal}>&times;</span>
                                <img src={popupImage} alt="Popup Image" className={styles.popup_image} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}