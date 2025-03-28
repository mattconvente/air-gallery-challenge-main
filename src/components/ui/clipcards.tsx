import React from "react";
import Image from "next/image";
import { Clip } from "@/app/api/clips";
import {formatDuration, formatSize} from '@/lib/utils';

interface ClipCardsProps {
  clips: Clip[];
}

interface ClipCardProps {
  clip: Clip;
}

type ClipThumbnailProps = Pick<Clip, "assets" | "displayName">;

type ClipMetadataProps = Pick<Clip,
  "displayName" |
  "ext" |
  "height" |
  "width" |
  "size" |
  "duration"
>;

export default function ClipCards({ clips }: ClipCardsProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
      {clips.map((clip) => <ClipCard key={clip.id} clip={clip} />)}
    </div>
  );
}

function ClipCard({ clip } : ClipCardProps) {
  const clipIsPortrait = clip.height > clip.width ? true : false;
  const assets = clip.assets ?? [];
  const duration = clip.duration ?? 0;

  return (
    <div tabIndex={0} className={`${clipIsPortrait ? "row-span-2" : ""} group transition h-[240px] flex flex-col relative rounded-sm overflow-hidden`}>
      <div className="relative flex size-full flex-col flex-grow justify-end">
        <ClipThumbnail assets={assets} displayName={clip.displayName} />
        <ClipMetadata
          displayName={clip.displayName}
          ext={clip.ext}
          height={clip.height}
          width={clip.width}
          size={clip.size}
          duration={duration}
        />
      </div>
    </div>
  )
}

function ClipThumbnail({ assets, displayName } : ClipThumbnailProps) {
  return (
    <div className="top-0 left-0 h-full w-full overflow-hidden [&>img]:relative [&>img]:h-full [&>img]:w-full">
      <Image className="object-cover" src={assets.image} fill alt={displayName || "Asset Thumbnail"} />
    </div>
  );
}

function ClipMetadata({
  displayName,
  ext,
  height,
  width,
  size,
  duration = 0,
} : ClipMetadataProps) {
  const durationMarkup = duration > 0
    ? (
      <div className="flex justify-end group-hover:hidden group-focus-visible:hidden">
        <span className="p-1 leading-none rounded-sm bg-zinc-500/50 text-white text-[10px]">{formatDuration(duration)}</span>
      </div>
    )
    : null;

  return (
    <div className="transition pointer-events-none absolute bottom-0 left-0 flex flex-col justify-end px-2 pb-3 w-full h-[100px] text-white group-hover:bg-gradient-to-b group-focus-visible:bg-gradient-to-b from-black/0 to-black/90">
      <div className="opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
        <h3 className="text-base text-white line-clamp-3 break-words mb-2 leading-[1.2]">{displayName}</h3>
        <ul className="flex text-xs font-light gap-4">
          <li className="after:content-['•'] after:absolute after:text-[8px] after:mx-1.5 uppercase">{ext}</li>
          <li className="after:content-['•'] after:absolute after:text-[8px] after:mx-1.5 uppercase">{formatSize(size)}</li>
          <li>{width} x {height}</li>
        </ul>
      </div>
      {durationMarkup}
    </div>
  )
}
