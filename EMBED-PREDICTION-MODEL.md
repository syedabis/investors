# Embedding the Profit Predictor on a Client Website

The prediction "model" is just a linear regression formula — five numbers multiplied
and added together. You don't need the Next.js app, a database, or a backend to use
it on another site. You have two options:

- **Option A (easiest):** paste a self-contained HTML widget into the client's site.
  All math runs in the visitor's browser.
- **Option B:** call a tiny API endpoint if you'd rather hide the formula/coefficients
  from the page source.

Pick A unless the client specifically asks for the coefficients to stay private.

---

## Option A: Drop-in HTML widget (no backend needed)

Copy this whole block into any HTML page (or a `<div>` on the client's site, e.g. via
a "custom HTML" block in Squarespace/Wix/WordPress).

```html
<div id="profit-predictor" style="max-width:400px;font-family:sans-serif;">
  <h3>Startup Profit Predictor</h3>

  <label>R&D Spend ($)</label>
  <input id="pp-rd" type="number" value="100000" style="width:100%;margin-bottom:8px;">

  <label>Administration Spend ($)</label>
  <input id="pp-admin" type="number" value="120000" style="width:100%;margin-bottom:8px;">

  <label>Marketing Spend ($)</label>
  <input id="pp-marketing" type="number" value="300000" style="width:100%;margin-bottom:8px;">

  <label>State</label>
  <select id="pp-state" style="width:100%;margin-bottom:12px;">
    <option>California</option>
    <option>Florida</option>
    <option>New York</option>
  </select>

  <button id="pp-btn" style="padding:8px 16px;">Predict Profit</button>

  <p id="pp-result" style="font-size:1.2em;font-weight:bold;margin-top:12px;"></p>
</div>

<script>
  // Coefficients from sklearn LinearRegression trained on 50_Startups.csv (R² = 0.90)
  const COEF = {
    intercept: 54028.03959405866,
    florida: 938.7930059,
    newYork: 6.98775997,
    rd: 0.80563006,
    admin: -0.06878788,
    marketing: 0.02985544,
  };

  function predict(rd, admin, marketing, state) {
    const isFL = state === "Florida" ? 1 : 0;
    const isNY = state === "New York" ? 1 : 0;
    return (
      COEF.intercept +
      COEF.florida * isFL +
      COEF.newYork * isNY +
      COEF.rd * rd +
      COEF.admin * admin +
      COEF.marketing * marketing
    );
  }

  document.getElementById("pp-btn").addEventListener("click", () => {
    const rd = parseFloat(document.getElementById("pp-rd").value) || 0;
    const admin = parseFloat(document.getElementById("pp-admin").value) || 0;
    const marketing = parseFloat(document.getElementById("pp-marketing").value) || 0;
    const state = document.getElementById("pp-state").value;

    const result = predict(rd, admin, marketing, state);

    document.getElementById("pp-result").textContent =
      "Predicted Profit: $" + result.toLocaleString(undefined, { maximumFractionDigits: 2 });
  });
</script>
```

That's it. No npm install, no build step, no server. Style it with your own CSS/branding as needed.

---

## Option B: Public API endpoint (already built in this repo)

If the client doesn't want the coefficients visible in their page source, call the
live API instead. This repo now has a **public, unauthenticated** endpoint at:

```
POST /api/public-predict
```

This is separate from `/api/predict` (used by the logged-in app), which requires a
session cookie and won't work from another site. `public-predict` has no auth check
and sends CORS headers so any external domain can call it.

**Request body:**

```json
{ "rd": 100000, "admin": 120000, "marketing": 300000, "state": "Florida" }
```

`state` must be `"California"`, `"Florida"`, or `"New York"`.

**Response:**

```json
{ "prediction": 178432.91, "percentile": 63 }
```

**From the client's site**, once this app is deployed (e.g. on Vercel):

```js
const res = await fetch("https://your-deployed-app.vercel.app/api/public-predict", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ rd: 100000, admin: 120000, marketing: 300000, state: "Florida" }),
});
const { prediction, percentile } = await res.json();
```

Use the same HTML form from Option A, just swap the `predict()` call for this `fetch`
(and replace `your-deployed-app.vercel.app` with wherever this Next.js app is actually hosted).

**Security note:** this endpoint is intentionally public (no login required) so an
external website can call it. It doesn't touch the database or expose user data —
only the profit formula — so this is a reasonable tradeoff. If you ever want to
restrict who can call it, add an API-key check or rate limiting in
`src/app/api/public-predict/route.ts`.

---

## Notes

- The model predicts **profit** from R&D/Admin/Marketing spend + state, trained on
  `50_Startups.csv` (R² = 0.8987, RMSE ≈ $9,056 — see `streamlit-app/` for the source data).
- This is the same formula used in `src/lib/model.ts` in the main Next.js app — if those
  coefficients ever get retrained, update both places.
- No login, history, or database logic is needed for this — it's purely the prediction piece.
