import React, { useEffect } from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'

const Home = () => {
  // Mount a bottom-right popup chat widget only on Home page
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!window.chatWidgetScriptLoaded) {
      window.ChatWidgetConfig = {
        agentId: '690c8711ad933ffbec604352',
      };

      const chatWidgetScript = document.createElement('script');
      chatWidgetScript.type = 'text/javascript';
      chatWidgetScript.async = true;
      chatWidgetScript.src = 'https://storage.googleapis.com/cdwidget/dist/assets/js/main.js';
      document.body.appendChild(chatWidgetScript);

      window.chatWidgetScriptLoaded = true;
    }

    return () => {
      // keep script loaded globally; no cleanup so the widget stays responsive when navigating
    };
  }, []);

  return (
    <div>
      <Header />
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
      {/* Container where the widget renders; keep it fixed at bottom-right */}
      <div id="cd-widget" className="fixed bottom-4 right-4 z-50"></div>
    </div>
  )
}

export default Home