
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import MatchCard, { MatchData } from '@/components/MatchCard';

const MatchHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load matches from localStorage
    const storedMatches = localStorage.getItem('padelMatches');
    
    setTimeout(() => {
      if (storedMatches) {
        try {
          const parsedMatches = JSON.parse(storedMatches);
          // Sort by date, most recent first
          const sortedMatches = [...parsedMatches].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setMatches(sortedMatches);
        } catch (e) {
          console.error("Error parsing stored matches", e);
          setMatches([]);
        }
      }
      setIsLoading(false);
    }, 300);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredMatches = matches.filter(match => {
    const query = searchQuery.toLowerCase();
    
    // Search in team names
    const team1String = match.team1.join(' ').toLowerCase();
    const team2String = match.team2.join(' ').toLowerCase();
    
    // Search in date (formatted)
    const dateString = new Date(match.date).toLocaleDateString();
    
    return team1String.includes(query) || 
           team2String.includes(query) || 
           dateString.includes(query) ||
           match.id.includes(query);
  });

  const completedMatches = filteredMatches.filter(match => match.status === 'completed');
  const otherMatches = filteredMatches.filter(match => match.status !== 'completed');

  return (
    <div className="padel-container pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Match History</h1>
        <p className="text-muted-foreground">View all your matches</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search matches..."
          className="pl-8"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <p>Loading matches...</p>
        </div>
      ) : (
        <>
          {otherMatches.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Active Matches</h2>
              {otherMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold mb-3">Completed Matches</h2>
            {completedMatches.length > 0 ? (
              completedMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No completed matches found</p>
              </div>
            )}
          </div>

          {filteredMatches.length === 0 && searchQuery && (
            <div className="text-center py-10 bg-gray-50 rounded-lg mt-6">
              <h3 className="font-medium text-gray-700 mb-2">No matches found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search criteria</p>
              <Button 
                onClick={() => setSearchQuery('')}
                variant="outline"
              >
                Clear Search
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MatchHistoryPage;
