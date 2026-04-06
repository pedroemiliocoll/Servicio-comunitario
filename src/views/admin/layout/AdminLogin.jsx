import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminLogin({ loginUsername, setLoginUsername, loginPass, setLoginPass, login, loginLoading, loginError }) {
    return (
        <div className="min-h-screen bg-surface font-body text-on-surface flex flex-col">
            <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden bg-surface-container">
                {/* Background Mesh Gradients */}
                <div className="absolute top-0 left-0 w-full h-full z-0 opacity-40 pointer-events-none">
                    <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-primary-fixed blur-[120px] rounded-full"></div>
                    <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-secondary-fixed blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-surface-container-high blur-[120px] rounded-full"></div>
                </div>

                <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-surface-container-lowest rounded-[2rem] shadow-2xl shadow-primary/10 overflow-hidden relative z-10 animate-in zoom-in-95 duration-500">
                    
                    {/* Branding Side */}
                    <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-primary to-primary-container text-on-primary relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-12">
                                <div className="p-2 bg-on-primary/10 backdrop-blur-md rounded-xl">
                                    <span className="material-symbols-outlined text-3xl text-on-primary">account_balance</span>
                                </div>
                                <span className="font-headline font-extrabold text-2xl tracking-tight text-on-primary">UEN Pedro Emilio Coll</span>
                            </div>
                            <h1 className="font-headline font-extrabold text-5xl leading-tight mb-6 tracking-tighter text-on-primary">
                                Gestión Académica de Excelencia
                            </h1>
                            <p className="text-on-primary font-medium text-lg max-w-md opacity-90">
                                Bienvenido al portal exclusivo para el personal administrativo y docente. Inicie sesión para gestionar el futuro académico.
                            </p>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 bg-on-primary/5 p-4 rounded-2xl backdrop-blur-sm border border-on-primary/10">
                                <span className="material-symbols-outlined text-on-primary opacity-80">verified</span>
                                <span className="text-sm font-semibold text-on-primary">Sistema de Seguridad Institucional Activo</span>
                            </div>
                        </div>

                        {/* Abstract background image effect */}
                        <div className="absolute inset-0 z-0 opacity-20 filter grayscale mix-blend-overlay">
                            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1541339907198-e08756ebafe3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center"></div>
                        </div>
                    </div>

                    {/* Login Form Side */}
                    <div className="p-8 md:p-16 flex flex-col justify-center bg-surface-container-lowest">
                        <div className="mb-10 text-center md:text-left">
                            <div className="md:hidden flex justify-center mb-6">
                                <span className="font-headline font-extrabold text-primary text-xl tracking-tight">UEN Pedro Emilio Coll</span>
                            </div>
                            <h2 className="font-headline font-bold text-3xl text-on-surface mb-2 tracking-tight">Acceso Administrativo</h2>
                            <p className="text-on-surface-variant font-medium">Por favor, ingrese sus credenciales autorizadas.</p>
                        </div>

                        <form className="space-y-6" onSubmit={login}>
                            {loginError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
                                    {loginError}
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-on-surface-variant ml-1" htmlFor="username">Nombre de Usuario</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">person</span>
                                    <input 
                                        className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-high transition-all text-on-surface font-medium placeholder:text-outline/40" 
                                        id="username" 
                                        name="username" 
                                        placeholder="usuario_admin" 
                                        type="text" 
                                        value={loginUsername}
                                        onChange={e => setLoginUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-on-surface-variant ml-1" htmlFor="password">Contraseña</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">lock</span>
                                    <input 
                                        className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-high transition-all text-on-surface font-medium placeholder:text-outline/40" 
                                        id="password" 
                                        name="password" 
                                        placeholder="••••••••" 
                                        type="password" 
                                        value={loginPass}
                                        onChange={e => setLoginPass(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between px-1">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20" type="checkbox" />
                                    <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">Recordarme</span>
                                </label>
                                <Link to="/recovery" className="text-sm font-bold text-primary hover:underline transition-all">¿Olvidó su contraseña?</Link>
                            </div>

                            <button 
                                className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50" 
                                type="submit"
                                disabled={loginLoading}
                            >
                                {loginLoading ? 'Accediendo...' : 'Acceder'}
                                <span className="material-symbols-outlined">login</span>
                            </button>
                        </form>

                        <div className="mt-12 pt-8 border-t border-surface-container-highest">
                            <p className="text-[10px] text-center text-on-surface-variant font-medium leading-relaxed uppercase tracking-widest opacity-60">
                                Sistema Restringido • UEN Pedro Emilio Coll
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="w-full border-t border-outline-variant/10 py-8 px-8 flex flex-col items-center space-y-4 bg-surface-container-lowest font-body text-xs text-on-surface-variant/50">
                <div className="flex gap-6">
                    <button className="hover:text-primary hover:underline transition-all">Privacidad</button>
                    <button className="hover:text-primary hover:underline transition-all">Términos</button>
                    <button className="hover:text-primary hover:underline transition-all">Contacto</button>
                </div>
                <p>© 2024 UEN Pedro Emilio Coll. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}
