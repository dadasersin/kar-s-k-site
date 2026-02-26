import React, { useState, useEffect } from 'react';

const WeatherView: React.FC = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Konum Belirleniyor...');
  const [searchInput, setSearchInput] = useState('');

  const apiKey = "d9adaee289ac54703dda8e00a3c96628";

  const getLocalCity = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      const detectedCity = data.city || "Sakarya";
      checkWeather(detectedCity);
      setStatus(detectedCity);
    } catch {
      checkWeather("Sakarya");
      setStatus("Sakarya");
    }
  };

  const checkWeather = async (cityName: string) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&lang=tr&q=${cityName}&appid=${apiKey}`);
      const data = await response.json();
      if (data.cod === 200) {
        setWeatherData(data);
      } else {
        alert("Şehir bulunamadı!");
      }
    } catch (error) {
      console.error("Hava durumu alınamadı:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getLocalCity();
  }, []);

  const getIcon = (condition: string) => {
    const icons: Record<string, string> = {
      "Clouds": "fa-cloud",
      "Clear": "fa-sun",
      "Rain": "fa-cloud-showers-heavy",
      "Snow": "fa-snowflake"
    };
    return icons[condition] || "fa-cloud-sun";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      checkWeather(searchInput);
      setStatus(searchInput);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
         style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1534088568595-a066f710b721?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80')" }}>

      <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-[30px] w-full max-w-[420px] text-center text-white shadow-2xl animate-in fade-in zoom-in duration-500">

        <div className="bg-white/20 px-4 py-1.5 rounded-full text-[12px] mb-6 inline-flex items-center gap-2">
          <i className="fas fa-location-dot"></i>
          <span className="font-bold uppercase tracking-widest">{status}</span>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Şehir ara..."
            className="flex-1 bg-white/90 text-slate-900 px-5 py-3 rounded-full outline-none focus:ring-2 ring-primary/50 transition-all text-sm font-medium"
          />
          <button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-lg"
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </form>

        <div className="weather-info min-h-[300px] flex flex-col items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <i className="fa-solid fa-spinner fa-spin text-6xl opacity-50"></i>
              <p className="text-xs font-black uppercase tracking-widest opacity-50">Veriler Alınıyor...</p>
            </div>
          ) : weatherData ? (
            <>
              <div className="text-[90px] mb-4 drop-shadow-2xl">
                <i className={`fa-solid ${getIcon(weatherData.weather[0].main)}`}></i>
              </div>
              <h2 className="text-7xl font-black italic tracking-tighter mb-2">{Math.round(weatherData.main.temp)}°C</h2>
              <h1 className="text-2xl font-bold uppercase tracking-tight mb-1">{weatherData.name}</h1>
              <p className="text-lg font-medium opacity-80 capitalize mb-8">{weatherData.weather[0].description}</p>

              <div className="grid grid-cols-2 gap-4 w-full bg-white/10 p-5 rounded-2xl border border-white/5">
                <div className="flex flex-col items-center gap-1 border-r border-white/10">
                  <i className="fa-solid fa-droplet text-primary mb-1"></i>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Nem</p>
                  <span className="font-bold text-lg">{weatherData.main.humidity}%</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <i className="fa-solid fa-wind text-primary mb-1"></i>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Rüzgar</p>
                  <span className="font-bold text-lg">{weatherData.wind.speed} km/s</span>
                </div>
              </div>
            </>
          ) : (
            <p>Hata oluştu</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherView;
