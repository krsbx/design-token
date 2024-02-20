# Design Token Transformer

Convert Figma Design Tokens to useable css.

## Requirements

1. Node >= 16.0.0
2. Figma Design Token generated with [tokensbrucke](https://www.figma.com/community/plugin/1254538877056388290/tokensbrucke)

## Installation

```bash
npm install @krsbx/design-token
```

## Usage

```bash
npx dt-transformer -s JSON_FILE_PATH -w OUTPUT_FILE_PATH
```

## Recommended Usage

1. Install [dt-transformer] for the specific project

2. Add `dt-transformer` script to your package.json

```json
"script": {
  "generate-css": "dt-transformer -s JSON_FILE_PATH -w OUTPUT_FILE_PATH"
}
```

> Change `-s JSON_FILE_PATH` to your JSON file path
> Change `-w OUTPUT_FILE_PATH` to your output file path

3. Add `generate-css` script to your `prepare` scripts.

```json
"script": {
  "generate-css": "dt-transformer -s JSON_FILE_PATH -w OUTPUT_FILE_PATH",
  "prepare": "husky install && npm run generate-css"
}
```
