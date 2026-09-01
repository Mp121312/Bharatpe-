module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { merchantId, token, cookies, from, to, pageSize = 200 } = req.query;

  if (!merchantId || !token || !cookies) {
    return res.status(400).json({ success: false, error: 'Missing parameters' });
  }

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
    const transactions = data?.data?.transactions || [];
    res.status(200).json({ success: true, total: 0, count: transactions.length, transactions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
