import React from 'react';

interface VoucherQrCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export const VoucherQrCode: React.FC<VoucherQrCodeProps> = ({ value, size = 64, className = '' }) => {
  // Deterministic 17x17 grid generator for realistic QR look
  const gridSize = 15;
  const hash = Array.from(value).reduce((acc, char, i) => acc + char.charCodeAt(0) * (i + 1) * 31, 0);

  const cells: boolean[][] = [];
  for (let r = 0; r < gridSize; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < gridSize; c++) {
      // Finder patterns in 3 corners (7x7 zones)
      const isTopLeftFinder = (r < 5 && c < 5);
      const isTopRightFinder = (r < 5 && c >= gridSize - 5);
      const isBottomLeftFinder = (r >= gridSize - 5 && c < 5);

      if (isTopLeftFinder || isTopRightFinder || isBottomLeftFinder) {
        // Border of finder pattern
        const rowInBox = r < 5 ? r : r - (gridSize - 5);
        const colInBox = c < 5 ? c : c - (gridSize - 5);
        const isBorder = rowInBox === 0 || rowInBox === 4 || colInBox === 0 || colInBox === 4;
        const isCenter = rowInBox >= 1 && rowInBox <= 3 && colInBox >= 1 && colInBox <= 3;
        row.push(isBorder || isCenter);
      } else {
        // Pseudo-random deterministic data bit
        const bit = ((hash * (r + 1) * 13 + (c + 1) * 19 + r * c) % 100) > 46;
        row.push(bit);
      }
    }
    cells.push(row);
  }

  const cellSize = size / gridSize;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`bg-white rounded p-1 shrink-0 ${className}`}
      aria-label={`QR Code for ${value}`}
    >
      {cells.map((row, r) =>
        row.map((active, c) =>
          active ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize + 0.3}
              height={cellSize + 0.3}
              fill="#0F172A"
            />
          ) : null
        )
      )}
    </svg>
  );
};
