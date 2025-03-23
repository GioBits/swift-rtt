import { useEffect } from 'react'
import RankingTable from "../components/RankingTable";
import UserStats from "../components/userStats/UserStats";
import { useSelector } from "react-redux";

const Ranking = () => {
  useEffect(() => {
    document.title = 'Estadísticas'
  }, [])

  const userId = useSelector(state => state.auth.user?.id);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col md:flex-row p-6 m-auto">
        {/* User Stats Section */}
        <div className="w-full md:w-100">
          <UserStats userId={userId} />
        </div>
        
        {/* Ranking Table Section */}
        <div className="w-full md:w-2/3">
          <RankingTable limit={6} />
        </div>
      </div>
    </div>
  );
};

export default Ranking;
