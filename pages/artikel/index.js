import { useState } from 'react';
import styles from "@/styles/Article.module.css"
import banner from "@/styles/Banner.module.css"
import Link from 'next/link';
import { HiArrowLongRight } from "react-icons/hi2";
import { useEffect } from 'react';
import Head from 'next/head';
import loadingStyles from "@/styles/Loading.module.css";

export default function Artikel() {
    const [articles, setArticles] = useState([]);
    const [articlesAll, setArticlesAll] = useState([]);
    const [tags, setTags] = useState([]);
    const [currentPage, setCurrentPage] = useState(2); // Menyimpan halaman yang aktif
    const [totalPages, setTotalPages] = useState(1); 
    const [loading, setLoading] = useState(true); // Tambahkan state loading
    
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${baseUrl}/article-new`);
                const data = await response.json();
                if (data && data.data) { // Pastikan data dan data.data ada
                    // Ambil artikel dari data.data
                    const articles = data.data;
    
                    // Urutkan artikel berdasarkan 'date' dan 'created_at' yang paling baru
                    const sortedArticles = articles.sort((a, b) => {
                        const dateA = new Date(a.date);
                        const dateB = new Date(b.date);
                        const createdAtA = new Date(a.created_at);
                        const createdAtB = new Date(b.created_at);
    
                        // Urutkan berdasarkan 'date' jika ada, jika tidak, urutkan berdasarkan 'created_at'
                        return (dateB - dateA) || (createdAtB - createdAtA);
                    });
    
                    // Ambil 3 artikel pertama setelah diurutkan
                    setArticles(sortedArticles.slice(0, 3));
                } else {
                    console.error('Invalid response data format:', data);
                }
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);    
    
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`${baseUrl}/article?page=${currentPage}`);
            const data = await response.json();
            if (data) {
              setArticlesAll(data.data); // Simpan artikel yang didapat
              setTotalPages(data.meta.last_page); // Simpan total halaman
            } else {
              console.error('Invalid response data format:', data);
            }
          } catch (error) {
            console.error('Error fetching articles:', error);
          }
        };
    
        fetchData();
      }, [currentPage]); // Fetch ulang saat currentPage berubah

      useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${baseUrl}/get-tag`);
                const data = await response.json();
                setTags(data); // Langsung mengatur data JSON yang diterima
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchData();
      }, []);
    
      // Fungsi untuk menangani klik halaman berikutnya
        const handleNextPage = () => {
            if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            }
        };

        // Fungsi untuk menangani klik halaman sebelumnya
        const handlePrevPage = () => {
            if (currentPage > 2) {
            setCurrentPage(currentPage - 1); // Mulai dari halaman 2
            }
        };

        // Fungsi untuk menangani klik halaman tertentu
        const handlePageClick = (page) => {
            setCurrentPage(page + 1); // Map angka halaman mulai dari 1 ke halaman asli
        };

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
    

  return (
    <>
    <Head>
        <title>Artikel | NMW Aesthetic Clinic</title>
        <meta name="description" content="Artikel NMW Aesthetic Clinic" />
        <meta property="og:title" content="Artikel" />
        <meta property="og:description" content="Artikel NMW Aesthetic Clinic" />
        <meta property="og:type" content="article" />
        <meta name="twitter:title" content="Artikel" />
        <meta name="twitter:description" content="Artikel NMW Aesthetic Clinic" />
    </Head>
    <div className={banner.banner}>
        <img src="images/slimming-treatment.png" alt="Layanan Nmw Aesthetic Clinic"/>
    </div>
    <div className={styles.container}>
        <div className={styles.tabsContainer}>
            <div className={styles.tabContent_container}>
                <div className={`${styles.heading_section} ${styles.heading_section_start}`}>
                    <h1><font>Artikel</font> Terbaru</h1>
                </div>
                <div className={styles.heading_sidebar}>
                    <h1>Tag Artikel</h1>
                </div>
            </div>
            <div className={styles.tabContent}>
                <div className={styles.tabcontent_layout}>
                    <div className={styles.tabcontent_section}>
                    {articles.map((article) => {
                        const tagsList = article.tags ? article.tags.split(',') : [];

                        return (
                            <div className={styles.tabcontent_box} key={article.id}>
                                <div className={styles.tabcontent_box_img}>
                                    <Link href={`/artikel/${encodeURIComponent(article.title.replace(/\s+/g, '-').toLowerCase())}`}>
                                        <img src={article.image} alt={article.title} />
                                    </Link>
                                    {tagsList.length > 0 && (
                                        <Link href={`/artikel/tag/${tagsList[0].trim()}`}>
                                            <button className={styles.tag_article_img}>#{tagsList[0].trim()}</button>
                                        </Link>
                                    )}
                                </div>
                                <div className={styles.tabcontent_box_text}>
                                    <Link href={`/artikel/${encodeURIComponent(article.title.replace(/\s+/g, '-').toLowerCase())}`}>
                                        <h1>{article.title}</h1>
                                    </Link>
                                    <span>Admin, {article.date}</span>
                                    <div className={styles.description} dangerouslySetInnerHTML={{ __html: article.description }} />
                                    <Link href={`/artikel/${encodeURIComponent(article.title.replace(/\s+/g, '-').toLowerCase())}`}>
                                        <button>Baca Selengkapnya</button>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}

                    </div>
                    <div className={styles.article_sidebar_layout}>
                        <h3 className={styles.heading_sidebar_mobile}>Tag Artikel</h3>
                        <div className={styles.article_sidebar_button}>
                        {tags.length > 0 ? (
                            tags.map((tag, index) => {
                                // Buat URL dengan format artikel/[tag]
                                const tagUrl = `/artikel/tag/${tag.trim()}`;
                                return (
                                    <Link href={tagUrl} key={index}>
                                        <button>{tag.trim()}</button>
                                    </Link>
                                );
                            })
                        ) : (
                            <p>No tags available</p>
                        )}
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    </div>
    <div className={styles.article_section}>
        <div className={`${styles.heading_section} ${styles.heading_section_start}`}>
            <h1><font>Artikel</font> Lain</h1>
        </div>
        <div className={styles.article_container}>
            <div className={styles.article_layout}>
                {articlesAll.map(article => {
                    const tagsList = article.tags ? article.tags.split(',') : [];

                    return(
                        <div className={styles.article_box} key={article.id}>
                            <div className={styles.article_image}>
                                {tagsList.length > 0 && (
                                    <Link href={`/artikel/tag/${tagsList[0].trim()}`}>
                                        <button>#{tagsList[0].trim()}</button>
                                    </Link>
                                )}
                                <Link href={`/artikel/${encodeURIComponent(article.title.replace(/\s+/g, '-').toLowerCase())}`}>
                                    <img src={article.image} alt={article.title}/>
                                </Link>
                            </div>
                            <div className={styles.article_content}>
                                <Link href={`/artikel/${encodeURIComponent(article.title.replace(/\s+/g, '-').toLowerCase())}`}>
                                    <div className={styles.article_heading}>
                                        <h1>{article.title}</h1>
                                    </div>
                                </Link>
                                <span>Admin, {article.date}</span>
                                <Link href={`/artikel/${encodeURIComponent(article.title.replace(/\s+/g, '-').toLowerCase())}`}><button className={styles.btn_more}>Baca Selengkapnya</button></Link>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className={styles.article_pagination}>
            {/* Tombol "Sebelumnya" */}
            <button onClick={handlePrevPage} disabled={currentPage === 2}>
                Sebelumnya
            </button>

            {/* Menampilkan nomor halaman */}
            {[...Array(totalPages - 1)].map((_, index) => {
                const pageNumber = index + 2; // Menampilkan halaman mulai dari 2, tetapi treat itu sebagai halaman 1

                return (
                <button
                    key={index}
                    className={currentPage === pageNumber ? styles.active_pagination : ''}
                    onClick={() => setCurrentPage(pageNumber)} // Navigasi ke halaman yang benar
                >
                    {index + 1} {/* Menampilkan halaman mulai dari 1, tetapi tetap berfungsi untuk navigasi ke page 2 */}
                </button>
                );
            })}

            {/* Tombol "Selanjutnya" */}
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Selanjutnya
            </button>
            </div>


            
        </div>
    </div>
    </>
  );
}
