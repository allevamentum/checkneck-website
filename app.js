// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CheckNeck — Complete SVG + Posture Monitor Engine
// Golden Ratio design · Animated SVGs · Live monitoring
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

(function () {
    'use strict';

    const PHI = 1.618033988749895;
    const NS = 'http://www.w3.org/2000/svg';

    // ── Color Tokens ──
    const C = {
        gold: 'rgb(213,175,97)',
        goldHi: 'rgb(236,204,139)',
        goldLo: 'rgb(153,122,60)',
        goldDim: 'rgb(112,93,56)',
        champagne: 'rgb(196,164,106)',
        champagneHi: 'rgb(223,192,144)',
        steel: 'rgb(144,144,174)',
        sage: 'rgb(77,209,122)',
        amber: 'rgb(219,148,71)',
        coral: 'rgb(235,64,77)',
        cyan: 'rgb(0,230,255)',
        royal: 'rgb(171,0,255)',
        white: 'rgba(255,255,255,',
        bg: '#05050E',
    };

    // ── SVG Helper ──
    function el(tag, attrs, parent) {
        const e = document.createElementNS(NS, tag);
        if (attrs) Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
        if (parent) parent.appendChild(e);
        return e;
    }

    function defs(svg) {
        let d = svg.querySelector('defs');
        if (!d) { d = el('defs', null, svg); }
        return d;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 1. VITRUVIAN SPINE MARK — Full SVG reproduction
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    function drawVitruvianSpineMark(svg, size, opts = {}) {
        svg.innerHTML = '';
        const s = size;
        const cx = s / 2, cy = s / 2;
        const outerR = s * 0.455;
        const innerR = s * 0.378;
        const sqHalf = innerR / Math.SQRT2;
        const spineH = (sqHalf * 2) / PHI;

        const df = defs(svg);

        // Gradient for gold elements
        const gId = 'goldGrad' + Math.random().toString(36).slice(2, 6);
        const grad = el('linearGradient', { id: gId, x1: '0', y1: '0', x2: '0', y2: '1' }, df);
        el('stop', { offset: '0%', 'stop-color': C.champagneHi, 'stop-opacity': '0.6' }, grad);
        el('stop', { offset: '100%', 'stop-color': C.champagne, 'stop-opacity': '0.4' }, grad);

        // ── Outer Bezel (72 ticks) ──
        const bezelGroup = el('g', { class: opts.rotate ? 'bezel-rotate' : '' }, svg);

        // Outer circle
        el('circle', {
            cx, cy, r: outerR,
            fill: 'none', stroke: C.white + '0.12)',
            'stroke-width': s * 0.004
        }, bezelGroup);

        // 72 ticks at 5-degree intervals
        for (let i = 0; i < 72; i++) {
            const angle = (i * 5) * Math.PI / 180;
            const isCardinal = i % 18 === 0;
            const isMinor45 = i % 9 === 0 && !isCardinal;

            let len, width, opacity;
            if (isCardinal) {
                len = s * 0.035; width = s * 0.018; opacity = 0.50;
            } else if (isMinor45) {
                len = s * 0.025; width = s * 0.013; opacity = 0.22;
            } else {
                len = s * 0.015; width = s * 0.009; opacity = 0.09;
            }

            const x1 = cx + (outerR - len) * Math.cos(angle - Math.PI / 2);
            const y1 = cy + (outerR - len) * Math.sin(angle - Math.PI / 2);
            const x2 = cx + outerR * Math.cos(angle - Math.PI / 2);
            const y2 = cy + outerR * Math.sin(angle - Math.PI / 2);

            el('line', {
                x1, y1, x2, y2,
                stroke: C.white + opacity + ')',
                'stroke-width': width,
                'stroke-linecap': 'round'
            }, bezelGroup);
        }

        // Cardinal dots
        for (let i = 0; i < 4; i++) {
            const angle = (i * 90) * Math.PI / 180 - Math.PI / 2;
            const dotR = s * 0.016;
            el('circle', {
                cx: cx + (outerR + dotR * 1.5) * Math.cos(angle),
                cy: cy + (outerR + dotR * 1.5) * Math.sin(angle),
                r: dotR, fill: C.white + '0.18)'
            }, bezelGroup);
        }

        // ── Inner Circle ──
        el('circle', {
            cx, cy, r: innerR,
            fill: 'none', stroke: C.white + '0.16)',
            'stroke-width': s * 0.013
        }, svg);

        // ── Vitruvian Square ──
        el('rect', {
            x: cx - sqHalf, y: cy - sqHalf,
            width: sqHalf * 2, height: sqHalf * 2,
            fill: 'none', stroke: C.white + '0.12)',
            'stroke-width': s * 0.006
        }, svg);

        // ── Golden Section Line ──
        const goldenY = (cy - sqHalf) + (sqHalf * 2) / PHI;
        el('line', {
            x1: cx - sqHalf - s * 0.03, y1: goldenY,
            x2: cx + sqHalf + s * 0.03, y2: goldenY,
            stroke: C.champagne,
            'stroke-opacity': '0.45',
            'stroke-width': s * 0.005,
            'stroke-dasharray': `${s * 0.02} ${s * 0.015}`
        }, svg);

        // ── Golden Spiral ──
        const spiralGroup = el('g', { style: 'animation: spiral-pulse 4s ease-in-out infinite;' }, svg);
        const b = Math.log(PHI) / (Math.PI / 2);
        const startR = s * 0.014;
        let spiralPath = '';
        for (let i = 0; i <= 300; i++) {
            const t = (i / 300) * 2.2 * 2 * Math.PI;
            const r = startR * Math.exp(b * t);
            if (r > outerR * 0.9) break;
            const px = cx + r * Math.cos(t);
            const py = goldenY - r * Math.sin(t);
            spiralPath += (i === 0 ? 'M' : 'L') + `${px.toFixed(2)},${py.toFixed(2)} `;
        }
        const spiralEl = el('path', {
            d: spiralPath,
            fill: 'none', stroke: C.champagne,
            'stroke-opacity': '0.45',
            'stroke-width': s * 0.008,
            'stroke-linecap': 'round',
            class: opts.inkDraw ? 'ink-draw' : ''
        }, spiralGroup);

        if (opts.inkDraw) {
            const len = spiralEl.getTotalLength ? spiralEl.getTotalLength() : 800;
            spiralEl.style.setProperty('--path-len', len);
        }

        // ── Vertebrae C1-C7 ──
        const vertebrae = [
            { wF: 0.310, hF: 0.112, isAtlas: true },
            { wF: 0.265, hF: 0.096 },
            { wF: 0.278, hF: 0.100 },
            { wF: 0.285, hF: 0.102 },
            { wF: 0.278, hF: 0.100 },
            { wF: 0.262, hF: 0.094 },
            { wF: 0.244, hF: 0.088 },
        ];

        const vScale = s / 200;
        const gap = s * 0.028 * vScale;
        const totalH = vertebrae.reduce((sum, v) => sum + v.hF * spineH, 0) + gap * 6;
        let vy = cy - totalH / 2 + spineH * 0.15;

        const spineGroup = el('g', { style: 'animation: spine-breathe 3s ease-in-out infinite; transform-origin: center;' }, svg);

        vertebrae.forEach((v, i) => {
            const vw = v.wF * spineH;
            const vh = v.hF * spineH;
            const cr = vh * 0.22;

            if (v.isAtlas) {
                // Atlas C1 — special
                el('rect', {
                    x: cx - vw / 2, y: vy,
                    width: vw, height: vh,
                    rx: cr, ry: cr,
                    fill: C.champagne.replace(')', ',0.10)').replace('rgb', 'rgba'),
                    stroke: C.champagne,
                    'stroke-opacity': '0.6',
                    'stroke-width': s * 0.008
                }, spineGroup);
                // Atlas foramen
                el('ellipse', {
                    cx, cy: vy + vh / 2,
                    rx: vw * 0.18, ry: vh * 0.28,
                    fill: 'none', stroke: C.champagne,
                    'stroke-opacity': '0.5',
                    'stroke-width': s * 0.004
                }, spineGroup);
            } else {
                el('rect', {
                    x: cx - vw / 2, y: vy,
                    width: vw, height: vh,
                    rx: cr, ry: cr,
                    fill: C.white + '0.055)',
                    stroke: C.white + '0.22)',
                    'stroke-width': s * 0.004
                }, spineGroup);
                // Center line (spinous process)
                el('line', {
                    x1: cx, y1: vy + vh * 0.15,
                    x2: cx, y2: vy + vh * 0.85,
                    stroke: C.white + '0.12)',
                    'stroke-width': s * 0.003
                }, spineGroup);
                // Transverse processes
                el('line', {
                    x1: cx - vw * 0.55, y1: vy + vh / 2,
                    x2: cx - vw / 2, y2: vy + vh / 2,
                    stroke: C.white + '0.15)',
                    'stroke-width': s * 0.003,
                    'stroke-linecap': 'round'
                }, spineGroup);
                el('line', {
                    x1: cx + vw / 2, y1: vy + vh / 2,
                    x2: cx + vw * 0.55, y2: vy + vh / 2,
                    stroke: C.white + '0.15)',
                    'stroke-width': s * 0.003,
                    'stroke-linecap': 'round'
                }, spineGroup);
            }
            vy += vh + gap;
        });

        // ── Head ──
        const c1w = vertebrae[0].wF * spineH;
        const headR = (c1w * PHI) / 2;
        const headCy = cy - totalH / 2 + spineH * 0.15 - s * 0.016 - headR;

        el('circle', {
            cx, cy: headCy, r: headR,
            fill: 'none', stroke: C.white + '0.55)',
            'stroke-width': s * 0.008
        }, spineGroup);
        // Highlight arc
        el('path', {
            d: describeArc(cx, headCy, headR * 0.85, -45, 45),
            fill: 'none', stroke: C.white + '0.12)',
            'stroke-width': s * 0.005,
            'stroke-linecap': 'round'
        }, spineGroup);

        // ── Phi Ticks ──
        const tickLen = s * 0.028;
        [-1, 1].forEach(side => {
            const tx = cx + side * (sqHalf + s * 0.01);
            el('line', {
                x1: tx, y1: goldenY - tickLen / 2,
                x2: tx, y2: goldenY + tickLen / 2,
                stroke: C.champagne,
                'stroke-opacity': '0.5',
                'stroke-width': s * 0.004
            }, svg);
        });
    }

    function describeArc(cx, cy, r, startAngle, endAngle) {
        const start = polarToCartesian(cx, cy, r, endAngle);
        const end = polarToCartesian(cx, cy, r, startAngle);
        const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
        return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
    }

    function polarToCartesian(cx, cy, r, angleDeg) {
        const rad = (angleDeg - 90) * Math.PI / 180;
        return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 2. HEXAGONAL RINGS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    function hexPoint(cx, cy, r, index) {
        const angle = (index * 60 - 90) * Math.PI / 180;
        return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    }

    function hexPath(cx, cy, r) {
        let d = '';
        for (let i = 0; i < 6; i++) {
            const p = hexPoint(cx, cy, r, i);
            d += (i === 0 ? 'M' : 'L') + `${p.x.toFixed(2)},${p.y.toFixed(2)} `;
        }
        return d + 'Z';
    }

    function drawHexRings(svg, size, progress = {}) {
        svg.innerHTML = '';
        const cx = size / 2, cy = size / 2;
        const rings = [
            { r: size * 0.42, color: C.gold, glow: C.gold, prog: progress.posture || 0.78, label: 'P' },
            { r: size * 0.32, color: C.sage, glow: C.sage, prog: progress.stability || 0.62, label: 'S' },
            { r: size * 0.22, color: C.amber, glow: C.amber, prog: progress.alignment || 0.45, label: 'A' },
        ];

        const df = defs(svg);

        rings.forEach((ring, idx) => {
            // Track (background)
            el('path', {
                d: hexPath(cx, cy, ring.r),
                fill: 'none',
                stroke: C.white + '0.06)',
                'stroke-width': size * 0.04,
                'stroke-linejoin': 'round'
            }, svg);

            // Filter for glow
            const filtId = 'glow' + idx;
            const filt = el('filter', { id: filtId, x: '-50%', y: '-50%', width: '200%', height: '200%' }, df);
            const feG = el('feGaussianBlur', { stdDeviation: '3', result: 'blur' }, filt);
            const feM = el('feMerge', null, filt);
            el('feMergeNode', { in: 'blur' }, feM);
            el('feMergeNode', { in: 'SourceGraphic' }, feM);

            // Progress fill
            const fullPath = hexPath(cx, cy, ring.r);
            const pathEl = el('path', {
                d: fullPath,
                fill: 'none',
                stroke: ring.color,
                'stroke-width': size * 0.04,
                'stroke-linejoin': 'round',
                'stroke-linecap': 'round',
                filter: `url(#${filtId})`,
                style: `animation: ring-glow 3s ease-in-out infinite; animation-delay: ${idx * 0.5}s; color: ${ring.glow};`
            }, svg);

            // Use stroke-dasharray for progress
            const totalLen = ring.r * 6; // approximate perimeter
            pathEl.setAttribute('stroke-dasharray', `${totalLen * ring.prog} ${totalLen}`);

            // Vertex dots
            for (let i = 0; i < 6; i++) {
                const p = hexPoint(cx, cy, ring.r, i);
                el('circle', {
                    cx: p.x, cy: p.y, r: size * 0.008,
                    fill: ring.color, opacity: '0.6'
                }, svg);
            }
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 3. POSTURE GAUGE (Arc display)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    function drawPostureGauge(svg, size, score) {
        svg.innerHTML = '';
        const cx = size / 2, cy = size / 2;
        const r = size * 0.40;
        const startAngle = 135;
        const endAngle = 405;
        const range = endAngle - startAngle;

        const df = defs(svg);

        // Track
        el('path', {
            d: describeArc(cx, cy, r, startAngle, endAngle),
            fill: 'none',
            stroke: C.white + '0.06)',
            'stroke-width': size * 0.035,
            'stroke-linecap': 'round'
        }, svg);

        // Determine color based on score
        let color = C.gold;
        if (score >= 90) color = C.sage;
        else if (score >= 75) color = C.gold;
        else if (score >= 50) color = C.amber;
        else if (score > 0) color = C.coral;

        // Progress arc
        if (score > 0) {
            const progAngle = startAngle + (score / 100) * range;

            // Glow filter
            const filtId = 'gaugeGlow';
            const filt = el('filter', { id: filtId, x: '-50%', y: '-50%', width: '200%', height: '200%' }, df);
            el('feGaussianBlur', { stdDeviation: '4', result: 'blur' }, filt);
            const feM = el('feMerge', null, filt);
            el('feMergeNode', { in: 'blur' }, feM);
            el('feMergeNode', { in: 'SourceGraphic' }, feM);

            el('path', {
                d: describeArc(cx, cy, r, startAngle, progAngle),
                fill: 'none',
                stroke: color,
                'stroke-width': size * 0.035,
                'stroke-linecap': 'round',
                filter: `url(#${filtId})`
            }, svg);

            // Endpoint dot
            const endPt = polarToCartesian(cx, cy, r, progAngle);
            el('circle', {
                cx: endPt.x, cy: endPt.y, r: size * 0.02,
                fill: color
            }, svg);
        }

        // Tick marks around the arc
        for (let i = 0; i <= 20; i++) {
            const angle = startAngle + (i / 20) * range;
            const isMajor = i % 5 === 0;
            const inner = r - (isMajor ? size * 0.035 : size * 0.02);
            const outer = r + (isMajor ? size * 0.035 : size * 0.02);
            const p1 = polarToCartesian(cx, cy, inner, angle);
            const p2 = polarToCartesian(cx, cy, outer, angle);
            el('line', {
                x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
                stroke: C.white + (isMajor ? '0.25)' : '0.10)'),
                'stroke-width': isMajor ? 1.5 : 0.8,
                'stroke-linecap': 'round'
            }, svg);
        }

        // Labels
        const labelPairs = [
            { angle: startAngle + 15, text: '0' },
            { angle: startAngle + range / 2, text: '50' },
            { angle: endAngle - 15, text: '100' },
        ];
        labelPairs.forEach(lp => {
            const p = polarToCartesian(cx, cy, r + size * 0.07, lp.angle);
            el('text', {
                x: p.x, y: p.y,
                'text-anchor': 'middle',
                'dominant-baseline': 'central',
                fill: C.white + '0.3)',
                'font-family': "'JetBrains Mono', monospace",
                'font-size': size * 0.04
            }, svg).textContent = lp.text;
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 4. AXIS VISUALIZATIONS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    function drawAxisIcon(svg, size, type, value) {
        svg.innerHTML = '';
        const cx = size / 2, cy = size / 2;
        const r = size * 0.35;

        // Circle
        el('circle', {
            cx, cy, r,
            fill: 'none', stroke: C.white + '0.12)',
            'stroke-width': 1.5
        }, svg);

        const colors = { pitch: C.gold, roll: C.cyan, yaw: C.royal };
        const color = colors[type] || C.gold;
        const rad = (value || 0) * Math.PI / 180;

        if (type === 'pitch') {
            // Vertical arrow
            const arrowLen = r * 0.7;
            const dy = Math.sin(rad) * arrowLen;
            el('line', {
                x1: cx, y1: cy + arrowLen * 0.3,
                x2: cx, y2: cy - arrowLen + dy,
                stroke: color, 'stroke-width': 2.5,
                'stroke-linecap': 'round'
            }, svg);
            // Arrowhead
            const tip = cy - arrowLen + dy;
            el('path', {
                d: `M${cx - 5},${tip + 8} L${cx},${tip} L${cx + 5},${tip + 8}`,
                fill: 'none', stroke: color, 'stroke-width': 2,
                'stroke-linecap': 'round', 'stroke-linejoin': 'round'
            }, svg);
            // Arc indicator
            if (Math.abs(value || 0) > 1) {
                el('path', {
                    d: describeArc(cx, cy, r * 0.6, -90, -90 + (value || 0)),
                    fill: 'none', stroke: color, 'stroke-width': 2,
                    'stroke-linecap': 'round', opacity: '0.5'
                }, svg);
            }
        } else if (type === 'roll') {
            // Horizontal arrow
            const arrowLen = r * 0.7;
            const dx = Math.sin(rad) * arrowLen;
            el('line', {
                x1: cx - arrowLen * 0.3, y1: cy,
                x2: cx + arrowLen + dx, y2: cy,
                stroke: color, 'stroke-width': 2.5,
                'stroke-linecap': 'round'
            }, svg);
            const tip = cx + arrowLen + dx;
            el('path', {
                d: `M${tip - 8},${cy - 5} L${tip},${cy} L${tip - 8},${cy + 5}`,
                fill: 'none', stroke: color, 'stroke-width': 2,
                'stroke-linecap': 'round', 'stroke-linejoin': 'round'
            }, svg);
            // Tilt line
            el('line', {
                x1: cx - r * 0.4, y1: cy - 2,
                x2: cx + r * 0.4, y2: cy + 2,
                stroke: C.white + '0.1)', 'stroke-width': 1, 'stroke-dasharray': '3 3'
            }, svg);
        } else if (type === 'yaw') {
            // Rotation indicator
            const arcAngle = (value || 0);
            el('path', {
                d: describeArc(cx, cy, r * 0.55, 0, Math.max(10, Math.abs(arcAngle))),
                fill: 'none', stroke: color, 'stroke-width': 2.5,
                'stroke-linecap': 'round', 'stroke-dasharray': '4 3'
            }, svg);
            // Center dot
            el('circle', {
                cx, cy, r: 3, fill: color, opacity: '0.7'
            }, svg);
            // Arrow tip at end of arc
            const endP = polarToCartesian(cx, cy, r * 0.55, Math.max(10, Math.abs(arcAngle)));
            el('circle', {
                cx: endP.x, cy: endP.y, r: 3, fill: color
            }, svg);
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 5. TECH AXIS (Large version for technology section)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    function drawTechAxis(svg, size, type) {
        svg.innerHTML = '';
        const cx = size / 2, cy = size / 2;
        const r = size * 0.38;
        const colors = { pitch: C.gold, roll: C.cyan, yaw: C.royal };
        const color = colors[type];

        // Background circle
        el('circle', {
            cx, cy, r,
            fill: 'none', stroke: C.white + '0.08)',
            'stroke-width': 1.5
        }, svg);

        // Inner circle
        el('circle', {
            cx, cy, r: r * 0.6,
            fill: 'none', stroke: C.white + '0.05)',
            'stroke-width': 1
        }, svg);

        // Cross hairs
        el('line', { x1: cx - r, y1: cy, x2: cx + r, y2: cy, stroke: C.white + '0.04)', 'stroke-width': 0.5 }, svg);
        el('line', { x1: cx, y1: cy - r, x2: cx, y2: cy + r, stroke: C.white + '0.04)', 'stroke-width': 0.5 }, svg);

        if (type === 'pitch') {
            // Up arrow with arc
            const arrowY = cy - r * 0.75;
            el('line', { x1: cx, y1: cy + r * 0.2, x2: cx, y2: arrowY, stroke: color, 'stroke-width': 3, 'stroke-linecap': 'round' }, svg);
            el('path', { d: `M${cx - 8},${arrowY + 12} L${cx},${arrowY} L${cx + 8},${arrowY + 12}`, fill: 'none', stroke: color, 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
            // Side arcs
            el('path', { d: describeArc(cx, cy, r * 0.5, -120, -60), fill: 'none', stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round', opacity: '0.4' }, svg);
        } else if (type === 'roll') {
            // Horizontal arrow
            const arrowX = cx - r * 0.75;
            el('line', { x1: cx + r * 0.2, y1: cy, x2: arrowX, y2: cy, stroke: color, 'stroke-width': 3, 'stroke-linecap': 'round' }, svg);
            el('path', { d: `M${arrowX + 12},${cy - 8} L${arrowX},${cy} L${arrowX + 12},${cy + 8}`, fill: 'none', stroke: color, 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
            // Tilt indicator
            el('line', { x1: cx - r * 0.6, y1: cy - r * 0.15, x2: cx + r * 0.6, y2: cy + r * 0.15, stroke: color, 'stroke-width': 1.5, opacity: '0.3', 'stroke-dasharray': '4 3' }, svg);
        } else if (type === 'yaw') {
            // Rotation arc with arrow
            el('path', { d: describeArc(cx, cy, r * 0.5, -30, 210), fill: 'none', stroke: color, 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-dasharray': '6 4' }, svg);
            const endP = polarToCartesian(cx, cy, r * 0.5, 210);
            el('circle', { cx: endP.x, cy: endP.y, r: 4, fill: color }, svg);
            el('circle', { cx, cy, r: 4, fill: color, opacity: '0.5' }, svg);
        }

        // Degree ticks around outer edge
        for (let i = 0; i < 12; i++) {
            const angle = i * 30;
            const p1 = polarToCartesian(cx, cy, r - 4, angle);
            const p2 = polarToCartesian(cx, cy, r + 2, angle);
            el('line', { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, stroke: C.white + '0.15)', 'stroke-width': 1 }, svg);
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 6. BENTO FEATURE ICONS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    function drawBentoIcon(svg, size, type) {
        svg.innerHTML = '';
        const cx = size / 2, cy = size / 2;
        const s = size;

        if (type === 'airpods') {
            // AirPods with motion waves
            // Left pod
            el('ellipse', { cx: cx - s * 0.18, cy: cy, rx: s * 0.07, ry: s * 0.15, fill: 'none', stroke: C.white + '0.6)', 'stroke-width': 2 }, svg);
            el('line', { x1: cx - s * 0.18, y1: cy + s * 0.15, x2: cx - s * 0.18, y2: cy + s * 0.30, stroke: C.white + '0.6)', 'stroke-width': 2, 'stroke-linecap': 'round' }, svg);
            // Right pod
            el('ellipse', { cx: cx + s * 0.18, cy: cy, rx: s * 0.07, ry: s * 0.15, fill: 'none', stroke: C.white + '0.6)', 'stroke-width': 2 }, svg);
            el('line', { x1: cx + s * 0.18, y1: cy + s * 0.15, x2: cx + s * 0.18, y2: cy + s * 0.30, stroke: C.white + '0.6)', 'stroke-width': 2, 'stroke-linecap': 'round' }, svg);
            // Motion waves
            [0.12, 0.20, 0.28].forEach((r, i) => {
                el('path', {
                    d: describeArc(cx, cy - s * 0.12, s * r, -60, 60),
                    fill: 'none', stroke: C.gold,
                    'stroke-width': 1.5,
                    opacity: String(0.6 - i * 0.15),
                    'stroke-linecap': 'round'
                }, svg);
            });
        } else if (type === 'score') {
            // Hexagonal score display
            el('path', { d: hexPath(cx, cy, s * 0.28), fill: 'none', stroke: C.gold, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, svg);
            el('text', { x: cx, y: cy + 2, 'text-anchor': 'middle', 'dominant-baseline': 'central', fill: C.gold, 'font-family': "'JetBrains Mono'", 'font-size': s * 0.28, 'font-weight': '700' }, svg).textContent = '92';
            // Glow corners
            for (let i = 0; i < 6; i++) {
                const p = hexPoint(cx, cy, s * 0.28, i);
                el('circle', { cx: p.x, cy: p.y, r: 2, fill: C.gold, opacity: '0.5' }, svg);
            }
        } else if (type === 'protocol') {
            // Schedule/clipboard icon
            const w = s * 0.35, h = s * 0.45;
            el('rect', { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: 4, fill: 'none', stroke: C.gold, 'stroke-width': 2 }, svg);
            // Lines
            [0.3, 0.45, 0.6].forEach(yf => {
                el('line', { x1: cx - w * 0.3, y1: cy - h / 2 + h * yf, x2: cx + w * 0.3, y2: cy - h / 2 + h * yf, stroke: C.white + '0.3)', 'stroke-width': 1.5, 'stroke-linecap': 'round' }, svg);
            });
            // Top tab
            el('rect', { x: cx - w * 0.2, y: cy - h / 2 - 4, width: w * 0.4, height: 8, rx: 2, fill: C.gold, opacity: '0.6' }, svg);
        } else if (type === 'exercise') {
            // Stick figure in motion
            el('circle', { cx, cy: cy - s * 0.18, r: s * 0.06, fill: 'none', stroke: C.gold, 'stroke-width': 2 }, svg);
            el('line', { x1: cx, y1: cy - s * 0.12, x2: cx, y2: cy + s * 0.08, stroke: C.gold, 'stroke-width': 2, 'stroke-linecap': 'round' }, svg);
            // Arms
            el('line', { x1: cx - s * 0.14, y1: cy - s * 0.04, x2: cx + s * 0.14, y2: cy - s * 0.04, stroke: C.gold, 'stroke-width': 2, 'stroke-linecap': 'round' }, svg);
            // Legs
            el('line', { x1: cx, y1: cy + s * 0.08, x2: cx - s * 0.10, y2: cy + s * 0.24, stroke: C.gold, 'stroke-width': 2, 'stroke-linecap': 'round' }, svg);
            el('line', { x1: cx, y1: cy + s * 0.08, x2: cx + s * 0.10, y2: cy + s * 0.24, stroke: C.gold, 'stroke-width': 2, 'stroke-linecap': 'round' }, svg);
        } else if (type === 'background') {
            // Eye/monitoring icon
            el('ellipse', { cx, cy, rx: s * 0.25, ry: s * 0.15, fill: 'none', stroke: C.gold, 'stroke-width': 2 }, svg);
            el('circle', { cx, cy, r: s * 0.07, fill: C.gold, opacity: '0.6' }, svg);
            // Pulse lines
            el('path', { d: `M${cx - s * 0.35},${cy} Q${cx - s * 0.2},${cy - s * 0.1} ${cx - s * 0.1},${cy}`, fill: 'none', stroke: C.gold, 'stroke-width': 1.5, opacity: '0.3' }, svg);
            el('path', { d: `M${cx + s * 0.1},${cy} Q${cx + s * 0.2},${cy + s * 0.1} ${cx + s * 0.35},${cy}`, fill: 'none', stroke: C.gold, 'stroke-width': 1.5, opacity: '0.3' }, svg);
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 7. STEP ICONS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    function drawStepIcon(svg, size, type) {
        svg.innerHTML = '';
        const cx = size / 2, cy = size / 2;
        const s = size;

        // Background circle
        el('circle', { cx, cy, r: s * 0.42, fill: 'none', stroke: C.white + '0.06)', 'stroke-width': 1 }, svg);

        if (type === 'connect') {
            // AirPods connecting illustration
            el('ellipse', { cx: cx - s * 0.12, cy: cy, rx: s * 0.06, ry: s * 0.13, fill: 'none', stroke: C.champagne, 'stroke-width': 2 }, svg);
            el('line', { x1: cx - s * 0.12, y1: cy + s * 0.13, x2: cx - s * 0.12, y2: cy + s * 0.25, stroke: C.champagne, 'stroke-width': 2, 'stroke-linecap': 'round' }, svg);
            el('ellipse', { cx: cx + s * 0.12, cy: cy, rx: s * 0.06, ry: s * 0.13, fill: 'none', stroke: C.champagne, 'stroke-width': 2 }, svg);
            el('line', { x1: cx + s * 0.12, y1: cy + s * 0.13, x2: cx + s * 0.12, y2: cy + s * 0.25, stroke: C.champagne, 'stroke-width': 2, 'stroke-linecap': 'round' }, svg);
            // Connection waves
            [0.10, 0.17, 0.24].forEach((r, i) => {
                el('path', { d: describeArc(cx, cy - s * 0.10, s * r, -50, 50), fill: 'none', stroke: C.gold, 'stroke-width': 1.5, opacity: String(0.7 - i * 0.2), 'stroke-linecap': 'round' }, svg);
            });
            // Phone outline below
            el('rect', { x: cx - s * 0.08, y: cy + s * 0.20, width: s * 0.16, height: s * 0.12, rx: 3, fill: 'none', stroke: C.white + '0.2)', 'stroke-width': 1.5 }, svg);
        } else if (type === 'calibrate') {
            // Crosshair + timer
            el('circle', { cx, cy, r: s * 0.22, fill: 'none', stroke: C.gold, 'stroke-width': 2 }, svg);
            el('line', { x1: cx, y1: cy - s * 0.30, x2: cx, y2: cy - s * 0.14, stroke: C.gold, 'stroke-width': 1.5 }, svg);
            el('line', { x1: cx, y1: cy + s * 0.14, x2: cx, y2: cy + s * 0.30, stroke: C.gold, 'stroke-width': 1.5 }, svg);
            el('line', { x1: cx - s * 0.30, y1: cy, x2: cx - s * 0.14, y2: cy, stroke: C.gold, 'stroke-width': 1.5 }, svg);
            el('line', { x1: cx + s * 0.14, y1: cy, x2: cx + s * 0.30, y2: cy, stroke: C.gold, 'stroke-width': 1.5 }, svg);
            // Center dot
            el('circle', { cx, cy, r: 3, fill: C.gold }, svg);
            // Timer arc
            el('path', { d: describeArc(cx, cy, s * 0.32, -90, 180), fill: 'none', stroke: C.champagne, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-dasharray': '4 4' }, svg);
            // "3s" text
            el('text', { x: cx + s * 0.30, y: cy - s * 0.30, fill: C.gold, 'font-family': "'JetBrains Mono'", 'font-size': 11, opacity: '0.7' }, svg).textContent = '3s';
        } else if (type === 'coaching') {
            // Line chart rising
            const points = [
                { x: cx - s * 0.28, y: cy + s * 0.15 },
                { x: cx - s * 0.12, y: cy + s * 0.05 },
                { x: cx, y: cy - s * 0.08 },
                { x: cx + s * 0.12, y: cy - s * 0.12 },
                { x: cx + s * 0.28, y: cy - s * 0.20 },
            ];
            let path = points.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x},${p.y}`).join(' ');
            el('path', { d: path, fill: 'none', stroke: C.sage, 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
            // Data dots
            points.forEach(p => {
                el('circle', { cx: p.x, cy: p.y, r: 3, fill: C.sage }, svg);
            });
            // Arrow tip
            el('path', { d: `M${cx + s * 0.24},${cy - s * 0.24} L${cx + s * 0.28},${cy - s * 0.20} L${cx + s * 0.22},${cy - s * 0.18}`, fill: 'none', stroke: C.sage, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 8. EXERCISE ILLUSTRATIONS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    function drawExerciseIcon(svg, size, type) {
        svg.innerHTML = '';
        const cx = size / 2, cy = size / 2;
        const s = size;

        // Hex background
        el('path', { d: hexPath(cx, cy, s * 0.42), fill: 'none', stroke: C.white + '0.06)', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, svg);

        const colors = { squats: C.gold, neck: C.cyan, walking: C.sage };
        const color = colors[type];

        if (type === 'squats') {
            // Squatting figure
            el('circle', { cx, cy: cy - s * 0.20, r: s * 0.05, fill: 'none', stroke: color, 'stroke-width': 2 }, svg);
            // Torso (angled for squat)
            el('line', { x1: cx, y1: cy - s * 0.15, x2: cx, y2: cy, stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round' }, svg);
            // Arms extended forward
            el('line', { x1: cx, y1: cy - s * 0.10, x2: cx + s * 0.15, y2: cy - s * 0.12, stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round' }, svg);
            el('line', { x1: cx, y1: cy - s * 0.10, x2: cx - s * 0.15, y2: cy - s * 0.12, stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round' }, svg);
            // Legs bent (squat position)
            el('path', { d: `M${cx},${cy} L${cx - s * 0.10},${cy + s * 0.10} L${cx - s * 0.12},${cy + s * 0.20}`, fill: 'none', stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
            el('path', { d: `M${cx},${cy} L${cx + s * 0.10},${cy + s * 0.10} L${cx + s * 0.12},${cy + s * 0.20}`, fill: 'none', stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
            // Depth arrow
            el('line', { x1: cx + s * 0.25, y1: cy - s * 0.15, x2: cx + s * 0.25, y2: cy + s * 0.15, stroke: color, 'stroke-width': 1.5, opacity: '0.4', 'stroke-dasharray': '3 3' }, svg);
            el('path', { d: `M${cx + s * 0.22},${cy + s * 0.12} L${cx + s * 0.25},${cy + s * 0.15} L${cx + s * 0.28},${cy + s * 0.12}`, fill: 'none', stroke: color, 'stroke-width': 1.5, opacity: '0.4' }, svg);
        } else if (type === 'neck') {
            // Head with rotation arrows
            el('circle', { cx, cy: cy - s * 0.08, r: s * 0.08, fill: 'none', stroke: color, 'stroke-width': 2 }, svg);
            // Neck
            el('line', { x1: cx, y1: cy, x2: cx, y2: cy + s * 0.12, stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round' }, svg);
            // Shoulders
            el('line', { x1: cx - s * 0.15, y1: cy + s * 0.12, x2: cx + s * 0.15, y2: cy + s * 0.12, stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round' }, svg);
            // Rotation arrows
            el('path', { d: describeArc(cx, cy - s * 0.08, s * 0.16, -160, -20), fill: 'none', stroke: color, 'stroke-width': 1.5, opacity: '0.5', 'stroke-linecap': 'round' }, svg);
            el('path', { d: describeArc(cx, cy - s * 0.08, s * 0.16, 20, 160), fill: 'none', stroke: color, 'stroke-width': 1.5, opacity: '0.5', 'stroke-linecap': 'round' }, svg);
            // Arrow tips
            const lp = polarToCartesian(cx, cy - s * 0.08, s * 0.16, -20);
            el('circle', { cx: lp.x, cy: lp.y, r: 2.5, fill: color, opacity: '0.5' }, svg);
            const rp = polarToCartesian(cx, cy - s * 0.08, s * 0.16, 160);
            el('circle', { cx: rp.x, cy: rp.y, r: 2.5, fill: color, opacity: '0.5' }, svg);
        } else if (type === 'walking') {
            // Walking figure
            el('circle', { cx, cy: cy - s * 0.22, r: s * 0.05, fill: 'none', stroke: color, 'stroke-width': 2 }, svg);
            el('line', { x1: cx, y1: cy - s * 0.17, x2: cx, y2: cy + s * 0.02, stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round' }, svg);
            // Arms (swinging)
            el('line', { x1: cx, y1: cy - s * 0.10, x2: cx + s * 0.10, y2: cy + s * 0.02, stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round' }, svg);
            el('line', { x1: cx, y1: cy - s * 0.10, x2: cx - s * 0.08, y2: cy - s * 0.02, stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round' }, svg);
            // Legs (walking stride)
            el('path', { d: `M${cx},${cy + s * 0.02} L${cx + s * 0.08},${cy + s * 0.14} L${cx + s * 0.10},${cy + s * 0.22}`, fill: 'none', stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
            el('path', { d: `M${cx},${cy + s * 0.02} L${cx - s * 0.06},${cy + s * 0.14} L${cx - s * 0.10},${cy + s * 0.22}`, fill: 'none', stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
            // Path dots below
            [-0.18, -0.06, 0.06, 0.18].forEach(xoff => {
                el('circle', { cx: cx + s * xoff, cy: cy + s * 0.28, r: 1.5, fill: color, opacity: '0.3' }, svg);
            });
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 9. GOLDEN SPIRAL (identity card)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    function drawGoldenSpiral(svg, size) {
        svg.innerHTML = '';
        const cx = size / 2, cy = size / 2;
        const s = size;

        // Golden rectangle cascade
        let x = cx - s * 0.35, y = cy - s * 0.22;
        let w = s * 0.7, h = w / PHI;
        const rects = [];
        for (let i = 0; i < 6; i++) {
            rects.push({ x, y, w, h });
            el('rect', {
                x, y, width: w, height: h,
                fill: 'none',
                stroke: C.gold,
                'stroke-opacity': String(0.4 - i * 0.05),
                'stroke-width': 1.5 - i * 0.15
            }, svg);

            // Cut golden section
            const newW = h;
            const remain = w - newW;
            if (i % 4 === 0) { x = x + newW; w = remain; const tmp = h; h = w / PHI; if (h > tmp) h = tmp; }
            else if (i % 4 === 1) { y = y; h = remain > 0 ? remain : h; w = w; const tmp = w; w = h * PHI; if (w > tmp) w = tmp; }
            else if (i % 4 === 2) { x = x; w = remain > 0 ? remain : w; }
            else { h = remain > 0 ? remain : h; }
        }

        // Spiral path
        const b = Math.log(PHI) / (Math.PI / 2);
        const startR = s * 0.01;
        let path = '';
        for (let i = 0; i <= 200; i++) {
            const t = (i / 200) * 3 * Math.PI;
            const r = startR * Math.exp(b * t);
            if (r > s * 0.35) break;
            const px = cx + r * Math.cos(t);
            const py = cy - r * Math.sin(t);
            path += (i === 0 ? 'M' : 'L') + `${px.toFixed(2)},${py.toFixed(2)} `;
        }
        const spiralPath = el('path', {
            d: path,
            fill: 'none',
            stroke: C.champagne,
            'stroke-width': 2,
            'stroke-linecap': 'round',
            class: 'ink-draw'
        }, svg);

        // Phi annotation
        el('text', {
            x: cx, y: cy + s * 0.38,
            'text-anchor': 'middle',
            fill: C.gold,
            'font-family': "'Playfair Display'",
            'font-size': 14,
            'font-style': 'italic',
            opacity: '0.5'
        }, svg).textContent = 'phi = 1.618...';
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 10. NAVIGATION LOGO
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    function drawNavLogo(svg) {
        drawVitruvianSpineMark(svg, 40, { rotate: false });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 11. QUOTE ORNAMENT SPIRAL
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    function drawQuoteSpiral(svg, size) {
        svg.innerHTML = '';
        const cx = size / 2, cy = size / 2;
        const b = Math.log(PHI) / (Math.PI / 2);
        let path = '';
        for (let i = 0; i <= 150; i++) {
            const t = (i / 150) * 2 * Math.PI;
            const r = 2 * Math.exp(b * t);
            if (r > size * 0.4) break;
            path += (i === 0 ? 'M' : 'L') + `${(cx + r * Math.cos(t)).toFixed(2)},${(cy - r * Math.sin(t)).toFixed(2)} `;
        }
        el('path', { d: path, fill: 'none', stroke: C.gold, 'stroke-width': 1.5, 'stroke-linecap': 'round', opacity: '0.5' }, svg);
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // INITIALIZE ALL SVGs
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    function initAllSVGs() {
        // Nav logo
        const navLogo = document.getElementById('navLogo');
        if (navLogo) drawNavLogo(navLogo);

        // Hero spine mark
        const heroMark = document.getElementById('heroSpineMark');
        if (heroMark) drawVitruvianSpineMark(heroMark, 240, { rotate: true, inkDraw: true });

        // Hero rings
        const heroRings = document.getElementById('heroRings');
        if (heroRings) drawHexRings(heroRings, 320);

        // Posture gauge
        const gauge = document.getElementById('postureGauge');
        if (gauge) drawPostureGauge(gauge, 280, 0);

        // Axis icons (small, monitor)
        drawAxisIcon(document.getElementById('axisPitch'), 80, 'pitch', 0);
        drawAxisIcon(document.getElementById('axisRoll'), 80, 'roll', 0);
        drawAxisIcon(document.getElementById('axisYaw'), 80, 'yaw', 0);

        // Monitor rings
        const monRings = document.getElementById('monitorRings');
        if (monRings) drawHexRings(monRings, 200, { posture: 0, stability: 0, alignment: 0 });

        // Identity cards
        const identSpiral = document.getElementById('identitySpiral');
        if (identSpiral) drawGoldenSpiral(identSpiral, 200);

        const identMark = document.getElementById('identityMark');
        if (identMark) drawVitruvianSpineMark(identMark, 200, { rotate: true });

        const identHex = document.getElementById('identityHex');
        if (identHex) drawHexRings(identHex, 200);

        // Bento icons
        document.querySelectorAll('.bento-svg').forEach(svg => {
            const type = svg.dataset.icon;
            if (type) drawBentoIcon(svg, 64, type);
        });

        // Step icons
        document.querySelectorAll('.step-svg').forEach(svg => {
            const type = svg.dataset.step;
            if (type) drawStepIcon(svg, 120, type);
        });

        // Tech axes
        document.querySelectorAll('.tech-svg').forEach(svg => {
            const type = svg.dataset.axis;
            if (type) drawTechAxis(svg, 160, type);
        });

        // Exercise icons
        document.querySelectorAll('.exercise-svg').forEach(svg => {
            const type = svg.dataset.exercise;
            if (type) drawExerciseIcon(svg, 200, type);
        });

        // Quote spirals
        const qs1 = document.getElementById('quoteSpiral');
        if (qs1) drawQuoteSpiral(qs1, 80);
        const qs2 = document.getElementById('quoteSpiralBottom');
        if (qs2) { drawQuoteSpiral(qs2, 80); qs2.style.transform = 'rotate(180deg)'; }

        // Download mark
        const dlMark = document.getElementById('downloadMark');
        if (dlMark) drawVitruvianSpineMark(dlMark, 160, { rotate: true });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // LIVE POSTURE MONITOR
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const monitor = {
        active: false,
        calibrated: false,
        zeroPitch: 0,
        zeroRoll: 0,
        zeroYaw: 0,
        pitch: 0,
        roll: 0,
        yaw: 0,
        score: 0,
        smoothPitch: 0,
        smoothRoll: 0,
        mode: 'mouse', // 'mouse' | 'device'
    };

    function startMonitor() {
        const btn = document.getElementById('startMonitor');
        const calBtn = document.getElementById('calibrateBtn');
        const hint = document.getElementById('monitorHint');

        if (monitor.active) {
            monitor.active = false;
            btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg> Start Monitoring';
            hint.textContent = 'Monitoring paused';
            calBtn.disabled = true;
            return;
        }

        monitor.active = true;
        btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause';
        calBtn.disabled = false;

        // Try device orientation first
        if (window.DeviceOrientationEvent) {
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                // iOS 13+
                DeviceOrientationEvent.requestPermission().then(state => {
                    if (state === 'granted') {
                        monitor.mode = 'device';
                        window.addEventListener('deviceorientation', handleDeviceOrientation);
                        hint.textContent = 'Device sensors active — tilt your device';
                    } else {
                        fallbackToMouse(hint);
                    }
                }).catch(() => fallbackToMouse(hint));
            } else {
                // Non-iOS or older
                let tested = false;
                const testHandler = (e) => {
                    if (e.beta !== null && !tested) {
                        tested = true;
                        monitor.mode = 'device';
                        hint.textContent = 'Device sensors active — tilt your device';
                    }
                };
                window.addEventListener('deviceorientation', handleDeviceOrientation);
                window.addEventListener('deviceorientation', testHandler, { once: true });
                setTimeout(() => {
                    if (!tested) fallbackToMouse(hint);
                }, 1000);
            }
        } else {
            fallbackToMouse(hint);
        }
    }

    function fallbackToMouse(hint) {
        monitor.mode = 'mouse';
        hint.textContent = 'Mouse mode — move cursor to simulate head position';
        document.addEventListener('mousemove', handleMouseMove);
    }

    function handleDeviceOrientation(e) {
        if (!monitor.active) return;
        const rawPitch = e.beta || 0;  // -180 to 180
        const rawRoll = e.gamma || 0;  // -90 to 90
        const rawYaw = e.alpha || 0;   // 0 to 360

        monitor.pitch = rawPitch - monitor.zeroPitch;
        monitor.roll = rawRoll - monitor.zeroRoll;
        monitor.yaw = rawYaw - monitor.zeroYaw;
    }

    function handleMouseMove(e) {
        if (!monitor.active) return;
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;  // -1 to 1
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        monitor.pitch = ny * 30;  // -30 to 30 degrees
        monitor.roll = nx * 20;
        monitor.yaw = nx * 15;
    }

    function calibrateMonitor() {
        monitor.zeroPitch = monitor.pitch + monitor.zeroPitch;
        monitor.zeroRoll = monitor.roll + monitor.zeroRoll;
        monitor.zeroYaw = monitor.yaw + monitor.zeroYaw;
        monitor.pitch = 0;
        monitor.roll = 0;
        monitor.yaw = 0;
        monitor.calibrated = true;
        document.getElementById('monitorHint').textContent = 'Calibrated! This is your zero position.';
    }

    function calculateScore(pitch, roll) {
        const tilt = Math.sqrt(pitch * pitch + roll * roll) * Math.PI / 180; // radians
        if (tilt < 0.10) return Math.max(90, Math.round(100 - tilt * 100));
        if (tilt < 0.22) return Math.max(75, Math.round(90 - tilt * 70));
        if (tilt < 0.38) return Math.max(50, Math.round(75 - tilt * 65));
        return Math.max(20, Math.round(50 - tilt * 55));
    }

    function getStatus(score) {
        if (score >= 90) return 'Excellent';
        if (score >= 75) return 'Good';
        if (score >= 50) return 'Fair';
        if (score > 0) return 'Poor';
        return 'Idle';
    }

    function updateMonitorUI() {
        if (!monitor.active) return;

        // EMA smoothing
        const alpha = 0.15;
        monitor.smoothPitch += (monitor.pitch - monitor.smoothPitch) * alpha;
        monitor.smoothRoll += (monitor.roll - monitor.smoothRoll) * alpha;

        const score = calculateScore(monitor.smoothPitch, monitor.smoothRoll);
        monitor.score = score;

        // Update score display
        document.getElementById('scoreValue').textContent = score;
        const status = getStatus(score);
        const statusEl = document.getElementById('scoreStatus');
        statusEl.textContent = status;

        let statusColor = C.gold;
        if (score >= 90) statusColor = C.sage;
        else if (score >= 75) statusColor = C.gold;
        else if (score >= 50) statusColor = C.amber;
        else statusColor = C.coral;
        statusEl.style.color = statusColor;
        document.getElementById('scoreValue').style.color = statusColor;

        // Update gauge
        drawPostureGauge(document.getElementById('postureGauge'), 280, score);

        // Update axis readouts
        document.getElementById('pitchValue').textContent = monitor.smoothPitch.toFixed(1) + '\u00B0';
        document.getElementById('rollValue').textContent = monitor.smoothRoll.toFixed(1) + '\u00B0';
        document.getElementById('yawValue').textContent = (monitor.yaw || 0).toFixed(1) + '\u00B0';

        // Update axis visuals
        drawAxisIcon(document.getElementById('axisPitch'), 80, 'pitch', monitor.smoothPitch);
        drawAxisIcon(document.getElementById('axisRoll'), 80, 'roll', monitor.smoothRoll);
        drawAxisIcon(document.getElementById('axisYaw'), 80, 'yaw', monitor.yaw);

        // Update hex rings (derive from score)
        drawHexRings(document.getElementById('monitorRings'), 200, {
            posture: score / 100,
            stability: Math.max(0, (100 - Math.abs(monitor.smoothRoll) * 3) / 100),
            alignment: Math.max(0, (100 - Math.abs(monitor.smoothPitch) * 2) / 100),
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // SCROLL ANIMATIONS & UI
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    // Nav scroll blur
    function handleNavScroll() {
        const nav = document.getElementById('nav');
        if (window.scrollY > 40) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    }

    // Intersection Observer for animations
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay || '0', 10);
                    setTimeout(() => entry.target.classList.add('visible'), delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('[data-anim]').forEach(el => observer.observe(el));
    }

    // Counter animation
    function animateCounter(el, target, suffix, duration) {
        const start = performance.now();
        const isFloat = String(target).includes('.');
        function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const current = eased * target;
            el.textContent = isFloat ? current.toFixed(1) : Math.round(current).toLocaleString();
            if (suffix) el.textContent += suffix;
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    function initCounters() {
        const stats = document.querySelector('.hero-stats');
        if (!stats) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.hero-stat-value').forEach(v => {
                        const count = parseFloat(v.dataset.count);
                        const suffix = v.dataset.suffix || '';
                        animateCounter(v, count, suffix, 2000);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(stats);
    }

    // Golden dust particles
    function initGoldenDust() {
        const container = document.getElementById('goldenDust');
        if (!container) return;
        for (let i = 0; i < 24; i++) {
            const p = document.createElement('div');
            p.className = 'dust-particle';
            const dur = 4 + Math.random() * 5;
            p.style.cssText = `
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                --dur: ${dur}s;
                --delay: ${-Math.random() * dur}s;
                --max-op: ${0.08 + Math.random() * 0.15};
                width: ${1.5 + Math.random() * 2.5}px;
                height: ${1.5 + Math.random() * 2.5}px;
            `;
            container.appendChild(p);
        }
    }

    // Smooth scroll for anchor links
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', e => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const top = target.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            });
        });
    }

    // Mobile hamburger
    function initHamburger() {
        const btn = document.getElementById('hamburger');
        const links = document.getElementById('navLinks');
        if (!btn || !links) return;
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            links.classList.toggle('open');
        });
        links.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                btn.classList.remove('active');
                links.classList.remove('open');
            });
        });
    }

    // Glass card spotlight
    function initGlassSpotlight() {
        document.querySelectorAll('.glass-standard, .glass-elevated').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(213,175,97,0.04), rgba(255,255,255,0.035) 300px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.background = '';
            });
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ANIMATION LOOP
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    function animationLoop() {
        if (monitor.active) {
            updateMonitorUI();
        }
        requestAnimationFrame(animationLoop);
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // BOOT
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    function init() {
        initAllSVGs();
        initScrollAnimations();
        initCounters();
        initGoldenDust();
        initSmoothScroll();
        initHamburger();
        initGlassSpotlight();

        // Nav scroll
        window.addEventListener('scroll', handleNavScroll, { passive: true });
        handleNavScroll();

        // Monitor buttons
        document.getElementById('startMonitor')?.addEventListener('click', startMonitor);
        document.getElementById('calibrateBtn')?.addEventListener('click', calibrateMonitor);

        // Start animation loop
        requestAnimationFrame(animationLoop);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
