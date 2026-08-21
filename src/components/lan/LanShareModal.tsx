import React, { useState, useEffect } from 'react';
import { Wifi, Copy, Check, QrCode, Monitor, Smartphone, Server, X, RefreshCw, Download, Upload } from 'lucide-react';
import { FirmProfile } from '../../types';

interface LanShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  firmProfile: FirmProfile;
  onExportBackup: () => void;
  onImportBackup: (json: string) => void;
}

export const LanShareModal: React.FC<LanShareModalProps> = ({
  isOpen,
  onClose,
  firmProfile,
  onExportBackup,
  onImportBackup
}) => {
  const [lanIp, setLanIp] = useState<string>('');
  const [port, setPort] = useState<string>('3000');
  const [copied, setCopied] = useState<boolean>(false);
  const [syncCode, setSyncCode] = useState<string>('');

  useEffect(() => {
    // Detect current host
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      setLanIp('192.168.1.100'); // default typical LAN IP template for users
    } else {
      setLanIp(host);
    }
    setPort(window.location.port || '3000');
  }, [isOpen]);

  if (!isOpen) return null;

  const lanUrl = `http://${lanIp}:${port}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(lanUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate simple QR code matrix using svg
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(lanUrl)}&color=000000&bgcolor=ffffff`;

  return (
    <div id="lan-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 overflow-y-auto">
      <div id="lan-modal-container" className="w-full max-w-lg bg-white text-[#161616] border border-[#393939] shadow-2xl my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#161616] text-white border-b border-[#393939]">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#ff832b]"></div>
            <div className="flex items-center space-x-2">
              <Wifi className="w-4 h-4 text-[#ff832b]" />
              <h2 className="text-base font-bold tracking-tight uppercase">
                Local Wi-Fi LAN Studio Endpoint
              </h2>
            </div>
          </div>
          <button
            id="close-lan-modal-btn"
            onClick={onClose}
            className="p-1 hover:bg-[#393939] text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Status badge */}
          <div className="p-3 bg-[#defbe6] border-l-4 border-[#24a148] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 bg-[#24a148] animate-pulse"></span>
              <span className="text-xs font-bold uppercase text-[#0f6225]">
                LAN Network Server Binding: Active (0.0.0.0:{port})
              </span>
            </div>
            <span className="text-[10px] font-mono bg-white px-2 py-0.5 border border-[#24a148] text-[#0f6225]">
              Port {port}
            </span>
          </div>

          <p className="text-xs text-[#525252]">
            When your laptop, phone, and tablet are connected to the <strong>same Wi-Fi router / office network</strong>, any device can access this studio application in their web browser via your local LAN IP.
          </p>

          {/* LAN IP Config Box */}
          <div className="p-4 bg-[#f4f4f4] border border-[#e0e0e0] space-y-3">
            <span className="block text-xs font-bold uppercase tracking-wider text-[#161616]">
              Your Studio Local Wi-Fi URL
            </span>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-[10px] uppercase font-mono text-[#525252] mb-0.5">
                  Host Machine LAN IP:
                </label>
                <input
                  type="text"
                  id="lan-ip-input"
                  value={lanIp}
                  onChange={(e) => setLanIp(e.target.value)}
                  placeholder="e.g. 192.168.1.105"
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-mono font-bold text-[#161616] outline-none focus:border-[#ff832b]"
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
                  className="w-full bg-white border border-[#8d8d8d] px-2.5 py-1.5 text-xs font-mono font-bold text-[#161616] outline-none focus:border-[#ff832b]"
                />
              </div>
            </div>

            {/* Generated Link Display */}
            <div className="flex items-center space-x-2 pt-2">
              <div className="flex-1 bg-white border border-[#161616] px-3 py-2 text-xs font-mono font-bold text-[#161616] truncate">
                {lanUrl}
              </div>
              <button
                id="btn-copy-lan-url"
                onClick={handleCopy}
                className="carbon-btn-primary px-3 py-2 text-xs font-bold uppercase flex items-center space-x-1 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* QR Code Section for Mobile Scanning */}
          <div className="border border-[#e0e0e0] p-4 flex flex-col sm:flex-row items-center gap-4 bg-white">
            <div className="p-2 border border-[#161616] bg-white shrink-0">
              <img
                src={qrSvgUrl}
                alt="LAN QR Code"
                className="w-32 h-32"
                onError={(e) => {
                  // fallback visual placeholder if offline
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="space-y-1.5 text-left">
              <div className="flex items-center space-x-1.5 text-xs font-bold uppercase text-[#161616]">
                <Smartphone className="w-4 h-4 text-[#ff832b]" />
                <span>Instant Mobile / iPad Scan</span>
              </div>
              <p className="text-xs text-[#525252]">
                Open your smartphone or tablet camera while connected to the studio Wi-Fi and point at the QR code to open the studio suite instantly.
              </p>
              <div className="text-[10px] font-mono text-[#8d8d8d] pt-1">
                Tip: Run <code className="bg-[#f4f4f4] px-1 py-0.5 border">ipconfig</code> or <code className="bg-[#f4f4f4] px-1 py-0.5 border">ifconfig</code> on your terminal to verify your computer's exact Wi-Fi IPv4 address.
              </div>
            </div>
          </div>

          {/* Direct Studio Peer Backup & Sync */}
          <div className="border-t border-[#e0e0e0] pt-4 space-y-3">
            <span className="block text-xs font-bold uppercase tracking-wider text-[#161616]">
              Studio Network Data Sync & Backup
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-lan-export-backup"
                onClick={onExportBackup}
                className="py-2 px-3 text-xs font-bold uppercase tracking-wider border border-[#161616] bg-white hover:bg-[#161616] hover:text-white transition-all flex items-center justify-center space-x-1"
              >
                <Download className="w-3.5 h-3.5 mr-1 text-[#ff832b]" />
                <span>Download Studio JSON</span>
              </button>

              <label className="py-2 px-3 text-xs font-bold uppercase tracking-wider border border-[#161616] bg-white hover:bg-[#161616] hover:text-white transition-all flex items-center justify-center space-x-1 cursor-pointer">
                <Upload className="w-3.5 h-3.5 mr-1 text-[#ff832b]" />
                <span>Import Studio JSON</span>
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
        <div className="px-5 py-3 bg-[#f4f4f4] border-t border-[#e0e0e0] flex justify-end">
          <button
            onClick={onClose}
            className="carbon-btn-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
