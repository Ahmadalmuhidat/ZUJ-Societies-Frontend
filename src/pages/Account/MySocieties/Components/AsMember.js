import SocietyCard from "../../../Societies/Components/SocietyCard";

export default function AsMemeber({ societies }) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Memberships</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {societies
          .filter(society => society.Role === 'member')
          .map(society => (
            <div key={society.ID} className="relative">
              <SocietyCard {...society} />
              <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                Member
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
