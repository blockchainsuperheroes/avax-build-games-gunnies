'use client';

import React from 'react';
import Modal from '../common/Modal';
import { useCartStore, CartHistory } from '@/app/stores/cartStore';
import Image from 'next/image';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose }) => {
  const { history } = useCartStore();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Purchase History"
      className="max-w-4xl max-h-[80vh] overflow-y-auto"
      isShowCloseButton={true}
    >
      <div className="p-6">
        {history.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No purchase history yet</p>
            <p className="text-gray-500 mt-2">Your completed orders will appear here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((order) => (
              <div key={order.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">Order #{order.id}</h3>
                    <p className="text-gray-400">{formatDate(order.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#f4ba0e] font-bold text-xl">${order.total.toFixed(2)}</p>
                    <p className="text-gray-400 text-sm">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={`${order.id}-${item.id}-${index}`} className="flex items-center space-x-4 bg-gray-900 p-3 rounded-lg">
                      <div className="relative w-12 h-12 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{item.name}</h4>
                        <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-gray-400 text-sm">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}; 