import axios from 'axios';

export default async function handler(req, res) {
  const { imageUrl } = req.query;

  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const contentType = response.headers['content-type'];
    res.setHeader('Content-Type', contentType);
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch image' });
  }
}