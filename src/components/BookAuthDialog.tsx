import { FormEvent, useState } from 'react';
import { LogOut, X } from 'lucide-react';

interface BookAuthDialogProps {
    open: boolean;
    onClose: () => void;
    email: string | null;
    isSharedEditor: boolean;
    configured: boolean;
    onSignIn: (username: string, password: string) => Promise<void>;
    onSignOut: () => Promise<void>;
    onExportLegacy: () => void;
}

export function BookAuthDialog({
    open,
    onClose,
    email,
    isSharedEditor,
    configured,
    onSignIn,
    onSignOut,
    onExportLegacy,
}: BookAuthDialogProps) {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [busy, setBusy] = useState(false);

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        setBusy(true);
        setMessage('');
        try {
            await onSignIn(loginId, password);
            setMessage('Berhasil masuk.');
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Autentikasi gagal.');
        } finally {
            setBusy(false);
        }
    };

    return open ? (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/80 backdrop-blur-xs">
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="book-auth-title"
                className="relative w-full max-w-md parchment-texture rounded-lg border-2 border-[#b59972] shadow-2xl p-5 sm:p-7 text-[#3d2919]"
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-1 text-[#694827] hover:text-[#2c1d11]"
                    aria-label="Tutup"
                >
                    <X className="w-5 h-5" />
                </button>
                <h2 id="book-auth-title" className="font-cinzel text-lg font-bold text-[#331c0a]">
                    {email ? (isSharedEditor ? 'Akun Bersama Angkatan' : 'Akun Tidak Diizinkan') : ' Login'}
                </h2>
                {email ? (
                    <div className="mt-4 space-y-4">
                        <p className="font-source-serif text-sm">
                            {isSharedEditor
                                ? 'Akun bersama aktif.'
                                : 'Akun ini bukan akun bersama Forza Youth Generation dan tidak dapat mengubah isi buku.'}
                        </p>
                        <button
                            onClick={async () => {
                                setBusy(true);
                                try {
                                    await onSignOut();
                                    setMessage('');
                                } catch (error) {
                                    setMessage(error instanceof Error ? error.message : 'Gagal keluar.');
                                } finally {
                                    setBusy(false);
                                }
                            }}
                            disabled={busy}
                            className="inline-flex items-center gap-2 px-3 py-2 border border-[#8a5b35] bg-[#422610] text-[#fbf5e8] font-cinzel text-xs font-bold disabled:opacity-50"
                        >
                            <LogOut className="w-4 h-4" /> Keluar
                        </button>
                    </div>
                ) : (
                    <form onSubmit={submit} className="mt-4 space-y-3">
                        <label className="block font-cinzel text-xs font-bold text-[#694827]">
                            ID akun angkatan
                            <input
                                type="text"
                                required
                                autoComplete="username"
                                placeholder="ID akun bersama"
                                value={loginId}
                                onChange={(event) => setLoginId(event.target.value)}
                                className="mt-1 w-full px-2.5 py-2 bg-[#f3ebd8] border border-[#bfa683] rounded text-sm font-source-serif"
                            />
                        </label>
                        <label className="block font-cinzel text-xs font-bold text-[#694827]">
                            Kata sandi
                            <input
                                type="password"
                                required
                                minLength={8}
                                autoComplete="current-password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="mt-1 w-full px-2.5 py-2 bg-[#f3ebd8] border border-[#bfa683] rounded text-sm font-source-serif"
                            />
                        </label>
                        <button
                            type="submit"
                            disabled={busy || !configured}
                            className="w-full px-3 py-2 bg-[#422610] hover:bg-[#5e3819] text-[#fbf5e8] font-cinzel text-xs font-bold disabled:opacity-50"
                        >
                            {busy ? 'Memproses...' : 'Masuk'}
                        </button>
                        <p className="font-source-serif text-xs text-[#694827]">
                            Gunakan kredensial bersama angkatan. Pendaftaran akun publik tidak tersedia.
                        </p>
                    </form>
                )}

                {message && <p role="status" className="mt-3 font-source-serif text-sm text-[#694827]">{message}</p>}
                <div className="mt-5 border-t border-[#cfbe9e] pt-3">
                    <button
                        onClick={onExportLegacy}
                        className="font-source-serif text-xs underline text-[#694827]"
                    >
                        Ekspor arsip LocalStorage lama
                    </button>
                </div>
            </section>
        </div>
    ) : null;
}