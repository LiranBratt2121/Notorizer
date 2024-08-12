import { useState, useEffect } from 'react';

const useFetchSvg = (url: string) => {
  const [svgXmlData, setSvgXmlData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSvgData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const svgText = await response.text();
        setSvgXmlData(svgText);
      } catch (error) {
        setError('Failed to load SVG');
      } finally {
        setLoading(false);
      }
    };

    fetchSvgData();
  }, [url]);

  return { svgXmlData, loading, error };
};

export default useFetchSvg;
