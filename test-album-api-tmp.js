

(async () => {
  try {
    console.log("Searching for albums...");
    const searchRes = await fetch("https://jiosavnapi-production.up.railway.app/api/search/albums?query=Arijit");
    const searchJson = await searchRes.json();
    console.log("Search Success! Results count:", searchJson.data?.results?.length);
    if (searchJson.data?.results?.length > 0) {
      const album = searchJson.data.results[0];
      console.log("First Album Sample Info:", {
        id: album.id,
        name: album.name,
        artist: album.artists?.primary?.map(a => a.name).join(", "),
        image: album.image?.[album.image.length - 1]?.url
      });

      console.log("\nFetching details for Album ID:", album.id);
      const detailRes = await fetch(`https://jiosavnapi-production.up.railway.app/api/albums?id=${album.id}`);
      const detailJson = await detailRes.json();
      console.log("Detail Success! Songs in album count:", detailJson.data?.songs?.length);
      if (detailJson.data?.songs?.length > 0) {
        const song = detailJson.data.songs[0];
        console.log("First Song in Album Sample Info:", {
          id: song.id,
          name: song.name,
          duration: song.duration,
          downloadUrl: song.downloadUrl?.[song.downloadUrl.length - 1]?.url
        });
      }
    }
  } catch (err) {
    console.error("API test error:", err);
  }
})();
