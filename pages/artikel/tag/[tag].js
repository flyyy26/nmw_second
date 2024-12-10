import { useState, useEffect } from 'react';
import styles from "@/styles/Article.module.css";
import banner from "@/styles/Banner.module.css";
import Link from 'next/link';
import { HiArrowLongRight } from "react-icons/hi2";
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import loadingStyles from "@/styles/Loading.module.css";

export default function TagsPage() {
    const router = useRouter();
    const { tag } = router.query;
    const [articlesAll, setArticlesAll] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [tags, setTags] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true); // Loading state to prevent hydration issues

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch(`${baseUrl}/article-new`);
                const data = await response.json();
                if (data) {
                    setArticlesAll(data.data);

                    if (tag) {
                        const filtered = data.data.filter(article => article.tags && article.tags.includes(tag)); // Filter articles by tag
                        setFilteredArticles(filtered);
                    } else {
                        setFilteredArticles(data.data); // If no tag, show all articles
                    }
                } else {
                    console.error('Invalid response data format:', data);
                }
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false); // Stop loading after the data is fetched
            }
        };

        fetchArticles();
    }, [tag]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch(`${baseUrl}/get-tag`);
                const data = await response.json();
                setTags(data);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchTags();
    }, []);

    if (loading) {
        return (
            <>
                <div className={loadingStyles.box}>
                    <div className={loadingStyles.content}>
                        <img src="../../images/logo.svg"/>
                        <span>Loading</span>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>{`Tag ${tag}`} | NMW Aesthetic Clinic</title>
                <meta name="description" content="Artikel NMW Aesthetic Clinic" />
                <meta property="og:title" content="Artikel" />
                <meta property="og:description" content="Artikel NMW Aesthetic Clinic" />
                <meta property="og:type" content="article" />
                <meta name="twitter:title" content="Artikel" />
                <meta name="twitter:description" content="Artikel NMW Aesthetic Clinic" />
            </Head>
            <div className={styles.article_section}>
                <div className={`${styles.heading_section} ${styles.heading_section_start}`}>
                    <h1>Artikel dengan tag <font className={styles.tag_heading}>{tag}</font></h1>
                </div>
                <div className={styles.article_container}>
                    <div className={styles.article_layout}>
                        {loading ? (
                            <p>Loading...</p> // Add loading state message or skeleton loader
                        ) : (
                            filteredArticles.length > 0 ? (
                                filteredArticles.map((article) => {
                                    const tagsList = article.tags ? article.tags.split(',') : [];
                                    return(
                                        <div className={styles.article_box} key={article.id}>
                                            <div className={styles.article_image}>
                                                {tagsList.length > 0 && (
                                                    <Link href={`${tagsList[0].trim()}`}>
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
                                                <span>Admin, {article.date}</span>
                                                <Link href={`/artikel/${encodeURIComponent(article.title.replace(/\s+/g, '-').toLowerCase())}`}>
                                                    <button className={styles.btn_more}>Baca Selengkapnya</button>
                                                </Link>
                                            </div>
                                        </div>
                                    )
                            })
                            ) : (
                                <p>No articles found for this tag.</p>
                            )
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
