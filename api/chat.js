import http from "http";

const PORT = 3000;

async function askAI(prompt) {

  try {

    const response = await fetch(
      `https://text.pollinations.ai/${encodeURIComponent(prompt)}`
    );

    const text = await response.text();

    return text || "Tidak ada respon";

  } catch (err) {

    return "Error: " + err.message;
  }
}

const server = http.createServer(
  (req, res) => {

    res.setHeader(
      "Access-Control-Allow-Origin",
      "*"
    );

    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS"
    );

    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type"
    );

    if (
      req.method ===
      "OPTIONS"
    ) {

      res.writeHead(200);

      return res.end();
    }

    if (
      req.url === "/" &&
      req.method === "GET"
    ) {

      res.writeHead(200, {
        "Content-Type":
          "application/json"
      });

      return res.end(
        JSON.stringify({
          status: true,
          message:
            "AI Backend Running"
        })
      );
    }

    if (
      req.url ===
        "/api/chat" &&
      req.method === "POST"
    ) {

      let body = "";

      req.on(
        "data",
        chunk => {
          body += chunk;
        }
      );

      req.on(
        "end",
        async () => {

          try {

            const parsed =
              JSON.parse(
                body
              );

            const prompt =
              parsed.prompt;

            if (!prompt) {

              res.writeHead(
                400,
                {
                  "Content-Type":
                    "application/json"
                }
              );

              return res.end(
                JSON.stringify(
                  {
                    status: false,
                    error:
                      "Prompt kosong"
                  }
                )
              );
            }

            const result =
              await askAI(
                prompt
              );

            res.writeHead(200, {
              "Content-Type":
                "application/json"
            });

            return res.end(
              JSON.stringify({
                status: true,
                result
              })
            );

          } catch (err) {

            res.writeHead(500, {
              "Content-Type":
                "application/json"
            });

            return res.end(
              JSON.stringify({
                status: false,
                error:
                  err.message
              })
            );
          }
        }
      );

      return;
    }

    res.writeHead(404, {
      "Content-Type":
        "application/json"
    });

    res.end(
      JSON.stringify({
        status: false,
        error:
          "Endpoint not found"
      })
    );
  }
);

server.listen(PORT, () => {

  console.log(
    `Running on http://localhost:${PORT}`
  );
});