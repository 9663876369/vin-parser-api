const express = require("express");
const axios = require("axios");
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const screenshotDir = path.join(process.cwd(), "screenshots");

if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir);
}


async function captureRCMP(page, vin) {
  try {
    await page.goto("https://cpic-cipc.ca/sve-rve-eng.htm", {
      waitUntil: "domcontentloaded"
    });

    await page.waitForTimeout(3000);

    await page.fill('input[type="text"]', vin);

    await page.check('input[type="checkbox"]');

    await page.click("text=Submit");

    await page.waitForTimeout(5000);

    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(1000);

    const filePath = path.join(screenshotDir, `${vin}.png`);

    await page.screenshot({
      path: filePath,
      fullPage: true
    });

    console.log("Screenshot saved:", filePath);

  } catch (error) {
    console.log("RCMP Error:", vin, error.message);
  }
}

app.get("/", (req, res) => {
  res.send("VIN Parser API Running");
});

app.get("/parse-vins", async (req, res) => {
  const defaultVins = [
    "WDCGG8JB0FG411675",
    "JM3TCBDY7H0131929",
    "5XYZU3LB6DG026838",
    "4T1BE32K04U892643",
    "2T1BU4EE0DC005266",
    "KMHD84LF5LU003437",
    "2T3B1RFV1SC559991",
    "2T3R1RFV4NC274026",
    "5NPE34AF3KH762218"
  ];

  const vins = req.query.vins
    ? req.query.vins.split(",")
    : defaultVins;

  const results = [];

  const browser = await chromium.launch({ headless: false });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
  });

  const page = await context.newPage();

  for (const vin of vins) {
    try {
      await captureRCMP(page, vin);

      const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`;

      const response = await axios.get(url);
      const data = response.data.Results[0];

      const result = {
        VIN: vin,
        Manufacturer: data.Manufacturer || "Not Found",
        VehicleType: data.VehicleType || "Not Found",
        ModelYear: data.ModelYear || "Not Found",
        Make: data.Make || "Not Found",
        Model: data.Model || "Not Found",
        FuelType: data.FuelTypePrimary || "Not Found"
      };

      console.log("================================");
      console.log("VIN:", result.VIN);
      console.log("Manufacturer:", result.Manufacturer);
      console.log("Vehicle Type:", result.VehicleType);
      console.log("Model Year:", result.ModelYear);
      console.log("Make:", result.Make);
      console.log("Model:", result.Model);
      console.log("Primary Fuel Type:", result.FuelType);

      results.push(result);

    } catch (error) {
      results.push({
        VIN: vin,
        error: "Failed to process"
      });
    }
  }

  await browser.close();

  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});