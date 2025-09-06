export default function QuickStats({ societies }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Impact</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div>
          <div className="text-3xl font-bold text-blue-600">
            {societies.filter(soc => soc.Role === 'member').length}
          </div>
          <div className="text-gray-600">Memberships</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-green-600">
            {societies.filter(soc => soc.Role === 'admin').length}
          </div>
          <div className="text-gray-600">Managed Societies</div>
        </div>
      </div>
    </div>
  );
}
