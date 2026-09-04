import React, { useEffect, useState } from 'react';
import { Plus, Shield, Key } from 'lucide-react';
import apiClient from '../api/client';
import { User } from '../types';

interface Role {
  name: string;
  permissions: {
    contacts: boolean;
    accounts: boolean;
    leads: boolean;
    reports: boolean;
    settings: boolean;
  };
}

export const Settings: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([
    { name: 'Admin', permissions: { contacts: true, accounts: true, leads: true, reports: true, settings: true } },
    { name: 'Manager', permissions: { contacts: true, accounts: false, leads: true, reports: true, settings: false } },
    { name: 'Sales Rep', permissions: { contacts: true, accounts: true, leads: false, reports: false, settings: false } },
  ]);
  const [securitySettings, setSecuritySettings] = useState({
    passwordPolicy: true,
    twoFA: true,
    sessionTimeout: true,
  });
  const [apiKey, setApiKey] = useState('sk-••••••••••••••••••••••••');

  useEffect(() => {
    apiClient.get('/users').then((response) => setUsers(response.data));
  }, []);

  const togglePermission = (roleIndex: number, permission: string) => {
    const newRoles = [...roles];
    newRoles[roleIndex].permissions[permission as keyof typeof newRoles[roleIndex].permissions] = 
      !newRoles[roleIndex].permissions[permission as keyof typeof newRoles[roleIndex].permissions];
    setRoles(newRoles);
  };

  const regenerateApiKey = () => {
    setApiKey('sk-' + Math.random().toString(36).substring(2, 15));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">CRM Role Management & Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">User Roles Table</h2>
          <div className="space-y-6">
            {roles.map((role, index) => (
              <div key={role.name} className="border-b pb-4">
                <h3 className="text-lg font-bold text-gray-800 mb-3">{role.name}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(role.permissions).map(([permission, value]) => (
                    <label key={permission} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => togglePermission(index, permission)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="text-gray-700 capitalize">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">User List</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                Add User
              </button>
            </div>
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <span className="font-medium text-gray-800">{user.name}</span>
                  </div>
                  <select className="border border-gray-300 rounded px-3 py-1">
                    <option value="admin" selected={user.role === 'admin'}>Admin</option>
                    <option value="manager" selected={user.role === 'manager'}>Manager</option>
                    <option value="sales_rep" selected={user.role === 'sales_rep'}>Sales Rep</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Password Policy</span>
                <input
                  type="checkbox"
                  checked={securitySettings.passwordPolicy}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, passwordPolicy: e.target.checked })}
                  className="h-5 w-5 text-blue-600"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">2FA Enabled</span>
                <input
                  type="checkbox"
                  checked={securitySettings.twoFA}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, twoFA: e.target.checked })}
                  className="h-5 w-5 text-blue-600"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Session Timeout</span>
                <input
                  type="checkbox"
                  checked={securitySettings.sessionTimeout}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.checked })}
                  className="h-5 w-5 text-blue-600"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Configuration
            </h2>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={apiKey}
                readOnly
                className="flex-1 border border-gray-300 rounded px-3 py-2 bg-gray-50"
              />
              <button
                onClick={regenerateApiKey}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                Regenerate Key
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};