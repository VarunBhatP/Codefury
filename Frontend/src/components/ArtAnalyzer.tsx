import React, { useState, FC, ReactNode } from "react";
// For icons, you would need to install heroicons: npm install @heroicons/react
import {
  SparklesIcon,
  PaintBrushIcon,
  CubeTransparentIcon,
  BeakerIcon,
  GlobeAltIcon,
  TagIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

// --- TYPE DEFINITION for API Response ---
// It's good practice to define the shape of your data.
interface AnalysisResult {
  predictedArtForm: string;
  artStyleSubcategory: string;
  artFormConfidence: number;
  artPeriod: string;
  artRegion: string;
  artisticComplexity: string;
  craftsmanshipQuality: string;
  authenticityScore: number;
  collectorValue: string;
  priceRange: string;
  printSuitability: string;
  marketplaceReady: boolean;
  imageResolution: string;
  imageQuality: string;
  aspectRatio: string;
  fileSize: string;
  bitDepth: string;
  colorSpace: string;
  compressionType: string;
  compressionArtifacts: string;
  colorHarmony: string;
  colorContrast: string;
  colorSaturation: string;
  colorTemperature: string;
  colorPalette: string[];
  dominantColors: string[];
  culturalContext: string;
  culturalSignificance: string;
  sceneType: string;
  ritualContext: string;
  socialContext: string;
  seasonalAssociation: string;
  animalPresence: string[];
  architecturalElements: string[];
  detectedObjects: string[];
  naturalElements: string[];
  mythologicalReferences: string[];
  suggestedCaption: string;
  suggestedTags: string[];
  recommendedHashtags: string[];
  targetAudience: string[];
}


// --- REUSABLE UI COMPONENTS ---

// A styled container for each section of the analysis
const InfoCard: FC<{ title: string; icon: ReactNode; children: ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-slate-50 rounded-xl p-4 md:p-6 ring-1 ring-slate-200 h-full">
    <div className="flex items-center gap-3 mb-4">
      <div className="bg-blue-100 text-blue-600 rounded-full p-2">{icon}</div>
      <h3 className="font-bold text-lg text-slate-800">{title}</h3>
    </div>
    <div className="space-y-3 text-slate-600">{children}</div>
  </div>
);

// A component for displaying key-value pairs
const Stat: FC<{ label: string; value?: string | ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between items-start text-sm">
    <p className="font-medium text-slate-700">{label}:</p>
    <p className="text-right">{value || "N/A"}</p>
  </div>
);

// A component for percentage-based stats
const ProgressBar: FC<{ label: string; value: number }> = ({ label, value }) => (
  <div>
    <div className="flex justify-between items-center text-sm mb-1">
      <p className="font-medium text-slate-700">{label}:</p>
      <p className="font-semibold text-blue-600">{(value * 100).toFixed(1)}%</p>
    </div>
    <div className="w-full bg-slate-200 rounded-full h-2">
      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${value * 100}%` }}></div>
    </div>
  </div>
);

// A styled pill/badge for displaying list items
const Pill: FC<{ text: string }> = ({ text }) => (
  <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">{text}</span>
);

// A component for rendering lists of pills
const PillList: FC<{ items?: string[] }> = ({ items }) => (
  <div className="flex flex-wrap gap-2 pt-1">
    {items?.length ? (
      items.map((item, i) => <Pill key={i} text={item} />)
    ) : (
      <p className="text-slate-400 text-sm">None detected</p>
    )}
  </div>
);


// --- UI STATE COMPONENTS ---

const LoadingSpinner = () => (
    <div className="text-center py-20">
        <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-slate-600 font-medium">Analyzing artwork...</p>
    </div>
);

const ErrorMessage: FC<{ message: string }> = ({ message }) => (
    <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3">
        <ExclamationTriangleIcon className="h-6 w-6 text-red-500"/>
        <div>
            <h4 className="font-bold">Analysis Failed</h4>
            <p className="text-sm">{message}</p>
        </div>
    </div>
);

const InitialState = () => (
    <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-xl">
        <SparklesIcon className="h-12 w-12 mx-auto text-slate-400"/>
        <h3 className="mt-4 text-lg font-medium text-slate-800">AI Art Analyzer</h3>
        <p className="mt-1 text-slate-500">Paste an image URL above to begin your analysis.</p>
    </div>
);


// --- MAIN COMPONENT ---

export default function ArtAnalyzer() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!url) return;
    
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("https://codefury-zacg.onrender.com/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: url }),
      });
      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`);
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unknown error occurred while analyzing the art.");
    } finally {
      setLoading(false);
    }
  };

  const renderResults = () => (
      <div className="animate-fade-in">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">📊 Analysis Results</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <InfoCard title="Art Information" icon={<PaintBrushIcon className="w-6 h-6" />}>
            <Stat label="Predicted Form" value={result!.predictedArtForm} />
            <Stat label="Subcategory" value={result!.artStyleSubcategory} />
            <ProgressBar label="Confidence" value={result!.artFormConfidence} />
            <Stat label="Period" value={result!.artPeriod} />
            <Stat label="Region" value={result!.artRegion} />
          </InfoCard>

          <InfoCard title="Quality & Value" icon={<SparklesIcon className="w-6 h-6" />}>
            <Stat label="Craftsmanship" value={result!.craftsmanshipQuality} />
            <ProgressBar label="Authenticity" value={result!.authenticityScore} />
            <Stat label="Collector Value" value={result!.collectorValue} />
            <Stat label="Est. Price Range" value={result!.priceRange} />
             <Stat label="Marketplace Ready" value={result!.marketplaceReady ? "Yes ✅" : "No ❌"} />
          </InfoCard>

          <InfoCard title="Technical Details" icon={<CubeTransparentIcon className="w-6 h-6" />}>
            <Stat label="Resolution" value={result!.imageResolution} />
            <Stat label="Image Quality" value={result!.imageQuality} />
            <Stat label="Aspect Ratio" value={result!.aspectRatio} />
            <Stat label="Color Space" value={result!.colorSpace} />
            <Stat label="Compression" value={`${result!.compressionType} (${result!.compressionArtifacts})`} />
          </InfoCard>
          
          <InfoCard title="Color Analysis" icon={<BeakerIcon className="w-6 h-6" />}>
            <Stat label="Harmony" value={result!.colorHarmony} />
            <Stat label="Contrast" value={result!.colorContrast} />
            <Stat label="Saturation" value={result!.colorSaturation} />
            <Stat label="Temperature" value={result!.colorTemperature} />
            <p className="text-sm font-medium text-slate-700 pt-2">Dominant Colors:</p>
            <div className="flex gap-2 flex-wrap">
              {result!.dominantColors?.map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full ring-2 ring-white" style={{ backgroundColor: c }} title={c}></div>
              ))}
            </div>
          </InfoCard>
          
          <InfoCard title="Cultural Context" icon={<GlobeAltIcon className="w-6 h-6" />}>
            <Stat label="Cultural Significance" value={result!.culturalSignificance} />
            <Stat label="Scene Type" value={result!.sceneType} />
            <Stat label="Social Context" value={result!.socialContext} />
            <Stat label="Seasonal Assoc." value={result!.seasonalAssociation} />
          </InfoCard>

          <InfoCard title="Detected Elements" icon={<TagIcon className="w-6 h-6" />}>
            <p className="text-sm font-medium text-slate-700">Objects:</p>
            <PillList items={result!.detectedObjects} />
            <p className="text-sm font-medium text-slate-700 pt-2">Natural Elements:</p>
            <PillList items={result!.naturalElements} />
          </InfoCard>

          <div className="md:col-span-2 lg:col-span-3">
             <InfoCard title="📢 Social Boost" icon={<TagIcon className="w-6 h-6" />}>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-medium text-slate-700 mb-1">Suggested Caption:</p>
                        <blockquote className="border-l-4 border-blue-200 pl-4 italic text-slate-600">
                           {result!.suggestedCaption}
                        </blockquote>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-700">Hashtags:</p>
                        <PillList items={result!.recommendedHashtags} />
                    </div>
                     <div>
                        <p className="text-sm font-medium text-slate-700">Target Audience:</p>
                        <PillList items={result!.targetAudience} />
                    </div>
                </div>
             </InfoCard>
          </div>
        </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">AI Art Analyzer</h1>
            <p className="mt-2 text-lg text-slate-500">Uncover the secrets behind any piece of art with the power of AI.</p>
        </div>

        <div className="max-w-2xl mx-auto bg-white/50 backdrop-blur-sm shadow-lg rounded-2xl p-4 mb-8 ring-1 ring-slate-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste image URL here..."
              className="flex-1 border border-slate-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !url}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
            {url && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-slate-700 mb-3 text-center">Image Preview</h2>
                    <img src={url} alt="Art Preview" className="max-w-lg mx-auto rounded-xl shadow-2xl" />
                </div>
            )}
            
            {loading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            {result && renderResults()}
            {!loading && !error && !result && <InitialState />}
        </div>
      </div>
    </div>
  );
}