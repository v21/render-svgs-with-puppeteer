import puppeteer, { Browser } from 'puppeteer';

export type { Browser };

export async function createPuppet() {
    return await puppeteer.launch();
}


export async function destroyPuppet(puppet: puppeteer.Browser) {
    await puppet.close();
}
const pause = (timeoutMsec: number) => new Promise(resolve => setTimeout(resolve, timeoutMsec))

export async function convert(input: string, puppet?: puppeteer.Browser): Promise<Buffer> {
    let browser = null;
    try {
        browser = puppet || await puppeteer.launch();
        const page = await browser.newPage();

        const start = input.indexOf('<svg');

        let html = `<!DOCTYPE html>
<style>
* { margin: 0; padding: 0; }
</style>`;
        if (start >= 0) {
            html += input.substring(start);
        } else {
            throw new Error('SVG element open tag not found in input. Check the SVG input');
        }

        page.setContent(html, { waitUntil: ['networkidle0', 'load'], timeout: 5000 });
        await pause(3000); //wish this wasn't here, but it seems necessary in order to wait for the paint to complete when loading images into SVGs

        const dimensions = await getDimensions(page);
        if (!dimensions) {
            throw new Error('Unable to derive width and height from SVG.');
        }

        await page.setViewport({
            height: Math.round(dimensions.height),
            width: Math.round(dimensions.width)
        });


        const output = await page.screenshot({
            type: 'png',
            clip: Object.assign({ x: 0, y: 0 }, dimensions),
            omitBackground: true
        }) as Buffer;

        if (!puppet) {
            await browser.close();
            browser = null;
        }

        return output;
    }
    catch (e) {
        throw (e);
    }
    finally {
        if (!puppet && browser) {
            await browser.close();
        }
    }
}



function getDimensions(page: puppeteer.Page) {
    return page.evaluate(() => {
        const el = document.querySelector('svg');
        if (!el) {
            return null;
        }

        const widthIsPercent = (el.getAttribute('width') || '').endsWith('%');
        const heightIsPercent = (el.getAttribute('height') || '').endsWith('%');
        const width = !widthIsPercent && parseFloat(el.getAttribute('width')!);
        const height = !heightIsPercent && parseFloat(el.getAttribute('height')!);

        if (width && height) {
            return { width, height };
        }

        const viewBoxWidth = el.viewBox.animVal.width;
        const viewBoxHeight = el.viewBox.animVal.height;

        if (width && viewBoxHeight) {
            return {
                width,
                height: width * viewBoxHeight / viewBoxWidth
            };
        }

        if (height && viewBoxWidth) {
            return {
                width: height * viewBoxWidth / viewBoxHeight,
                height
            };
        }

        return null;
    });
}
