import React from 'react';
import {
  AbsoluteFill, Composition, Easing, Img, Sequence, interpolate,
  registerRoot, staticFile, useCurrentFrame,
} from 'remotion';
import './video.css';

const FPS = 30;
const seconds = [4, 7, 6, 8, 9, 8];
const duration = seconds.reduce((total, length) => total + length, 0);

const scenes = [
  ['Raziel / NUS FinTech Lab', 'Who checks what an AI agent can read?',
    'Follow one request from a signed token to a verifiable decision.'],
  ['The scale problem', 'One task can trigger many access decisions',
    'Agents can call several services in parallel. Every call that relies on a wrong grant can repeat the same access mistake.'],
  ['One request', 'Alice asks to read Doc 42',
    'Bob’s service protects Doc 42. Its rule allows only assigned reviewers. Alice has no assignment.'],
  ['Signed OAuth access token', 'A valid signature can carry a wrong grant',
    'In this setup, Bob checks the token and relies on the issuer to have applied the access rule correctly.'],
  ['Raziel / Same request', 'Bob requires proof that the rule allows the read',
    'The verifier checks the proof against the approved policy and a commitment to the relationship snapshot. No valid proof means no read.'],
  ['Raziel / Zero trust for agent access', 'The proof travels. Private evidence stays.',
    'Agents can reuse a verified grant within its scope and validity period. The gateway checks every signed read.'],
];

const motion = (frame, start, end) => interpolate(frame, [start, end], [0, 1], {
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
});

function Reveal({at = 0, children, className = ''}) {
  const progress = motion(useCurrentFrame(), at, at + 14);
  return <div className={className} style={{opacity: progress, transform: `translateY(${14 * (1 - progress)}px)`}}>{children}</div>;
}

function Box({label, detail, tone = '', at}) {
  return <Reveal at={at} className={`box ${tone}`}>
    <strong>{label}</strong><span>{detail}</span>
  </Reveal>;
}

function Path({d, at = 0, tone = 'mint', pulse = true}) {
  const frame = useCurrentFrame();
  const reveal = motion(frame, at, at + 26);
  const travel = ((frame - at - 12) % 58 + 58) % 58 / 58;
  return <g className={`path ${tone}`} opacity={reveal}>
    <path d={d} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - reveal}/>
    {pulse && reveal > .75 && <path className="packet" d={d} pathLength={1} strokeDasharray=".055 1" strokeDashoffset={-travel}/>}
  </g>;
}

function Route({tone = 'mint', at = 0}) {
  return <svg className="route" viewBox="0 0 80 38" aria-hidden="true">
    <Path d="M2 19 H72 M62 10 L72 19 L62 28" tone={tone} at={at} pulse={false}/>
  </svg>;
}

function Scale() {
  const frame = useCurrentFrame();
  const spread = frame >= 42;
  const agents = [90, 170, 250];
  const services = [58, 138, 218, 298];
  return <div className="scale">
    <svg viewBox="0 0 1120 333" aria-hidden="true">
      <text x="24" y="29">AGENTS</text><text x="931" y="29">SERVICES</text>
      {agents.map((y, i) => <g key={y} className="agent" opacity={i === 1 ? 1 : motion(frame, 42 + i * 7, 58 + i * 7)}>
        <rect x="24" y={y - 25} width="166" height="50" rx="7"/>
        <text x="43" y={y + 7}>Agent {i + 1}</text>
      </g>)}
      {services.map((y, i) => <g key={y} className="service" opacity={i === 1 ? 1 : motion(frame, 42 + i * 5, 58 + i * 5)}>
        <rect x="929" y={y - 20} width="167" height="46" rx="7"/>
        <text x="948" y={y + 9}>{['Customer data', 'Documents', 'Payments', 'Internal tools'][i]}</text>
      </g>)}
      {agents.flatMap((y, i) => services.map((target, j) => i === 1 && j === 1 ? null :
        <Path key={`${i}/${j}`} d={`M194 ${y} C440 ${y}, 680 ${target}, 924 ${target}`} at={48 + (i * 4 + j) * 4}/>))}
      <Path d="M194 170 C440 170, 680 138, 924 138" at={1}/>
    </svg>
    <div className="scale-label">{spread ? 'More calls. More decisions to get right.' : 'One agent. One protected read.'}</div>
  </div>;
}

function Request() {
  return <div className="diagram middle">
    <div className="flow">
      <Box label="Alice" detail="AI review agent" at={1}/>
      <Route at={12}/>
      <Box label="Read Doc 42" detail="Protected request" at={22}/>
      <Route at={36}/>
      <Box label="Bob" detail="Service holding the file" at={46}/>
    </div>
    <Reveal at={68} className="rule">
      <div><small>Approved rule</small><strong>Assigned reviewers only</strong></div>
      <div className="negative"><small>Relationship on record</small><strong>Alice is unassigned</strong></div>
    </Reveal>
  </div>;
}

function Verdict({withProof}) {
  return <div className="diagram middle">
    <div className="flow">
      <Box label={withProof ? 'Approved policy' : 'Issuer'} detail={withProof ? 'Assigned reviewers only' : 'Signs the wrong grant'} tone={withProof ? '' : 'warning'} at={1}/>
      <Route at={14} tone={withProof ? 'mint' : 'amber'}/>
      <Box label={withProof ? 'Owner-held snapshot' : 'Alice presents token'} detail={withProof ? 'Alice is unassigned' : 'Access to Doc 42'} at={24}/>
      <Route at={35}/>
      <Box label={withProof ? 'Independent verifier' : 'Bob validates token'} detail={withProof ? 'Requires proof for this read' : 'Issuer · Signature · Audience · Expiry'} tone="emphasis" at={45}/>
    </div>
    <Reveal at={79} className={`verdict ${withProof ? 'blocked' : 'warning'}`}>
      <small>{withProof ? 'No valid ALLOW proof' : 'All token checks pass'}</small>
      <strong>{withProof ? 'Gateway withholds Doc 42' : 'Bob releases Doc 42'}</strong>
    </Reveal>
  </div>;
}

function Boundary() {
  return <div className="diagram middle">
    <div className="flow final-flow">
      <Box label="Data owner" detail="Retains private relationship evidence" at={1}/>
      <Route at={17}/>
      <Box label="Independent verifier" detail="Checks proof against approved inputs" tone="emphasis" at={28}/>
      <Route at={42}/>
      <Box label="Gateway" detail="Checks and enforces each signed request" at={56}/>
    </div>
    <Reveal at={81} className="rule last-note">
      <div><small>Checked for each read</small><strong>Agent, scope and validity</strong></div>
      <div><small>Reusable within scope</small><strong>Proof-backed grant</strong></div>
    </Reveal>
  </div>;
}

function Frame({scene}) {
  const [label, title, summary] = scenes[scene];
  const frame = useCurrentFrame();
  if (scene === 0) {
    return <AbsoluteFill className="title-scene">
      <Img src={staticFile('explainer/source-artwork.webp')} className="art"
        style={{transform: `scale(${1 + frame * .00035})`}}/>
      <div className="art-shade"/>
      <Reveal className="opening">
        <Img src={staticFile('brand/logo-primary-dark.svg')} className="brand"/>
        <h1>{title}</h1>
        <p>{summary}</p>
      </Reveal>
      <div className="opening-footer">{label}</div>
    </AbsoluteFill>;
  }
  return <AbsoluteFill className="scene">
    <header><Reveal><div className="eyebrow">{label}</div><h1>{title}</h1></Reveal></header>
    {scene === 1 && <Scale/>}
    {scene === 2 && <Request/>}
    {scene === 3 && <Verdict withProof={false}/>}
    {scene === 4 && <Verdict withProof/>}
    {scene === 5 && <Boundary/>}
    <footer><p>{summary}</p><span>{String(scene).padStart(2, '0')} / 05</span></footer>
  </AbsoluteFill>;
}

function Explainer() {
  let start = 0;
  return <AbsoluteFill>{seconds.map((length, i) => {
    const from = start;
    start += FPS * length;
    return <Sequence key={i} name={scenes[i][0]} from={from} durationInFrames={FPS * length}><Frame scene={i}/></Sequence>;
  })}</AbsoluteFill>;
}

registerRoot(() => <Composition id="RazielTrustExplainer" component={Explainer}
  durationInFrames={FPS * duration} fps={FPS} width={1280} height={720}/>);
