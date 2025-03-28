import React from "react";
import Image from "next/image";
import { Board } from "@/app/api/boards";

interface BoardCardsProps {
  boards: Board[];
}

interface BoardCardProps {
  board: Board;
}

export default function BoardCards({ boards }: BoardCardsProps) {
  return (
    <div className="flex gap-6 flex-wrap">
      {boards.map((board) => <BoardCard key={board.id} board={board} />)}
    </div>
  );
}

function BoardCard({ board } : BoardCardProps) {
  const thumbnails = board.thumbnails ?? [];

  const cardThumbnail = thumbnails.length > 0
    ? (
      <div className="absolute top-0 left-0 h-full w-full overflow-hidden [&>img]:relative [&>img]:h-full [&>img]:w-full">
        <Image className="object-cover" src={thumbnails[0]} fill alt={board.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 from-20% to-black/20"></div>
      </div>
    )
    : null;

  return (
    <div className="transition w-[200px] h-[200px] px-3 pt-3 pb-5 flex flex-col relative rounded-sm aspect-square overflow-hidden">
      {cardThumbnail}
      <div className="relative flex size-full flex-col flex-grow justify-end">
        <h3 className="text-xl font-semibold text-white line-clamp-3 break-words">{board.title}</h3>
      </div>
    </div>
  )
}
