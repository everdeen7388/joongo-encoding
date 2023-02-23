const { google } = require('googleapis');
const { DateTime } = require('luxon');

export default async function handler(req, res) {
  const { keyword } = req.query;
  const apiKey = 'AIzaSyAvNGZ7ap-evDA7TvNLH76Hg6r9gvB07uY';

  try {
    const videoData = await searchYoutube(keyword, apiKey);
    res.status(200).json(videoData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function searchYoutube(keyword, apiKey) {
  const youtube = google.youtube({
    version: 'v3',
    auth: apiKey
  });

  const response = await youtube.search.list({
    part: 'id,snippet',
    q: keyword,
    type: 'video',
    maxResults: 50,
  });

  const videoData = [];

  for (const item of response.data.items) {
    const videoId = item.id.videoId;
    const videoSnippet = item.snippet;

    const video = await youtube.videos.list({
      part: 'snippet,statistics',
      id: videoId
    });

    const videoInfo = video.data.items[0];
    const videoTitle = videoInfo.snippet.title;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const viewCount = videoInfo.statistics.viewCount;
    const likeCount = videoInfo.statistics.likeCount;
    const channelTitle = videoInfo.snippet.channelTitle;
    const channelSubscribers = videoInfo.statistics.subscriberCount;
    const channelCreationDate = DateTime.fromISO(videoInfo.snippet.publishedAt).toFormat('yyyy-MM-dd');

    videoData.push({
      title: videoTitle,
      url: videoUrl,
      viewCount: viewCount,
      likeCount: likeCount,
      channelTitle: channelTitle,
      channelSubscribers: channelSubscribers,
      channelCreationDate: channelCreationDate,
    });
  }

  return videoData;
}
