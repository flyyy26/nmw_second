import { useRouter } from 'next/router';
import React, { useRef, useState, useEffect } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import banner from "@/styles/Banner.module.css";
import styles from "@/styles/Detail.module.css";
import stylesAll from "@/styles/Article.module.css"
import loadingStyles from "@/styles/Loading.module.css";
import not from "@/styles/Not.module.css";
import Link from 'next/link';
import Head from 'next/head';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';

export default function DetailArtikel() {
    const router = useRouter();
    const { name, title } = router.query;
    const [articleDetail, setArticleDetail] = useState({ service: null });
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState([]);
    const [settings, setSettings] = useState([]);
    const [articlesAll, setArticlesAll] = useState([]);
    const [tos, setTos] = useState([]);
    const [doctor, setDoctor] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Menyimpan halaman yang aktif
    const [totalPages, setTotalPages] = useState(1); 

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const storageUrl = process.env.NEXT_PUBLIC_API_STORAGE_URL;

    useEffect(() => {
        if (title && articles.length > 0) {
            const matchedArticle = articles.find(article =>
                article.title.replace(/\s+/g, '-').toLowerCase() === title
            );
    
            if (matchedArticle) {
                const fetchArticleDetail = async () => {
                    try {
                        const response = await fetch(`${baseUrl}/detail-artikel?id=${matchedArticle.id}`);
                        const data = await response.json();
    
                        if (data && data.data) {
                            const products = typeof data.data.products === "string"
                                ? JSON.parse(data.data.products)
                                : data.data.products || [];
    
                            const service = typeof data.data.service === "string"
                                ? JSON.parse(data.data.service)
                                : data.data.service;

                            const doctor = typeof data.data.doctor === "string"
                                ? JSON.parse(data.data.doctor)
                                : data.data.doctor;
    
                            // Gabungkan products dan service ke dalam articleDetail
                            setArticleDetail({ ...data.data, products, service, doctor });
    
                            // Filter artikel lain
                            const filteredArticles = articles.filter(article => article.id !== matchedArticle.id);
                            setArticles(filteredArticles.slice(0, 3)); // Tampilkan 3 artikel lainnya
                        }
                    } catch (error) {
                        console.error("Error fetching article detail:", error);
                    } finally {
                        setLoading(false);
                    }
                };
    
                fetchArticleDetail();
            } else {
                setLoading(false); // Jika artikel tidak ditemukan
            }
        }
    }, [title, articles, baseUrl]);

    
    useEffect(() => {
        if (articleDetail?.service) {
            try {
                // Cek jika articleDetail.service adalah objek dan bukan string atau array
                const serviceObject = typeof articleDetail.service === 'string'
                    ? JSON.parse(articleDetail.service) // Parse jika berupa string
                    : articleDetail.service;
    
                // Jika serviceObject adalah objek yang valid
                if (serviceObject && serviceObject.id) {
                    const serviceId = serviceObject.id; // Ambil service ID dari objek
    
                    console.log("service id : " + serviceId); // Log ID ke console
    
                    const fetchServiceDetail = async () => {
                        try {
                            const response = await fetch(`${baseUrl}/tos/${serviceId}`);
                            if (!response.ok) {
                                throw new Error(`Failed to fetch service details: ${response.status} ${response.statusText}`);
                            }                            
                            const data = await response.json();
                            if (data && data.data) {
                                setTos(data.data); // Set data ke state
                            } else {
                                console.error('Data format is incorrect:', data);
                            }
                        } catch (error) {
                            console.error('Error fetching service detail:', error);
                        }
                    };
    
                    fetchServiceDetail();
                } else {
                    console.error('Invalid service data:', serviceObject);
                }
            } catch (error) {
                console.error("Error parsing service data:", error);
            }
        }
    }, [articleDetail?.service, baseUrl]);


    useEffect(() => {
        if (articleDetail?.doctor) {
            try {
                // Cek jika articleDetail.service adalah objek dan bukan string atau array
                const serviceObject = typeof articleDetail.doctor === 'string'
                    ? JSON.parse(articleDetail.doctor) // Parse jika berupa string
                    : articleDetail.doctor;
    
                // Jika serviceObject adalah objek yang valid
                if (serviceObject && serviceObject.id) {
                    const serviceId = serviceObject.id; // Ambil service ID dari objek
    
                    console.log("service id : " + serviceId); // Log ID ke console
    
                    const fetchServiceDetail = async () => {
                        try {
                            const response = await fetch(`${baseUrl}/doctor_single/${serviceId}`);
                            if (!response.ok) {
                                throw new Error(`Failed to fetch service details: ${response.status} ${response.statusText}`);
                            }                            
                            const data = await response.json();
                            if (data && data.data) {
                                setDoctor(data.data); // Set data ke state
                            } else {
                                console.error('Data format is incorrect:', data);
                            }
                        } catch (error) {
                            console.error('Error fetching service detail:', error);
                        }
                    };
    
                    fetchServiceDetail();
                } else {
                    console.error('Invalid service data:', serviceObject);
                }
            } catch (error) {
                console.error("Error parsing service data:", error);
            }
        }
    }, [articleDetail?.doctor, baseUrl]);
    
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${baseUrl}/article-new`);
                const data = await response.json();
                if (data && data.data) { 
                    const articles = data.data;

                    // Urutkan artikel berdasarkan 'date' dan 'created_at' yang paling baru
                    const sortedArticles = articles.sort((a, b) => {
                        const dateA = new Date(a.date);
                        const dateB = new Date(b.date);
                        const createdAtA = new Date(a.created_at);
                        const createdAtB = new Date(b.created_at);

                        return (dateB - dateA) || (createdAtB - createdAtA);
                    });

                    setArticles(sortedArticles);
                } else {
                    console.error('Invalid response data format:', data);
                }
            } catch (error) {
                console.error('Error fetching articles:', error);
            }
        };

        fetchData();
    }, [baseUrl]);

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
      
    
      // Fungsi untuk menangani klik halaman berikutnya
      const handleNextPage = () => {
        if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
        }
      };
    
      // Fungsi untuk menangani klik halaman sebelumnya
      const handlePrevPage = () => {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
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

    if (!articleDetail) {
        return (
            <>
                <div className={not.box}>
                    <div className={not.content}>
                        <img src="../images/not-found.png" alt='Artikel Tidak Ditemukan' />
                        <span>Artikel Tidak Ditemukan</span>
                    </div>
                </div>
                <div className={stylesAll.article_section}>
                    <div className={`${stylesAll.heading_section} ${stylesAll.heading_section_start}`}>
                        <h1><font>Artikel</font> Lain</h1>
                    </div>
                    <div className={stylesAll.article_container}>
                        <div className={stylesAll.article_layout}>
                            {articlesAll.map(article => {
                                const tagsList = article.tags ? article.tags.split(',') : [];

                                return(
                                <div className={stylesAll.article_box} key={article.id}>
                                    <div className={stylesAll.article_image}>
                                        {tagsList.length > 0 && (
                                            <Link href={`tag/${tagsList[0].trim()}`}>
                                                <button className={styles.tag_article_img}>#{tagsList[0].trim()}</button>
                                            </Link>
                                        )}
                                        <Link href={`/artikel/${encodeURIComponent(article.title.replace(/\s+/g, '-').toLowerCase())}`}>
                                            <img src={article.image} alt={article.title}/>
                                        </Link>
                                    </div>
                                    <div className={stylesAll.article_content}>
                                        <Link href={`/artikel/${encodeURIComponent(article.title.replace(/\s+/g, '-').toLowerCase())}`}>
                                            <div className={stylesAll.article_heading}>
                                                <h1>{article.title}</h1>
                                            </div>
                                        </Link>
                                        <span>Admin, {article.date}</span>
                                        <Link href={`/artikel/${encodeURIComponent(article.title.replace(/\s+/g, '-').toLowerCase())}`}><button className={stylesAll.btn_more}>Baca Selengkapnya</button></Link>
                                    </div>
                                </div>
                                )
                            })}
                        </div>
                        <div className={stylesAll.article_pagination}>
                            <button onClick={handlePrevPage} disabled={currentPage === 1}>
                            Sebelumnya
                            </button>
                            {/* Menampilkan nomor halaman */}
                            {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                className={currentPage === index + 1 ? stylesAll.active_pagination : ''}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                            ))}
                            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                            Selanjutnya
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    const tags = articleDetail.tags ? articleDetail.tags.split(',') : [];

    const cleanDescription = articleDetail.description.replace(/<[^>]*>/g, ''); // Menghapus semua tag HTML

    const shortDescription = cleanDescription.length > 100 
    ? cleanDescription.substring(0, 100) + "..." 
    : cleanDescription;

    console.log("products : " + articleDetail.products)


    return (
        <>
            <Head>
                <title>{articleDetail.title} - NMW Aesthetic Clinic</title>
                <meta name="description" content={articleDetail.description} />
                <meta name="keywords" content={tags.join(', ')} /> {/* SEO meta untuk tags */}
                <meta property="og:title" content={articleDetail.title} />
                <meta property="og:description" content={articleDetail.description} />
                <meta property="og:type" content="article" />
                <meta name="twitter:title" content={articleDetail.title} />
                <meta name="twitter:description" content={articleDetail.description} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Article',
                        headline: `${articleDetail.title}`,
                        description: `${shortDescription}`,
                        datePublished: `${articleDetail.created_at}`,
                        dateModified: `${articleDetail.updated_at}`,
                        image: `${articleDetail.image}`,
                        author: {
                        '@type': 'Person',
                        name: 'Admin',
                        },
                    })}
                </script>
            </Head>
            <div className={banner.banner}>
                <img src={articleDetail.image} alt={articleDetail.title} /> 
                {articleDetail.image_source ? (
                    <div className={banner.image_source}>
                        <Link href={articleDetail.image_source} target="_blank">{articleDetail.image_source_name}</Link>
                    </div>
                ) : null }
            </div>
            <div className={styles.container}>
                <div className={styles.detail_tag}>
                    {tags.map((tag, index) => (
                        <Link href={`tag/${tag.trim()}`} key={index}>
                            <button>
                                #{tag.trim()}
                            </button>
                        </Link>
                    ))}
                </div>
                <div className={styles.container_layout}>
                    <div className={styles.container_content}>
                        <div className={styles.content_heading}>
                            <h1>{articleDetail.title}</h1>
                            <span>{articleDetail.author}, {articleDetail.date}</span>
                        </div>
                        <div className={styles.content_text}>
                            <div dangerouslySetInnerHTML={{ __html: articleDetail.description }} />
                            <div className={styles.author_meta}>
                                <p>Penulis : {articleDetail.author}</p>
                                <p>Editor : {articleDetail.editor}</p>
                                <p>Sumber : {articleDetail.source_link}</p>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.container_sidebar} ${styles.dekstop_block}`}>
                        <div className={styles.sidebar_heading}>
                            <h4>Artikel Lain</h4>
                            <Link href={"/artikel"}>Lihat lebih banyak</Link>
                        </div>
                        <div className={styles.sidebar_layout}>
                            {articles.map(article => {
                                const tagsList = article.tags ? article.tags.split(',') : [];

                                return(
                                    <div className={styles.article_box} key={article.id}>
                                        <div className={styles.article_image}>
                                            {tagsList.length > 0 && (
                                                <Link href={`tag/${tagsList[0].trim()}`}>
                                                    <button className={styles.tag_article_img}>#{tagsList[0].trim()}</button>
                                                </Link>
                                            )}
                                            <Link href={`/artikel/${encodeURIComponent(article.title.replace(/\s+/g, '-').toLowerCase())}`}>
                                                <img src={article.image} alt={article.title} />
                                            </Link>
                                        </div>
                                        <div className={styles.article_content}>
                                            <Link href={`/artikel/${encodeURIComponent(article.title.replace(/\s+/g, '-').toLowerCase())}`}>
                                                <div className={styles.article_heading}>
                                                    <h1>{article.title}</h1>
                                                </div>
                                            </Link>
                                            <span>Admin, {article.date}</span>
                                            <Link href={`/artikel/${encodeURIComponent(article.title.replace(/\s+/g, '-').toLowerCase())}`}>
                                                <button className={styles.btn_more}>Baca Selengkapnya</button>
                                            </Link>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.container_sc}>
                {Array.isArray(articleDetail.products) && articleDetail.products.length > 0 ? (
                    <div className={styles.product_detail}>
                        <div className={styles.layanan_heading}>
                            <h3>Produk <font>Artikel Ini</font></h3>
                        </div>
                        <div className={styles.product_detail_layout}>
                            {articleDetail.products.map((product, index) => (
                                <div className={styles.article_box} key={index}>
                                    <div className={`${styles.article_image} ${styles.article_image_product}`}>
                                        <Link href={product.link} target="_blank">
                                            <img
                                                src={`${storageUrl}/${product.image}`}
                                                alt={product.name}
                                            />
                                        </Link>
                                    </div>
                                    <div className={`${styles.article_content} ${styles.article_product}`}>
                                        <Link href={product.link} target="_blank">
                                            <div className={styles.article_heading}>
                                                <h1>{product.name}</h1>
                                            </div>
                                        </Link>
                                        <p>{product.description}</p>
                                        <Link href={product.link} target="_blank">
                                            <button className={styles.btn_more}>Lihat Produk</button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null }
                <div className={styles.container_layout}>
                    {tos && tos.id ? (
                        <div className={styles.layanan}>
                            <div className={styles.layanan_heading}>
                                <h3>Terkait <font>Artikel Ini</font></h3>
                            </div>
                            <div className={styles.box_service_layout}>
                                <div className={styles.box_service} key={tos.id}>
                                    <div className={styles.box_service_image}>
                                        <Link href={`/jenis-layanan/${tos.slug}`} >
                                            <img
                                                src={`${storageUrl}/${tos.image}`}
                                                alt={tos.title}
                                            />
                                        </Link>
                                    </div>
                                    <div className={styles.box_service_content}>
                                        <Link href={`/jenis-layanan/${tos.slug}`} ><h1>{tos.title}</h1></Link>
                                        <p
                                            className={styles.service_description}
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    tos.description === "-"
                                                        ? "Klik lihat detail untuk mendapatkan informasi selengkapnya tentang layanan ini"
                                                        : tos.description,
                                            }}
                                        />
                                        <div className={styles.box_service_btn}>
                                            <Link href={`/jenis-layanan/${tos.slug}`} >
                                                <button>Lihat Detail</button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                    {doctor && doctor.id ? (
                    <div className={styles.container_sidebar}>
                        <div className={styles.layanan_heading}>
                            <h3> <font>Dokter</font> Terkait</h3>
                        </div>
                        <div className={`${styles.sidebar_layout} ${styles.sidebar_layout_sc}`}>
                            <div className={`${styles.article_box} ${styles.doctor_box}`} key={doctor.id}>
                                <div className={`${styles.article_image} ${styles.article_image_product} ${styles.article_image_doctor}`}>
                                    <img
                                        src={`${doctor.image}`}
                                        alt={doctor.name}
                                    />
                                </div>
                                <div className={styles.article_content}>
                                    <div className={styles.article_heading}>
                                        <h1>{doctor.name}</h1>
                                    </div>
                                    <p>{doctor.position}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    ) : null}
                </div>
                <div className={`${styles.container_sidebar} ${styles.mobile_block}`}>
                    <div className={styles.sidebar_heading}>
                        <h4>Artikel Lain</h4>
                        <Link href={"/artikel"}>Lihat lebih banyak</Link>
                    </div>
                    <div className={styles.sidebar_layout}>
                        {articles.map(article => {
                            const tagsList = article.tags ? article.tags.split(',') : [];

                            return(
                                <div className={styles.article_box} key={article.id}>
                                    <div className={styles.article_image}>
                                        {tagsList.length > 0 && (
                                            <Link href={`tag/${tagsList[0].trim()}`}>
                                                <button className={styles.tag_article_img}>#{tagsList[0].trim()}</button>
                                            </Link>
                                        )}
                                        <Link href={`/artikel/${encodeURIComponent(article.title.replace(/\s+/g, '-').toLowerCase())}`}>
                                            <img src={article.image} alt={article.title} />
                                        </Link>
                                    </div>
                                    <div className={styles.article_content}>
                                        <Link href={`/artikel/${encodeURIComponent(article.title.replace(/\s+/g, '-').toLowerCase())}`}>
                                            <div className={styles.article_heading}>
                                                <h1>{article.title}</h1>
                                            </div>
                                        </Link>
                                        <span>Admin, {article.date}</span>
                                        <Link href={`/artikel/${encodeURIComponent(article.title.replace(/\s+/g, '-').toLowerCase())}`}>
                                            <button className={styles.btn_more}>Baca Selengkapnya</button>
                                        </Link>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
