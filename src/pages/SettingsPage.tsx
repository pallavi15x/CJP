import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, LogOut, User, Bell, Shield, Trash2 } from 'lucide-react';
import { useAuth, useToast } from '../contexts';
import Modal from '../components/ui/Modal';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    location: user?.location || '',
    bio: user?.bio || '',
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSave = () => {
    updateProfile(formData);
    showToast('Settings saved successfully!', 'success');
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Settings</h1>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="card space-y-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary/20 text-primary'
                      : 'text-text-muted hover:bg-dark-hover hover:text-text-primary'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="card">
              <h2 className="text-lg font-bold text-text-primary mb-4">Profile Information</h2>

              <div className="flex items-center gap-6 mb-6">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <button className="btn-primary text-sm">Change Avatar</button>
                  <p className="text-text-muted text-xs mt-1">JPG, PNG. Max 2MB</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Username</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={e => setFormData(prev => ({ ...prev, username: e.target.value.toLowerCase() }))}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="City, Country"
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    placeholder="Tell us about yourself..."
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card">
              <h2 className="text-lg font-bold text-text-primary mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { label: 'New comments on your stories', checked: true },
                  { label: 'Petition milestone updates', checked: true },
                  { label: 'Community activity', checked: true },
                  { label: 'Badge achievements', checked: true },
                  { label: 'Email notifications', checked: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-dark-border last:border-0">
                    <span className="text-text-primary">{item.label}</span>
                    <button
                      className={`w-12 h-6 rounded-full transition-colors ${item.checked ? 'bg-primary' : 'bg-dark-hover'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${item.checked ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card">
              <h2 className="text-lg font-bold text-text-primary mb-4">Security Settings</h2>
              <div className="space-y-4">
                <div className="p-4 bg-dark-hover rounded-lg">
                  <h3 className="text-text-primary font-medium mb-2">Change Password</h3>
                  <button className="btn-secondary text-sm">Update Password</button>
                </div>
                <div className="p-4 bg-dark-hover rounded-lg">
                  <h3 className="text-text-primary font-medium mb-2">Two-Factor Authentication</h3>
                  <p className="text-text-muted text-sm mb-3">Add an extra layer of security to your account</p>
                  <button className="btn-secondary text-sm">Enable 2FA</button>
                </div>
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <h3 className="text-red-400 font-medium mb-2">Delete Account</h3>
                  <p className="text-text-muted text-sm mb-3">This action cannot be undone</p>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors text-sm"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 card">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-text-muted hover:text-text-primary"
        >
          <LogOut className="w-5 h-5" />
          Sign out of all devices
        </button>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
      >
        <p className="text-text-secondary mb-6">
          Are you sure you want to delete your account? All your data will be permanently removed.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
          <button className="flex-1 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
            Delete Account
          </button>
        </div>
      </Modal>
    </div>
  );
}
