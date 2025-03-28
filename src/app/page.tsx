"use client"

import React, { useEffect, useState, useRef } from "react";
import { fetchBoards } from '@/app/api/boards';
import { fetchAssets } from '@/app/api/clips';
import { BoardsListResponse } from "@/app/api/boards";
import { ClipsListResponse } from "@/app/api/clips";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BoardCards from "@/components/ui/boardcards";
import ClipCards from "@/components/ui/clipcards";

export default function Home() {
  const [boards, setBoards] = useState<BoardsListResponse>();
  const [assets, setAssets] = useState<ClipsListResponse>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);

  const loadMoreRef = useRef(null);

  useEffect(() => {
    const getBoards = async () => {
      try {
        const data = await fetchBoards();
        setBoards(data);
      } catch (err) {
        setError("Failed to fetch boards");
      } finally {
        setLoading(false);
      }
    };

    getBoards();
  }, []);

  useEffect(() => {
    const getAssets = async () => {
      try {
        const data = await fetchAssets({ cursor: null });
        setAssets(data);
        setCursor(data.pagination.cursor);
      } catch (err) {
        setError("Failed to fetch assets");
      } finally {
        setLoading(false);
      }
    };

    getAssets();
  }, []);

  useEffect(() => {
    const loadMoreObserver = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !loading && cursor) {
          console.log("Next cursor:", cursor);
          setLoading(true);
          try {
            const data = await fetchAssets({ cursor });
            setCursor(data.pagination.cursor);
          } catch (err) {
            setError("Failed to fetch more assets");
          } finally {
            setLoading(false);
          }
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      loadMoreObserver.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        loadMoreObserver.unobserve(loadMoreRef.current);
      }
    };
  }, [cursor, loading]);

  if (loading) return <>Loading</>;

  if (error) return <>{error}</>;

  return (
    <main className="p-4 md:p-8 lg:p-12">
      <Accordion type="multiple" defaultValue={["boards"]}>
        <AccordionItem value="boards">
          <AccordionTrigger className="uppercase font-semibold text-xs text-stone-500">
            Boards ({boards?.total})
          </AccordionTrigger>
          <AccordionContent>
             {boards?.data && <BoardCards boards={boards.data} />}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="assets">
          <AccordionTrigger className="uppercase font-semibold text-xs text-stone-500">
            Assets ({assets?.data.total})
          </AccordionTrigger>
          <AccordionContent>
            {assets?.data && <ClipCards clips={assets.data.clips} />}
            <div ref={loadMoreRef} className="h-10" />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
}
