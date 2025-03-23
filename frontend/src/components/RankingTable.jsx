import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PropTypes from 'prop-types';

const mockData = [
  {
    id: 1,
    user_id: 101,
    username: "John Doe",
    total_translations: 50,
    total_languages_used: 5,
    total_users_translations: 20,
    total_system_languages: 10,
    different_users_contacted: 15,
    total_system_users: 100,
    score: 85.5,
    last_updated: "2023-10-01T12:34:56"
  },
  {
    id: 2,
    user_id: 102,
    username: "Jane Smith",
    total_translations: 30,
    total_languages_used: 3,
    total_users_translations: 10,
    total_system_languages: 8,
    different_users_contacted: 8,
    total_system_users: 100,
    score: 72.0,
    last_updated: "2023-10-01T14:20:10"
  },
  {
    id: 3,
    user_id: 103,
    username: "Mike Johnson",
    total_translations: 120,
    total_languages_used: 8,
    total_users_translations: 50,
    total_system_languages: 12,
    different_users_contacted: 25,
    total_system_users: 100,
    score: 95.0,
    last_updated: "2023-10-02T09:15:30"
  },
  {
    id: 4,
    user_id: 104,
    username: "Abel Zavaleta",
    total_translations: 120,
    total_languages_used: 8,
    total_users_translations: 50,
    total_system_languages: 12,
    different_users_contacted: 25,
    total_system_users: 100,
    score: 95.0,
    last_updated: "2023-10-02T09:15:30"
  },
  {
    id: 5,
    user_id: 105,
    username: "Jesús Prieto",
    total_translations: 90,
    total_languages_used: 8,
    total_users_translations: 50,
    total_system_languages: 12,
    different_users_contacted: 25,
    total_system_users: 100,
    score: 95.0,
    last_updated: "2023-10-02T09:15:30"
  },
  {
    id: 6,
    user_id: 106,
    username: "Sergio Carrillo",
    total_translations: 150,
    total_languages_used: 8,
    total_users_translations: 50,
    total_system_languages: 12,
    different_users_contacted: 25,
    total_system_users: 100,
    score: 100.0,
    last_updated: "2023-10-02T09:15:30"
  }
];

const RankingTable = ({ limit = 6 }) => {
  // Sort users by score in descending order
  const sortedUsers = [...mockData].sort((a, b) => b.score - a.score);
  // Get top 3 users for podium
  const topThree = sortedUsers.slice(0, 3);
  // Get remaining users for the table
  const remainingUsers = sortedUsers.slice(3, limit);

  return (
    <div className="w-full h-full">
      <div className="min-w-xl max-w-4xl m-auto p-4">
        {/* Header Section */}
        {/* Podium Section */}
        <div className="flex justify-center items-end h-55">
          {/* Second Place */}
          <div className="flex flex-col items-center mx-2">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-gray-300"></div>
              <div className="absolute inset-[3px] rounded-full bg-white overflow-hidden">
                <AccountCircleIcon 
                  className="w-full h-full text-gray-400"
                  sx={{ fontSize: 88 }}
                />
                <div className="absolute bottom-0 w-full h-7 bg-gray-300 -rotate-[0deg] scale-[1.2] translate-y-2 flex items-center justify-center">
                  <span className="text-white font-bold rotate-[5deg] translate-y-[-4px]">2</span>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="font-semibold text-gray-700">{topThree[1]?.username}</p>
              <p className="text-2xl font-bold text-gray-300">{topThree[1]?.score}</p>
            </div>
          </div>

          {/* First Place */}
          <div className="flex flex-col items-center mx-2">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 rounded-full bg-yellow-400"></div>
              <div className="absolute inset-[3px] rounded-full bg-white overflow-hidden">
                <AccountCircleIcon 
                  className="w-full h-full text-gray-400"
                  sx={{ fontSize: 120 }}
                />
                <div className="absolute bottom-0 w-full h-8 bg-yellow-400 -rotate-[0deg] scale-[1.2] translate-y-2 flex items-center justify-center">
                  <span className="text-white font-bold rotate-[5deg] translate-y-[-5px]">1</span>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="font-semibold text-gray-700">{topThree[0]?.username}</p>
              <p className="text-3xl font-bold text-yellow-400">{topThree[0]?.score}</p>
            </div>
          </div>

          {/* Third Place */}
          <div className="flex flex-col items-center mx-2">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-amber-700"></div>
              <div className="absolute inset-[3px] rounded-full bg-white overflow-hidden">
                <AccountCircleIcon 
                  className="w-full h-full text-gray-400"
                  sx={{ fontSize: 88 }}
                />
                <div className="absolute bottom-0 w-full h-7 bg-amber-700 -rotate-[0deg] scale-[1.2] translate-y-2 flex items-center justify-center">
                  <span className="text-white font-bold rotate-[5deg] translate-y-[-4px]">3</span>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="font-semibold text-gray-700">{topThree[2]?.username}</p>
              <p className="text-2xl font-bold text-amber-700">{topThree[2]?.score}</p>
            </div>
          </div>
        </div>

        {/* Ranking Table */}
        <div className="bg-white flex m-auto rounded-xl w-150 h-60 mt-5 overflow-hidden">
          

          {/* User Profiles Section */}
          <div className="p-4 w-full space-y-2 h-60 overflow-auto">
            {remainingUsers.map((user, index) => (
              <div
                key={user.id}
                className="grid grid-cols-[1fr_3fr_1fr] items-center p-3 pr-8 rounded-lg shadow-md shadow-blueMetal/30 hover:scale-105 hover:shadow-xl transition-all duration-250 ease-out bg-white"
              >
                
                {/* User Information */}
                <div className='w-8 font-bold text-black'>
                  {index + 4}
                </div>
                <div className="flex items-center text-lg ml-4">
                  <h3 className="text-lg w-50 font-semibold text-gray-700">{user.username}</h3>
                  <p className="text-gray-500 w-50">
                    Traducciones: {user.total_translations}
                  </p>
                </div>

                {/* User Score */}
                <div className="text-right text-lg">
                  <span className="font-bold text-green-500">
                    {user.score}
                  </span>
                  <span className="text-gray-500 ml-1">puntos</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

RankingTable.propTypes = {
  limit: PropTypes.number.isRequired
};

export default RankingTable;