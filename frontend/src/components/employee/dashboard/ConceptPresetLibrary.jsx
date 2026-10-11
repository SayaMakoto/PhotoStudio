import React from 'react';
import { Sparkles, Download, Eye, ExternalLink, Image } from 'lucide-react';
import { CONCEPTS_PRESETS } from '../employeeData';

export default function ConceptPresetLibrary() {
  const handleDownload = (fileName) => {
    alert(`Mô phỏng: Đang tải tệp chuẩn [${fileName}] về máy...`);
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-md space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-neutral-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-amber-400" />
            <span>Thư Viện Concept Moodboard & Preset Màu Chuẩn Studio</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Xem hình ảnh mẫu tạo dáng, sơ đồ đánh sáng và tải preset Lightroom (.xmp / .dng) đồng bộ màu sắc.
          </p>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {CONCEPTS_PRESETS.map((item) => (
          <div
            key={item.id}
            className="group overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/70 hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Image Preview */}
              <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-2.5 left-2.5 rounded-full bg-neutral-950/80 backdrop-blur-md border border-neutral-800 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
                  {item.category}
                </span>
              </div>

              {/* Info */}
              <div className="p-4 space-y-2">
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Action */}
            <div className="p-4 pt-0 border-t border-neutral-850 flex items-center justify-between text-xs mt-3">
              <span className="text-[11px] text-neutral-500 font-mono">
                {item.downloads} lượt tải
              </span>

              <button
                onClick={() => handleDownload(item.presetFile)}
                className="flex items-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold px-3 py-1.5 text-xs transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Tải Preset</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
