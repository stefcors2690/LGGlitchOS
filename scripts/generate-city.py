"""Generate original local vector scenery; deterministic, no external input/assets."""
from pathlib import Path
from random import Random

out = Path(__file__).resolve().parents[1] / 'src/assets/city'
out.mkdir(parents=True, exist_ok=True)
rng = Random(1101)
start = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080">'
defs = '''<defs>
<linearGradient id="sky" x2="0" y2="1"><stop stop-color="#060d20"/><stop offset=".6" stop-color="#173853"/><stop offset="1" stop-color="#0c1830"/></linearGradient>
<radialGradient id="aura"><stop stop-color="#38b6d9" stop-opacity=".28"/><stop offset="1" stop-color="#38b6d9" stop-opacity="0"/></radialGradient>
<radialGradient id="moon"><stop stop-color="#a1e5ee"/><stop offset=".8" stop-color="#65b4cf"/><stop offset="1" stop-color="#35738e"/></radialGradient>
<linearGradient id="tower" x2="1" y2=".3"><stop stop-color="#0b1729"/><stop offset=".7" stop-color="#152942"/><stop offset="1" stop-color="#081120"/></linearGradient>
<linearGradient id="haze" x2="0" y2="1"><stop stop-color="#267d99" stop-opacity="0"/><stop offset=".8" stop-color="#267d99" stop-opacity=".22"/><stop offset="1" stop-color="#06101d"/></linearGradient>
<pattern id="windows" width="17" height="22" patternUnits="userSpaceOnUse"><path d="M3 3h3v5H3z M12 13h2v3h-2z" fill="#7cbfc7" opacity=".32"/><path d="M3 15h3v2H3z" fill="#2688ac" opacity=".5"/></pattern>
<pattern id="near-windows" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M4 4h12v3H4z" fill="#3895b6" opacity=".25"/><path d="M4 17h6v3H4z" fill="#bc54a3" opacity=".2"/></pattern>
</defs>'''
far = [start, defs, '<path fill="url(#sky)" d="M0 0h1920v1080H0z"/>', '<ellipse cx="1330" cy="270" rx="480" ry="380" fill="url(#aura)"/>', '<circle cx="1320" cy="235" r="89" fill="url(#moon)" opacity=".7"/>', '<path d="M1260 220q60-40 117-3M1285 255q33-25 67-17" fill="none" stroke="#337a95" stroke-width="6" opacity=".25"/>']
for x in range(-30, 1930, 37):
    width=rng.randint(27,60); top=rng.randint(430,650)
    far.append(f'<path d="M{x} 850V{top}h{width}v{850-top}z" fill="#17344b" opacity=".6"/>')
x=-30
while x<1950:
    width=rng.randint(68,145); top=rng.randint(250,530)
    if 1100<x<1300: top=180
    color=rng.choice(['#168dac','#af387f','#366183'])
    far.append(f'<path d="M{x} 840V{top}l{width//3}-18h{width-width//3}v{858-top}z" fill="url(#tower)" stroke="#244254" stroke-width="1"/>')
    far.append(f'<path d="M{x+8} {top+14}h{width-16}v{815-top}H{x+8}z" fill="url(#windows)"/>')
    far.append(f'<path d="M{x+width-5} {top+2}v{800-top}M{x+4} {top+8}h{width-8}" fill="none" stroke="{color}" stroke-width="2" opacity=".75"/>')
    if width>100:
        far.append(f'<path d="M{x+width//2} {top-17}v-37" stroke="#326179" stroke-width="2"/>')
        far.append(f'<path d="M{x+15} {top+70}h{width-30}v34H{x+15}z" fill="{color}" opacity=".35"/>')
        for i in range(4):
            far.append(f'<path d="M{x+24+i*16} {top+79}v14" stroke="{color}" stroke-width="5"/>')
    x+=width+rng.randint(8,24)
far += ['<path d="M0 460h1920v620H0z" fill="url(#haze)"/>','</svg>']
(out/'city-distant.svg').write_text(''.join(far)+'\n')
near=[start,defs]
for x,width,top in [(-35,220,80),(155,130,305),(1615,130,250),(1755,220,25)]:
    near += [f'<path d="M{x} 1080V{top}l{width}-35v{1115-top}z" fill="#080f1d" stroke="#253549" stroke-width="2"/>',f'<path d="M{x+14} {top+35}h{width-28}v{1000-top}H{x+14}z" fill="url(#near-windows)"/>']
    color='#c642a9' if x<300 else '#269abc'
    near.append(f'<path d="M{x+width-10} {top+5}v{900-top}" stroke="{color}" stroke-width="3" opacity=".5"/>')
    for y in range(top+70,850,120):
        near.append(f'<path d="M{x+15} {y}h{width-30}" stroke="#28354d" stroke-width="6"/>')
near += ['<path d="M0 814Q960 725 1920 814v266H0z" fill="#080f1c"/>','<path d="M0 814Q960 725 1920 814" fill="none" stroke="#38627a" stroke-width="3"/>','<path d="M0 825Q960 736 1920 825" fill="none" stroke="#8e3d7c" stroke-width="2" opacity=".5"/>']
for x in range(40,1920,135):
    color=rng.choice(['#2390ad','#bd3997'])
    near.append(f'<path d="M{x} 855l-35 225h{rng.randint(3,12)}l25-225z" fill="{color}" opacity=".07"/>')
near += ['</svg>']
(out/'city-foreground.svg').write_text(''.join(near)+'\n')
(out/'shuttle.svg').write_text('''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 48"><defs><linearGradient id="hull" x2="0" y2="1"><stop stop-color="#5b7890"/><stop offset=".4" stop-color="#1c354c"/><stop offset="1" stop-color="#080f21"/></linearGradient><linearGradient id="trail"><stop stop-color="#00ddf5" stop-opacity="0"/><stop offset="1" stop-color="#00ddf5" stop-opacity=".55"/></linearGradient></defs><path d="M0 30h51v4H0z" fill="url(#trail)"/><path d="M43 30l20-8 21-15h32l13 15 23 6 7 7-26 5H64l-21-5z" fill="url(#hull)" stroke="#55768c"/><path d="M87 10h26l9 12H73z" fill="#164454"/><path d="M78 22h43" stroke="#46c2d4" stroke-width="2" opacity=".7"/><path d="M51 31h13" stroke="#36d8ed" stroke-width="3"/><path d="M124 36h21" stroke="#c653ac" stroke-width="2"/><path d="M72 40h47" stroke="#00ddf5" opacity=".3"/></svg>\n''')
print('Generated three original city SVG assets.')
