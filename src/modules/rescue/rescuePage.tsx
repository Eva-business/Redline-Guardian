import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 起始畫面
//環境危險因素排除畫面
import DangerCheckPage from './components/DangerCheckPage';
//症狀辨識畫面
import SymptomSelector from './components/SymptomSelector';

// 急救頁面
import CPRGuide from './components/CPRGuide';
import CPRGuide_p from './components/CPRGuide_p';
import ConsciousnessEmergency from './components/ConsciousnessEmergency';
import ConsciousnessEmergency_p from './components/ConsciousnessEmergency_p';
import ChokingEmergency from './components/ChokingEmergency';
import ChokingEmergency_p from './components/ChokingEmergency_p';
import SeizureFirstAid from './components/SeizureFirstAid';
import BleedingControl from './components/BleedingControl';
import BleedingControl_p from './components/BleedingControl_p';
import BurnHelp from './components/BurnHelp';
import BurnHelp_p from './components/BurnHelp_p';
import SevereAllergyHelp from './components/SevereAllergyHelp';
import MildAllergyHelp from './components/MildAllergyHelp';

//輔助頁面
import CPRAssist from './components/CPRAssist';

const RescuePage: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DangerCheckPage />} />
      <Route path="danger-check" element={<DangerCheckPage />} />
      <Route path="symptom-selector" element={<SymptomSelector />} />
      <Route path="CPRGuide" element={<CPRGuide />} />
      <Route path="CPRGuide_p" element={<CPRGuide_p />} />
      <Route path="ConsciousnessEmergency" element={<ConsciousnessEmergency />} />
      <Route path="ConsciousnessEmergency_p" element={<ConsciousnessEmergency_p />} />
      <Route path="ChokingEmergency" element={<ChokingEmergency />} />
      <Route path="ChokingEmergency_p" element={<ChokingEmergency_p />} />
      <Route path="SeizureFirstAid" element={<SeizureFirstAid />} />
      <Route path="BleedingControl" element={<BleedingControl />} />
      <Route path="BleedingControl_p" element={<BleedingControl_p />} />
      <Route path="BurnHelp" element={<BurnHelp />} />
      <Route path="BurnHelp_p" element={<BurnHelp_p />} />
      <Route path="SevereAllergyHelp" element={<SevereAllergyHelp />} />
      <Route path="MildAllergyHelp" element={<MildAllergyHelp />} />
      <Route path="CPRAssist" element={<CPRAssist />} />
    </Routes>
  );
};

export default RescuePage;