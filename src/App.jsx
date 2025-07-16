import React, { useState, useRef, useEffect } from 'react';
import { Shield, Camera, AlertTriangle, Eye, TrendingUp, DollarSign, MapPin, Clock, Users, Zap, Activity, CheckCircle, XCircle, BarChart, LineChart } from 'lucide-react';

const WalmartLossPreventionAI = () => {
  // State variables for managing the application's view, monitoring status, alerts, and statistics.
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({
    totalPrevented: 145680, // Total simulated loss prevented
    activeAlerts: 3,       // Number of currently active alerts
    camerasOnline: 47,     // Number of cameras online
    accuracyRate: 97.8,    // AI detection accuracy rate
    dailySavings: 8940,    // Simulated daily savings from prevention
    monthlyTrend: 23.5     // Monthly improvement trend percentage
  });
  const [liveDetections, setLiveDetections] = useState([]); // Array for live AI detection types
  const [selectedCamera, setSelectedCamera] = useState(3);  // Default to Grocery - Self Checkout camera (ID 3)
  const videoRef = useRef(null); // Ref for the video element to display camera feed
  const [isVideoActive, setIsVideoActive] = useState(false); // State to control video feed activation
  const [showIncidentModal, setShowIncidentModal] = useState(false); // State for incident modal
  const [dailySavingsTrend, setDailySavingsTrend] = useState([]); // State for daily savings trend data
  const [isTheftDetected, setIsTheftDetected] = useState(false); // New state for simulated theft detection
  // Initialize uploadedVideoUrl to demo1.mp4 by default
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState('/demo1.mp4'); 

  // Simulate camera locations and their statuses/risk levels
  const cameras = [
    { id: 1, location: 'Electronics - Aisle 12', status: 'active', riskLevel: 'high', gridArea: '1 / 2 / 3 / 3' },
    { id: 2, location: 'Clothing - Entrance', status: 'active', riskLevel: 'medium', gridArea: '2 / 1 / 4 / 2' },
    { id: 3, location: 'Grocery - Self Checkout', status: 'active', riskLevel: 'high', gridArea: '3 / 3 / 5 / 4' },
    { id: 4, location: 'Pharmacy - Counter', status: 'active', riskLevel: 'low', gridArea: '1 / 4 / 2 / 5' },
    { id: 5, location: 'Garden Center - Exit', status: 'maintenance', riskLevel: 'medium', gridArea: '4 / 2 / 5 / 3' }
  ];

  // List of simulated suspicious activities
  const suspiciousActivities = [
    'Concealment behavior detected',
    'Bag switching observed',
    'Multiple item handling',
    'Loitering in blind spot',
    'Unusual scanning pattern',
    'Tag removal attempt',
    'Exit without payment',
    'Coordinated movement',
    'Price tag alteration',
    'Suspicious package placement'
  ];

  // Function to generate a random alert
  const generateAlert = (manual = false, activityOverride = null) => {
    const activity = activityOverride || suspiciousActivities[Math.floor(Math.random() * suspiciousActivities.length)];
    const camera = cameras[Math.floor(Math.random() * cameras.length)];
    const confidence = Math.floor(Math.random() * 20) + 80; // Confidence between 80-99
    const severity = confidence > 95 ? 'critical' : confidence > 88 ? 'high' : 'medium';
    
    const newAlert = {
      id: Date.now(),
      activity,
      location: camera.location,
      confidence,
      severity,
      timestamp: new Date().toLocaleTimeString(),
      status: 'active',
      manual: manual // Flag to indicate if alert was manually triggered
    };
    
    setAlerts(prev => [newAlert, ...prev.slice(0, 19)]); // Keep up to 20 alerts
    
    // Update stats based on new alert
    setStats(prev => ({
      ...prev,
      activeAlerts: prev.activeAlerts + 1,
      dailySavings: prev.dailySavings + Math.floor(Math.random() * 200) + 50 // Simulate savings per alert
    }));
  };

  // Function to simulate live AI detections
  const simulateLiveDetection = () => {
    const detectionTypes = [
      { type: 'Person Tracking', color: 'bg-blue-500', count: Math.floor(Math.random() * 15) + 5 },
      { type: 'Object Detection', color: 'bg-green-500', count: Math.floor(Math.random() * 25) + 10 },
      { type: 'Behavior Analysis', color: 'bg-yellow-500', count: Math.floor(Math.random() * 8) + 2 },
      { type: 'Anomaly Detection', color: 'bg-red-500', count: Math.floor(Math.random() * 3) + 1 }
    ];
    setLiveDetections(detectionTypes);
  };

  // Effect to manage the automatic refresh of daily savings trend data
  useEffect(() => {
    // Function to generate more varied daily savings trend data
    const generateDailySavingsTrend = () => {
      // eslint-disable-next-line no-unused-vars
      const newTrend = Array.from({ length: 7 }, (_, i) => { // '_' and 'i' are parameters for Array.from, 'i' is used below
        // Base value, with more significant random fluctuation
        const base = stats.dailySavings * (0.7 + Math.random() * 0.6); // Between 70% and 130% of current dailySavings
        return Math.round(base);
      });
      setDailySavingsTrend(newTrend);
    };

    generateDailySavingsTrend(); // Initial generation
    const trendInterval = setInterval(generateDailySavingsTrend, 5000); // Refresh every 5 seconds

    return () => clearInterval(trendInterval); // Cleanup on unmount
  }, [stats.dailySavings]); // Re-run if dailySavings changes, ensuring trend is relevant

  // Function to start monitoring (activates video feed and simulated detection)
  const startMonitoring = () => {
    // Only start monitoring if a video has been uploaded
    if (!uploadedVideoUrl) {
      console.warn("Please upload a video before starting monitoring.");
      return;
    }

    setIsMonitoring(true);
    setIsVideoActive(true);
    
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video playback failed:", error);
        // Handle autoplay policy or other playback issues
      });

      // Removed the direct setTimeout for theft detection.
      // The theft detection will now be triggered by the video's 'onEnded' event.
    }
    
    // Start generating general alerts at intervals
    const alertInterval = setInterval(generateAlert, 8000); // New alert every 8 seconds
    
    // Call simulateLiveDetection once when monitoring starts
    simulateLiveDetection();

    // Cleanup function for intervals when component unmounts or monitoring stops
    return () => {
      clearInterval(alertInterval);
    };
  };

  // Function to stop monitoring
  const stopMonitoring = () => {
    setIsMonitoring(false);
    setIsVideoActive(false);
    setIsTheftDetected(false); // Reset theft detection on stop
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Reset video to start
      // The 'ended' event listener is now directly on the video element,
      // so it will be cleaned up when the video element is unmounted/re-rendered.
    }
    // Clear alerts and detections when stopping (optional, for a clean slate)
    setAlerts([]);
    setLiveDetections([]);
    // Reset stats for a new session (optional)
    setStats(prev => ({
      ...prev,
      activeAlerts: 0,
      dailySavings: 0 // Reset daily savings for a fresh start
    }));
  };

  // Function to resolve an alert
  const resolveAlert = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'resolved' } : alert
    ));
    setStats(prev => ({
      ...prev,
      activeAlerts: Math.max(0, prev.activeApps - 1), // Decrease active alerts, ensure it doesn't go below 0
      totalPrevented: prev.totalPrevented + Math.floor(Math.random() * 100) + 50 // Simulate additional prevention for resolved alert
    }));
  };

  // Modal for manual incident reporting
  const IncidentModal = () => {
    const [incidentType, setIncidentType] = useState('');
    const [incidentLocation, setIncidentLocation] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (incidentType && incidentLocation) {
        generateAlert(true, `Manual Incident: ${incidentType} at ${incidentLocation}`);
        setShowIncidentModal(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Report New Incident</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="incidentType" className="block text-sm font-medium text-gray-700">Incident Type</label>
              <input
                type="text"
                id="incidentType"
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                placeholder="e.g., Suspicious activity, Mis-scan"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="incidentLocation" className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                id="incidentLocation"
                value={incidentLocation}
                onChange={(e) => setIncidentLocation(e.target.value)}
                placeholder="e.g., Aisle 5, Self-checkout 3"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowIncidentModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Report Incident
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Handler for video file selection
  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create a URL for the selected file
      const fileURL = URL.createObjectURL(file);
      setUploadedVideoUrl(fileURL);
      // Stop any current monitoring and reset video state
      stopMonitoring(); 
      setIsVideoActive(false); // Ensure video is not playing until 'Start Monitoring' is clicked
    }
  };

  // Dashboard View Component
  const DashboardView = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Prevented Loss Card */}
        <div className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Prevented Loss</p>
              <p className="text-3xl font-extrabold mt-1">${stats.totalPrevented.toLocaleString()}</p>
            </div>
            <DollarSign className="w-14 h-14 opacity-70" />
          </div>
        </div>
        
        {/* Active Alerts Card */}
        <div className="bg-gradient-to-br from-red-500 to-red-700 text-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Active Alerts</p>
              <p className="text-3xl font-extrabold mt-1">{stats.activeAlerts}</p>
            </div>
            <AlertTriangle className="w-14 h-14 opacity-70" />
          </div>
        </div>
        
        {/* Cameras Online Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Cameras Online</p>
              <p className="text-3xl font-extrabold mt-1">{stats.camerasOnline}/50</p>
            </div>
            <Camera className="w-14 h-14 opacity-70" />
          </div>
        </div>
        
        {/* Accuracy Rate Card */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Accuracy Rate</p>
              <p className="text-3xl font-extrabold mt-1">{stats.accuracyRate}%</p>
            </div>
            <TrendingUp className="w-14 h-14 opacity-70" />
          </div>
        </div>
      </div>

      {/* ROI Calculator & Daily Savings */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Projected ROI & Savings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="text-center">
            <div className="text-5xl font-extrabold text-green-600 animate-pulse-once">${stats.dailySavings.toLocaleString()}</div>
            <div className="text-lg text-gray-600 mt-2">Daily Savings</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-extrabold text-blue-600">${(stats.dailySavings * 30).toLocaleString()}</div>
            <div className="text-lg text-gray-600 mt-2">Monthly Projected</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-extrabold text-purple-600">{stats.monthlyTrend}%</div>
            <div className="text-lg text-gray-600 mt-2">Improvement Rate (MoM)</div>
          </div>
        </div>
        <div className="mt-8">
          <h4 className="text-xl font-semibold text-gray-700 mb-3">Savings Trend</h4>
          {/* Dynamic simulated bar chart for daily savings */}
          <div className="flex justify-around items-end h-24 bg-gray-50 rounded-lg p-2">
            {dailySavingsTrend.map((daySavings, i) => {
              // Calculate max value for scaling
              const maxSavings = Math.max(...dailySavingsTrend);
              // Ensure bars are visible even with small values, set a minimum height
              const height = maxSavings > 0 ? (daySavings / maxSavings) * 100 : 0;
              const displayHeight = Math.max(height, 5); // Minimum 5% height for visibility

              return (
                <div key={i} className="flex flex-col items-center">
                  <div 
                    className="w-8 bg-blue-400 rounded-t-md transition-all duration-500 ease-out" 
                    style={{ height: `${displayHeight}%` }} 
                    title={`Day ${i+1}: $${daySavings.toLocaleString()}`}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">Day {i + 1}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Predictive Loss Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Predictive Loss Analytics</h3>
        <div className="flex items-center justify-center space-x-6">
          <div className="text-center">
            <DollarSign className="w-16 h-16 text-red-500 mx-auto mb-2" />
            <p className="text-5xl font-extrabold text-red-600">
              ${(stats.dailySavings * 0.15 * 30).toLocaleString()} {/* Simulate 15% of monthly savings as potential loss */}
            </p>
            <p className="text-lg text-gray-600 mt-2">Estimated Reduction in Loss Trend</p>
          </div>
          <div className="text-center">
            <LineChart className="w-16 h-16 text-purple-500 mx-auto mb-2" />
            <p className="text-5xl font-extrabold text-purple-600">
              {Math.round(stats.monthlyTrend * 0.8)}% {/* Simulate slightly lower improvement without AI */}
            </p>
            <p className="text-lg text-gray-600 mt-2">Estimated Reduction in Loss Trend</p>
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-6">
          These projections highlight the value of continuous AI monitoring in minimizing inventory shrinkage.
        </p>
      </div>


      {/* Camera Network Status & Store Map */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Store Camera Map</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Store Map Visualization */}
          <div className="bg-gray-100 rounded-lg p-4 relative overflow-hidden" style={{ minHeight: '300px' }}>
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Store Layout Overview</h4>
            <div className="grid gap-2 p-2 border-2 border-gray-300 rounded-md" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', height: '100%' }}>
              {/* Simulated Aisle/Section Backgrounds */}
              <div className="col-span-1 row-span-2 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">Aisle 1</div>
              <div className="col-span-2 row-span-1 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">Front End</div>
              <div className="col-span-1 row-span-2 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">Aisle 2</div>
              <div className="col-span-1 row-span-1 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">Produce</div>
              <div className="col-span-1 row-span-1 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">Meat</div>
              <div className="col-span-2 row-span-2 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">Backroom</div>
              <div className="col-span-1 row-span-1 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">Dairy</div>
              <div className="col-span-1 row-span-1 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">Frozen</div>

              {/* Camera Icons on Map */}
              {cameras.map(camera => (
                <div 
                  key={camera.id} 
                  className={`absolute p-1 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 transform hover:scale-110
                    ${camera.status === 'active' ? 'bg-blue-500' : 'bg-gray-500'}
                    ${camera.riskLevel === 'high' ? 'ring-4 ring-red-500' : ''} 
                    ${selectedCamera === camera.id ? 'z-10 ring-4 ring-yellow-300' : ''}
                  `}
                  style={{ gridArea: camera.gridArea }}
                  onClick={() => {
                    setSelectedCamera(camera.id);
                    setCurrentView('monitoring'); // Switch to monitoring view on click
                  }}
                  title={`Camera ${camera.id}: ${camera.location} (${camera.riskLevel} risk)`}
                >
                  <Camera className="w-6 h-6 text-white" />
                </div>
              ))}
            </div>
          </div>

          {/* Camera List Status */}
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Camera Details</h4>
            <div className="space-y-4">
              {cameras.map(camera => (
                <div 
                  key={camera.id} 
                  className={`border border-gray-200 rounded-lg p-4 flex items-center justify-between cursor-pointer
                    ${selectedCamera === camera.id ? 'bg-blue-50 border-blue-400 shadow-md' : 'bg-white hover:shadow-sm'}
                    transition-all duration-200
                  `}
                  onClick={() => setSelectedCamera(camera.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Camera className={`w-6 h-6 ${selectedCamera === camera.id ? 'text-blue-600' : 'text-gray-500'}`} />
                    <div>
                      <p className="font-semibold text-gray-800">{camera.location}</p>
                      <p className="text-sm text-gray-600">Camera ID: {camera.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      camera.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {camera.status.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      camera.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                      camera.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {camera.riskLevel.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Live Monitoring View Component
  const LiveMonitoringView = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Live Feed Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-2xl font-bold text-gray-800">Live Camera Feed</h3>
            <select 
              value={selectedCamera} 
              onChange={(e) => setSelectedCamera(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            >
              {cameras.map(camera => (
                <option key={camera.id} value={camera.id}>
                  {camera.location}
                </option>
              ))}
            </select>
          </div>
          
          <div className="relative bg-gray-900 rounded-lg aspect-video overflow-hidden">
            {uploadedVideoUrl && isVideoActive ? ( // Only render video if URL exists and is active
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  muted 
                  // Removed loop attribute to ensure it plays once
                  className="w-full h-full object-cover rounded-lg"
                  src={uploadedVideoUrl} // Use the uploaded video URL
                  onEnded={() => { // Event listener for when the video ends
                    setIsTheftDetected(true);
                    generateAlert(false, 'Theft Detected: Suspicious activity at grocery aisle'); // Specific theft alert
                    setTimeout(() => {
                      setIsTheftDetected(false);
                    }, 3000); // Display theft detection for 3 seconds
                  }}
                  onError={(e) => console.error("Video loading error:", e)}
                />
                {isTheftDetected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-50"> {/* Removed animate-pulse-once */}
                    <AlertTriangle className="w-24 h-24 text-white" /> {/* Removed animate-bounce */}
                    <span className="text-white text-4xl font-bold ml-4">THEFT DETECTED!</span>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-800">
                <div className="text-center text-gray-400">
                  <Camera className="w-20 h-20 mx-auto mb-4 text-gray-500" />
                  {uploadedVideoUrl ? (
                    <p className="text-lg">Video loaded. Click "Start Monitoring" to play.</p>
                  ) : (
                    <p className="text-lg">No video selected. Please upload a video.</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Overlay for LIVE indicator - removed flashing */}
            {isVideoActive && !isTheftDetected && ( // Hide general detections when theft is flagged
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1"> 
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>LIVE</span>
                </div>
                <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-lg text-sm">
                  <MapPin className="inline-block w-4 h-4 mr-1" />
                  {cameras.find(c => c.id === selectedCamera)?.location}
                </div>
                
                {/* Removed simulated detection boxes */}
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={isMonitoring ? stopMonitoring : startMonitoring}
              className={`px-8 py-3 rounded-full font-semibold text-lg shadow-md transition-all duration-300 transform hover:scale-105 ${
                isMonitoring 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
            </button>
            <button
              onClick={() => setShowIncidentModal(true)}
              className="px-8 py-3 rounded-full font-semibold text-lg bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Report Incident
            </button>
            {/* Input for file upload, hidden and triggered by a styled button */}
            <input
              type="file"
              accept="video/mp4"
              onChange={handleVideoUpload}
              className="hidden"
              id="video-upload-input"
            />
            <label
              htmlFor="video-upload-input"
              className="px-8 py-3 rounded-full font-semibold text-lg bg-purple-600 text-white shadow-md hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              Upload Video
            </label>
            {/* New: Manual Refresh Detections Button */}
            <button
              onClick={simulateLiveDetection}
              className="px-8 py-3 rounded-full font-semibold text-lg bg-gray-600 text-white shadow-md hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
            >
              Refresh Detections
            </button>
          </div>
        </div>

        {/* Live AI Analysis & Recent Detections */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold mb-5 text-gray-800">Live AI Analysis</h3>
          <div className="space-y-5">
            {liveDetections.map((detection, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 animate-fade-in-right">
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full ${detection.color}`} />
                  <span className="font-medium text-lg text-gray-700">{detection.type}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-extrabold text-gray-900">{detection.count}</span>
                  <Activity className="w-6 h-6 text-gray-500" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-5 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-semibold text-xl text-blue-800 mb-3">AI System Confidence</h4>
            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-blue-200 rounded-full h-3">
                <div className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out" style={{ width: `${stats.accuracyRate}%` }} />
              </div>
              <span className="text-blue-800 font-bold text-lg">{stats.accuracyRate}%</span>
            </div>
            <p className="text-sm text-blue-700 mt-2">Overall system accuracy in real-time detection.</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Alerts View Component
  const AlertsView = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Active Security Alerts ({alerts.filter(a => a.status === 'active').length})</h3>
          <button
            onClick={() => setAlerts(prev => prev.map(alert => ({ ...alert, status: 'resolved' })))}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full font-medium hover:bg-gray-300 transition-colors duration-200"
          >
            Resolve All
          </button>
        </div>
        
        <div className="space-y-5">
          {alerts.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
              <p className="text-xl font-medium">No active alerts at the moment. System is clear!</p>
            </div>
          )}

          {alerts.map(alert => (
            <div 
              key={alert.id} 
              className={`p-5 rounded-lg border-l-8 ${
                alert.severity === 'critical' ? 'bg-red-50 border-red-600' :
                alert.severity === 'high' ? 'bg-orange-50 border-orange-600' :
                'bg-yellow-50 border-yellow-600'
              } shadow-sm flex items-start justify-between transform transition-all duration-300 ${alert.status === 'resolved' ? 'opacity-60 grayscale' : 'hover:scale-[1.01]'}`}
            >
              <div className="flex-1 pr-4">
                <div className="flex items-center space-x-3 mb-2">
                  {alert.status === 'resolved' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertTriangle className={`w-6 h-6 ${
                      alert.severity === 'critical' ? 'text-red-600' :
                      alert.severity === 'high' ? 'text-orange-600' :
                      'text-yellow-600'
                    }`} />
                  )}
                  <span className="font-bold text-xl text-gray-900">{alert.activity}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    alert.severity === 'critical' ? 'bg-red-200 text-red-900' :
                    alert.severity === 'high' ? 'bg-orange-200 text-orange-900' :
                    'bg-yellow-200 text-yellow-900'
                  }`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  {alert.manual && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-200 text-blue-900">
                      MANUAL
                    </span>
                  )}
                </div>
                <div className="text-base text-gray-700 space-y-1">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <span>{alert.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span>{alert.timestamp}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Zap className="w-5 h-5 text-gray-500" />
                      <span>Confidence: {alert.confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {alert.status === 'resolved' ? (
                  <div className="flex items-center space-x-1 text-green-600 font-semibold">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                ) : (
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="px-5 py-2 bg-green-600 text-white rounded-full text-base font-medium hover:bg-green-700 transition-colors duration-200 shadow-md"
                  >
                    Resolve
                  </button>
                )}
                <button
                  onClick={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded-full text-sm font-medium hover:bg-red-200 transition-colors duration-200"
                  title="Dismiss Alert"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 font-inter">
      {/* Removed Tailwind CSS CDN and Font Inter links from here, they should be in index.html */}
      <style>{`
        /* Universal reset for full viewport usage */
        html, body, #root {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          overflow-x: hidden; /* Prevent horizontal scrollbar */
        }
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-fade-in-right {
          animation: fadeInRight 0.6s ease-out forwards;
        }
        /* Removed animate-pulse-once */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        /* Removed pulseOnce keyframes */
        /* Removed bounce keyframes */
      `}</style>

      {/* Header */}
      <div className="bg-blue-800 text-white shadow-xl relative">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              {/* Walmart Logo Image */}
              <img
  src="logo.png" 
  alt="Logo" 
  height="100" 
  width="250" 
/>

            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div> {/* Removed animate-pulse */}
                <span className="text-base font-medium">System Active</span>
              </div>
              <div className="text-base font-medium">
                Prevented Today: <span className="font-extrabold text-green-300">${stats.dailySavings.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Subtle yellow stripe at the bottom */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400"></div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-10">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`py-5 px-3 border-b-4 font-semibold text-base transition-colors duration-200 ${
                currentView === 'dashboard' 
                  ? 'border-blue-600 text-blue-800' 
                  : 'border-transparent text-gray-600 hover:text-blue-700 hover:border-blue-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('monitoring')}
              className={`py-5 px-3 border-b-4 font-semibold text-base transition-colors duration-200 ${
                currentView === 'monitoring' 
                  ? 'border-blue-600 text-blue-800' 
                  : 'border-transparent text-gray-600 hover:text-blue-700 hover:border-blue-300'
              }`}
            >
              Live Monitoring
            </button>
            <button
              onClick={() => setCurrentView('alerts')}
              className={`py-5 px-3 border-b-4 font-semibold text-base transition-colors duration-200 ${
                currentView === 'alerts' 
                  ? 'border-blue-600 text-blue-800' 
                  : 'border-transparent text-gray-600 hover:text-blue-700 hover:border-blue-300'
              }`}
            >
              Security Alerts
              {stats.activeAlerts > 0 && (
                <span className="ml-2 px-2.5 py-0.5 bg-red-500 text-white rounded-full text-xs font-bold"> 
                  {stats.activeApps}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 sm:px-6 lg:px-8 py-10">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'monitoring' && <LiveMonitoringView />}
        {currentView === 'alerts' && <AlertsView />}
      </div>

      {/* Incident Reporting Modal */}
      {showIncidentModal && <IncidentModal />}
    </div>
  );
};

export default WalmartLossPreventionAI;
