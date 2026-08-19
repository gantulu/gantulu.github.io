import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Edit3, 
  Clock, 
  Sparkles, 
  Upload, 
  Check, 
  X, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  Image as ImageIcon,
  AlertCircle,
  Tag,
  Layers,
  ArrowRight
} from 'lucide-react';

const CALENDAR_API_URL = 'https://jhpbtooefyzdndstlzva.supabase.co/functions/v1/calendar-img';
const SUBJECT_API_URL = 'https://opensheet.elk.sh/1EDv2YkI0CYRJHAIWgHqOPEJaZT0OcU7EatMISufQpes/subject';
const VAR_API_URL = 'https://opensheet.elk.sh/1EDv2YkI0CYRJHAIWgHqOPEJaZT0OcU7EatMISufQpes/var';

// Exactly 3 fixed UTC slots per date as per strict specification
const SLOT_TIMES = ['01:00:00+00', '05:00:00+00', '11:00:00+00'];

// Helper to normalize timestamp strings for deterministic matching across APIs
const normalizeTimestampKey = (str) => {
  if (!str) return '';
  const cleaned = str.trim().replace(' ', 'T');
  const match = cleaned.match(/(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})/);
  if (match) {
    return `${match[1]}T${match[2]}+00`;
  }
  return cleaned;
};

export default function App() {
  const [calendarData, setCalendarData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Date selection state - Defaulting to August 2026
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 7, 1)); 
  const [selectedDate, setSelectedDate] = useState('2026-08-20');

  // Modal / Active slot state
  const [activeModal, setActiveModal] = useState(null); // 'workflow' | 'preview' | null
  const [selectedSlot, setSelectedSlot] = useState(null); // { scheduledStr, existingRecord, subjectRecord }
  
  // Custom user logo override input
  const [customLogoFile, setCustomLogoFile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingStep, setGeneratingStep] = useState('');

  // Generated preview outputs
  const [generatedImage, setGeneratedImage] = useState(null); // Base64 image
  const [generatedHeadline, setGeneratedHeadline] = useState('');
  const [editedCaption, setEditedCaption] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchAllSources();
  }, []);

  const fetchAllSources = async () => {
    setLoading(true);
    setError(null);
    try {
      // Parallel fetch of calendar records and subject schedule
      const [calRes, subjRes] = await Promise.all([
        fetch(CALENDAR_API_URL),
        fetch(SUBJECT_API_URL)
      ]);

      if (!calRes.ok) throw new Error(`Calendar API HTTP error: ${calRes.status}`);
      if (!subjRes.ok) throw new Error(`Subject API HTTP error: ${subjRes.status}`);

      const calJson = await calRes.json();
      const subjJson = await subjRes.json();

      if (calJson && calJson.success && Array.isArray(calJson.data)) {
        setCalendarData(calJson.data);
      } else {
        setCalendarData([]);
      }

      if (Array.isArray(subjJson)) {
        setSubjectData(subjJson);
      } else {
        setSubjectData([]);
      }
    } catch (err) {
      console.error('Failed loading sources:', err);
      setError('Unable to load source of truth data from APIs.');
    } font: {
      setLoading(false);
    }
  };

  const formatDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getScheduledString = (dateStr, timeSuffix) => {
    return `${dateStr}T${timeSuffix}`;
  };

  // Match calendar record strictly by normalized scheduled string
  const findCalendarRecord = (scheduledStr) => {
    if (!calendarData || !calendarData.length) return null;
    const targetKey = normalizeTimestampKey(scheduledStr);
    
    return calendarData.find(item => {
      if (!item.scheduled) return false;
      return normalizeTimestampKey(item.scheduled) === targetKey;
    });
  };

  // Match subject and style from /subject API strictly by scheduled_at
  const findSubjectRecord = (scheduledStr) => {
    if (!subjectData || !subjectData.length) return null;
    const targetKey = normalizeTimestampKey(scheduledStr);

    return subjectData.find(item => {
      if (!item.scheduled_at) return false;
      return normalizeTimestampKey(item.scheduled_at) === targetKey;
    });
  };

  const handleOpenSlot = (scheduledStr) => {
    const existingRecord = findCalendarRecord(scheduledStr);
    const subjectRecord = findSubjectRecord(scheduledStr);

    setSelectedSlot({ scheduledStr, existingRecord, subjectRecord });
    setCustomLogoFile(null);

    if (existingRecord) {
      setGeneratedImage(existingRecord.image_url);
      setGeneratedHeadline('Existing Scheduled Content');
      setEditedCaption(existingRecord.caption || '');
      setActiveModal('preview');
    } else {
      setActiveModal('workflow');
    }
  };

  const getLogoBase64 = async (fallbackUrl) => {
    // 1. User uploaded custom logo file override
    if (customLogoFile) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(customLogoFile);
      });
    }

    // 2. Download logo_url supplied by /var API as binary blob
    if (!fallbackUrl) throw new Error('No logo URL available in /var API configuration');
    
    try {
      const resp = await fetch(fallbackUrl);
      if (!resp.ok) throw new Error(`HTTP ${resp.status} downloading logo asset`);
      const blob = await resp.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.warn('Direct fetch of logo_url hit CORS, executing canvas snapshot fallback:', e);
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png').split(',')[1]);
        };
        img.onerror = () => reject(new Error('Failed to load logo image from ' + fallbackUrl));
        img.src = fallbackUrl;
      });
    }
  };

  const handleGenerateContent = async () => {
    const subjectRec = selectedSlot?.subjectRecord;
    if (!subjectRec || !subjectRec.Subject) {
      setError('No subject/style found in /subject API for this scheduled slot.');
      return;
    }

    setIsGenerating(true);
    setGeneratingStep('Fetching prompt variables from /var API...');
    setError(null);

    try {
      // Step 1: Fetch variables from /var API
      const varRes = await fetch(VAR_API_URL);
      if (!varRes.ok) throw new Error('Failed to fetch variables from /var API');
      const varData = await varRes.json();
      
      const vars = Array.isArray(varData) && varData.length > 0 ? varData[0] : {};
      const {
        logo_url,
        headline,
        background,
        footer,
        layout,
        composition,
        ratio,
        quality,
        negative_prompt
      } = vars;

      setGeneratingStep('Downloading logo asset as binary image input...');
      const logoBase64 = await getLogoBase64(logo_url);

      setGeneratingStep('Generating 8k image, headline & caption via Gemini...');

      // Structured prompt referencing exact Subject & Style from /subject
      const promptText = `
Role: Senior Art Director and Instagram Copywriter for Apple Store Malaysia (@applestoremy).

TASK:
1. Generate an 8k realistic visual graphic featuring the exact specified Apple product/subject and style.
2. Generate a professional English headline suitable for Apple Store Malaysia.
3. Write an elegant, concise English Instagram caption highlighting key benefits and ending with relevant high-end hashtags.

AUTHORITATIVE INPUTS (DO NOT ALTER PRODUCT IDENTITY):
- Subject: ${subjectRec.Subject}
- Style: ${subjectRec.Style || 'Premium Minimal'}
- Category: ${subjectRec.Category || 'Product'} (${subjectRec['Sub-category'] || 'Apple'})
- Headline Variable: ${headline || 'Official Apple Store Malaysia Showcase'}
- Background Style: ${background || 'Minimalist studio lighting setting'}
- Footer: ${footer || 'Apple Store Malaysia'}
- Layout: ${layout || 'Clean hero framing'}
- Composition: ${composition || 'Macro detail focus'}
- Aspect Ratio: ${ratio || '1:1'}
- Quality: ${quality || '8k hyperrealistic product render'}
- Negative Prompt: ${negative_prompt || 'cluttered, low quality, cheap, bright neon, saturated'}

STRICT COPYWRITING RULES:
- Language: English ONLY. NEVER generate Bahasa Melayu.
- Tone: Professional, premium, formal, elegant, concise, natural.
- Avoid: Slang, aggressive selling, excessive emojis, generic marketing jargon.
- Every caption MUST end with relevant Instagram hashtags (e.g., #AppleStoreMY #AppleMalaysia #iPhone #MacBookPro).

OUTPUT FORMAT REQUIRED IN TEXT RESPONSE:
---HEADLINE---
[Write headline here]
---CAPTION---
[Write Instagram caption with hashtags here]
`;

      const apiKey = ""; // Canvas runtime environment automatically supplies key
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`;

      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: promptText },
              {
                inlineData: {
                  mimeType: 'image/png',
                  data: logoBase64
                }
              }
            ]
          }
        ],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE']
        }
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Gemini API error status: ${response.status}`);
      }

      const result = await response.json();
      const candidate = result?.candidates?.[0];

      if (!candidate || !candidate.content || !candidate.content.parts) {
        throw new Error('Received empty generation response from Gemini.');
      }

      let extractedText = '';
      let extractedImgBase64 = null;
      let mimeType = 'image/png';

      candidate.content.parts.forEach((part) => {
        if (part.text) {
          extractedText += part.text;
        }
        if (part.inlineData) {
          extractedImgBase64 = part.inlineData.data;
          mimeType = part.inlineData.mimeType || 'image/png';
        }
      });

      if (!extractedImgBase64) {
        throw new Error('Gemini engine did not return a generated image. Please retry.');
      }

      // Parse headline & caption
      let finalHeadline = `${subjectRec.Subject} | Apple Store Malaysia`;
      let finalCaption = `Discover ${subjectRec.Subject} at Apple Store Malaysia. Precision design meets exceptional capability.\n\n#AppleStoreMY #AppleMalaysia #Apple`;

      if (extractedText.includes('---HEADLINE---') && extractedText.includes('---CAPTION---')) {
        const headlineMatch = extractedText.match(/---HEADLINE---([\s\S]*?)---CAPTION---/);
        const captionMatch = extractedText.match(/---CAPTION---([\s\S]*)/);
        
        if (headlineMatch && headlineMatch[1]) finalHeadline = headlineMatch[1].trim();
        if (captionMatch && captionMatch[1]) finalCaption = captionMatch[1].trim();
      } else if (extractedText.trim()) {
        finalCaption = extractedText.trim();
      }

      setGeneratedImage(`data:${mimeType};base64,${extractedImgBase64}`);
      setGeneratedHeadline(finalHeadline);
      setEditedCaption(finalCaption);

      setActiveModal('preview');
    } catch (err) {
      console.error('Generation Error:', err);
      setError(err.message || 'An error occurred during AI generation.');
    } finally {
      setIsGenerating(false);
      setGeneratingStep('');
    }
  };

  const handleSaveSlot = async () => {
    if (!generatedImage || !selectedSlot) return;

    setIsSaving(true);
    setError(null);

    try {
      let imageBlob;
      if (generatedImage.startsWith('data:')) {
        const res = await fetch(generatedImage);
        imageBlob = await res.blob();
      } else {
        const res = await fetch(generatedImage);
        imageBlob = await res.blob();
      }

      const formData = new FormData();
      formData.append('image', imageBlob, 'instagram-post.png');
      formData.append('caption', editedCaption);
      formData.append('scheduled', selectedSlot.scheduledStr);

      const isUpdate = Boolean(selectedSlot.existingRecord && selectedSlot.existingRecord.id);
      const targetUrl = isUpdate 
        ? `${CALENDAR_API_URL}?id=${selectedSlot.existingRecord.id}`
        : CALENDAR_API_URL;

      const method = isUpdate ? 'PUT' : 'POST';

      const apiResponse = await fetch(targetUrl, {
        method: method,
        body: formData
      });

      if (!apiResponse.ok) {
        throw new Error(`Server API returned HTTP ${apiResponse.status} on ${method}`);
      }

      setSuccessMsg(isUpdate ? 'Slot updated successfully.' : 'New slot scheduled successfully.');
      setTimeout(() => setSuccessMsg(null), 4000);

      setActiveModal(null);
      
      // Refresh source of truth calendar records
      await fetchAllSources();

    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save content: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getMonthDays = () => {
    const totalDays = daysInMonth(currentMonth);
    const days = [];
    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      days.push(formatDateKey(d));
    }
    return days;
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex justify-center items-start sm:py-6 selection:bg-neutral-800">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md bg-black sm:rounded-3xl border border-neutral-800 shadow-2xl flex flex-col min-h-screen sm:min-h-[880px] overflow-hidden relative">
        
        {/* iOS Style Mobile Header */}
        <header className="sticky top-0 z-30 bg-black/90 backdrop-blur-md border-b border-neutral-800/80 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 fill-black mb-[1px]" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.16-1.9-14.48-6.08-3.38-2.73-7.25-7.38-11.62-13.96-6.17-9.33-11.02-19.67-14.55-31.02-3.53-11.35-5.3-22.31-5.3-32.88 0-12.82 3.01-23.63 9.03-32.43 6.02-8.8 13.88-13.3 23.58-13.5 4.58 0 9.87 1.25 15.87 3.75 6 2.5 10.23 3.75 12.69 3.75 2.12 0 6.44-1.28 12.96-3.84 6.52-2.56 11.75-3.75 15.69-3.57 10.23.63 18.29 4.38 24.18 11.25-9.1 5.51-13.53 13.31-13.29 23.41.24 9.1 3.98 16.65 11.22 22.65 4.25 3.56 9.09 5.88 14.52 6.96-2.45 7.15-5.83 14.88-10.14 23.19zM119.22 31.08c0-7.38 2.65-14.34 7.95-20.88 5.3-6.54 11.89-10.2 19.78-10.98.13 1 .19 1.88.19 2.63 0 7.37-2.78 14.48-8.34 21.32-5.56 6.84-12.22 10.59-19.98 11.25-.12-.88-.18-1.99-.18-3.34z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xs font-semibold tracking-tight text-white leading-tight">Apple Store MY</h1>
                <span className="text-[9px] bg-neutral-800 text-neutral-300 font-mono px-1.5 py-0.2 rounded border border-neutral-700">Canvas</span>
              </div>
              <p className="text-[10px] text-neutral-400 font-mono">Instagram Calendar System</p>
            </div>
          </div>

          <button 
            onClick={fetchAllSources} 
            className="p-2 text-neutral-400 hover:text-white rounded-full transition-colors active:scale-95"
            title="Refresh APIs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-white' : ''}`} />
          </button>
        </header>

        {/* Global Notifications */}
        {error && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-red-950/80 border border-red-800/80 flex items-start gap-2.5 text-red-200 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
            <button onClick={() => setError(null)}><X className="w-3.5 h-3.5 text-red-400" /></button>
          </div>
        )}

        {successMsg && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-emerald-950/80 border border-emerald-800/80 flex items-center gap-2.5 text-emerald-200 text-xs">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="flex-1">{successMsg}</div>
          </div>
        )}

        {/* Calendar Month Navigation */}
        <div className="px-4 py-3 border-b border-neutral-900 bg-neutral-950">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-neutral-400" />
              <h2 className="text-xs font-medium text-white">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
            </div>
            <div className="flex items-center gap-1 bg-neutral-900 rounded-lg p-0.5 border border-neutral-800">
              <button 
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                className="p-1.5 text-neutral-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                className="p-1.5 text-neutral-400 hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Day Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
            {getMonthDays().map((dateStr) => {
              const d = new Date(`${dateStr}T00:00:00`);
              const isSelected = dateStr === selectedDate;
              const dayNum = d.getDate();
              const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' });

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`flex-shrink-0 w-11 h-14 rounded-2xl flex flex-col items-center justify-center transition-all snap-center ${
                    isSelected 
                      ? 'bg-white text-black font-semibold shadow-lg scale-105' 
                      : 'bg-neutral-900 text-neutral-400 border border-neutral-800/60 hover:bg-neutral-850'
                  }`}
                >
                  <span className="text-[9px] uppercase font-mono tracking-wider opacity-70">{dayName}</span>
                  <span className="text-sm font-medium">{dayNum}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scheduled Slots Container */}
        <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-mono text-neutral-400">
              {new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="text-[10px] text-neutral-500 uppercase font-mono tracking-wider">3 Fixed UTC Slots</span>
          </div>

          {SLOT_TIMES.map((timeSuffix) => {
            const scheduledStr = getScheduledString(selectedDate, timeSuffix);
            const calRecord = findCalendarRecord(scheduledStr);
            const subjRecord = findSubjectRecord(scheduledStr);
            const slotHourUTC = timeSuffix.substring(0, 5);

            return (
              <div 
                key={scheduledStr}
                className="rounded-2xl bg-neutral-900/90 border border-neutral-800 overflow-hidden shadow-lg transition-all"
              >
                {/* Slot Header */}
                <div className="px-4 py-2 bg-neutral-900 border-b border-neutral-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="text-xs font-mono font-medium text-neutral-200">{slotHourUTC} UTC</span>
                  </div>
                  {calRecord ? (
                    <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800/50">
                      Populated
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full">
                      Empty Slot
                    </span>
                  )}
                </div>

                {/* Slot Body */}
                <div className="p-4 space-y-3">
                  {/* Subject Information Banner from /subject API */}
                  <div className="bg-black/60 rounded-xl p-2.5 border border-neutral-800/80 text-xs">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      <Tag className="w-3 h-3" />
                      <span>Scheduled Subject & Style</span>
                    </div>
                    {subjRecord ? (
                      <div>
                        <p className="font-medium text-white leading-snug">{subjRecord.Subject}</p>
                        <p className="text-[11px] text-neutral-400 mt-0.5 font-mono">Style: {subjRecord.Style || 'N/A'}</p>
                      </div>
                    ) : (
                      <p className="text-red-400 text-[11px] font-mono">No subject mapping found in /subject API for this slot.</p>
                    )}
                  </div>

                  {calRecord ? (
                    /* Existing Record Display */
                    <div className="space-y-3 pt-1">
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800">
                        <img 
                          src={calRecord.image_url} 
                          alt="Scheduled visual" 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      <div className="bg-neutral-950 rounded-xl p-3 border border-neutral-800/80">
                        <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap line-clamp-3">
                          {calRecord.caption}
                        </p>
                      </div>

                      <button
                        onClick={() => handleOpenSlot(scheduledStr)}
                        className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors active:scale-98"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit / Regenerate Content
                      </button>
                    </div>
                  ) : (
                    /* Empty Slot Action */
                    <div className="py-2 flex flex-col items-center justify-center text-center space-y-2">
                      <button
                        onClick={() => handleOpenSlot(scheduledStr)}
                        disabled={!subjRecord}
                        className="w-full py-2.5 px-5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-md disabled:opacity-40 disabled:pointer-events-none"
                      >
                        <Sparkles className="w-3.5 h-3.5 fill-black" />
                        Create / Generate Post
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </main>

        {/* Modal: Workflow Initiation */}
        {activeModal === 'workflow' && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <div>
                  <h3 className="text-sm font-semibold text-white">Generate Instagram Content</h3>
                  <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Slot: {selectedSlot?.scheduledStr}</p>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  disabled={isGenerating}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Subject / Style Auto-Resolved Summary */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Source Subject & Style (/subject API)</span>
                <div className="bg-black p-3 rounded-xl border border-neutral-800 space-y-1">
                  <p className="text-xs font-semibold text-white">{selectedSlot?.subjectRecord?.Subject}</p>
                  <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-mono">
                    <span>Category: {selectedSlot?.subjectRecord?.Category}</span>
                    <span>Style: {selectedSlot?.subjectRecord?.Style}</span>
                  </div>
                </div>
              </div>

              {/* Logo File Input Override */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-300">
                  Logo Asset <span className="text-neutral-500 font-normal">(Optional Upload Override)</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCustomLogoFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="logo-file-input"
                    disabled={isGenerating}
                  />
                  <label
                    htmlFor="logo-file-input"
                    className="w-full bg-black border border-neutral-800 hover:border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-neutral-300 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="truncate">
                      {customLogoFile ? customLogoFile.name : 'Auto-fetch logo_url from /var API'}
                    </span>
                    <Upload className="w-4 h-4 text-neutral-400 shrink-0 ml-2" />
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  disabled={isGenerating}
                  className="flex-1 py-3 px-4 rounded-xl bg-neutral-800 text-neutral-300 font-medium text-xs hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGenerateContent}
                  disabled={isGenerating || !selectedSlot?.subjectRecord}
                  className="flex-1 py-3 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 fill-black" />
                      Run Generation
                    </>
                  )}
                </button>
              </div>

              {isGenerating && (
                <div className="pt-1 text-center">
                  <p className="text-[10px] text-neutral-400 font-mono animate-pulse">{generatingStep}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal: Preview & Caption Edit */}
        {activeModal === 'preview' && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
              
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800 sticky top-0 bg-neutral-900 z-10">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {selectedSlot?.existingRecord ? 'Edit Post Preview' : 'Generated Content Preview'}
                  </h3>
                  <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Slot: {selectedSlot?.scheduledStr}</p>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  disabled={isSaving}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Image Preview */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Generated Visual</span>
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-black border border-neutral-800">
                  {generatedImage ? (
                    <img 
                      src={generatedImage} 
                      alt="Generated Content" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600">No Image</div>
                  )}
                </div>
              </div>

              {/* Headline */}
              {generatedHeadline && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Generated Headline</span>
                  <div className="bg-black p-3 rounded-xl border border-neutral-800 text-xs font-semibold text-white">
                    {generatedHeadline}
                  </div>
                </div>
              )}

              {/* Caption Editor */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Instagram Caption</span>
                  <span className="text-[10px] text-neutral-500 font-mono">Editable</span>
                </div>
                <textarea
                  value={editedCaption}
                  onChange={(e) => setEditedCaption(e.target.value)}
                  rows={5}
                  placeholder="Refine English caption..."
                  className="w-full bg-black border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-600 leading-relaxed font-sans transition-colors resize-none"
                  disabled={isSaving}
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal('workflow')}
                  disabled={isSaving}
                  className="px-3 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Regenerate
                </button>

                <button
                  type="button"
                  onClick={handleSaveSlot}
                  disabled={isSaving || !generatedImage}
                  className="flex-1 py-3 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      {selectedSlot?.existingRecord ? 'Update Slot (PUT)' : 'Save Slot (POST)'}
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
