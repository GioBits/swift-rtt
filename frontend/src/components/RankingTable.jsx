import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PropTypes from 'prop-types';
import StatsService from '../service/statsService';
import { useState, useEffect } from 'react';

const RankingTable = ({ limit = 6 }) => {

  const [sortedUsers, setSortedUsers] = useState([]);
  const [topThree, setTopThree] = useState([]);
  const [remainingUsers, setRemainingUsers] = useState([]);
  
  useEffect(() => {
    const fetchTopScores = async () => {
      const topScores = await StatsService.getTopScores(limit);
      setSortedUsers(topScores);
      console.log(topScores);
      // Get top 3 users for podium
      setTopThree(topScores.slice(0, 3));
      // Get remaining users for the table
      setRemainingUsers(topScores.slice(3, limit));
    };
    fetchTopScores();
  }, [limit]);

  

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
              <p className="font-semibold text-gray-700">{topThree[1]?.user_id}</p>
              <p className="text-2xl font-bold text-gray-300">{topThree[1]?.score * 100}</p>
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
              <p className="font-semibold text-gray-700">{topThree[0]?.user_id}</p>
              <p className="text-3xl font-bold text-yellow-400">{topThree[0]?.score * 100}</p>
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
              <p className="font-semibold text-gray-700">{topThree[2]?.user_id}</p>
              <p className="text-2xl font-bold text-amber-700">{topThree[2]?.score * 100}</p>
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
                  <h3 className="text-lg w-40 font-semibold text-gray-700">{user.user_id}</h3>
                  <p className="text-gray-500 w-50">
                    Traducciones: {user.total_translations}
                  </p>
                </div>

                {/* User Score */}
                <div className="text-right text-lg">
                  <span className="font-bold text-green-500">
                    {user.score * 100}
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