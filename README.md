# VIN Parser API 

This project is a Node.js-based application that processes Vehicle Identification Numbers (VINs), fetches vehicle details using an external API, and automates screenshot capture from the RCMP website using Playwright.

---

## 🔧 Technologies Used
- Node.js
- Express.js
- Axios
- Playwright
- JavaScript

---

##  Features
- Process multiple VIN numbers
- Fetch vehicle details from external API
- Automate RCMP website interaction
- Capture screenshots for each VIN
- Optimized performance for faster execution

---

##  Output Includes
- Manufacturer
- Vehicle Type
- Model Year
- Make
- Model
- Fuel Type
- Screenshot of RCMP result page

---

## How It Works
1. User provides VIN numbers
2. API fetches vehicle details using NHTSA service
3. Playwright automates RCMP website
4. Screenshots are captured and saved
5. Results are printed in console and returned via API

---

##  Installation & Setup

```bash
npm install
npx playwright install
