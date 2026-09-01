export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { from, to, pageSize = 5, search = '' } = req.query;
  const merchantId = '2179854';
  const token = 'a7bb042f6a204602abdee270f47e4ada';
  const cookies = 'eyJpdiI6IkMxenVoc2pYMnpqTzFcL0dhT3JWdEVnPT0iLCJ2YWx1ZSI6InpQeGYwYnlPZGJZbTVnUHdrMEhwZEpEQ1dlN2REYUd5blRHc3JDXC9sOFFxczhkMHJqT2grc040TjdGS0NrRU1OUGhFU2Rlc0h3eEhFeTV1UWEzMWFsMGJNMlJOTlE5Z2h4ODJ6aWFMWTkwRWlXTTZPUFwvdHJIVUZ1bFY3TXh3SGYiLCJtYWMiOiI1NTFkY2RhZWQ4NjIzOTM3YTkxMTExNGJkOWIyYjgyMDc3NzY5Zjg4ZGEwNDU2ZjJkMjEyYzExMzM4ZmE4ZTBkIn0=';
  const fromTs = from ? new Date(from).getTime() : Date.now() - 86400000;
  const toTs = to ? new Date(to).getTime() + 86399000 : Date.now();
  const apiUrl = `https://payments-tesseract.bharatpe.in/api/v1/merchant/transactions?module=PAYMENT_QR&merchantId=${merchantId}&sDate=${fromTs}&eDate=${toTs}&pageSize=${pageSize}&pageCount=0`;
  
  try {
    const response = await fetch(apiUrl, {
      headers: {
        token,
        Cookie: cookies,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'application/json',
        Referer: 'https://enterprise.bharatpe.in/'
      }
    });
    const data = await response.json();
    let transactions = data?.data?.transactions || [];
    if (search) {
      const s = search.toLowerCase();
      transactions = transactions.filter(t => 
        (t.payerName || '').toLowerCase().includes(s) ||
        (t.bankReferenceNo || '').toLowerCase().includes(s) ||
        String(t.amount || '').includes(s)
      );
    }
    const total = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    res.status(200).json({ success: true, total, count: transactions.length, transactions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
