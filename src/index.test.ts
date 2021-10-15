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
    fs.writeFileSync('test_output/test.png', buffer);
    expect(buffer).toBeInstanceOf(Buffer);
    expect(md5(buffer)).toBe('686973d72c9da41a69c22b2a28ecaf68');
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
    fs.writeFileSync('test_output/test2.png', buffer2);
    expect(buffer).toBeInstanceOf(Buffer);
    expect(md5(buffer)).toBe('686973d72c9da41a69c22b2a28ecaf68');
    expect(buffer2).toBeInstanceOf(Buffer);
    expect(md5(buffer2)).toBe('ade35cd9eda48df2f4236bba4e281f97');
});




test('load external image', async () => {

    const svg = `<svg width="500" height="250">    <defs>        <clipPath id="circleView">            <circle cx="250" cy="125" r="125" fill="#FFFFFF"></circle>        </clipPath>    </defs>    <image width="500" height="250" href="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Variegated_golden_frog_%28Mantella_baroni%29_Ranomafana.jpg/1024px-Variegated_golden_frog_%28Mantella_baroni%29_Ranomafana.jpg" clip-path="url(circleView)"></image> </svg>`;

    let puppet = await createPuppet();
    let buffer = await convert(svg, puppet);
    await destroyPuppet(puppet);
    expect(buffer).toBeInstanceOf(Buffer);
    fs.writeFileSync('test_output/test_frog.png', buffer);
    expect(md5(buffer)).toBe('400efae3ff8a5adcf5ff38baad2746c2');
});



test('run in parallel', async () => {

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

    const frog = `<svg width="500" height="250">    <defs>        <clipPath id="circleView">            <circle cx="250" cy="125" r="125" fill="#FFFFFF"></circle>        </clipPath>    </defs>    <image width="500" height="250" href="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Variegated_golden_frog_%28Mantella_baroni%29_Ranomafana.jpg/1024px-Variegated_golden_frog_%28Mantella_baroni%29_Ranomafana.jpg" clip-path="url(circleView)"></image> </svg>`;

    let puppet = await createPuppet();

    let buffers = await Promise.all([convert(svg, puppet), convert(svg2, puppet), convert(frog, puppet)]);

    await destroyPuppet(puppet);
    expect(buffers).toBeInstanceOf(Array);
    expect(buffers.length).toBe(3);
    expect(buffers[0]).toBeInstanceOf(Buffer);
    expect(md5(buffers[0])).toBe('686973d72c9da41a69c22b2a28ecaf68');
    expect(buffers[1]).toBeInstanceOf(Buffer);
    expect(md5(buffers[1])).toBe('ade35cd9eda48df2f4236bba4e281f97');
    expect(buffers[2]).toBeInstanceOf(Buffer);
    expect(md5(buffers[2])).toBe('400efae3ff8a5adcf5ff38baad2746c2');
});
