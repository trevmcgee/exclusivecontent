import os
from pathlib import Path

import markdown
from flask import Flask

app = Flask(__name__)

GETTING_STARTED = Path(__file__).parent / "GettingStarted.md"

PAGE_TEMPLATE = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>VibeCloud — Getting Started</title>
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            max-width: 760px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6;
            color: #222; }}
    h1, h2, h3 {{ line-height: 1.25; }}
    code {{ background: #f4f4f4; padding: 0.1em 0.3em; border-radius: 3px; }}
    pre code {{ display: block; padding: 0.75em; overflow-x: auto; }}
    table {{ border-collapse: collapse; }}
    th, td {{ border: 1px solid #ddd; padding: 0.4em 0.7em; }}
    blockquote {{ border-left: 3px solid #ccc; margin: 0; padding: 0.25em 1em; color: #555; }}
  </style>
</head>
<body>
{body}
</body>
</html>
"""


@app.route("/")
def index():
    body = markdown.markdown(
        GETTING_STARTED.read_text(encoding="utf-8"),
        extensions=["tables", "fenced_code"],
    )
    return PAGE_TEMPLATE.format(body=body)


@app.route("/healthz")
def health():
    return "ok", 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
