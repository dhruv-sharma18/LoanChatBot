import React, { useState } from 'react';
import Layout from './components/Layout';
import ChatSection from './components/ChatSection';
import EMISection from './components/EMISection';
import EligibilitySection from './components/EligibilitySection';
import CatalogSection from './components/CatalogSection';

function App() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="h-full">
        {activeTab === 'chat' && <ChatSection />}
        {activeTab === 'emi' && <EMISection />}
        {activeTab === 'eligibility' && <EligibilitySection />}
        {activeTab === 'catalog' && <CatalogSection />}
      </div>
    </Layout>
  );
}

export default App;
