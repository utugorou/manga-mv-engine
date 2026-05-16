import type { AudioMood, AspectRatio, MotionType, PresetName } from "../types/mv";

type Props = {
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAudioUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  audioName: string; aspectRatio: AspectRatio; formatTime:(t:number)=>string; audioDuration:number; currentTime:number; images:string[]; currentImageIndex:number; isPlaying:boolean; chorusBoost:boolean; activePreset:PresetName|null; audioMood:AudioMood; imageMotions:MotionType[]; onSelectImage:(img:string,i:number)=>void;
};

export default function UploadPanel(p:Props){return <div className="w-64 border-r border-purple-500 p-4 overflow-y-auto"><h2 className="text-xl font-bold mb-4 text-pink-400">Manga MV Engine</h2><label className="block mb-3"><div className="w-full bg-pink-500 hover:bg-pink-600 p-2 rounded text-center cursor-pointer">画像アップロード</div><input type="file" accept="image/*" multiple className="hidden" onChange={p.handleImageUpload}/></label><label className="block mb-4"><div className="w-full bg-cyan-500 hover:bg-cyan-600 p-2 rounded text-center cursor-pointer">音楽アップロード</div><input type="file" accept="audio/*" className="hidden" onChange={p.handleAudioUpload}/></label></div>}
