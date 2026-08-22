import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Download, 
  Check, 
  X, 
  Copy, 
  Terminal, 
  Layers, 
  ShieldCheck, 
  ExternalLink,
  Zap,
  ArrowRight,
  PackageCheck,
  CheckCircle2,
  HardDrive
} from 'lucide-react';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onInstallPwa: () => void;
}

type TabType = 'WEBAPK' | 'PWABUILDER_APK' | 'CAPACITOR_APK' | 'GITHUB_ACTIONS';

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstallPwa
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('PWABUILDER_APK');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
  }, []);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const capacitorCommands = `# 1. Install Capacitor CLI & Android platform
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Architect Studio Suite" "com.architectstudio.suite" --web-dir dist

# 2. Build the production React bundle
npm run build

# 3. Add Android native wrapper & open in Android Studio
npx cap add android
npx cap sync
npx cap open android

# 4. In Android Studio: Build -> Build Bundle(s) / APK(s) -> Build APK(s)`;

  const bubblewrapCommands = `# Generate signed Android APK / TWA directly from CLI
npm install -g @bubblewrap/cli
bubblewrap init --manifest="${window.location.origin}/manifest.json"
bubblewrap build`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white max-w-2xl w-full max-h-[92vh] flex flex-col border border-[#393939]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#393939] flex items-center justify-between bg-[#161616] text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-3 h-3 bg-[#0f62fe]" />
            <div>
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-[#0f62fe]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider leading-tight">
                  Android App & APK Deployment Suite
                </h3>
              </div>
              <p className="text-[11px] font-mono text-[#8d8d8d]">
                Install as Native WebAPK, compile Standalone Android APK, or run in Offline Standalone Mode
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8d8d8d] hover:text-white hover:bg-[#262626] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#f4f4f4] border-b border-[#e0e0e0] p-2 flex items-center space-x-1 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('PWABUILDER_APK')}
            className={`px-3 py-1.5 text-xs font-bold uppercase transition-all flex items-center space-x-1.5 border shrink-0 ${
              activeTab === 'PWABUILDER_APK'
                ? 'bg-[#161616] text-white border-[#0f62fe]'
                : 'bg-white text-[#525252] border-[#e0e0e0] hover:border-[#8d8d8d]'
            }`}
          >
            <Download className={`w-3.5 h-3.5 ${activeTab === 'PWABUILDER_APK' ? 'text-[#4589ff]' : 'text-[#8d8d8d]'}`} />
            <span>1. 1-Click Online .APK Builder</span>
            <span className="px-1 text-[9px] font-mono bg-[#0f62fe] text-white">
              EASIEST
            </span>
          </button>

          <button
            onClick={() => setActiveTab('WEBAPK')}
            className={`px-3 py-1.5 text-xs font-bold uppercase transition-all flex items-center space-x-1.5 border shrink-0 ${
              activeTab === 'WEBAPK'
                ? 'bg-[#161616] text-white border-[#0f62fe]'
                : 'bg-white text-[#525252] border-[#e0e0e0] hover:border-[#8d8d8d]'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${activeTab === 'WEBAPK' ? 'text-[#4589ff]' : 'text-[#8d8d8d]'}`} />
            <span>2. Instant 1-Tap Install (WebAPK)</span>
          </button>

          <button
            onClick={() => setActiveTab('CAPACITOR_APK')}
            className={`px-3 py-1.5 text-xs font-bold uppercase transition-all flex items-center space-x-1.5 border shrink-0 ${
              activeTab === 'CAPACITOR_APK'
                ? 'bg-[#161616] text-white border-[#0f62fe]'
                : 'bg-white text-[#525252] border-[#e0e0e0] hover:border-[#8d8d8d]'
            }`}
          >
            <PackageCheck className={`w-3.5 h-3.5 ${activeTab === 'CAPACITOR_APK' ? 'text-[#4589ff]' : 'text-[#8d8d8d]'}`} />
            <span>3. Local CLI / Android Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('GITHUB_ACTIONS')}
            className={`px-3 py-1.5 text-xs font-bold uppercase transition-all flex items-center space-x-1.5 border shrink-0 ${
              activeTab === 'GITHUB_ACTIONS'
                ? 'bg-[#161616] text-white border-[#0f62fe]'
                : 'bg-white text-[#525252] border-[#e0e0e0] hover:border-[#8d8d8d]'
            }`}
          >
            <Terminal className={`w-3.5 h-3.5 ${activeTab === 'GITHUB_ACTIONS' ? 'text-[#4589ff]' : 'text-[#8d8d8d]'}`} />
            <span>4. Auto GitHub CI/CD APK</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: 1-Click Online .APK Builder via PWABuilder */}
          {activeTab === 'PWABUILDER_APK' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#edf5ff] border-l-4 border-[#0f62fe] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase font-mono text-[#0043ce] flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#0f62fe]" />
                    <span>Instant Cloud .APK Package Generation</span>
                  </span>
                  <span className="text-[10px] font-mono bg-[#0f62fe] text-white px-2 py-0.5 font-bold">
                    Zero Setup Required
                  </span>
                </div>
                <p className="text-xs text-[#161616] leading-relaxed">
                  Because web sandbox containers do not include the 5GB Android Java SDK compiler tools, you can package this app into a signed Android <strong className="text-[#0043ce]">.apk / .aab package</strong> in under 60 seconds using the official Microsoft PWABuilder cloud packaging pipeline.
                </p>
              </div>

              {/* Action Box */}
              <div className="p-4 bg-white border border-[#161616] space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#e0e0e0]">
                  <div>
                    <h4 className="text-sm font-bold text-[#161616] uppercase tracking-wider">
                      Architect Studio Suite — Manifest v1.0.0
                    </h4>
                    <span className="text-xs font-mono text-[#525252]">
                      Target: Android 14 (API 34) • Package: com.architectstudio.suite
                    </span>
                  </div>
                  <a
                    href={`https://www.pwabuilder.com/publish?url=${encodeURIComponent(window.location.origin)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="carbon-btn-primary px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 shrink-0 shadow-md"
                  >
                    <span>Generate .APK on PWABuilder</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="p-3 bg-[#f4f4f4] space-y-2 text-xs text-[#161616]">
                  <span className="font-bold uppercase font-mono block text-[#161616]">
                    How to download your .APK file in 3 simple steps:
                  </span>
                  <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                    <li>Click the <strong>"Generate .APK on PWABuilder"</strong> button above.</li>
                    <li>Click <strong>"Store Package"</strong> or <strong>"Generate Android Package"</strong>.</li>
                    <li>Download the signed <strong>.apk</strong> (or <strong>.aab</strong> for Google Play Store) directly to your computer or phone and install!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
          {/* TAB 1: Instant Android WebAPK / PWA */}
          {activeTab === 'WEBAPK' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#edf5ff] border-l-4 border-[#0f62fe] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase font-mono text-[#0043ce] flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#0f62fe]" />
                    <span>Native Android Standalone WebAPK Architecture</span>
                  </span>
                  {isInstalled && (
                    <span className="text-[10px] font-mono bg-[#24a148] text-white px-2 py-0.5 font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Active Standalone Mode</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#161616] leading-relaxed">
                  Installing the app converts it into a full Android launcher app with its own dedicated app icon, splash screen, zero browser address bar, full-screen offline storage, and home-screen shortcuts.
                </p>
              </div>

              {/* Install Action Card */}
              <div className="p-4 bg-white border border-[#161616] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-14 h-14 bg-[#161616] border border-[#393939] p-2 flex items-center justify-center shrink-0">
                    <img src="/icon.svg" alt="App Icon" className="w-10 h-10" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#161616] uppercase tracking-wider">
                      Architect Studio Suite
                    </h4>
                    <span className="text-xs font-mono text-[#525252] block">
                      Package: com.architectstudio.suite • v1.0.0
                    </span>
                    <span className="text-[10px] text-[#24a148] font-bold font-mono">
                      ✓ Offline Service Worker Active • Instant Boot
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  id="btn-install-android-app"
                  onClick={onInstallPwa}
                  className="carbon-btn-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 shrink-0 shadow-md"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>Install on Android Device</span>
                </button>
              </div>

              {/* Manual Installation Guide */}
              <div className="p-4 bg-[#f4f4f4] border border-[#e0e0e0] space-y-2.5">
                <span className="font-bold text-xs text-[#161616] uppercase tracking-wider font-mono block">
                  Android Chrome / Samsung Internet Manual Steps:
                </span>
                <ol className="list-decimal list-inside space-y-2 text-xs text-[#161616] leading-relaxed">
                  <li>
                    Open this URL on your Android device (or via the <strong>USB Cable Tethering</strong> connection).
                  </li>
                  <li>
                    Tap the <strong>Chrome menu (three dots ⋮)</strong> in the top right corner.
                  </li>
                  <li>
                    Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                  </li>
                  <li>
                    Confirm <strong>"Install"</strong> — Android will automatically generate a native signed WebAPK and place it into your app drawer.
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: Capacitor Native APK Build */}
          {activeTab === 'CAPACITOR_APK' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-[#f4f4f4] border-l-4 border-[#393939] space-y-1.5">
                <span className="text-xs font-bold uppercase font-mono text-[#161616] block">
                  Capacitor Native Android Project & .APK Compilation
                </span>
                <p className="text-xs text-[#525252]">
                  Wrap this application in a native Kotlin/Java Android Studio project to compile an offline standalone <strong className="text-[#161616]">.apk</strong> or Google Play Store <strong className="text-[#161616]">.aab</strong> release bundle.
                </p>
              </div>

              <div className="border border-[#393939] bg-[#161616] text-white p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-[#78a9ff] uppercase">
                    Terminal Commands (Run in project root)
                  </span>
                  <button
                    onClick={() => handleCopy(capacitorCommands, 'cap')}
                    className="px-2.5 py-1 text-[11px] font-mono uppercase bg-[#262626] hover:bg-[#393939] text-white border border-[#525252] flex items-center space-x-1 transition-colors"
                  >
                    {copiedCode === 'cap' ? <Check className="w-3 h-3 text-[#42be65]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode === 'cap' ? 'Copied' : 'Copy Commands'}</span>
                  </button>
                </div>
                <pre className="p-2.5 bg-[#0c0c0c] border border-[#262626] text-[11px] font-mono text-[#e0e0e0] overflow-x-auto whitespace-pre leading-relaxed">
                  {capacitorCommands}
                </pre>
              </div>

              <div className="p-3 bg-white border border-[#e0e0e0] text-xs text-[#525252] space-y-1.5">
                <span className="font-bold text-[#161616] uppercase font-mono block">
                  Hardware & Native Android Features Available in Capacitor:
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                  <li className="flex items-center space-x-1 text-[#161616]">
                    <Check className="w-3.5 h-3.5 text-[#24a148]" />
                    <span>Android Keystore Biometrics</span>
                  </li>
                  <li className="flex items-center space-x-1 text-[#161616]">
                    <Check className="w-3.5 h-3.5 text-[#24a148]" />
                    <span>Bluetooth Thermal Receipt Printing</span>
                  </li>
                  <li className="flex items-center space-x-1 text-[#161616]">
                    <Check className="w-3.5 h-3.5 text-[#24a148]" />
                    <span>Direct USB OTG Host Communication</span>
                  </li>
                  <li className="flex items-center space-x-1 text-[#161616]">
                    <Check className="w-3.5 h-3.5 text-[#24a148]" />
                    <span>Native SQLite / Encrypted SQLCipher</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: Automated GitHub Actions APK Build */}
          {activeTab === 'GITHUB_ACTIONS' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-[#edf5ff] border-l-4 border-[#0f62fe] space-y-1.5">
                <span className="text-xs font-bold uppercase font-mono text-[#0043ce] block">
                  Automated GitHub Actions Android .APK Compiler
                </span>
                <p className="text-xs text-[#161616]">
                  We have added <code className="font-mono bg-[#d0e2ff] px-1">.github/workflows/build-apk.yml</code> and <code className="font-mono bg-[#d0e2ff] px-1">capacitor.config.json</code> to this project. When you export or push to GitHub, a fresh <strong>Architect-Studio-Suite-debug.apk</strong> file will be compiled automatically in the cloud on every commit.
                </p>
              </div>

              <div className="p-3 bg-white border border-[#e0e0e0] space-y-2 text-xs text-[#161616]">
                <span className="font-bold uppercase font-mono block text-[#161616]">
                  How to download your compiled .APK from GitHub:
                </span>
                <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                  <li>Push or Export this repository to your GitHub account.</li>
                  <li>Go to the <strong>Actions</strong> tab on your GitHub repository.</li>
                  <li>Click on the latest <strong>"Build Android APK"</strong> workflow run.</li>
                  <li>Scroll down to <strong>Artifacts</strong> and click <strong className="font-mono text-[#0043ce]">Architect-Studio-Suite-debug.apk</strong> to download your ready-to-install Android APK!</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#f4f4f4] border-t border-[#e0e0e0] flex items-center justify-between shrink-0">
          <span className="text-[10px] font-mono text-[#8d8d8d]">
            Android SDK Target: 34 (Android 14) • Standalone PWA Ready
          </span>
          <button
            onClick={onClose}
            className="carbon-btn-secondary px-4 py-1.5 text-xs font-bold uppercase"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
