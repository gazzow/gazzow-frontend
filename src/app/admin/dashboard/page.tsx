function Dashboard() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col gap-4  p-4 border border-border-primary rounded-lg mb-6">
        <div className="flex flex-col">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <p className="text-text-muted text-sm">
            {`Welcome back! Here's what's happening on your platform.`}
          </p>
        </div>
      </div>
    </div>

    
  );
}

export default Dashboard;
