import React, { useState, useEffect } from 'react';
import { useUsersAdmin } from '../../../controllers/useAdminController';
import ConfirmDialog from '../../ui/ConfirmDialog';

export default function UsersSection({ showToast }) {
    const { users, loading, newUser, setNewUser, create, remove, update, editingUser, setEditingUser, updating, creating } = useUsersAdmin(showToast);
    const [showConfirm, setShowConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [editForm, setEditForm] = useState({ username: '', email: '', password: '', role: '' });

    useEffect(() => {
        if (editingUser) {
            setEditForm({
                username: editingUser.username || '',
                email: editingUser.email || '',
                password: '',
                role: editingUser.role || 'admin'
            });
        }
    }, [editingUser]);

    const handleDelete = () => {
        if (itemToDelete) {
            remove(itemToDelete);
            setItemToDelete(null);
            setShowConfirm(false);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
    };

    const handleSaveEdit = () => {
        if (!editForm.username || !editForm.email) {
            showToast('Usuario y correo son requeridos', 'error');
            return;
        }
        const data = {
            username: editForm.username,
            email: editForm.email,
            role: editForm.role
        };
        if (editForm.password) {
            data.password = editForm.password;
        }
        update(editingUser.id, data);
    };

    return (
        <>
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-black font-headline text-on-surface px-2">Gestión de Personal Administrativo</h3>
            
            <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-outline-variant/10">
                <h4 className="text-sm font-black text-on-surface-variant uppercase tracking-widest mb-6 opacity-60">Crear Acceso Nuevo</h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2 opacity-60">Usuario</label>
                        <input className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 text-sm font-bold" value={newUser.username} onChange={e => setNewUser(u => ({ ...u, username: e.target.value }))} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2 opacity-60">Correo Electrónico</label>
                        <input className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 text-sm font-bold" type="email" value={newUser.email} onChange={e => setNewUser(u => ({ ...u, email: e.target.value }))} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2 opacity-60">Contraseña temporal</label>
                        <input className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 text-sm font-bold" type="password" value={newUser.password} onChange={e => setNewUser(u => ({ ...u, password: e.target.value }))} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2 opacity-60">Nivel de Acceso</label>
                        <select 
                            className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 text-sm font-bold appearance-none cursor-pointer"
                            value={newUser.role || 'admin'}
                            onChange={e => setNewUser(u => ({ ...u, role: e.target.value }))}
                        >
                            <option value="admin">Administrador</option>
                            <option value="editor">Editor</option>
                        </select>
                    </div>
                    <button className="bg-[#005bbf] text-white py-4 rounded-2xl font-headline font-black text-sm shadow-xl shadow-lg shadow-black/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50" onClick={create} disabled={creating}>{creating ? 'Confirmando...' : 'Asignar Credenciales'}</button>
                </div>
            </div>

            <div className="bg-surface-container-lowest rounded-[2.5rem] shadow-sm border border-outline-variant/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-surface-container-low/50">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest font-headline">Usuario</th>
                            <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest font-headline">Correo</th>
                            <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest font-headline">Nivel de Acceso</th>
                            <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest font-headline">Fecha Registro</th>
                            <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest font-headline text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-low">
                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-surface-container-low transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#005bbf] flex items-center justify-center text-white font-black shadow-lg shadow-primary/20 border border-white/5">
                                            {u.username.substring(0, 1).toUpperCase()}
                                        </div>
                                        <span className="font-bold text-on-surface">{u.username}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-sm font-bold text-on-surface-variant">{u.email || '—'}</td>
                                <td className="px-8 py-5">
                                    <span className="text-[10px] font-black text-on-secondary-container px-3 py-1 bg-secondary-container rounded-full uppercase tracking-tighter">
                                        {u.role === 'admin' ? 'Administrador' : 'Editor'}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-sm font-bold text-on-surface-variant">{new Date(u.created_at).toLocaleDateString('es-VE')}</td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all active:scale-90" onClick={() => handleEdit(u)}>
                                            <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>edit</span>
                                        </button>
                                        <button className="p-3 bg-error-container/20 text-error rounded-xl hover:bg-error-container/40 transition-all active:scale-90" onClick={() => { setItemToDelete(u.id); setShowConfirm(true); }}>
                                            <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>person_remove</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Modal de Edición */}
        {editingUser && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-surface-container-lowest rounded-[2rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black font-headline text-on-surface">Editar Usuario</h3>
                        <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
                            <span className="material-symbols-outlined text-on-surface-variant">close</span>
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2 opacity-60">Usuario</label>
                            <input 
                                className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 text-sm font-bold" 
                                value={editForm.username}
                                onChange={e => setEditForm(f => ({ ...f, username: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2 opacity-60">Correo Electrónico</label>
                            <input 
                                className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 text-sm font-bold" 
                                type="email"
                                value={editForm.email}
                                onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2 opacity-60">Nueva Contraseña (opcional)</label>
                            <input 
                                className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 text-sm font-bold" 
                                type="password"
                                placeholder="Dejar vacío para mantener"
                                value={editForm.password}
                                onChange={e => setEditForm(f => ({ ...f, password: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2 opacity-60">Nivel de Acceso</label>
                            <select 
                                className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 text-sm font-bold appearance-none cursor-pointer"
                                value={editForm.role}
                                onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
                            >
                                <option value="admin">Administrador</option>
                                <option value="editor">Editor</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button 
                            className="flex-1 py-4 bg-surface-container-high text-on-surface font-headline font-bold rounded-2xl hover:bg-surface-container-highest transition-all"
                            onClick={() => setEditingUser(null)}
                        >
                            Cancelar
                        </button>
                        <button 
                            className="flex-1 py-4 bg-[#005bbf] text-white font-headline font-bold rounded-2xl hover:bg-[#004a9e] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            onClick={handleSaveEdit}
                            disabled={updating}
                        >
                            {updating ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">save</span>
                                    Guardar
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        )}

        <ConfirmDialog
            open={showConfirm}
            onConfirm={handleDelete}
            onCancel={() => { setShowConfirm(false); setItemToDelete(null); }}
            title="Eliminar Usuario"
            message="Se eliminará este usuario permanentemente y perderá su acceso al sistema. ¿Deseas continuar?"
        />
        </>
    );
}