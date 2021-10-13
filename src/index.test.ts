import { convert, createPuppet, destroyPuppet } from './index';
import * as fs from 'fs';
import md5 from 'md5';

jest.setTimeout(10000)
test('simple render', async () => {

    const svg = `<svg version="1.1"
    width="300" height="200"
    xmlns="http://www.w3.org/2000/svg">

 <rect width="100%" height="100%" fill="red" />

 <circle cx="150" cy="100" r="80" fill="green" />

 <text x="150" y="125" font-size="60" text-anchor="middle" fill="white">SVG</text>

</svg>`;

    let buffer = await convert(svg);
    expect(buffer).toBeInstanceOf(Buffer);
    expect(md5(buffer)).toBe('686973d72c9da41a69c22b2a28ecaf68');
    // fs.writeFileSync('test.png', buffer);
});

test('reuse same instance', async () => {

    const svg = `<svg version="1.1"
    width="300" height="200"
    xmlns="http://www.w3.org/2000/svg">

 <rect width="100%" height="100%" fill="red" />

 <circle cx="150" cy="100" r="80" fill="green" />

 <text x="150" y="125" font-size="60" text-anchor="middle" fill="white">SVG</text>

</svg>`;
    const svg2 = `<svg version="1.1"
width="500" height="400"
xmlns="http://www.w3.org/2000/svg">

<rect width="100%" height="100%" fill="cyan" />

<circle cx="150" cy="100" r="80" fill="purple" />

<text x="150" y="125" font-size="60" text-anchor="middle" fill="yello">SVG2</text>

</svg>`;

    let puppet = await createPuppet();
    let buffer = await convert(svg, puppet);
    let buffer2 = await convert(svg2, puppet);
    await destroyPuppet(puppet);
    expect(buffer).toBeInstanceOf(Buffer);
    expect(md5(buffer)).toBe('686973d72c9da41a69c22b2a28ecaf68');
    expect(buffer2).toBeInstanceOf(Buffer);
    expect(md5(buffer2)).toBe('ade35cd9eda48df2f4236bba4e281f97');
    fs.writeFileSync('test2.png', buffer2);
});