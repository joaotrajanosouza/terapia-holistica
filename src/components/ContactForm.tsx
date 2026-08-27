import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ArrowUpRight, Check, Mail, MessageCircle, UserRound } from 'lucide-react';
import { whatsappLink } from '@lib/site';

type Status = 'idle' | 'submitting' | 'success' | 'error';

function phoneDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, 11);
}

function formatPhone(value: string): string {
  const digits = phoneDigits(value);
  if (!digits) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  function handleWhatsappChange(event: ChangeEvent<HTMLInputElement>) {
    setWhatsapp(formatPhone(event.target.value));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: campo invisível para humanos, preenchido só por bots.
    // Se vier preenchido, tratamos como spam sem chamar a API.
    if (data.get('website')) {
      setStatus('success');
      form.reset();
      setWhatsapp('');
      return;
    }

    const payload = {
      name: String(data.get('name') ?? '').trim(),
      whatsapp,
      email: String(data.get('email') ?? '').trim(),
    };

    if (!payload.name || phoneDigits(payload.whatsapp).length < 10) {
      setStatus('error');
      setErrorMsg('Preencha seu nome e WhatsApp para continuar.');
      return;
    }

    const message = [
      `Olá, Leandro! Meu nome é ${payload.name}.`,
      'Gostaria de agendar uma sessão.',
      `Meu WhatsApp: ${payload.whatsapp}`,
      payload.email ? `Meu e-mail: ${payload.email}` : 'E-mail: não informado',
    ].join('\n');

    setStatus('success');
    form.reset();
    setWhatsapp('');
    window.location.assign(whatsappLink(message));
  }

  if (status === 'success') {
    return (
      <div role="status" className="flex items-start gap-3 rounded-2xl border border-[color:var(--accent)] bg-[color:var(--accent-soft)] p-4 text-sm text-[color:var(--ink)]">
        <Check className="mt-0.5 shrink-0 text-[color:var(--accent)]" size={18} strokeWidth={2.4} aria-hidden="true" />
        <p>Mensagem preparada! Abrindo o WhatsApp para você continuar a conversa.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-[color:var(--ink)]" noValidate>
      {/* Honeypot — mantido fora da visão, nunca com display:none (alguns
          bots ignoram display:none, mas preenchem campos "visíveis") */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <label className="group flex flex-col gap-1.5 text-sm text-[color:var(--ink-soft)]">
        <span className="flex items-center gap-2 font-medium text-[color:var(--ink)]">
          <UserRound size={16} strokeWidth={1.8} aria-hidden="true" />
          Seu nome
        </span>
        <input
          type="text"
          name="name"
          required
          autoComplete="name"
          className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3.5 text-[color:var(--ink)] outline-none transition-all placeholder:text-[color:var(--ink-soft)]/60 focus:border-[color:var(--accent)] focus:shadow-[0_0_0_4px_var(--accent-soft)]"
        />
      </label>

      <label className="group flex flex-col gap-1.5 text-sm text-[color:var(--ink-soft)]">
        <span className="flex items-center gap-2 font-medium text-[color:var(--ink)]">
          <MessageCircle size={16} strokeWidth={1.8} aria-hidden="true" />
          Seu WhatsApp
        </span>
        <input
          type="tel"
          name="whatsapp"
          required
          autoComplete="tel"
          inputMode="numeric"
          value={whatsapp}
          onChange={handleWhatsappChange}
          placeholder="(12) 99999-9999"
          maxLength={15}
          className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3.5 text-[color:var(--ink)] outline-none transition-all placeholder:text-[color:var(--ink-soft)]/60 focus:border-[color:var(--accent)] focus:shadow-[0_0_0_4px_var(--accent-soft)]"
        />
      </label>

      <label className="group flex flex-col gap-1.5 text-sm text-[color:var(--ink-soft)]">
        <span className="flex items-center gap-2 font-medium text-[color:var(--ink)]">
          <Mail size={16} strokeWidth={1.8} aria-hidden="true" />
          Seu e-mail <span className="font-normal text-[color:var(--ink-soft)]">(opcional)</span>
        </span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3.5 text-[color:var(--ink)] outline-none transition-all placeholder:text-[color:var(--ink-soft)]/60 focus:border-[color:var(--accent)] focus:shadow-[0_0_0_4px_var(--accent-soft)]"
        />
      </label>

      {status === 'error' && (
        <p role="alert" className="text-sm text-[color:var(--danger)]">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="group mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-3.5 font-semibold text-white shadow-[var(--shadow-accent)] transition-all hover:-translate-y-0.5 hover:bg-[color:var(--accent-strong)] hover:shadow-[var(--shadow-lift)] disabled:cursor-wait disabled:opacity-60"
      >
        {status === 'submitting' ? 'Preparando…' : 'Continuar pelo WhatsApp'}
        <ArrowUpRight size={17} strokeWidth={2.2} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
      </button>
      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-[color:var(--ink-soft)]">
        <MessageCircle size={14} aria-hidden="true" />
        Seus dados serão enviados em uma mensagem privada.
      </p>
    </form>
  );
}
