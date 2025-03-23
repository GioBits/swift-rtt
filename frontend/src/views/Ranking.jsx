import RankingTable from "../components/RankingTable";
import UserStats from "../components/userStats/UserStats";

const Ranking = () => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col md:flex-row p-6 m-auto">
        {/* User Stats Section */}
        <div className="w-full md:w-100">
          <UserStats userId={1} />
        </div>
        
        {/* Ranking Table Section */}
        <div className="w-full md:w-2/3">
          <RankingTable />
        </div>
      </div>
    </div>
  );
};

export default Ranking;
