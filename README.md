# NodeJS with Chart.js in NodeJS Example

## Why this?

I'm trying to reproduce [Issue 11798](https://github.com/chartjs/Chart.js/issues/11798).

## How to run

```bash
npm install
npm start
```

## How to reproduce

1. Open `http://localhost:3000/generate` in your browser, and validate that you get a answer.
2. Open `http://localhost:3000/generate?case=invalid` in your browser, and you'll get a chart with overflow ([Issue 11798](https://github.com/chartjs/Chart.js/issues/11798)).
3. Open `http://localhost:3000/generate?case=valid` in your browser, and you'll get a chart without overflow.
