import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Zap, Users, BarChart3, Kanban, Shield, Star } from 'lucide-react';

const features = [
  { icon: Kanban, title: 'Kanban Boards', desc: 'Visualize your workflow with drag-and-drop Kanban boards that update in real time.' },
  { icon: Users, title: 'Team Collaboration', desc: 'Invite members, assign roles, and collaborate seamlessly across projects.' },
  { icon: BarChart3, title: 'Insightful Analytics', desc: 'Track progress with beautiful dashboards, completion charts, and activity feeds.' },
  { icon: Shield, title: 'Secure by Default', desc: 'Enterprise-grade security with JWT auth, RBAC, and encrypted passwords.' },
];

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center shadow-glow-sm">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg">TaskFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">Sign In</Link>
          <Link to="/signup" className="btn-primary text-sm px-4 py-2">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial="hidden" animate="show"
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          className="relative max-w-4xl mx-auto"
        >
          <motion.div variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-600/15 border border-brand-500/30 text-brand-400 text-sm font-medium mb-6"
          >
            <Star size={14} />
            <span>Built for modern teams</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Manage tasks like a{' '}
            <span className="gradient-text">pro team</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            TaskFlow brings projects, tasks, and teams together in one beautiful workspace.
            Drag. Drop. Deliver.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-2xl text-base transition-all duration-200 shadow-glow hover:shadow-glow hover:scale-105 active:scale-95"
            >
              Start for free
              <ArrowRight size={18} />
            </Link>
            <Link to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800/80 hover:bg-gray-700/80 text-gray-200 font-semibold rounded-2xl text-base border border-gray-700/60 transition-all duration-200 hover:scale-105"
            >
              Sign in
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-6 mt-10 text-sm text-gray-500">
            {['Free forever plan', 'No credit card needed', 'Unlimited projects'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-500" /> {t}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Mock UI Preview */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden border border-gray-800/60 shadow-2xl"
        >
          <div className="bg-gray-900 p-4 border-b border-gray-800 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-rose-500" />
            <div className="h-3 w-3 rounded-full bg-amber-400" />
            <div className="h-3 w-3 rounded-full bg-emerald-400" />
            <div className="flex-1 mx-4 h-6 bg-gray-800 rounded-lg" />
          </div>
          <div className="bg-gray-950 p-8 grid grid-cols-3 gap-4 min-h-[300px]">
            {['Todo', 'In Progress', 'Done'].map((col, i) => (
              <div key={col} className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-gray-400' : i === 1 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  <span className="text-xs font-semibold text-gray-400">{col}</span>
                  <span className="text-xs text-gray-600 bg-gray-800 px-1.5 rounded-full">{3 - i}</span>
                </div>
                {Array.from({ length: 3 - i }).map((_, j) => (
                  <div key={j} className="glass-card p-3 space-y-2">
                    <div className="h-3 bg-gray-800 rounded w-3/4" />
                    <div className="h-2 bg-gray-800 rounded w-1/2" />
                    <div className="flex gap-1.5">
                      <div className={`h-4 w-12 rounded-full ${j === 0 ? 'bg-rose-500/30' : j === 1 ? 'bg-amber-500/30' : 'bg-blue-500/30'}`} />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything your team needs</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">Designed for fast-moving teams who need clarity, not complexity.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass-card p-6 hover:border-brand-500/30 transition-all duration-300 group"
            >
              <div className="h-11 w-11 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon size={20} className="text-brand-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center glass-card p-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-violet-600/10 pointer-events-none" />
          <h2 className="text-3xl font-bold mb-4 relative">Ready to get organized?</h2>
          <p className="text-gray-400 mb-8 relative">Join teams who use TaskFlow to ship faster and stress less.</p>
          <Link to="/signup" className="btn-primary text-base px-8 py-3.5 inline-flex">
            Create your workspace <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/60 px-6 py-8 text-center text-sm text-gray-600">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="h-5 w-5 rounded bg-brand-600 flex items-center justify-center">
            <Zap size={11} className="text-white" />
          </div>
          <span className="font-semibold text-gray-400">TaskFlow</span>
        </div>
        <p>© {new Date().getFullYear()} TaskFlow. Built with ❤️ for modern teams.</p>
      </footer>
    </div>
  );
};
