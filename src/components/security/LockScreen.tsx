import React, { useState, useEffect } from 'react';
import { Lock, Unlock, AlertCircle, KeyRound, ShieldAlert, Check } from 'lucide-react';
import { AppSecurityConfig, FirmProfile } from '../../types';

interface LockScreenProps {
  securityConfig: AppSecurityConfig;
  firmProfile: FirmProfile;
  onUnlock: () => void;
  onEmergencyReset: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({
  securityConfig,
  firmProfile,
  onUnlock,
  onEmergencyReset
}) => {
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const [resetConfirmInput, setResetConfirmInput] = useState<string>('');

  const targetPin = securityConfig.pin || '1234';

  const handleKeyPress = (num: string) => {
    if (enteredPin.length < 6) {
      const nextPin = enteredPin + num;
      setEnteredPin(nextPin);
      setErrorMsg('');

      // If length matches target, check immediately
      if (nextPin.length === targetPin.length) {
        if (nextPin === targetPin) {
          onUnlock();
        } else {
          setErrorMsg('Incorrect Security PIN. Please try again.');
          setTimeout(() => setEnteredPin(''), 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setEnteredPin(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleClear = () => {
    setEnteredPin('');
    setErrorMsg('');
  };

  // Listen to physical keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enteredPin, targetPin]);

  return (
    <div id="app-lock-screen" className="fixed inset-0 z-50 bg-[#161616] text-white flex flex-col items-center justify-center p-4">
      {/* Studio Header */}
      <div className="text-center mb-6 space-y-2">
        <div className="w-14 h-14 bg-[#ff832b] text-black mx-auto flex items-center justify-center border border-[#ff832b]">
          <Lock className="w-7 h-7" />
        </div>
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#8d8d8d]">
            Studio Practice Security
          </span>
          <h1 className="text-xl font-bold uppercase tracking-tight text-white mt-0.5">
            {firmProfile.firmName}
          </h1>
          <p className="text-xs text-[#8d8d8d]">
            Enter 4-digit Master PIN to unlock financial records
          </p>
        </div>
      </div>

      {/* PIN Dots Display */}
      <div className="bg-[#262626] border border-[#393939] p-4 w-full max-w-xs text-center space-y-3">
        <div className="flex justify-center space-x-3 py-2">
          {Array.from({ length: targetPin.length }).map((_, idx) => (
            <div
              key={idx}
              className={`w-4 h-4 border transition-all ${
                idx < enteredPin.length
                  ? 'bg-[#ff832b] border-[#ff832b]'
                  : 'bg-transparent border-[#8d8d8d]'
              }`}
            />
          ))}
        </div>

        {errorMsg && (
          <div className="p-2 bg-[#da1e28] text-white text-[11px] font-bold flex items-center justify-center space-x-1">
            <AlertCircle className="w-3.5 h-3.5 mr-1" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Carbon Numpad */}
      <div className="w-full max-w-xs mt-6 grid grid-cols-3 gap-2">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            id={`pin-btn-${digit}`}
            onClick={() => handleKeyPress(digit)}
            className="h-14 bg-[#262626] hover:bg-[#393939] active:bg-[#ff832b] active:text-black text-white font-mono text-xl font-bold border border-[#393939] transition-colors"
          >
            {digit}
          </button>
        ))}
        <button
          id="pin-btn-clear"
          onClick={handleClear}
          className="h-14 bg-[#262626] hover:bg-[#393939] text-[#8d8d8d] hover:text-white text-xs font-bold uppercase tracking-wider border border-[#393939]"
        >
          Clear
        </button>
        <button
          id="pin-btn-0"
          onClick={() => handleKeyPress('0')}
          className="h-14 bg-[#262626] hover:bg-[#393939] active:bg-[#ff832b] active:text-black text-white font-mono text-xl font-bold border border-[#393939]"
        >
          0
        </button>
        <button
          id="pin-btn-delete"
          onClick={handleDelete}
          className="h-14 bg-[#262626] hover:bg-[#393939] text-[#8d8d8d] hover:text-white text-xs font-bold uppercase tracking-wider border border-[#393939]"
        >
          Del
        </button>
      </div>

      {/* Security Hint & Emergency Options */}
      <div className="mt-8 text-center space-y-2">
        {securityConfig.securityHint && (
          <div>
            {!showHint ? (
              <button
                onClick={() => setShowHint(true)}
                className="text-xs text-[#8d8d8d] hover:text-[#ff832b] underline"
              >
                Show PIN Hint
              </button>
            ) : (
              <div className="p-2 bg-[#262626] border border-[#ff832b] text-xs text-[#ff832b] font-mono">
                Hint: {securityConfig.securityHint}
              </div>
            )}
          </div>
        )}

        <button
          id="btn-emergency-reset-pin"
          onClick={() => setShowEmergencyModal(true)}
          className="text-[11px] text-[#525252] hover:text-[#da1e28] underline"
        >
          Forgot PIN / Emergency Reset
        </button>
      </div>

      {/* Emergency Reset Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-[#161616] border border-[#da1e28] p-6 max-w-sm w-full space-y-4 text-left">
            <div className="flex items-center space-x-2 text-[#da1e28]">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-base font-bold uppercase">Emergency PIN Reset</h3>
            </div>
            <p className="text-xs text-[#8d8d8d]">
              To reset your lock PIN without losing your studio records, type <strong className="text-white">RESET</strong> below. The lock will be disabled and PIN set back to default <strong className="text-[#ff832b]">1234</strong>.
            </p>
            <input
              type="text"
              id="emergency-reset-input"
              value={resetConfirmInput}
              onChange={(e) => setResetConfirmInput(e.target.value.toUpperCase())}
              placeholder="Type RESET"
              className="w-full bg-[#262626] border border-[#393939] p-2 text-sm font-mono text-white text-center uppercase outline-none focus:border-[#da1e28]"
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="px-3 py-1.5 text-xs font-bold uppercase border border-[#8d8d8d] text-white hover:bg-[#262626]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (resetConfirmInput === 'RESET') {
                    onEmergencyReset();
                    setShowEmergencyModal(false);
                  } else {
                    alert('Please type RESET to confirm.');
                  }
                }}
                className="px-4 py-1.5 text-xs font-bold uppercase bg-[#da1e28] text-white hover:bg-[#b81b24]"
              >
                Reset PIN & Unlock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
