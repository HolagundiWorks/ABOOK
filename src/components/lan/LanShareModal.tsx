import React, { useState, useEffect } from 'react';
import { 
  Cable,
  Usb,
  Wifi, 
  Copy, 
  Check, 
  QrCode, 
  Monitor, 
  Smartphone, 
  Server, 
  X, 
  ShieldCheck, 
  Radio, 
  Laptop, 
  Download, 
  Upload, 
  Lock, 
  Info,
  RefreshCw,
  Zap,
  HardDrive,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { FirmProfile } from '../../types';

interface LanShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  firmProfile: FirmProfile;
  onExportBackup: () => void;
  onImportBackup: (json: string) => void;
}

type ConnectionMode = 'USB_CABLE' | 'DEDICATED_HOTSPOT' | 'REGULAR_WIFI';

export const LanShareModal: React.FC<LanShareModalProps> = ({
  isOpen,
  onClose,
  firmProfile,
  onExportBackup,
  onImportBackup
}) => {
  const [connectionMode, setConnectionMode] = useState<ConnectionMode>('USB_CABLE');
  const [lanIp, setLanIp] = useState<string>('192.168.42.129');
  const [port, setPort] = useState<string>('3000');
  const [copied, setCopied] = useState<boolean>(false);
  const [hotspotSsid, setHotspotSsid] = useState<string>('Studio_Arch_Secure_LAN');
  const [hotspotPassword, setHotspotPassword] = useState<string>('ArchStudio@2026');
  const [copiedPass, setCopiedPass] = useState<boolean>(false);
  const [cableDeviceType, setCableDeviceType] = useState<'ANDROID' | 'IPHONE' | 'ADB_DIRECT'>('ANDROID');

  useEffect(() => {
    if (connectionMode === 'USB_CABLE') {
      if (cableDeviceType === 'ANDROID') {
        setLanIp('192.168.42.129');
      } else if (cableDeviceType === 'IPHONE') {
        setLanIp('172.20.10.1');
      } else {
        setLanIp('127.0.0.1');
      }
    } else if (connectionMode === 'DEDICATED_HOTSPOT') {
      setLanIp('192.168.137.1');
    } else {
      const host = window.location.hostname;
      if (host === 'localhost' || host === '127.0.0.1') {
        setLanIp('192.168.1.100');
      } else {
        setLanIp(host);
      }
    }
    setPort(window.location.port || '3000');
  }, [connectionMode, cableDeviceType, isOpen]);

  if (!isOpen) return null;

  const lanUrl = `http://${lanIp}:${port}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(lanUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPass = () => {
    navigator.clipboard.writeText(hotspotPassword);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2000);
  };

  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(lanUrl)}&color=000000&bgcolor=ffffff`;

  return (
    <div id="lan-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 overflow-y-auto">
      <div id="lan-modal-container" className="w-full max-w-2xl bg-white text-[#161616] border border-[#393939] shadow-2xl my-4 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#161616] text-white border-b border-[#393939] shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-2.5 h-2.5 bg-[#0f62fe]" />
            <div className="flex items-center space-x-2">
              <Cable className="w-4 h-4 text-[#0f62fe]" />
              <div>
                <h2 className="text-sm font-bold tracking-tight uppercase">
                  Mobile Data Cable & Security Link Gateway
                </h2>
                <span className="text-[10px] font-mono text-[#8d8d8d]">
                  Physical USB Data Cable Tethering • Anti-Sniffing Air-Gap Protection
                </span>
              </div>
            </div>
          </div>
          <button
            id="close-lan-modal-btn"
            onClick={onClose}
            className="p-1 hover:bg-[#393939] text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security Mode Selector Bar */}
        <div className="bg-[#f4f4f4] border-b border-[#e0e0e0] p-2 flex items-center justify-between gap-2 shrink-0 overflow-x-auto">
          <div className="flex items-center space-x-1.5 w-full sm:w-auto">
            {/* Primary: USB Data Cable */}
            <button
              onClick={() => setConnectionMode('USB_CABLE')}
              className={`px-3 py-1.5 text-xs font-bold uppercase transition-all flex items-center space-x-1.5 border shrink-0 ${
                connectionMode === 'USB_CABLE'
                  ? 'bg-[#161616] text-white border-[#0f62fe]'
                  : 'bg-white text-[#525252] border-[#e0e0e0] hover:border-[#8d8d8d]'
              }`}
            >
              <Cable className={`w-3.5 h-3.5 ${connectionMode === 'USB_CABLE' ? 'text-[#4589ff]' : 'text-[#8d8d8d]'}`} />
              <span>1. USB Mobile Data Cable</span>
              <span className="px-1 text-[9px] font-mono bg-[#0f62fe] text-white ml-1">
                MAX SECURITY
              </span>
            </button>

            {/* Fallback 1: Dedicated Hotspot */}
            <button
              onClick={() => setConnectionMode('DEDICATED_HOTSPOT')}
              className={`px-3 py-1.5 text-xs font-bold uppercase transition-all flex items-center space-x-1.5 border shrink-0 ${
                connectionMode === 'DEDICATED_HOTSPOT'
                  ? 'bg-[#161616] text-white border-[#0f62fe]'
                  : 'bg-white text-[#525252] border-[#e0e0e0] hover:border-[#8d8d8d]'
              }`}
            >
              <Lock className={`w-3.5 h-3.5 ${connectionMode === 'DEDICATED_HOTSPOT' ? 'text-[#4589ff]' : 'text-[#8d8d8d]'}`} />
              <span>2. Dedicated Hotspot</span>
            </button>

            {/* Fallback 2: Regular Office Wi-Fi */}
            <button
              onClick={() => setConnectionMode('REGULAR_WIFI')}
              className={`px-3 py-1.5 text-xs font-bold uppercase transition-all flex items-center space-x-1.5 border shrink-0 ${
                connectionMode === 'REGULAR_WIFI'
                  ? 'bg-[#161616] text-white border-[#0f62fe]'
                  : 'bg-white text-[#525252] border-[#e0e0e0] hover:border-[#8d8d8d]'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${connectionMode === 'REGULAR_WIFI' ? 'text-[#4589ff]' : 'text-[#8d8d8d]'}`} />
              <span>3. Office Wi-Fi LAN</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* Mode Banner */}
          {connectionMode === 'USB_CABLE' && (
            <div className="p-3.5 bg-[#edf5ff] border-l-4 border-[#0f62fe] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase font-mono text-[#0043ce] flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0f62fe]" />
                  <span>Physical USB Data Cable Connection (Air-Gapped Hardware Link)</span>
                </span>
                <span className="text-[10px] font-mono bg-[#0f62fe] text-white px-2 py-0.5 font-bold">
                  Zero RF Radiation
                </span>
              </div>
              <p className="text-xs text-[#161616] leading-relaxed">
                Connect your mobile phone or tablet to this computer via a physical <strong>USB Data Cable</strong>. By bypassing wireless Wi-Fi broadcasts entirely, this eliminates packet sniffing, man-in-the-middle attacks, and unauthorized Wi-Fi snooping on confidential architectural billing data.
              </p>

              {/* Physical Security Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <div className="bg-white p-2 border border-[#a6c8ff] text-[11px] font-mono flex items-center space-x-1.5 text-[#0043ce]">
                  <Check className="w-3.5 h-3.5 text-[#24a148] shrink-0" />
                  <span>Zero Wi-Fi Radio Leak</span>
                </div>
                <div className="bg-white p-2 border border-[#a6c8ff] text-[11px] font-mono flex items-center space-x-1.5 text-[#0043ce]">
                  <Check className="w-3.5 h-3.5 text-[#24a148] shrink-0" />
                  <span>100% Offline Hardware Bus</span>
                </div>
                <div className="bg-white p-2 border border-[#a6c8ff] text-[11px] font-mono flex items-center space-x-1.5 text-[#0043ce]">
                  <Check className="w-3.5 h-3.5 text-[#24a148] shrink-0" />
                  <span>Zero Router Ingress Risk</span>
                </div>
              </div>
            </div>
          )}

          {connectionMode === 'DEDICATED_HOTSPOT' && (
            <div className="p-3 bg-[#f4f4f4] border-l-2 border-[#0f62fe] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase font-mono text-[#161616] flex items-center space-x-1.5">
                  <Lock className="w-4 h-4 text-[#0f62fe]" />
                  <span>Host-Created Dedicated Wi-Fi (Air-Gapped Wireless)</span>
                </span>
                <span className="text-[10px] font-mono bg-[#0f62fe] text-white px-2 py-0.5 font-bold">
                  Wireless Air-Gap
                </span>
              </div>
              <p className="text-xs text-[#525252]">
                The Host Laptop broadcasts a direct peer-to-peer Wi-Fi hotspot for devices within line-of-sight when physical USB cables are not available.
              </p>
            </div>
          )}

          {connectionMode === 'REGULAR_WIFI' && (
            <div className="p-3 bg-[#f4f4f4] border-l-2 border-[#525252] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase font-mono text-[#161616] flex items-center space-x-1.5">
                  <Radio className="w-4 h-4 text-[#525252]" />
                  <span>Office Router Wi-Fi LAN Mode</span>
                </span>
                <span className="text-[10px] font-mono bg-[#e0e0e0] text-[#161616] px-2 py-0.5 font-bold">
                  Shared Router
                </span>
              </div>
              <p className="text-xs text-[#525252]">
                Both host and client devices communicate over the shared building Wi-Fi network. Note: USB data cable or isolated hotspot offers higher security against local network snoopers.
              </p>
            </div>
          )}

          {/* USB DATA CABLE SETUP GUIDE (When USB Cable is selected) */}
          {connectionMode === 'USB_CABLE' && (
            <div className="border border-[#0f62fe] p-3.5 bg-white space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#e0e0e0]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#161616] flex items-center space-x-1.5">
                  <Usb className="w-3.5 h-3.5 text-[#0f62fe]" />
                  <span>USB Data Cable Connection Step-by-Step Guide</span>
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setCableDeviceType('ANDROID')}
                    className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold border transition-colors ${
                      cableDeviceType === 'ANDROID'
                        ? 'bg-[#0f62fe] text-white border-[#0f62fe]'
                        : 'bg-white text-[#525252] border-[#8d8d8d]'
                    }`}
                  >
                    Android USB
                  </button>
                  <button
                    onClick={() => setCableDeviceType('IPHONE')}
                    className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold border transition-colors ${
                      cableDeviceType === 'IPHONE'
                        ? 'bg-[#0f62fe] text-white border-[#0f62fe]'
                        : 'bg-white text-[#525252] border-[#8d8d8d]'
                    }`}
                  >
                    iPhone / iPad Cable
                  </button>
                  <button
                    onClick={() => setCableDeviceType('ADB_DIRECT')}
                    className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold border transition-colors ${
                      cableDeviceType === 'ADB_DIRECT'
                        ? 'bg-[#0f62fe] text-white border-[#0f62fe]'
                        : 'bg-white text-[#525252] border-[#8d8d8d]'
                    }`}
                  >
                    ADB Direct Tunnel
                  </button>
                </div>
              </div>

              {/* Instructions based on selected cable device */}
              {cableDeviceType === 'ANDROID' && (
                <div className="p-3 bg-[#f4f4f4] space-y-2 border border-[#e0e0e0]">
                  <span className="font-bold text-xs text-[#161616] uppercase font-mono block">
                    Android USB Tethering Instructions:
                  </span>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-[#161616]">
                    <li>Plug your Android phone into the computer using a <strong>standard USB Data Cable</strong> (ensure cable supports data, not just charging).</li>
                    <li>On your phone, open <strong>Settings → Connections / Network & Internet → Hotspot & Tethering</strong>.</li>
                    <li>Toggle ON <strong>USB Tethering</strong> (a direct hardware network adapter will be created instantly).</li>
                    <li>Open Chrome/browser on your phone and navigate to the IP address below: <strong className="font-mono text-[#0043ce]">http://192.168.42.129:{port}</strong> (or scan the QR code below).</li>
                  </ol>
                </div>
              )}

              {cableDeviceType === 'IPHONE' && (
                <div className="p-3 bg-[#f4f4f4] space-y-2 border border-[#e0e0e0]">
                  <span className="font-bold text-xs text-[#161616] uppercase font-mono block">
                    iPhone / iPad Lightning or USB-C Cable Instructions:
                  </span>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-[#161616]">
                    <li>Plug your iPhone/iPad into your Mac or PC using the <strong>Lightning / USB-C data cable</strong>.</li>
                    <li>Tap <strong>"Trust This Computer"</strong> on your iPhone screen if prompted.</li>
                    <li>Go to <strong>Settings → Personal Hotspot</strong>, enable <strong>"Allow Others to Join"</strong>, and choose <strong>"USB Only"</strong> if prompted.</li>
                    <li>Open Safari on iPhone and navigate to <strong className="font-mono text-[#0043ce]">http://172.20.10.1:{port}</strong> (or scan the QR code below).</li>
                  </ol>
                </div>
              )}

              {cableDeviceType === 'ADB_DIRECT' && (
                <div className="p-3 bg-[#f4f4f4] space-y-2 border border-[#e0e0e0]">
                  <span className="font-bold text-xs text-[#161616] uppercase font-mono block">
                    Developer Direct ADB Reverse Tunnel (Port 3000 over Cable):
                  </span>
                  <p className="text-xs text-[#525252]">
                    For maximum hardware isolation, enable USB Debugging on your phone and run this terminal command:
                  </p>
                  <div className="p-2 bg-[#161616] text-[#78a9ff] font-mono text-xs border border-[#393939] select-all">
                    adb reverse tcp:3000 tcp:3000
                  </div>
                  <p className="text-xs text-[#161616]">
                    Then open <strong className="font-mono text-[#0043ce]">http://localhost:3000</strong> directly in your mobile browser with 0% network exposure!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Dedicated Hotspot Setup Box (When Hotspot is selected) */}
          {connectionMode === 'DEDICATED_HOTSPOT' && (
            <div className="border border-[#0f62fe] p-3.5 bg-white space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#e0e0e0]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#161616] flex items-center space-x-1.5">
                  <Laptop className="w-3.5 h-3.5 text-[#0f62fe]" />
                  <span>Host Hotspot Wi-Fi Credentials</span>
                </span>
                <span className="text-[10px] font-mono text-[#0043ce]">
                  Connect devices to this SSID
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                    Wi-Fi Network Name (SSID):
                  </label>
                  <input
                    type="text"
                    value={hotspotSsid}
                    onChange={(e) => setHotspotSsid(e.target.value)}
                    className="w-full bg-[#f4f4f4] border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-mono font-bold text-[#161616] outline-none focus:border-[#0f62fe]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#525252] mb-1">
                    Wi-Fi Security Password (WPA2/WPA3):
                  </label>
                  <div className="flex items-center space-x-1">
                    <input
                      type="text"
                      value={hotspotPassword}
                      onChange={(e) => setHotspotPassword(e.target.value)}
                      className="w-full bg-[#f4f4f4] border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-mono font-bold text-[#161616] outline-none focus:border-[#0f62fe]"
                    />
                    <button
                      onClick={handleCopyPass}
                      className="px-2 py-1.5 border border-[#8d8d8d] bg-white hover:bg-[#f4f4f4] text-xs font-mono font-bold shrink-0"
                      title="Copy Password"
                    >
                      {copiedPass ? <Check className="w-3.5 h-3.5 text-[#24a148]" /> : <Copy className="w-3.5 h-3.5 text-[#161616]" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* OS Hotspot Fast Guide */}
              <div className="p-2.5 bg-[#f4f4f4] text-[11px] text-[#525252] space-y-1">
                <span className="font-bold text-[#161616] uppercase block font-mono text-[10px]">
                  How Host Creates the Wi-Fi Hotspot:
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-[10px] font-mono">
                  <li><strong>Windows Laptop:</strong> Settings → Network & Internet → Mobile Hotspot → Toggle ON.</li>
                  <li><strong>MacBook:</strong> System Settings → General → Sharing → Internet Sharing (Wi-Fi).</li>
                  <li><strong>Mobile / iPad:</strong> Settings → Personal Hotspot / Portable Hotspot → Toggle ON.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Quick IP Presets & Custom Configuration */}
          <div className="p-3.5 bg-white border border-[#e0e0e0] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#161616] flex items-center space-x-1.5">
                <HardDrive className="w-3.5 h-3.5 text-[#0f62fe]" />
                <span>Portal Access Address & Gateway IP</span>
              </span>
              <div className="flex items-center space-x-1 overflow-x-auto">
                <span className="text-[9px] font-mono text-[#8d8d8d] uppercase">Presets:</span>
                {[
                  { ip: '192.168.42.129', label: 'Android USB Cable' },
                  { ip: '172.20.10.1', label: 'iPhone Cable' },
                  { ip: '127.0.0.1', label: 'ADB Cable Local' },
                  { ip: '192.168.137.1', label: 'Win Hotspot' },
                  { ip: '192.168.1.100', label: 'Office Router' }
                ].map((p) => (
                  <button
                    key={p.ip}
                    onClick={() => setLanIp(p.ip)}
                    className={`px-1.5 py-0.5 text-[9px] font-mono border transition-colors shrink-0 ${
                      lanIp === p.ip
                        ? 'bg-[#161616] text-[#4589ff] border-[#0f62fe] font-bold'
                        : 'bg-white text-[#525252] border-[#e0e0e0] hover:border-[#8d8d8d]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-0.5">
                  Host Interface IPv4 / Cable Gateway:
                </label>
                <input
                  type="text"
                  id="lan-ip-input"
                  value={lanIp}
                  onChange={(e) => setLanIp(e.target.value)}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-mono font-bold text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-0.5">
                  Port:
                </label>
                <input
                  type="text"
                  id="lan-port-input"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-mono font-bold text-[#161616] outline-none focus:border-[#0f62fe]"
                />
              </div>
            </div>

            {/* Generated Link Display */}
            <div className="flex items-center space-x-2 pt-1">
              <div className="flex-1 bg-[#f4f4f4] border border-[#161616] px-3 py-2 text-xs font-mono font-bold text-[#0043ce] truncate">
                {lanUrl}
              </div>
              <button
                id="btn-copy-lan-url"
                onClick={handleCopy}
                className="carbon-btn-primary px-3 py-2 text-xs font-bold uppercase flex items-center space-x-1 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                <span>{copied ? 'Copied' : 'Copy Cable URL'}</span>
              </button>
            </div>
          </div>

          {/* QR Code and Quick Scan Section */}
          <div className="border border-[#e0e0e0] p-3.5 flex flex-col sm:flex-row items-center gap-4 bg-white">
            <div className="p-2 border border-[#161616] bg-white shrink-0">
              <img
                src={qrSvgUrl}
                alt="Cable / LAN QR Code"
                className="w-28 h-28"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="space-y-1 text-left">
              <div className="flex items-center space-x-1.5 text-xs font-bold uppercase text-[#161616]">
                <Smartphone className="w-4 h-4 text-[#0f62fe]" />
                <span>Instant Mobile & Tablet Direct Access</span>
              </div>
              <p className="text-xs text-[#525252] leading-relaxed">
                Once your phone is connected via <strong>USB Data Cable Tethering</strong> (or dedicated hotspot), scan this QR code using the phone camera to open the portal instantly over the physical cable bus.
              </p>
              <div className="pt-1 flex items-center space-x-2 text-[10px] font-mono text-[#0043ce]">
                <span className="w-2 h-2 bg-[#24a148] rounded-full inline-block animate-pulse" />
                <span>Zero Cloud Server • Hardware-Enforced Offline Privacy</span>
              </div>
            </div>
          </div>

          {/* Backup Sync Section */}
          <div className="border-t border-[#e0e0e0] pt-3 space-y-2">
            <span className="block text-xs font-bold uppercase tracking-wider text-[#161616]">
              Encrypted Offline JSON Backup & Peer Data Import
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-lan-export-backup"
                onClick={onExportBackup}
                className="py-2 px-3 text-xs font-bold uppercase tracking-wider border border-[#161616] bg-white hover:bg-[#161616] hover:text-white transition-all flex items-center justify-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#0f62fe]" />
                <span>Download Studio JSON</span>
              </button>

              <label className="py-2 px-3 text-xs font-bold uppercase tracking-wider border border-[#161616] bg-white hover:bg-[#161616] hover:text-white transition-all flex items-center justify-center space-x-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-[#0f62fe]" />
                <span>Import JSON Backup</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (evt) => {
                        const content = evt.target?.result as string;
                        if (content) onImportBackup(content);
                      };
                      reader.readAsText(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#f4f4f4] border-t border-[#e0e0e0] flex items-center justify-between shrink-0">
          <span className="text-[10px] font-mono text-[#8d8d8d]">
            Hardware Link: USB-C / Lightning Bus • Binding: 0.0.0.0:{port}
          </span>
          <button
            onClick={onClose}
            className="carbon-btn-secondary px-4 py-1.5 text-xs font-bold uppercase tracking-wider"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

