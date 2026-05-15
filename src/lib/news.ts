import Papa from "papaparse";

type NewsRow = {
  title?: string;
  input_text: string;
};

let cachedNews: NewsRow[] = [];

export async function getRandomNews(): Promise<string> {
  // Cache supaya CSV tidak dibaca terus-menerus
  if (cachedNews.length === 0) {
    const response = await fetch("/data/test.csv");

    const csvText = await response.text();

    const parsed = Papa.parse<NewsRow>(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    cachedNews = parsed.data;
  }

  const randomIndex = Math.floor(
    Math.random() * cachedNews.length,
  );

  return cachedNews[randomIndex]?.input_text || "";
}