import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MetricCard from './components/MetricCard';
import RiskGauge from './components/RiskGauge';
import { Snowflake, BrainCircuit, Loader2, Link as LinkIcon, TrendingUp, Activity } from 'lucide-react';
import { METRICS, CURRENT_RISK, CURRENT_LOCATION } from './constants';
import { analyzeGlacierRisk } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Current Status');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const tabs = [
    'Current Status',
    'Forecast & Trends',
    'Advanced Analysis',
    'About GLOFs'
  ];

  const handleAnalyze = async () => {
    if (aiAnalysis) return; // Don't re-fetch if already have it
    setIsAnalyzing(true);
    const result = await analyzeGlacierRisk(CURRENT_LOCATION, METRICS, CURRENT_RISK);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col h-full overflow-y-auto scroll-smooth">
        {/* Header Section */}
        <header className="px-8 pt-8 pb-4">
          <div className="flex items-center gap-3 mb-2">
             <Snowflake className="text-blue-400 h-8 w-8" />
             <h1 className="text-3xl font-bold text-blue-600">SafeFlow</h1>
          </div>
          <p className="text-slate-500 text-sm ml-11">Advanced Glacier Monitoring & GLOF Risk Assessment</p>
        </header>

        {/* Navigation Tabs */}
        <div className="px-8 mt-6 border-b border-slate-200">
          <div className="flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab 
                    ? 'text-blue-600' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-8 animate-in fade-in duration-500">
          {activeTab === 'Current Status' && (
            <div className="max-w-6xl">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Current Status</h2>
              
              {/* Status Banner */}
              <div className="inline-block bg-blue-600 text-white px-3 py-1 rounded-sm text-sm font-semibold mb-8">
                Monitoring {CURRENT_LOCATION.name} as of {CURRENT_LOCATION.lastUpdated}
              </div>

              {/* Metrics Section */}
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-6">
                  <h3 className="text-xl font-bold text-slate-800">Predicted Features (ML Model Outputs)</h3>
                  <LinkIcon size={16} className="text-slate-400" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {METRICS.map((metric) => (
                    <MetricCard key={metric.id} data={metric} />
                  ))}
                </div>
              </div>

              {/* Risk Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 {/* Gauge Chart */}
                 <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-8">GLOF Risk Score (Calculated)</h3>
                    <div className="bg-white p-8 rounded-xl flex justify-center">
                       <RiskGauge score={CURRENT_RISK.score} change={CURRENT_RISK.change} />
                    </div>
                 </div>

                 {/* AI Analysis Section */}
                 <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <BrainCircuit className="text-purple-600" />
                        AI Risk Analysis
                      </h3>
                      {!aiAnalysis && (
                         <button 
                           onClick={handleAnalyze}
                           disabled={isAnalyzing}
                           className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                         >
                           {isAnalyzing ? <Loader2 className="animate-spin w-4 h-4" /> : "Generate Report"}
                         </button>
                      )}
                    </div>
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex-1 relative overflow-hidden">
                       {!aiAnalysis && !isAnalyzing && (
                         <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
                           Click "Generate Report" for AI insights on this data.
                         </div>
                       )}
                       {isAnalyzing && (
                         <div className="flex flex-col items-center justify-center h-full text-purple-600 gap-3">
                           <Loader2 className="animate-spin w-8 h-8" />
                           <span className="text-sm font-medium">Analyzing glacial patterns...</span>
                         </div>
                       )}
                       {aiAnalysis && (
                         <div className="prose prose-sm prose-slate max-w-none animate-in slide-in-from-bottom-4 duration-700">
                           <h4 className="text-purple-900 font-semibold mb-2">Executive Risk Assessment</h4>
                           <p className="whitespace-pre-line leading-relaxed text-slate-700">
                             {aiAnalysis}
                           </p>
                           <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-400 flex justify-between">
                             <span>Generated by Gemini 2.5 Flash</span>
                             <span>{new Date().toLocaleTimeString()}</span>
                           </div>
                         </div>
                       )}
                    </div>
                 </div>
              </div>

            </div>
          )}

          {activeTab === 'Forecast & Trends' && (
             <div className="max-w-6xl">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Forecast & Trends</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Temperature Trend Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-700 mb-6 flex items-center gap-2">
                            <TrendingUp className="text-blue-500" /> Temperature Forecast (7 Days)
                        </h3>
                        {(() => {
                            const data = [12.5, 13.1, 11.8, 14.2, 15.0, 12.9, 10.5];
                            const min = Math.min(...data) - 1;
                            const max = Math.max(...data) + 1;
                            const range = max - min;
                            
                            return (
                                <div className="flex flex-col h-64 w-full">
                                    <div className="flex-1 relative">
                                        <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                                            {/* Grid Lines */}
                                            {[0, 25, 50, 75, 100].map(y => (
                                                <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#f1f5f9" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeDasharray="4 4"/>
                                            ))}
                                            
                                            {/* Line Path */}
                                            <path
                                                d={`M ${data.map((val, i) => `${(i / (data.length - 1)) * 100},${100 - ((val - min) / range) * 100}`).join(' L ')}`}
                                                fill="none"
                                                stroke="#3b82f6"
                                                strokeWidth="3"
                                                vectorEffect="non-scaling-stroke"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        
                                        {/* HTML Data Points Overlay */}
                                        {data.map((val, i) => {
                                            const left = `${(i / (data.length - 1)) * 100}%`;
                                            const top = `${100 - ((val - min) / range) * 100}%`;
                                            return (
                                                <div 
                                                    key={i}
                                                    className="absolute group z-10"
                                                    style={{ left, top, transform: 'translate(-50%, -50%)' }}
                                                >
                                                    <div className="w-3 h-3 bg-white border-[3px] border-blue-600 rounded-full group-hover:scale-125 transition-transform cursor-pointer shadow-sm"></div>
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                        <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded font-bold shadow-lg whitespace-nowrap">
                                                            {val}°C
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    {/* X Axis Labels */}
                                    <div className="flex justify-between mt-4 text-xs text-slate-400 font-medium pt-2 border-t border-transparent">
                                        {data.map((_, i) => (
                                            <span key={i}>Day {i + 1}</span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    {/* Velocity Trend */}
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                            <Activity className="text-purple-500" /> Ice Velocity Trends
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r">
                                <p className="text-sm text-red-800 font-medium">Critical Acceleration Detected</p>
                                <p className="text-xs text-red-600 mt-1">Velocity has increased by 15% over the last week.</p>
                            </div>
                             <div className="h-32 flex items-end gap-1 border-b border-slate-200 pb-1">
                                {[300, 310, 325, 340, 380, 395, 409].map((v, i) => (
                                    <div key={i} style={{ height: `${(v/500)*100}%` }} className="flex-1 bg-purple-200 rounded-t"></div>
                                ))}
                             </div>
                             <div className="flex justify-between text-xs text-slate-400">
                                <span>Week 1</span>
                                <span>Week 7</span>
                             </div>
                        </div>
                    </div>
                </div>
             </div>
          )}

          {activeTab === 'Advanced Analysis' && (
              <div className="max-w-6xl">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Advanced Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Lake Volume', value: '14.2', unit: 'M m³', status: 'Critical', color: 'red' },
                        { label: 'Moraine Stability', value: 'Low', unit: 'Index', status: 'Warning', color: 'orange' },
                        { label: 'Seepage Rate', value: '45', unit: 'L/s', status: 'Normal', color: 'green' },
                        { label: 'Downstream Impact', value: 'High', unit: 'Risk', status: 'Critical', color: 'red' },
                        { label: 'Satellite Confidence', value: '98', unit: '%', status: 'High', color: 'blue' },
                        { label: 'Sensor Health', value: '100', unit: '%', status: 'Good', color: 'green' },
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-6 rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                            <div className="text-sm text-slate-500 mb-2">{item.label}</div>
                            <div className="flex items-end justify-between">
                                <div className="text-2xl font-bold text-slate-800">{item.value} <span className="text-sm font-normal text-slate-500">{item.unit}</span></div>
                                <div className={`text-xs font-bold px-2 py-1 rounded bg-${item.color}-100 text-${item.color}-700 uppercase`}>{item.status}</div>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
          )}

          {activeTab === 'About GLOFs' && (
             <div className="max-w-4xl bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">About Glacial Lake Outburst Floods (GLOFs)</h2>
                <div className="prose prose-slate max-w-none">
                    <p className="text-lg text-slate-600 mb-6">
                        A Glacial Lake Outburst Flood (GLOF) is a type of outburst flood that occurs when the dam containing a glacial lake fails. An event similar to a GLOF, where a body of water contained by a glacier melts or overflows the glacier, is called a Jökulhlaup.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-blue-800 mb-3">Why Monitoring is Critical</h3>
                    <p className="text-slate-600 mb-4">
                        As glaciers retreat due to climate change, glacial lakes are increasing in number and size. The risk of GLOFs is growing in mountain regions worldwide, threatening downstream communities, infrastructure, and ecosystems.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                         <div className="bg-blue-50 p-4 rounded-lg">
                             <h4 className="font-bold text-blue-900 mb-2">Triggers</h4>
                             <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                                 <li>Avalanches into the lake</li>
                                 <li>Earthquakes</li>
                                 <li>Moraine dam collapse</li>
                                 <li>Rapid melting</li>
                             </ul>
                         </div>
                         <div className="bg-orange-50 p-4 rounded-lg">
                             <h4 className="font-bold text-orange-900 mb-2">Warning Signs</h4>
                             <ul className="list-disc list-inside text-sm text-orange-800 space-y-1">
                                 <li>Sudden rise in water level</li>
                                 <li>Turbid water discharge</li>
                                 <li>Increased seepage</li>
                                 <li>Ice calving noise</li>
                             </ul>
                         </div>
                    </div>
                </div>
             </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;