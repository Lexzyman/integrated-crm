import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Phone, Mail, Building } from 'lucide-react';
import apiClient from '../api/client';
import { Customer, Activity, Deal } from '../types';

export const CustomerDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      apiClient.get(`/customers/${id}`).then((response) => setCustomer(response.data));
      apiClient.get(`/customers/${id}/activities`).then((response) => setActivities(response.data));
      apiClient.get(`/customers/${id}/deals`).then((response) => setDeals(response.data));
    }
  }, [id]);

  if (!customer) return <div>Loading...</div>;

  const tabs = ['Overview', 'Activities', 'Notes', 'Documents', 'Related Deals'];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Customer Detail</h1>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex gap-4 p-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-4 py-2 rounded ${activeTab === tab.toLowerCase() ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl text-gray-600">{customer.name.charAt(0)}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{customer.name}</h2>
              <div className="mt-4 space-y-2 text-gray-600">
                <p className="flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" />
                  {customer.email}
                </p>
                <p className="flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4" />
                  {customer.phone}
                </p>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Company Details</h3>
              <div className="space-y-2 text-gray-600">
                <p><strong>Company:</strong> {customer.company}</p>
                <p><strong>Industry:</strong> {customer.industry}</p>
                <p><strong>Revenue:</strong> ${customer.revenue.toLocaleString()}</p>
                <p><strong>Employees:</strong> {customer.employees}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-3">Notes</h3>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3"
                rows={4}
                placeholder="Add a note..."
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Activity Timeline</h3>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="border-l-2 border-blue-500 pl-4">
                  <p className="text-sm text-gray-600">{activity.createdAt}</p>
                  <p className="font-medium text-gray-800">{activity.type} - {activity.description}</p>
                </div>
              ))}
            </div>

            <h3 className="font-semibold text-gray-800 mb-4 mt-8">Related Deals</h3>
            <div className="space-y-3">
              {deals.map((deal) => (
                <div key={deal.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">{deal.title}</span>
                    <span className="text-blue-600 font-semibold">${deal.value.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${deal.probability}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t p-4 flex justify-end gap-3">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            <Edit className="inline h-4 w-4 mr-2" />
            Edit
          </button>
          <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
            <Trash2 className="inline h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};