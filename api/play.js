// api/play.js
const { scrapeVidsrc } = require('@definisi/vidsrc-scraper');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Get parameters from URL
  const { tmdb_id, type, season, episode } = req.query;

  // Validate parameters
  if (!tmdb_id || !type) {
    return res.status(400).json({ 
      success: false,
      error: 'Missing required parameters: tmdb_id and type are required' 
    });
  }

  try {
    console.log(`📺 Fetching: ${type} ${tmdb_id}${season ? ` S${season}E${episode}` : ''}`);
    
    // Use the scraper to get video links
    const result = await scrapeVidsrc(
      tmdb_id, 
      type, 
      season || null, 
      episode || null
    );
    
    if (result && result.hlsUrl) {
      console.log(`✅ Found video: ${result.hlsUrl}`);
      res.json({
        success: true,
        url: result.hlsUrl,
        subtitles: result.subtitles || [],
        title: result.title || ''
      });
    } else {
      console.log(`❌ No stream found`);
      res.status(404).json({
        success: false,
        error: 'No video stream available for this content'
      });
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching video'
    });
  }
};
