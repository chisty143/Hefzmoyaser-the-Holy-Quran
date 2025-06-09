"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

export const dynamic = 'force-static' // ⬅️ ضروري لتوليد الصفحة بشكل ثابت
export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const prompted = localStorage.getItem("pwaPrompt");
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isiOS = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone;

    setIsIOS(isiOS);

    if (!prompted && !isStandalone) {
      if (isiOS) {
        setTimeout(() => setShowModal(true), 1000);
      } else {
        window.addEventListener("beforeinstallprompt", (e) => {
          e.preventDefault();
          setDeferredPrompt(e);
          setTimeout(() => setShowModal(true), 1000);
        });
      }
    }
  }, []);

  const handleAccept = async () => {
    localStorage.setItem("pwaPrompt", "accepted");
    setShowModal(false);

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        console.log("PWA Installed");
      }
    }
  };

  const handleDecline = () => {
    localStorage.setItem("pwaPrompt", "declined");
    setShowModal(false);
  };

  return (
    <div className="h-full w-screen overflow-hidden flex flex-col" dir="rtl">
      <header className="h-16 bg-green-800 text-white flex items-center justify-center px-4 sticky top-0 z-10 shadow-md">
        <h1 className="text-2xl font-bold text-center">
          مصحف الحفظ الميسر
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto">
        <section className="relative w-full h-auto animate-fade-in">
          <Image
            src="/images/logo/home.webp"
            alt="مصحف الحفظ الميسر"
            width={1200}
            height={300}
            className="w-full h-auto max-h-[250px] object-cover shadow-md"
            priority
          />
        </section>

        <section className="p-3 md:p-12 animate-fade-in-up">
          <div className="container section-title mb-3">
            <h2 className="text-center">  عن مصحف الحفظ الميسر </h2>
          </div>
          <div className="container mb-3">
            <div className="row">
              <div className="col-12">
                <p className="text-2xl text-gray-700 leading-tight text-justify mb-3">
                  هو طريقة مبتكرة لتيسير حفظ القرآن الكريم باستخدام الروابط اللفظية والمعنوية والموضوعية – ويهدف إلى تيسير الحفظ والتدبر والعمل بالقرآن الكريم.
                </p>
              </div>
            </div>
          </div>
      </section>

      <section className="p-3 md:p-12 animate-fade-in-up shadow-md shadow-xl/30">
          <div className="container section-title mb-3">
            <h2 className="text-center">  روابط الوصول للمصحف </h2>
          </div>
          <div className="container mb-3">
            <div className="row">
              <div className="col-md-4 col-12">
                <Link
                  href="/madina"
                  className="btn btn-success btn-lg w-full mb-3"
                >
                  مصحف المدينة برواية حفص
                </Link>
              </div>
              <div className="col-md-4 col-12">
                <Link
                  href="/hafs"
                  className="btn btn-success btn-lg w-full mb-3"
                >
                  الحفظ الميسر برواية  حفص
                </Link>
              </div>
              <div className="col-md-4 col-12">
                <Link
                  href="/warsh"
                  className="btn btn-success btn-lg w-full mb-3"
                >
                  الحفظ الميسر برواية ورش
                </Link>
              </div>
              <div className="col-md-4 col-12">
                <button
                  className="btn btn-secondary btn-lg w-full mb-3 cursor-not-allowed"
                >
                  المصحف برواية قالون (قريبًا)
                </button>
              </div>
            </div>
          </div>
      </section>

      <section className="p-3 md:p-12 animate-fade-in-up">

          <div className="container section-title mb-3">
            <h2 className="text-center">  مميزات النسخة الإلكترونية </h2>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-md-6 col-12">
                <ul className="list-disc p-0 text-lg text-gray-700">
                  <li className="text-1xl leading-9 text-justify">عرض صفحات المصحف بدقة عالية وسلاسة.</li>
                  <li className="text-1xl leading-9 text-justify">إمكانية تصفح  كل آية بشكل منفصل.</li>
                  <li className="text-1xl leading-9 text-justify">واجهة سريعة وفعالة حتى بدون اتصال بالإنترنت (PWA).</li>
                  <li className="text-1xl leading-9 text-justify"> يوفر المصحف  أكثر من 60 ألف وقفة تدبرية </li>
                  <li className="text-1xl leading-9 text-justify"> خاصية معرفة مناسبة كل آيه بما قبلها  ( الربط والتناسب ) </li>
                  <li className="text-1xl leading-9 text-justify"> عرض تفسير كل آية كريمة ( التفسير الميسر ) </li>
                </ul>
              </div>
              <div className="col-md-6 col-12">
                <ul className="list-disc p-0 text-lg text-gray-700">
                  <li className="text-1xl leading-9 text-justify"> إمكانية وضع علامة مرجعية للصفحة للرجوع لها عند الحاجة . </li>
                  <li className="text-1xl leading-9 text-justify"> إمكانية الاستماع للآيات باختيار نطاق معين و اختيار قارئ و التكرار والسرعة .. الخ . </li>
                  <li className="text-1xl leading-9 text-justify"> معاني آيات الآيات الكريمة من أكثر من مصدر </li>
                  <li className="text-1xl leading-9 text-justify"> خاصية الحصول على سبب نزول كل ايه من أكثر من مصدر </li>
                  <li className="text-1xl leading-9 text-justify"> يوفر المصحف خاصية معرفة القراءات العشر لكل آية </li>
                  <li className="text-1xl leading-9 text-justify"> خاصية التعرف على متشابهات كل آيه  </li>
                </ul>
              </div>
            </div>
          </div>



        </section>
      </main>

      <footer className="h-10 md:h-10 bg-green-800 text-white flex items-center justify-around p-2 text-sm md:text-base">
        <p className="m-0">مصحف الحفظ الميسر &copy; 2025</p>
        <p className="m-0">
          BY:
          <Link href="https://alaaamer.net" target="_blank">
            <span className="text-white"> Alaa Amer </span>
          </Link>
        </p>
      </footer>

      {/* مودال PWA */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center animate-fade-in">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-11/12 max-w-sm text-center animate-slide-up">
            <h4 className="text-xl font-bold mb-3 p-3 bg-green-300">تشغيل الموقع كتطبيق (PWA)</h4>
            {isIOS ? (
              <>
                <p className="text-lg text-red-600 mb-3">لتثبيت "مصحف الحفظ الميسر" على الآيفون:</p>
                <p className="text-gray-700 text-justify">
                  اضغط على زر <strong>المشاركة (⬆️)</strong> في أسفل الشاشة، ثم اختر <strong>"إضافة إلى الشاشة الرئيسية"</strong>.
                </p>
                <button
                  className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-xl"
                  onClick={handleDecline}
                >
                  تم، لا تظهر هذه الرسالة مرة أخرى
                </button>
              </>
            ) : (
              <>
                <p className="text-lg mb-3 p-3 border-b border-gray-500 text-justify">
                  هذا النظام يجعل الموقع يعمل على جهازك بدون استخدام الإنترنت، ويمكن استخدامه بطريقة سهلة من خلال الاختصار.
                </p>
                <p className="text-lg mb-3 text-red-600">
                  هل تريد تثبيت "مصحف الحفظ الميسر" على جهازك؟
                </p>
                <div className="flex justify-center gap-3 p-3 border-t border-gray-500">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
                    onClick={handleAccept}
                  >
                    نعم، ثبّت التطبيق
                  </button>
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-xl"
                    onClick={handleDecline}
                  >
                    لا، شكرًا
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
