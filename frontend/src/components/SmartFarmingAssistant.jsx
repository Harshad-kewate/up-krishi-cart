import { useState, useEffect } from 'react';
import { MapPin, Leaf, Sparkles, AlertTriangle, Cloud, Sun, CloudRain, Thermometer, Droplets, Wind } from 'lucide-react';

const SmartFarmingAssistant = () => {
  // Safe state initialization
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cropInput, setCropInput] = useState({
    cropName: "",
    season: "",
    soilType: "",
    goal: ""
  });

  const [cropSuggestion, setCropSuggestion] = useState(null);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [suggestionError, setSuggestionError] = useState("");

  // Safe geolocation function
  const getLocationSafe = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
          });
        },
        (err) => {
          console.error("Geolocation error:", err);
          // Return fallback instead of rejecting
          resolve({
            lat: 26.8467,
            lon: 80.9462,
            fallback: true
          });
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  // Safe weather fetch
  const fetchWeatherSafe = async (coords) => {
    try {
      const res = await fetch(`http://localhost:5000/api/weather?lat=${coords.lat}&lon=${coords.lon}`);
      if (!res.ok) {
        throw new Error("Weather API failed");
      }
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Weather fetch error:", err);
      throw err;
    }
  };

  // Safe crop suggestion
  const getCropSuggestion = async () => {
    if (!cropInput.cropName || !cropInput.season || !cropInput.soilType || !cropInput.goal) {
      setSuggestionError("Please fill all fields");
      return;
    }

    if (!weatherData?.current) {
      setSuggestionError("Weather data required for suggestions");
      return;
    }

    setSuggestionLoading(true);
    setSuggestionError("");

    try {
      const payload = {
        cropName: cropInput.cropName,
        season: cropInput.season,
        soilType: cropInput.soilType,
        goal: cropInput.goal,
        weather: {
          temperature: weatherData.current.temperature,
          humidity: weatherData.current.humidity,
          condition: weatherData.current.conditionCode
        }
      };

      const res = await fetch('http://localhost:5000/api/crop-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setCropSuggestion(data);
      } else {
        setSuggestionError("Failed to get suggestions");
      }
    } catch (error) {
      console.error('Crop suggestion error:', error);
      setSuggestionError("Error connecting to service");
    } finally {
      setSuggestionLoading(false);
    }
  };

  // Main initialization flow
  const initSmartFarming = async () => {
    try {
      setLoading(true);
      setError("");

      const coords = await getLocationSafe();
      setLocation(coords);

      const weather = await fetchWeatherSafe(coords);
      setLocation(weather.location);
      setWeatherData({ current: weather.current });
      setForecast(weather.forecast || []);

    } catch (err) {
      console.error("Smart farming init error:", err);
      setError("Smart Farming Assistant temporarily unavailable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initSmartFarming();
  }, []);

  // Weather icon helper
  const getWeatherIcon = (code) => {
    if (code === 0) return <Sun className="w-6 h-6 text-yellow-500" />;
    if (code === 1 || code === 2 || code === 3) return <Cloud className="w-6 h-6 text-gray-500" />;
    if (code >= 51 && code <= 67) return <CloudRain className="w-6 h-6 text-blue-500" />;
    return <Cloud className="w-6 h-6 text-gray-400" />;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl border border-green-200 shadow-sm">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-green-200 rounded-lg w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 bg-green-200 rounded-xl"></div>
            <div className="h-32 bg-green-200 rounded-xl"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-24 bg-green-200 rounded-xl"></div>
            <div className="h-24 bg-green-200 rounded-xl"></div>
            <div className="h-24 bg-green-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl border border-green-200 shadow-sm">
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-green-800 mb-2">Smart Farming Assistant</h3>
          <p className="text-green-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl border border-green-200 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-900 flex items-center gap-3">
          <Sparkles className="w-7 h-7 text-green-600" />
          Smart Farming Assistant
        </h2>
        <p className="text-green-700 mt-1 font-medium">
          Live weather + crop recommendations based on your location
        </p>
      </div>

      {/* Row 1: Location & Current Weather */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Location Card */}
        <div className="bg-white/80 backdrop-blur rounded-xl border border-green-200 p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="w-5 h-5 text-green-600" />
            <span className="font-bold text-green-800">Your Location</span>
          </div>
          <div className="space-y-1">
            <p className="text-lg font-black text-green-900">
              {location?.city || 'Unknown'}, {location?.state || 'Location'}
            </p>
            <p className="text-sm text-green-600">
              {location?.fallback ? 'Using default location' : 'Live location detected'}
            </p>
          </div>
        </div>

        {/* Current Weather Card */}
        <div className="bg-white/80 backdrop-blur rounded-xl border border-green-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-green-800">Current Weather</span>
            {getWeatherIcon(weatherData?.current?.conditionCode)}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <Thermometer className="w-4 h-4 text-red-500 mx-auto mb-1" />
              <p className="text-xs font-bold text-gray-500">Temp</p>
              <p className="font-black text-green-900 text-lg">
                {weatherData?.current?.temperature || '--'}°C
              </p>
            </div>
            <div className="text-center">
              <Droplets className="w-4 h-4 text-blue-500 mx-auto mb-1" />
              <p className="text-xs font-bold text-gray-500">Humidity</p>
              <p className="font-black text-green-900 text-lg">
                {weatherData?.current?.humidity || '--'}%
              </p>
            </div>
            <div className="text-center">
              <CloudRain className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
              <p className="text-xs font-bold text-gray-500">Rain</p>
              <p className="font-black text-green-900 text-lg">
                {weatherData?.current?.precipitation || '--'}mm
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: 3-Day Forecast */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-green-800 mb-4">3-Day Forecast</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {forecast?.slice(0, 3)?.map((day, idx) => (
            <div key={idx} className="bg-white/60 rounded-xl border border-green-100 p-4 shadow-sm">
              <p className="text-sm font-bold text-green-700 mb-2">
                {idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : 'Day 3'}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getWeatherIcon(day?.conditionCode)}
                  <div>
                    <p className="font-bold text-green-900">
                      {day?.maxTemp || '--'}°C
                    </p>
                    <p className="text-xs text-green-600">
                      {day?.minTemp || '--'}°C
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-blue-600">
                    Rain: {day?.rainProb || '--'}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Crop Suggestion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white/80 backdrop-blur rounded-xl border border-green-200 p-4 shadow-sm">
          <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
            <Leaf className="w-5 h-5" />
            Crop Recommendation
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-bold text-green-700 mb-1">Crop Name</label>
              <input
                type="text"
                value={cropInput.cropName}
                onChange={(e) => setCropInput({...cropInput, cropName: e.target.value})}
                className="w-full px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-green-900 focus:ring-2 focus:ring-green-300 focus:border-green outline-none text-sm"
                placeholder="e.g., Wheat, Rice, Tomato"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-green-700 mb-1">Season</label>
                <select
                  value={cropInput.season}
                  onChange={(e) => setCropInput({...cropInput, season: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-green-900 focus:ring-2 focus:ring-green-300 focus:border-green outline-none text-sm"
                >
                  <option value="">Select</option>
                  <option value="kharif">Kharif</option>
                  <option value="rabi">Rabi</option>
                  <option value="zaid">Zaid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-green-700 mb-1">Soil Type</label>
                <select
                  value={cropInput.soilType}
                  onChange={(e) => setCropInput({...cropInput, soilType: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-green-900 focus:ring-2 focus:ring-green-300 focus:border-green outline-none text-sm"
                >
                  <option value="">Select</option>
                  <option value="alluvial">Alluvial</option>
                  <option value="black">Black</option>
                  <option value="red">Red</option>
                  <option value="sandy">Sandy</option>
                  <option value="clay">Clay</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-green-700 mb-1">Goal</label>
              <select
                value={cropInput.goal}
                onChange={(e) => setCropInput({...cropInput, goal: e.target.value})}
                className="w-full px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-green-900 focus:ring-2 focus:ring-green-300 focus:border-green outline-none text-sm"
              >
                <option value="">Select Goal</option>
                <option value="yield">Max Yield</option>
                <option value="organic">Organic</option>
                <option value="fast">Fast Growth</option>
                <option value="drought">Drought Resistant</option>
              </select>
            </div>

            <button
              onClick={getCropSuggestion}
              disabled={suggestionLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {suggestionLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Get Suggestions
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white/80 backdrop-blur rounded-xl border border-green-200 p-4 shadow-sm">
          <h3 className="text-lg font-bold text-green-800 mb-4">Recommendations</h3>

          {suggestionError && (
            <div className="bg-red-50 p-3 rounded-lg border border-red-200 mb-4">
              <p className="text-red-700 text-sm font-medium">{suggestionError}</p>
            </div>
          )}

          {cropSuggestion?.crops?.length > 0 ? (
            <div className="space-y-3">
              {cropSuggestion.crops.map((crop, idx) => (
                <div key={idx} className="bg-green-50 p-3 rounded-lg border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-green-900">{crop.name}</h4>
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-bold">
                      {crop.confidence}% match
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mb-2">{crop.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {crop.benefits?.slice(0, 2)?.map((benefit, i) => (
                      <span key={i} className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {cropSuggestion.tips?.length > 0 && (
                <div className="mt-4 pt-3 border-t border-green-200">
                  <h5 className="font-bold text-green-800 mb-2 text-sm">Tips:</h5>
                  <ul className="text-xs text-green-700 space-y-1">
                    {cropSuggestion.tips.slice(0, 3).map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : !suggestionLoading && !suggestionError ? (
            <div className="text-center py-8">
              <Sparkles className="w-8 h-8 text-green-300 mx-auto mb-3" />
              <p className="text-green-600 text-sm">
                Fill the form and get personalized crop recommendations
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SmartFarmingAssistant;