interface StatsCardsProps {
  stats: {
    totalRequests: number;
    pending: number;
    completed: number;
    activeWorkers: number;
  };
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {Object.entries(stats).map(([key, value]) => (
        <div key={key} className="bg-white p-4 rounded shadow">
          <h3 className="font-bold capitalize">{key.replace(/([A-Z])/g, " $1")}</h3>
          <p className="text-2xl mt-2">{value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
