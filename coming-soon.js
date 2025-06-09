
const http = require("http");

const PORT = 4000;

const html = `
  <!DOCTYPE html>
  <html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>قريبًا - الموقع تحت الصيانة</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(to bottom right, #f8f9fa, #e0e0e0);
        color: #333;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        text-align: center;
      }

      .container {
        padding: 2rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        max-width: 500px;
        width: 90%;
      }

      h1 {
        font-size: 2.2rem;
        color: #dc3545;
        margin-bottom: 1rem;
      }

      p {
        font-size: 1.1rem;
        margin-bottom: 0;
      }

      @media (max-width: 600px) {
        h1 {
          font-size: 1.6rem;
        }

        p {
          font-size: 1rem;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>🚧 الموقع تحت الصيانة</h1>
      <p>نعمل على تطوير الموقع، ونعود قريبًا إن شاء الله.</p>
    </div>
  </body>
  </html>
`;

http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
}).listen(PORT, () => {
  console.log(`✅ صفحة "قريبًا" تعمل على http://localhost:${PORT}`);
});
