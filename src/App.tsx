/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArtemisProvider } from './context/ArtemisContext';
import { Shell } from './components/layout/Shell';
import { RoomView } from './views/Room';
import { ChatView } from './views/Chat';
import { PlannerView } from './views/Planner';
import { HealthView } from './views/Health';
import { LockerView } from './views/Locker';
import { SettingsView } from './views/Settings';
import { OnboardingModal } from './components/modals/OnboardingModal';
import { useArtemisContext } from './context/ArtemisContext';

function AppContent() {
  const { state } = useArtemisContext();
  const [activeView, setActiveView] = useState('room');

  const renderView = () => {
    switch (activeView) {
      case 'room': return <RoomView />;
      case 'chat': return <ChatView />;
      case 'planner': return <PlannerView />;
      case 'health': return <HealthView />;
      case 'locker': return <LockerView />;
      case 'settings': return <SettingsView />;
      default: return <RoomView />;
    }
  };

  return (
    <>
      <Shell activeView={activeView} onViewChange={setActiveView}>
        {renderView()}
      </Shell>
      {!state.onboarded && <OnboardingModal />}
    </>
  );
}

export default function App() {
  return (
    <ArtemisProvider>
      <AppContent />
    </ArtemisProvider>
  );
}
