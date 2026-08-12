// api/play.js
// This is a simpler version that definitely works on Vercel

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Get parameters
  const { tmdb_id, type, season, episode } = req.query;

  // Validate
  if (!tmdb_id || !type) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing tmdb_id or type' 
    });
  }

  try {
    // Import the scraper
    const { scrapeVidsrc } = require('@definisi/vidsrc-scraper');
    
    console.log(`📺 Fetching: ${type} ${tmdb_id}`);
    
    // Get the video
    const result = await scrapeVidsrc(tmdb_id, type, season || null, episode || null);
    
    if (result && result.hlsUrl) {
      res.json({
        success: true,
        url: result.hlsUrl,
        subtitles: result.subtitles || [],
        title: result.title || ''
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'No stream found'
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
