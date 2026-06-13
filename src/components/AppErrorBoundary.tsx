import React from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

type AppErrorBoundaryState = {
  hasError: boolean;
};

export default class AppErrorBoundary extends React.Component<React.PropsWithChildren, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('ELN Technology page error:', error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7FBFF] px-4 text-slate-950 dark:bg-[#070A1F] dark:text-white">
        <section className="w-full max-w-xl rounded-md border border-sky-100 bg-white p-6 text-center shadow-xl shadow-sky-900/10 dark:border-white/10 dark:bg-[#0E1428] dark:shadow-black/20">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-amber-500/15 text-amber-500">
            <AlertTriangle className="h-7 w-7" />
          </span>
          <h1 className="mt-5 text-2xl font-black">Esta página encontrou um problema.</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Seus dados não foram apagados. Recarregue a página ou volte ao início para continuar.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#159AFD] px-4 py-3 text-sm font-black text-white transition hover:bg-[#0D0F52]"
            >
              <RefreshCw className="h-4 w-4" />
              Recarregar
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-sky-200 px-4 py-3 text-sm font-black text-[#0D0F52] transition hover:border-[#159AFD] dark:border-white/10 dark:text-white"
            >
              <Home className="h-4 w-4" />
              Voltar ao início
            </a>
          </div>
        </section>
      </main>
    );
  }
}
