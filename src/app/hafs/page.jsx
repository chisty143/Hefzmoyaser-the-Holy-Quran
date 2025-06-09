"use client";

// استدعاء الحزم
import { useEffect, useRef, useState, useMemo } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import dynamicImport from 'next/dynamic';
import pageData from "@/data/page_info.json"; // بيانات السور والأجزاء
import versesJson from "@/data/verses.json"; // بيانات الآيات وإحداثياتها

import SEOUpdater from "../../components/SEOUpdater";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PageViewer from "./PageViewer"; //  استدعاء مكون عرض الصفحات 

// استدعاء المكونات بطريقة dynamic لتقليل حجم الباندل
const SuraOffcanvas = dynamicImport(() => import('../../components/SuraOffcanvas'), { ssr: false });
const JuzOffcanvas = dynamicImport(() => import('../../components/JuzOffcanvas'), { ssr: false });
const VerseOffcanvas = dynamicImport(() => import('../../components/VerseOffcanvas'), { ssr: false });

export const dynamic = 'force-static' // ⬅️ ضروري لتوليد الصفحة بشكل ثابت
export default function HafsPage() {
  // المتغيرات والحالات
  const totalPages = 604;
  const imageWidth = 1446;
  const imageHeight = 2297;
  const scrollContainerRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentSura, setCurrentSura] = useState("");
  const [currentJuz, setCurrentJuz] = useState(1);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [highlightedVerseId, setHighlightedVerseId] = useState(null);
  const [userInteracted, setUserInteracted] = useState(false);

  const [isMemorizationMode, setIsMemorizationMode] = useState(false);
  const [hoveredVerses, setHoveredVerses] = useState([])

  const flipAudioRef = useRef(null); // مرجع لصوت التقليب

  // تحميل مكتبة Bootstrap JS عند أول تحميل
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js").catch((err) =>
      console.error("فشل تحميل Bootstrap:", err)
    );
  }, []);


  useEffect(() => {
    if (!isMemorizationMode) {
      setHoveredVerses([]); // إعادة تعيين الحالة الجديدة
      setHighlightedVerseId(null);
      setSelectedVerse(null);
    }
  }, [isMemorizationMode]);

  // تفعيل أول تفاعل مع الصفحة
  useEffect(() => {
    const handleFirstInteraction = () => {
      setUserInteracted(true);
      document.removeEventListener("pointerdown", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };
    document.addEventListener("pointerdown", handleFirstInteraction);
    document.addEventListener("keydown", handleFirstInteraction);
    return () => {
      document.removeEventListener("pointerdown", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };
  }, []);

  // تحضير صوت التقليب مرة واحدة
  useEffect(() => {
    flipAudioRef.current = new Audio("/sounds/page-flip.mp3");
  }, []);

  // إنشاء خريطة السور والأجزاء
  const suraMap = {};
  const juzMap = {};
  for (let entry of pageData) {
    if (!suraMap[entry.sura]) suraMap[entry.sura] = entry.page;
    if (!juzMap[entry.juz]) juzMap[entry.juz] = entry.page;
  }
  const suraNames = Object.keys(suraMap);
  const juzNumbers = Object.keys(juzMap);

  // التعامل مع السكرول وتحديث المعلومات
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const pageWidth = container.clientWidth;
    const newPage = Math.round(scrollLeft / pageWidth * -1) + 1;
    setCurrentPage(newPage);
    console.log("👀 Scrolling to page:", newPage);
    const info = pageData.find((p) => p.page === newPage);
    if (info) {
      setCurrentSura(info.sura);
      setCurrentJuz(info.juz);
    }
    localStorage.setItem("lastVisitedPage", newPage);
  };

  // الانتقال لصفحة مع صوت تقليب
  const scrollToPage = (page) => {
    const container = scrollContainerRef.current;
    const pageWidth = container.clientWidth;
    container.scrollTo({
      left: (page - 1) * pageWidth * -1,
      behavior: "smooth",
    });
    if (userInteracted && flipAudioRef.current) {
      flipAudioRef.current.play().catch(() => { });
    }
  };

  // التعامل مع أول تحميل للصفحة
  useEffect(() => {
    const savedPage = parseInt(localStorage.getItem("lastVisitedPage"), 10);
    if (savedPage && !isNaN(savedPage)) {
      setCurrentPage(savedPage);
      setTimeout(() => {
        scrollToPage(savedPage);
      }, 100);
    } else {
      handleScroll();
    }
  }, []);

  // تسريع استخراج آيات الصفحة
  const versesByPage = useMemo(() => {
    const map = {};
    for (const verse of versesJson) {
      if (!map[verse.page_number]) {
        map[verse.page_number] = [];
      }
      map[verse.page_number].push(verse);
    }
    return map;
  }, []);

  const currentPageRange = versesByPage[currentPage] || [];

  // تظليل آية
  const highlightVerse = (chapter_id, verse_number) => {
    const verse = versesJson.find(
      (v) => v.chapter_id === chapter_id && v.verse_number === verse_number
    );
    if (verse) {
      setHighlightedVerseId(verse.id);
    }
  };

   const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false); // حالة جديدة لتتبع فتح/إغلاق الـ offcanvas

  return (
    <>
      <SEOUpdater currentPage={currentPage} />

      <div className="h-[100dvh] w-screen overflow-hidden flex flex-col" dir="rtl">
        {/* الهيدر */}
        <div className="flex-none h-16 md:h-20">
          <Header
            currentSura={currentSura}
            currentJuz={currentJuz}
            currentPage={currentPage}
            totalPages={totalPages}
            scrollToPage={scrollToPage}
          />
        </div>

        {/* عارض الصفحات */}
       
        <PageViewer
          totalPages={totalPages}
          currentPage={currentPage}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          scrollContainerRef={scrollContainerRef}
          handleScroll={handleScroll}
          versesByPage={versesByPage}
          highlightedVerseId={highlightedVerseId}
          setSelectedVerse={setSelectedVerse}
          setHighlightedVerseId={setHighlightedVerseId}
          isMemorizationMode={isMemorizationMode}
          hoveredVerses={hoveredVerses}
          setHoveredVerses={setHoveredVerses}
        />
         {/* سهم الصفحة السابقة */}
        {currentPage > 1 && (
          <button
            onClick={() => !isOffcanvasOpen && scrollToPage(currentPage - 1)}
            className={`hidden md:block absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-3 rounded-full z-20 hover:bg-opacity-50 transition-all
              ${isOffcanvasOpen ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100'}`}
            aria-label="الصفحة السابقة"
            disabled={isOffcanvasOpen}
          >
            <FaArrowRight className="text-xl" />
          </button>
        )}
        
        {/* سهم الصفحة التالية */}
        {currentPage < totalPages && (
          <button
            onClick={() => !isOffcanvasOpen && scrollToPage(currentPage + 1)}
            className={`hidden md:block absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-3 rounded-full z-20 hover:bg-opacity-50 transition-all
              ${isOffcanvasOpen ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100'}`}
            aria-label="الصفحة التالية"
            disabled={isOffcanvasOpen}
          >
            <FaArrowLeft className="text-xl" />
          </button>
        )}
        

        {/* الفوتر */}
        <div className="flex-none h-12 md:h-16">
          <Footer
            currentPageRange={currentPageRange}
            highlightVerse={highlightVerse}
            goToPage={scrollToPage}
            currentPage={currentPage}
            setIsMemorizationMode={setIsMemorizationMode}
            isMemorizationMode={isMemorizationMode}
          />
        </div>

        {/* النوافذ الجانبية */}
        <SuraOffcanvas
          suraNames={suraNames}
          suraMap={suraMap}
          scrollToPage={scrollToPage}
        />
        <JuzOffcanvas
          juzNumbers={juzNumbers}
          juzMap={juzMap}
          scrollToPage={scrollToPage}
        />
        <VerseOffcanvas
          selectedVerse={selectedVerse}
          setSelectedVerse={(verse) => {
            setSelectedVerse(verse);
            setHighlightedVerseId(verse?.id ?? null);
            setIsOffcanvasOpen(!!verse);
          }}
          scrollToPage={scrollToPage}
          versesData={versesJson}
          isMemorizationMode={isMemorizationMode}
        />
      </div>
    </>

  );
}
