import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Upload, Sparkles, Video, AlertCircle, Loader2 } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { GoogleGenAI } from '@google/genai';

interface MagicVideoProps {
  onNav: (screen: string) => void;
}

export default function MagicVideo({ onNav }: MagicVideoProps) {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [prompt, setPrompt] = useState('一个可爱的卡通角色，生动活泼，充满魔法');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImage(result.split(',')[1]); // Base64 data
      setMimeType(file.type);
    };
    reader.readAsDataURL(file);
  };

  const generateVideo = async () => {
    if (!image) return;
    
    try {
      setIsGenerating(true);
      setError(null);
      setVideoUrl(null);
      
      // Check API Key
      if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
        await window.aistudio.openSelectKey();
      }
      
      // We must use the API key from the environment (injected after selection)
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("请先选择 API Key");
      }

      setStatusMsg('正在连接魔法引擎...');
      const ai = new GoogleGenAI({ apiKey });
      
      setStatusMsg('正在施展魔法，生成视频中...');
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: {
          imageBytes: image,
          mimeType: mimeType,
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      setStatusMsg('魔法正在生效，这可能需要几分钟时间...');
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({operation: operation});
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) {
        throw new Error('未能生成视频');
      }

      setStatusMsg('正在下载魔法视频...');
      const response = await fetch(downloadLink, {
        method: 'GET',
        headers: {
          'x-goog-api-key': apiKey,
        },
      });
      
      if (!response.ok) {
          throw new Error(`下载视频失败: ${response.statusText}`);
      }

      const blob = await response.blob();
      setVideoUrl(URL.createObjectURL(blob));
      setStatusMsg('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || '生成视频时发生错误');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full flex flex-col bg-indigo-50 relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-8 sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-indigo-100">
        <button onClick={() => onNav('map')} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="text-indigo-500" size={24} />
          魔法动画工坊
        </h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100 mb-6">
          <h3 className="text-lg font-bold text-slate-800 mb-2">让图片动起来！</h3>
          <p className="text-slate-500 text-sm mb-6">上传一张图片，输入你想要的魔法效果，我们将为你生成一段专属动画视频。</p>

          {/* Image Upload */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-indigo-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50 transition-colors mb-6 relative overflow-hidden"
          >
            {image ? (
              <img src={`data:${mimeType};base64,${image}`} alt="Uploaded" className="absolute inset-0 w-full h-full object-cover opacity-50" />
            ) : null}
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-full shadow-sm mb-3 relative z-10">
              <Upload className="text-indigo-500" size={24} />
            </div>
            <span className="text-indigo-600 font-medium relative z-10">
              {image ? '更换图片' : '点击上传图片'}
            </span>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          {/* Prompt Input */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">魔法咒语（提示词）</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="描述你希望图片如何动起来..."
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-start gap-2 mb-6">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Generate Button */}
          <button 
            onClick={generateVideo}
            disabled={!image || isGenerating}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
              !image || isGenerating 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                {statusMsg || '生成中...'}
              </>
            ) : (
              <>
                <Video size={20} />
                生成魔法视频
              </>
            )}
          </button>
        </div>

        {/* Video Result */}
        {videoUrl && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-indigo-100"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Sparkles className="text-amber-500" size={20} />
              你的魔法视频已完成！
            </h3>
            <div className="rounded-xl overflow-hidden bg-black aspect-video relative">
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                loop 
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
        )}
      </div>

      <BottomNav current="magic" onNav={onNav} />
    </motion.div>
  );
}
