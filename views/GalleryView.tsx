import React, { useState } from 'react';

const GalleryView: React.FC = () => {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  return (
    <section className="section-transition p-8 lg:p-12 animate-in fade-in duration-500 h-full overflow-y-auto pb-32" id="gallery">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
          <i className="fa-solid fa-image text-primary"></i>
          Üretilen Sanat Galerisi
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              onClick={() => setSelectedImg(`https://picsum.photos/seed/${i + 30}/1200`)}
              className="aspect-square bg-surface border border-white/5 rounded-custom overflow-hidden group relative cursor-pointer"
            >
              <img src={`https://picsum.photos/seed/${i + 30}/400`} alt="Gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <button className="bg-white text-brandDark p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all shadow-xl">
                  <i className="fa-solid fa-expand"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal View */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 lg:p-12 animate-in fade-in duration-300"
          onClick={() => setSelectedImg(null)}
        >
          <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
             <i className="fa-solid fa-xmark text-3xl"></i>
          </button>
          <img src={selectedImg} alt="Preview" className="max-w-full max-h-full rounded-custom shadow-2xl animate-in zoom-in-95 duration-300" />
        </div>
      )}
    </section>
  );
};

export default GalleryView;
