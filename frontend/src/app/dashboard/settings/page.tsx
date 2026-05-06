'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/store/auth';
import { api } from '@/lib/api';

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await api.post('/uploads/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      const newAvatarUrl = res.data.data?.url || res.data.url;
      if (user) {
        setUser({ ...user, avatarUrl: newAvatarUrl });
      }
      setSuccessMsg('Avatar updated successfully!');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Settings</h1>
          <p className="text-outline-variant font-medium">Manage your personal profile and preferences.</p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-3xl bg-white shadow-sm border border-outline-variant/30 max-w-2xl">
        <h2 className="text-xl font-bold text-on-surface mb-6">Profile Information</h2>
        
        {error && (
          <div className="mb-6 p-4 bg-error-container/30 border border-error/20 text-error rounded-xl font-medium text-sm">
            {error}
          </div>
        )}
        
        {successMsg && (
          <div className="mb-6 p-4 bg-primary-container/30 border border-primary/20 text-primary rounded-xl font-medium text-sm">
            {successMsg}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container shadow-md relative group">
              <Image 
                src={user?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBO0N69FtsBkCbiTZ0ftfa6e886BgpQ_jCL2VVBxdS-EcFDSaPwtPZtsBg62aYpcIHv-B_6MztyyONBdkcnP47tLWMuiwVnLmf_c7lRZmz-VlPk6nXMboj1E9uOI7r5firUn8gYvlS8yw1IQeHnopIPKHdt5YYTPk7iwICnHrSBqHdZiJgIntePfHFKZTtQlyj1AMvzPz8zlUqexSlSMAFxAlagdpsuEKTky6h7m6R2Qcy6hUX1cb7bVHkbZKjcq8w5VaorB9EhRXQ-"}
                alt="Profile Avatar"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white/90 text-primary p-2 rounded-full hover:scale-110 transition-transform"
                >
                  <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                </button>
              </div>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />

            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="font-button text-sm text-primary hover:text-primary-container font-semibold transition-colors disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Change Avatar'}
            </button>
          </div>

          <div className="flex-1 w-full space-y-4">
            <div>
              <label className="block font-label-sm text-on-surface font-bold mb-1">Full Name</label>
              <div className="p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl font-medium text-on-surface shadow-sm">
                {user?.name || 'Not provided'}
              </div>
            </div>
            
            <div>
              <label className="block font-label-sm text-on-surface font-bold mb-1">Email Address</label>
              <div className="p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl font-medium text-on-surface shadow-sm">
                {user?.email || 'Not provided'}
              </div>
            </div>

            <div>
              <label className="block font-label-sm text-on-surface font-bold mb-1">Phone Number</label>
              <div className="p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl font-medium text-on-surface shadow-sm">
                {user?.phone || 'Not provided'}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-outline-variant/20 pt-6">
          <h3 className="font-bold text-lg text-on-surface mb-2">Staff Management</h3>
          <p className="text-sm text-outline-variant mb-4">
            Staff management is currently under development. You will soon be able to add and manage staff members here.
          </p>
          <button disabled className="bg-surface-container border border-outline-variant/30 text-outline px-4 py-2 rounded-lg font-button text-sm flex items-center gap-2 opacity-60 cursor-not-allowed">
            <span className="material-symbols-outlined text-[18px]">group_add</span>
            Add Staff Member
          </button>
        </div>
      </div>
    </div>
  );
}
