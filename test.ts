import { JSDOM } from "jsdom";

type GridItem = {
  x: number;
  y: number;
  char: string;
};

async function decoding(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to retrieve document: ${response.status}`);
  }
  const html = await response.text();
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const rows = Array.from(document.querySelectorAll("table tr"));
  const items: GridItem[] = [];

  for (const row of rows) {
    const cells = Array.from(row.querySelectorAll("td")).map(
      (cell) => cell.textContent?.trim() ?? "",
    );

    if (cells.length < 3) continue;
    const x = Number(cells[0]);
    const char = cells[1];
    const y = Number(cells[2]);

    if (!Number.isInteger(x) || !Number.isInteger(y) || char === "") {
      continue;
    }

    items.push({ x, y, char });
  }
  if (items.length === 0) {
    throw new Error("No valid coordinate data was found.");
  }

  const maxX = Math.max(...items.map((item) => item.x));
  const maxY = Math.max(...items.map((item) => item.y));

  const grid: string[][] = Array.from({ length: maxY + 1 }, () =>
    Array.from({ length: maxX + 1 }, () => " "),
  );

  for (const { x, y, char } of items) {
    grid[y][x] = char;
  }

  const result = grid
    .slice()
    .reverse()
    .map((row) => row.join(""))
    .join("\n");

  console.log(result);
}

decoding(
  "https://docs.google.com/document/d/e/2PACX-1vSvM5gDlNvt7npYHhp_XfsJvuntUhq184By5xO_pA4b_gCWeXb6dM6ZxwN8rE6S4ghUsCj2VKR21oEP/pub",
);
