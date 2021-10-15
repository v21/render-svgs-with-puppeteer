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
    fs.writeFileSync('test_output/test.png', buffer);
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
    fs.writeFileSync('test_output/test2.png', buffer2);
});




test('load external image', async () => {

    const svg = `<svg width="500" height="250">    <defs>        <clipPath id="circleView">            <circle cx="250" cy="125" r="125" fill="#FFFFFF"></circle>        </clipPath>    </defs>    <image width="500" height="250" href="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Variegated_golden_frog_%28Mantella_baroni%29_Ranomafana.jpg/1024px-Variegated_golden_frog_%28Mantella_baroni%29_Ranomafana.jpg" clip-path="url(circleView)"></image> </svg>`;

    let puppet = await createPuppet();
    let buffer = await convert(svg, puppet);
    await destroyPuppet(puppet);
    expect(buffer).toBeInstanceOf(Buffer);
    fs.writeFileSync('test_output/test_frog.png', buffer);
    expect(md5(buffer)).toBe('9181038c72dc265fbbaca59558ca217e');
});



    fs.writeFileSync('test2.png', buffer2);
});