async function testWebhook() {
  const url = 'https://ror-lbn3lq3qy-noname-su.vercel.app/api/webhook';
  const payload = {
    "destination": "U12345678901234567890123456789012",
    "events": [
      {
        "type": "message",
        "message": {
          "type": "text",
          "id": "14353798921116",
          "text": "/班表-t"
        },
        "timestamp": 1625665242211,
        "source": {
          "type": "user",
          "userId": "U12345678901234567890123456789012"
        },
        "replyToken": "00000000000000000000000000000000",
        "mode": "active"
      }
    ]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const text = await response.text();
  console.log(`Status: ${response.status}`);
  console.log(`Response: ${text}`);
}

testWebhook().catch(console.error);
