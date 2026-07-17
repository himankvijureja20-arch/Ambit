import { useState } from 'react';
import Logo from '../components/brand/Logo';
import {
  Button,
  Input,
  Textarea,
  Badge,
  Avatar,
  Card,
  IconTile,
  TrustScoreBar,
  SegmentedControl,
  SectionHeader,
} from '../components/ui';

const colors = [
  { name: 'Primary green', hex: '#36754D', cls: 'bg-primary' },
  { name: 'Green hover', hex: '#2C6140', cls: 'bg-primary-600' },
  { name: 'Navy (logo)', hex: '#16283D', cls: 'bg-navy-900' },
  { name: 'Ink / deep navy', hex: '#041627', cls: 'bg-navy-950' },
  { name: 'App background', hex: '#F8F9FA', cls: 'bg-app border border-line' },
  { name: 'Text secondary', hex: '#44474C', cls: 'bg-ink-secondary' },
  { name: 'Text tertiary', hex: '#74777D', cls: 'bg-ink-tertiary' },
  { name: 'Border', hex: '#C4C6CD', cls: 'bg-line' },
  { name: 'Sage bg', hex: '#C8E6DC', cls: 'bg-sage-bg' },
  { name: 'Sage text', hex: '#4C6860', cls: 'bg-sage-text' },
  { name: 'Amber', hex: '#FFBF00', cls: 'bg-amber' },
  { name: 'Danger', hex: '#BA1A1A', cls: 'bg-danger' },
];

export default function BrandPage() {
  const [segmentValue, setSegmentValue] = useState('home');
  const [trustScore, setTrustScore] = useState(75);

  return (
    <div className="mx-auto max-w-mobile px-5 py-10 space-y-12">
      {/* Logo */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-tertiary mb-4">
          Logo
        </p>
        <div className="rounded-card border border-line bg-surface shadow-card p-6 space-y-6">
          <Logo size={48} />
          <Logo size={32} />
          <Logo size={24} withTile />
          <div className="rounded-lg bg-navy-950 p-4 inline-block">
            <Logo size={32} className="[&_span]:!text-white" />
          </div>
        </div>
      </section>

      {/* Colors */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-tertiary mb-4">
          Colors
        </p>
        <div className="grid grid-cols-2 gap-3">
          {colors.map((c) => (
            <div
              key={c.name}
              className="rounded-card border border-line bg-surface shadow-card overflow-hidden"
            >
              <div className={`h-14 ${c.cls}`} />
              <div className="p-3">
                <p className="text-sm font-semibold">{c.name}</p>
                <p className="text-xs text-ink-tertiary font-mono">{c.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-tertiary mb-4">
          Typography
        </p>
        <div className="rounded-card border border-line bg-surface shadow-card p-6 space-y-4">
          <h1 className="text-[32px] font-bold leading-10 tracking-tight">
            Welcome to Ambit
          </h1>
          <h2 className="text-2xl font-semibold">Society Circles</h2>
          <h3 className="text-xl font-semibold">Morning Yoga</h3>
          <p className="text-base text-ink-secondary">
            Body text — Inter regular. Find a neighbor who shares your hobby and
            make plans inside your Circle.
          </p>
          <p className="text-sm text-ink-secondary">
            Small body — supporting copy on cards and notices.
          </p>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-tertiary">
            Eyebrow label / section heading
          </p>
        </div>
      </section>

      {/* Buttons & badges (token preview — real components come in Phase 1) */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-tertiary mb-4">
          Buttons &amp; badges
        </p>
        <div className="rounded-card border border-line bg-surface shadow-card p-6 space-y-4">
          <button className="w-full rounded-xl bg-primary py-3.5 font-display text-lg font-semibold text-white shadow-cta hover:bg-primary-600 transition-colors">
            Verify Code →
          </button>
          <button className="w-full rounded-xl bg-navy-950 py-3.5 font-display text-base font-semibold text-white hover:bg-navy-800 transition-colors">
            Join Circle +
          </button>
          <button className="w-full rounded-xl border-2 border-navy-950 py-3 font-display text-base font-semibold text-navy-950 hover:bg-navy-950/5 transition-colors">
            Edit Details
          </button>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="rounded-full bg-sage-bg px-3 py-1 text-xs font-semibold tracking-wide text-sage-text">
              VERIFIED RESIDENT
            </span>
            <span className="rounded-full bg-amber px-3 py-1 text-xs font-semibold tracking-wide text-ink">
              HIGH PRIORITY
            </span>
            <span className="rounded-full bg-amber-bg px-3 py-1 text-xs font-bold tracking-wide text-amber-text">
              URGENT REQUEST
            </span>
            <span className="rounded-full bg-info-soft px-3 py-1 text-xs font-semibold tracking-wide text-info-text">
              ACTIVE NOW
            </span>
          </div>
        </div>
      </section>

      {/* Card sample */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-tertiary mb-4">
          Card style
        </p>
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <IconTile icon="🐾" color="sage" size="md" />
            <div className="flex-1">
              <h4 className="font-display font-semibold text-navy-950">Dog walking (30 mins)</h4>
              <p className="mt-1 text-sm text-ink-secondary">
                Emergency at work! Need someone to walk Moti for a quick round of
                the society garden.
              </p>
              <button className="mt-3 text-sm font-semibold text-primary hover:text-primary-600">
                Offer Help →
              </button>
            </div>
          </div>
        </Card>
      </section>

      {/* Buttons */}
      <section>
        <SectionHeader>Buttons</SectionHeader>
        <Card className="p-6 space-y-3">
          <Button variant="primary" className="w-full">
            Join Circle
          </Button>
          <Button variant="secondary" className="w-full">
            Create Request
          </Button>
          <Button variant="ghost" className="w-full">
            Edit Details
          </Button>
          <div className="flex gap-2">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg" className="flex-1">
              Large
            </Button>
          </div>
          <Button loading>Loading...</Button>
        </Card>
      </section>

      {/* Form Inputs */}
      <section>
        <SectionHeader>Form Inputs</SectionHeader>
        <Card className="p-6 space-y-4">
          <Input label="Email Address" placeholder="user@example.com" type="email" />
          <Input label="Full Name" placeholder="John Doe" />
          <Input
            label="With Error"
            error="This field is required"
            placeholder="Try entering something"
          />
          <Textarea label="Tell us about yourself" placeholder="Share your interests..." />
        </Card>
      </section>

      {/* Avatar & Icons */}
      <section>
        <SectionHeader>Avatars &amp; Icon Tiles</SectionHeader>
        <Card className="p-6 space-y-6">
          <div>
            <p className="text-xs font-semibold text-ink-secondary mb-3">Avatar sizes</p>
            <div className="flex gap-3">
              <Avatar initials="AB" size="lg" />
              <Avatar initials="CD" size="md" />
              <Avatar initials="EF" size="sm" />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-ink-secondary mb-3">Icon tiles</p>
            <div className="grid grid-cols-4 gap-3">
              <IconTile icon="⚽" color="primary" size="md" />
              <IconTile icon="🧘" color="sage" size="md" />
              <IconTile icon="🎨" color="amber" size="md" />
              <IconTile icon="📚" color="info" size="md" />
            </div>
          </div>
        </Card>
      </section>

      {/* Trust Score */}
      <section>
        <SectionHeader>Trust Score Bar</SectionHeader>
        <Card className="p-6 space-y-6">
          <TrustScoreBar score={100} label="Perfect Trust" size="lg" />
          <TrustScoreBar score={trustScore} label="Your Score" size="md" />
          <TrustScoreBar score={30} label="Low Trust" size="sm" />
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setTrustScore(Math.max(0, trustScore - 10))}>
              -10
            </Button>
            <Button size="sm" onClick={() => setTrustScore(Math.min(100, trustScore + 10))}>
              +10
            </Button>
          </div>
        </Card>
      </section>

      {/* Segmented Control */}
      <section>
        <SectionHeader>Segmented Control</SectionHeader>
        <Card className="p-6 space-y-4">
          <SegmentedControl
            value={segmentValue}
            onChange={setSegmentValue}
            options={[
              { value: 'home', label: '🏠 Home' },
              { value: 'circles', label: '🔵 Circles' },
              { value: 'profile', label: '👤 Profile' },
            ]}
          />
          <p className="text-sm text-ink-secondary">Selected: {segmentValue}</p>
        </Card>
      </section>

      {/* Badges */}
      <section>
        <SectionHeader>Badges</SectionHeader>
        <Card className="p-6">
          <div className="flex flex-wrap gap-3">
            <Badge status="verified">VERIFIED RESIDENT</Badge>
            <Badge status="priority">HIGH PRIORITY</Badge>
            <Badge status="urgent">URGENT REQUEST</Badge>
            <Badge status="active">ACTIVE NOW</Badge>
          </div>
        </Card>
      </section>
    </div>
  );
}
