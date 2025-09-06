import React from 'react';
import NewSocietyForm from './Components/NewSocietyForm';

export default function NewSociety() {
  return (
    <>
      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a New Society</h1>
            <p className="text-lg text-gray-600">
              Start building your community and connect with like-minded people
            </p>
          </div>

          <NewSocietyForm />
        </div>
      </main>
    </>
  );
}
