"use client";

import { motion } from "framer-motion";
import {
  Heart,
  Wind,
  Hand,
  Sparkles,
  Trees,
  Music2,
  Shield,
  Users,
  Mail,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const categories = [
  {
    icon: Wind,
    label: "Breathing",
    desc: "Box breathing, coherent breathing, physiological sighs, and more",
  },
  {
    icon: Hand,
    label: "Grounding",
    desc: "5-4-3-2-1 senses, body scan, EFT tapping, dive reflex",
  },
  {
    icon: Sparkles,
    label: "Mindfulness",
    desc: "Loving-kindness, self-compassion, journaling, urge surfing",
  },
  {
    icon: Trees,
    label: "Visualization",
    desc: "Safe place, nature scenes, thoughts as clouds",
  },
  {
    icon: Music2,
    label: "Sound",
    desc: "Calming tones, white/pink/brown noise, ocean and rain",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Nav */}
      <nav className="mb-12 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <Heart className="w-5 h-5" />
          CalmMyself
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft size={14} />
          Back to tools
        </Link>
      </nav>

      {/* Hero */}
      <motion.div className="mb-12" {...fadeUp} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
          About CalmMyself
        </h1>
        <p className="text-lg font-light leading-relaxed">
          Anxiety doesn&rsquo;t wait for your next therapy appointment.
        </p>
      </motion.div>

      {/* Mission */}
      <motion.section
        className="mb-12"
        {...fadeUp}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <p className="leading-relaxed mb-4">
          CalmMyself is a free toolbox of evidence-based techniques &mdash; the
          same ones used in CBT, DBT, and somatic therapy &mdash; made instant,
          private, and accessible to anyone. No signup. No tracking. No ads.
          Just tools that work.
        </p>
        <p className="leading-relaxed">
          Whether you&rsquo;re mid-panic attack, can&rsquo;t sleep, need to
          reset between meetings, or just want a moment of calm &mdash;
          there&rsquo;s something here for you.
        </p>
      </motion.section>

      {/* How it works */}
      <motion.section
        className="mb-12"
        {...fadeUp}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <h2 className="text-xl font-semibold mb-4">What&rsquo;s inside</h2>
        <div className="grid gap-3">
          {categories.map((cat) => (
            <div
              key={cat.label}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-gray-100"
            >
              <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
                <cat.icon size={16} />
              </div>
              <div>
                <p className="font-medium text-sm">{cat.label}</p>
                <p className="text-xs mt-0.5">{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Evidence basis */}
      <motion.section
        className="mb-12"
        {...fadeUp}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-3">The science</h2>
        <p className="leading-relaxed">
          Every tool draws from established therapeutic approaches: Cognitive
          Behavioral Therapy (CBT), Dialectical Behavior Therapy (DBT), somatic
          experiencing, polyvagal theory, and mindfulness-based stress reduction
          (MBSR). These aren&rsquo;t trends &mdash; they&rsquo;re techniques
          backed by decades of clinical research.
        </p>
        <p className="text-sm mt-3">
          CalmMyself is not a replacement for professional care. If you&rsquo;re
          in crisis, please call <strong>988</strong> or text{" "}
          <strong>HELLO</strong> to 741741.
        </p>
      </motion.section>

      {/* Privacy */}
      <motion.section
        className="mb-12"
        id="privacy"
        {...fadeUp}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Shield size={18} />
          <h2 className="text-xl font-semibold">Privacy</h2>
        </div>
        <p className="leading-relaxed">
          CalmMyself collects absolutely nothing. No cookies. No analytics. No
          tracking pixels. No accounts. Your browser stores your favorites
          locally &mdash; that data never leaves your device. The app works
          offline once loaded.
        </p>
        <p className="leading-relaxed mt-3">
          We believe mental health tools should be private by default, not by
          opt-in.
        </p>
      </motion.section>

      {/* For clinicians */}
      <motion.section
        className="mb-12"
        {...fadeUp}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Users size={18} />
          <h2 className="text-xl font-semibold">For clinicians</h2>
        </div>
        <p className="leading-relaxed">
          Therapists, counselors, and healthcare providers are welcome to
          recommend CalmMyself to clients as a between-session resource. The
          tools are free, require no account, and work on any device. Share{" "}
          <strong>calmmyself.com</strong> directly &mdash; no barriers.
        </p>
      </motion.section>

      {/* Contact */}
      <motion.section
        className="mb-16"
        {...fadeUp}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Mail size={18} />
          <h2 className="text-xl font-semibold">Contact</h2>
        </div>
        <p className="leading-relaxed">
          Questions, feedback, or ideas? Reach out at{" "}
          <a
            href="mailto:hello@calmmyself.com"
            className="underline underline-offset-2"
          >
            hello@calmmyself.com
          </a>
        </p>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-gray-100 pt-8 pb-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">CalmMyself</span>
          </div>
          <p className="text-xs">Free tools for calm and anxiety relief</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/" className="transition-colors">
              Tools
            </Link>
            <Link href="/about" className="transition-colors">
              About
            </Link>
            <Link href="/about#privacy" className="transition-colors">
              Privacy
            </Link>
            <a href="mailto:hello@calmmyself.com" className="transition-colors">
              Contact
            </a>
          </div>
          <div className="space-y-1">
            <p>No data collection · No ads · Free forever</p>
            <p>
              If you&rsquo;re in crisis: call <strong>988</strong>
            </p>
            <p className="mt-2">Made with care for anyone who needs it</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
