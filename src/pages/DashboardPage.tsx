
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { PlusCircle } from 'lucide-react';
import MatchCard, { MatchData } from '@/components/MatchCard';

const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to determine player level based on score
  const getPlayerLevel = (score: number): string => {
    if (score >= 1726) return 'B+';
    if (score >= 1600) return 'B';
    if (score >= 1500) return 'B-';
    if (score >= 1400) return 'C+';
    if (score >= 1300) return 'C';
    if (score >= 1200) return 'C-';
    if (score >= 1100) return 'D';
    if (score >= 1000) return 'D-';
    return 'N/A'; // For scores below 1000
  };

  useEffect(() => {
    // Simulate fetching data
    const storedMatches = localStorage.getItem('padelMatches');
    
    setTimeout(() => {
      if (storedMatches) {
        try {
          const parsedMatches = JSON.parse(storedMatches);
          setMatches(parsedMatches);
        } catch (e) {
          console.error("Error parsing stored matches", e);
          setMatches([]);
        }
      } else {
        // Sample data for demonstration
        const sampleMatches: MatchData[] = [
          {
            id: "1234",
            date: new Date().toISOString(),
            team1: ["John", "Sarah"],
            team2: ["Mike", "Emily"],
            status: "upcoming"
          },
          {
            id: "5678",
            date: new Date(Date.now() - 86400000).toISOString(), // yesterday
            team1: ["User", "Partner"],
            team2: ["Opponent 1", "Opponent 2"],
            status: "in-progress",
            score: {
              team1Sets: 1,
              team2Sets: 0,
              sets: [
                { team1: 6, team2: 4 }
              ]
            }
          }
        ];
        setMatches(sampleMatches);
        localStorage.setItem('padelMatches', JSON.stringify(sampleMatches));
      }
      setIsLoading(false);
    }, 500);
  }, []);

  const handleCreateMatch = () => {
    navigate('/create-match');
  };

  // Filter matches into categories
  const inProgressMatches = matches.filter(match => match.status === 'in-progress');
  const upcomingMatches = matches.filter(match => match.status === 'upcoming');
  const recentMatches = matches.filter(match => match.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="pb-20 pt-2 padel-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">
          Welcome, {profile?.name || user?.email?.split('@')[0] || 'Player'}
        </h1>
        
        {profile && (
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-padel-primary text-white px-2 py-1 rounded text-sm font-medium">
              Level: {getPlayerLevel(profile.score)}
            </div>
            <div className="text-sm text-muted-foreground">
              Score: {profile.score}
            </div>
          </div>
        )}
        
        <p className="text-muted-foreground">Your padel matches and scores</p>
      </div>

      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
      </div>
      <Button
        onClick={handleCreateMatch}
        className="w-full mb-6 bg-padel-primary hover:bg-padel-secondary"
      >
        <PlusCircle className="mr-2 h-5 w-5" /> Create New Match
      </Button>

      {isLoading ? (
        <div className="text-center py-10">
          <p>Loading matches...</p>
        </div>
      ) : (
        <>
          {inProgressMatches.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-3">In Progress</h2>
              {inProgressMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}

          {upcomingMatches.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-3">Upcoming Matches</h2>
              {upcomingMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}

          {recentMatches.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-3">Recent Matches</h2>
              {recentMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}

          {matches.length === 0 && (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">No matches yet</h3>
              <p className="text-gray-500 mb-4">Create your first match to get started</p>
              <Button 
                onClick={handleCreateMatch}
                className="bg-padel-primary hover:bg-padel-secondary"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Create Match
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardPage;
