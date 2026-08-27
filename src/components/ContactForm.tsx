import { useState, type ChangeEvent, type FormEvent } from 'react';

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

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('request_failed');

      setStatus('success');
      form.reset();
      setWhatsapp('');
    } catch {
      setStatus('error');
      setErrorMsg('Não foi possível enviar agora. Tente novamente ou chame no WhatsApp.');
    }
  }

  if (status === 'success') {
    return (
      <p role="status" className="rounded-2xl border border-[color:var(--accent)] bg-[color:var(--accent-soft)] p-4 text-sm text-[color:var(--ink)]">
        Recebi sua solicitação! Vou responder em breve pelo WhatsApp ou e-mail informado.
      </p>
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

      <label className="flex flex-col gap-1 text-sm text-[color:var(--ink-soft)]">
        Seu nome
        <input
          type="text"
          name="name"
          required
          autoComplete="name"
          className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-[color:var(--ink)] outline-none transition-colors focus:border-[color:var(--accent)]"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-[color:var(--ink-soft)]">
        Seu WhatsApp
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
          className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-[color:var(--ink)] outline-none transition-colors focus:border-[color:var(--accent)]"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-[color:var(--ink-soft)]">
        Seu e-mail
        <input
          type="email"
          name="email"
          autoComplete="email"
          className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-[color:var(--ink)] outline-none transition-colors focus:border-[color:var(--accent)]"
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
        className="rounded-full bg-[color:var(--accent)] px-4 py-3 font-medium text-white transition-transform hover:scale-[1.01] disabled:opacity-60"
      >
        {status === 'submitting' ? 'Enviando…' : 'Agendar minha sessão'}
      </button>
    </form>
  );
}
