import type React from "react";
import { useState } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { ArrowDownWideNarrow, ArrowUpNarrowWide, Check, X } from "lucide-react";

interface WordData {
  frequency: number;
  isInTheArray: boolean;
}

interface WordFrequencyGridProps {
  data: Record<string, WordData>;
}

type ArrayFilterType = "all" | "inArray" | "notInArray";
type FrequencyFilterType = "all" | "zero" | "nonZero";
type SortType = "asc" | "desc";

const WordFrequencyGrid: React.FC<WordFrequencyGridProps> = ({ data }) => {
  const [arrayFilter, setArrayFilter] = useState<ArrayFilterType>("all");
  const [frequencyFilter, setFrequencyFilter] =
    useState<FrequencyFilterType>("all");
  const [sort, setSort] = useState<SortType>("desc");
  const maxFrequency = Math.max(
    ...Object.values(data).map((item) => item.frequency)
  );

  const filteredAndSortedData = Object.entries(data)
    .filter(([, { isInTheArray, frequency }]) => {
      const arrayFilterPass =
        arrayFilter === "all" ||
        (arrayFilter === "inArray" && isInTheArray) ||
        (arrayFilter === "notInArray" && !isInTheArray);

      const frequencyFilterPass =
        frequencyFilter === "all" ||
        (frequencyFilter === "zero" && frequency === 0) ||
        (frequencyFilter === "nonZero" && frequency > 0);

      return arrayFilterPass && frequencyFilterPass;
    })
    .sort(([, a], [, b]) =>
      sort === "desc" ? b.frequency - a.frequency : a.frequency - b.frequency
    );

  const FilterButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
    className?: string;
  }> = ({ label, isActive, onClick, className }) => (
    <button
      type="button"
      className={`px-4 py-2 text-sm font-medium ${
        isActive
          ? "bg-blue-500 text-white"
          : "bg-white text-gray-700 hover:bg-gray-50"
      } ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        High Frequency Words Map
        </h1>

        <div className="mb-6 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <FilterButton
              label="All Words"
              isActive={arrayFilter === "all"}
              onClick={() => setArrayFilter("all")}
              className="rounded-l-lg"
            />
            <FilterButton
              label={(() => {
                const inArrayWords = Object.entries(data).filter(
                  ([, { isInTheArray }]) => isInTheArray
                );
                const inArrayWithFrequency = inArrayWords.filter(
                  ([, { frequency }]) => frequency > 0
                );
                return `In Array (${inArrayWithFrequency.length}/${inArrayWords.length})`;
              })()}
              isActive={arrayFilter === "inArray"}
              onClick={() => setArrayFilter("inArray")}
            />
            <FilterButton
              label="Not in Array"
              isActive={arrayFilter === "notInArray"}
              onClick={() => setArrayFilter("notInArray")}
              className="rounded-r-lg"
            />
          </div>

          <div className="inline-flex rounded-md shadow-sm" role="group">
            <FilterButton
              label="All Frequencies"
              isActive={frequencyFilter === "all"}
              onClick={() => setFrequencyFilter("all")}
              className="rounded-l-lg"
            />
            <FilterButton
              label="Frequency = 0"
              isActive={frequencyFilter === "zero"}
              onClick={() => setFrequencyFilter("zero")}
            />
            <FilterButton
              label="Frequency > 0"
              isActive={frequencyFilter === "nonZero"}
              onClick={() => setFrequencyFilter("nonZero")}
              className="rounded-r-lg"
            />
          </div>

          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                sort === "desc"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setSort(sort === "desc" ? "asc" : "desc")}
            >
              {sort === "desc" ? (
                <>
                  <ArrowDownWideNarrow className="inline mr-2" /> High to Low
                </>
              ) : (
                <>
                  <ArrowUpNarrowWide className="inline mr-2" /> Low to High
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 h-[calc(100vh-200px)]">
          <AutoSizer>
            {({ height, width }) => {
              const columnCount =
                width > 1024 ? 4 : width > 768 ? 3 : width > 640 ? 2 : 1;
              const columnWidth = width / columnCount;
              const rowCount = Math.ceil(
                filteredAndSortedData.length / columnCount
              );
              const rowHeight = 150; // Adjust this value based on your card height

              const Cell = ({
                columnIndex,
                rowIndex,
                style,
              }: {
                columnIndex: number;
                rowIndex: number;
                style: React.CSSProperties;
              }) => {
                const index = rowIndex * columnCount + columnIndex;
                if (index >= filteredAndSortedData.length) return null;

                const [word, { frequency, isInTheArray }] =
                  filteredAndSortedData[index];

                return (
                  <div style={style}>
                    <div
                      className={`m-2 p-4 rounded-lg shadow-md ${
                        isInTheArray ? "bg-white" : "bg-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-semibold text-gray-800">
                          {word}
                        </h2>
                        {isInTheArray ? (
                          <Check className="text-blue-500" />
                        ) : (
                          <X className="text-gray-500" />
                        )}
                      </div>
                      <div className="mb-2">
                        <div className="text-sm font-medium text-gray-500">
                          Frequency
                        </div>
                        <div className="mt-1 relative">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                            <div
                              style={{
                                width: `${(frequency / maxFrequency) * 100}%`,
                              }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                            ></div>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-end">
                            <span className="text-xs font-semibold text-gray-700">
                              {frequency}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {isInTheArray ? "In array" : "Not in array"}
                      </div>
                    </div>
                  </div>
                );
              };

              return (
                <Grid
                  className="List"
                  columnCount={columnCount}
                  columnWidth={columnWidth}
                  height={height}
                  rowCount={rowCount}
                  rowHeight={rowHeight}
                  width={width}
                >
                  {Cell}
                </Grid>
              );
            }}
          </AutoSizer>
        </div>
      </div>
    </div>
  );
};

export default WordFrequencyGrid;
