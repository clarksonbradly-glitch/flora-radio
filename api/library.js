export default async function handler(req, res) {
  const token  = process.env.AIRTABLE_TOKEN;
  const baseId = 'appCKjGopVAl85cVc';
  const table  = 'Mixes';
  const bucket = req.query.bucket || 'Morning';

  const filter = encodeURIComponent(`{Bucket}="${bucket}"`);
  const fields = [
    'Artist','Title','Event','Year','Duration','SoundCloud_URL','Artist_SoundCloud'
  ].map(f => `fields[]=${encodeURIComponent(f)}`).join('&');

  // Fetch all pages from Airtable (handles 100+ records)
  let allRecords = [];
  let offset = '';

  try {
    do {
      const offsetParam = offset ? `&offset=${offset}` : '';
      const url = `https://api.airtable.com/v0/${baseId}/${table}?filterByFormula=${filter}&${fields}&pageSize=100${offsetParam}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.records) {
        allRecords = allRecords.concat(data.records);
      }

      // Airtable returns an offset token if there are more pages
      offset = data.offset || '';

    } while (offset);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store'); // Always fetch fresh
    res.status(200).json({ records: allRecords });

  } catch (err) {
    console.error('Airtable error:', err);
    res.status(500).json({ error: 'Failed to fetch library' });
  }
}
