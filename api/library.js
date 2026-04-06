export default async function handler(req, res) {
  const token  = process.env.AIRTABLE_TOKEN;
  const baseId = 'appCKjGopVAl85cVc';
  const table  = 'Mixes';
  const bucket = req.query.bucket || 'Morning';

  const filter = encodeURIComponent(`{Bucket}="${bucket}"`);
  const url = `https://api.airtable.com/v0/${baseId}/${table}?filterByFormula=${filter}&fields[]=Artist&fields[]=Title&fields[]=Event&fields[]=Year&fields[]=SoundCloud_URL&fields[]=Artist_SoundCloud`;

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch library' });
  }
}
