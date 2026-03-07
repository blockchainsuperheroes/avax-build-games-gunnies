// earlyaccessmodal.tsx
import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import React, { FormEvent } from 'react';

interface EarlyAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EarlyAccessModal: React.FC<EarlyAccessModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    // Simple email validation regex
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Send the email to the backend
    try {
      const response = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else if (response.status === 409) {
        setError('This email is already registered.');
      } else {
        setError('Failed to submit email. Please try again later.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  // Reset form state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setIsSubmitted(false);
      setError('');
    }
  }, [isOpen]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center font-barlow">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#00afaf] p-6 text-left align-middle shadow-xl transition-all">
                <div className="space-y-4">
                  {!isSubmitted ? (
                    <>
                      <Dialog.Title
                        as="h2"
                        className="text-2xl font-bold leading-6  text-center uppercase text-white"
                      >
                        Sign Up for Early Access
                      </Dialog.Title>
                      <form onSubmit={handleSubmit} className="mt-4">
                        <input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          required
                          onChange={e => setEmail(e.target.value)}
                          className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                        <button
                          type="submit"
                          className="mt-4 w-full wishlist text-white py-2 rounded-md hover:opacity-90 transition-colors"
                        >
                          Submit
                        </button>
                      </form>
                      <button
                        onClick={onClose}
                        className="mt-4 w-full early-access text-white py-2 rounded-md hover:opacity-90 transition-colors"
                      >
                        Close
                      </button>
                    </>
                  ) : (
                    <>
                      <Dialog.Title
                        as="h2"
                        className="text-2xl font-bold leading-6 text-gray-900 text-center"
                      >
                        Thank You!
                      </Dialog.Title>
                      <p className="mt-2 text-gray-700 text-center">
                        We&lsquo;ll be in touch soon.
                      </p>
                      <button
                        onClick={onClose}
                        className="mt-4 w-full early-access text-white py-2 rounded-md hover:opacity-90 transition-colors"
                      >
                        Close
                      </button>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EarlyAccessModal;
