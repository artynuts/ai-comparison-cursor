"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import MarkdownResponse from "../components/MarkdownResponse";
import DeleteButton from "../components/DeleteButton";
import ThumbsRating from "../components/ThumbsRating";
import { useHistory } from "../context/HistoryContext";

export default function History() {
  const searchParams = useSearchParams();
  const selectedQuery = searchParams.get("query");
  const { history, deleteFromHistory, updateResponseRating } = useHistory();
  const selectedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedQuery && selectedRef.current) {
      setTimeout(() => {
        selectedRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [selectedQuery]);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Query History</h1>

      <div className="space-y-8">
        {history.map((item, historyIndex) => (
          <div
            key={historyIndex}
            ref={selectedQuery === item.query ? selectedRef : null}
            className={`border rounded-lg p-4 ${
              selectedQuery === item.query ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-mono bg-gray-100 p-2 rounded">
                  {item.query}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
              <DeleteButton
                onDelete={() => deleteFromHistory(item.timestamp)}
                className="text-gray-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {item.responses.map((response, responseIndex) => (
                <div key={responseIndex} className="border rounded p-3">
                  <div className="mb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{response.modelName}</h4>
                        <p className="text-xs text-gray-500">
                          {response.provider}
                        </p>
                        <p className="text-xs text-gray-400">
                          Latency: {response.latency}ms
                        </p>
                      </div>
                    </div>
                  </div>
                  {response.error ? (
                    <p className="text-red-500 text-sm">{response.error}</p>
                  ) : (
                    <>
                      <div className="text-sm">
                        <MarkdownResponse content={response.response} />
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <ThumbsRating
                          rating={response.rating}
                          onChange={(rating) =>
                            updateResponseRating(
                              item.timestamp,
                              responseIndex,
                              rating
                            )
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
