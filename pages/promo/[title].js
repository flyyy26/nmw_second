import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import banner from "@/styles/Banner.module.css";
import loadingStyles from "@/styles/Loading.module.css";
import styles from "@/styles/Promo.module.css";
import Link from 'next/link';
import { FaCalendar } from "react-icons/fa";

export default function DetailArtikel() {
    const router = useRouter();
    const { title } = router.query;
    const [promoDetail, setPromoDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [promos, setPromos] = useState([]);

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const storageUrl = process.env.NEXT_PUBLIC_API_STORAGE_URL;

    useEffect(() => {
        if (title && promos.length > 0) {
            const matchedArticle = promos.find(
                promo =>
                    promo.title &&
                    promo.title.replace(/\s+/g, '-').toLowerCase() === title
            );
    
            if (matchedArticle) {
                const fetchPromoDetail = async () => {
                    try {
                        const response = await fetch(`${baseUrl}/detail_promo/${matchedArticle.id}`);
                        if (!response.ok) {
                            throw new Error(`Failed to fetch promo detail: ${response.status}`);
                        }
    
                        const data = await response.json();
    
                        // Data langsung berupa objek promo
                        if (data) {
                            setPromoDetail(data);
                            console.log("Promo Detail:", data); // Debugging
                        } else {
                            console.error("Unexpected response structure:", data);
                        }
                    } catch (error) {
                        console.error('Error fetching promo detail:', error);
                    } finally {
                        setLoading(false);
                    }
                };
    
                fetchPromoDetail();
            } else {
                console.warn('Promo not found for the given title:', title);
                setLoading(false); // Jika promo tidak ditemukan
            }
        }
    }, [title, promos, baseUrl]);
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${baseUrl}/promo`);
                const data = await response.json();

                if (data?.data) {
                    setPromos(data.data);
                    console.log("Data Promo:", data.data);
                } else {
                    console.error('Invalid response data format:', data);
                }
            } catch (error) {
                console.error('Error fetching promos:', error);
            }
        };

        fetchData();
    }, [baseUrl]);

    if (loading) {
        return (
            <div className={loadingStyles.box}>
                <div className={loadingStyles.content}>
                    <img src="../images/logo.svg" alt="Loading logo" />
                    <span>Loading...</span>
                </div>
            </div>
        );
    }

    if (!promoDetail) {
        return (
            <div className={banner.banner}>
                <h2>Promo not found</h2>
            </div>
        );
    }

    function formatDateWithTextMonth(dateString) {
        // Jika dateString kosong atau null, kembalikan string kosong
        if (!dateString) {
            return '';
        }
    
        const months = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
    
        const [year, month, day] = dateString.split('-');
        const monthName = months[parseInt(month, 10) - 1];
        return `${day} ${monthName} ${year}`;
    }
    
     

    return (
        <>
            <div className={banner.banner}>
                <img src={`${storageUrl}/${promoDetail.image}`} alt={promoDetail.title} />
                <h1>{promoDetail.title}</h1>
            </div>
            <div className={styles.section_1}>
                <div className={styles.section_1_heading}>
                    <h1>
                        <font>{promoDetail.title.split(' ')[0]} </font> 
                        {promoDetail.title.split(' ').slice(1).join(' ')}
                    </h1>
                    {(promoDetail.start_date && promoDetail.end_date) && (
                        <div className={styles.date}>
                            <FaCalendar />
                            <p>
                                {formatDateWithTextMonth(promoDetail.start_date)} - {formatDateWithTextMonth(promoDetail.end_date)}
                            </p>
                        </div>
                    )}
                </div>
                <div className={styles.section_1_content}>
                    <div className={styles.section_1_content_heading}>
                        <h3>Syarat & Ketentuan</h3>
                    </div>
                    <div className={styles.service_description} dangerouslySetInnerHTML={{ __html: promoDetail.sk }} />
                </div>
            </div>
        </>
        
    );
}
