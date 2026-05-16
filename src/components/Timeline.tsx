import type { SwitchMode, TimelineMarker } from "../types/mv";

type Props = { audioUrl: string | null; currentTime: number; audioDuration: number; onSeek: (v:number)=>void; markers: TimelineMarker[]; currentImageIndex: number; imagesLength: number; switchMode: SwitchMode; formatTime:(t:number)=>string };

export default function Timeline(p: Props){
  if(!p.audioUrl) return null;
  return <div className="w-full max-w-[720px] bg-zinc-900 border border-zinc-700 rounded-xl p-4">
    <div className="flex justify-between text-xs text-zinc-400 mb-2"><span>{p.formatTime(p.currentTime)}</span><span>{p.formatTime(p.audioDuration)}</span></div>
    <input type="range" min="0" max={p.audioDuration||0} step="0.01" value={p.currentTime} onChange={(e)=>p.onSeek(Number(e.target.value))} className="w-full accent-pink-500"/>
  </div>
}
