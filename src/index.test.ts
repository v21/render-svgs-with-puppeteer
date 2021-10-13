import { convert } from './index';
import * as fs from 'fs';

jest.setTimeout(10000)
test('returns buffer', async () => {

    const svg = `<svg version="1.1"
    width="300" height="200"
    xmlns="http://www.w3.org/2000/svg">

 <rect width="100%" height="100%" fill="red" />

 <circle cx="150" cy="100" r="80" fill="green" />

 <text x="150" y="125" font-size="60" text-anchor="middle" fill="white">SVG</text>

</svg>`;

    let buffer = await convert(svg);
    expect(buffer).toBeInstanceOf(Buffer);
    fs.writeFileSync('test.png', buffer);
});