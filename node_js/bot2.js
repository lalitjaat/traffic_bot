const puppeteer = require('puppeteer');

(async () => {
    // Function to perform the search and click the desired link
    async function searchAndClick(page, query, desiredDomain) {
        // Type the search query
await page.type('textarea[title="Search"]', query);
        // Submit the search form
        await Promise.all([
            page.keyboard.press('Enter'),
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ]);

        let desiredLinkFound = false;
        let currentPage = 1;

        while (!desiredLinkFound) {
            console.log(`Checking page ${currentPage}...`);

            // Wait for the search results to load and display the results
            await page.waitForSelector('h3');

            // Get all the search result links
            const links = await page.$$eval('a', as => as.map(a => ({ href: a.href, text: a.innerText })));

            // Find the link that matches the desired website
            const desiredLink = links.find(link => link.href.includes(desiredDomain));

            if (desiredLink) {
                // Scroll to the desired link and click it
                await page.evaluate((link) => {
                    const anchor = Array.from(document.querySelectorAll('a')).find(a => a.href === link);
                    if (anchor) {
                        anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        anchor.click();
                    }
                }, desiredLink.href);

                // Wait for the page to load
                await page.waitForNavigation({ waitUntil: 'networkidle2' });

                // Optionally take a screenshot of the desired page
                await page.screenshot({ path: 'desired-page.png' });

                console.log(`Navigated to ${desiredLink.href}`);
                desiredLinkFound = true;
            } else {
                // Check if there is a next page button
                const nextPageButton = await page.$('a#pnnext');

                if (nextPageButton) {
                    // Click the next page button and wait for navigation
                    await Promise.all([
                        nextPageButton.click(),
                        page.waitForNavigation({ waitUntil: 'networkidle2' }),
                    ]);
                    currentPage++;
                } else {
                    console.log('Desired link not found and no more pages left.');
                    break;
                }
            }
        }
    }

    // Launch the browser
    const browser = await puppeteer.launch({ headless: false }); // Set to false to see the browser action
    const page = await browser.newPage();

    // Navigate to Google
    await page.goto('https://www.google.com', { waitUntil: 'networkidle2' });

    // Wait for the search input element to appear
    await page.waitForSelector('textarea[title="Search"]');

    // Perform the search and click the desired link
    await searchAndClick(page, 'exam', 'examenglish.com'); // Replace 'example.com' with the actual domain

    // Close the browser
    await browser.close();
})();








// await page.waitForSelector('textarea[title="Search"]');
//    await page.type('textarea[title="Search"]', 'exam');