export const useImagePreloader = (urls: string[]) => {
  const preload = async (url: string) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => resolve(url); // Resolve anyway to not block the queue
      img.src = url;
    });
  };

  const startPreloading = async (concurrency = 3) => {
    const queue = [...urls];
    const workers = Array(concurrency).fill(null).map(async () => {
      while (queue.length > 0) {
        const nextUrl = queue.shift();
        if (!nextUrl) continue;
        await preload(nextUrl);
      }
    });
    await Promise.all(workers);
  };

  return { startPreloading };
};