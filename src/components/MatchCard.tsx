
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users } from 'lucide-react';

export interface MatchData {
  id: string;
  date: string;
  team1: string[];
  team2: string[];
  score?: {
    team1Sets: number;
    team2Sets: number;
    sets: Array<{
      team1: number;
      team2: number;
    }>;
  };
  status: 'upcoming' | 'in-progress' | 'completed';
}

interface MatchCardProps {
  match: MatchData;
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const navigate = useNavigate();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getMatchTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getTeamNames = (team: string[]) => {
    return team.join(' & ');
  };

  const getScoreSummary = () => {
    if (!match.score) return null;
    
    return (
      <div className="text-sm font-medium">
        <span className={match.score.team1Sets > match.score.team2Sets ? "font-bold" : ""}>
          {match.score.team1Sets}
        </span>
        {" - "}
        <span className={match.score.team2Sets > match.score.team1Sets ? "font-bold" : ""}>
          {match.score.team2Sets}
        </span>
      </div>
    );
  };

  const handleContinueMatch = () => {
    navigate(`/match/${match.id}`);
  };

  const handleViewDetails = () => {
    if (match.status === 'completed') {
      navigate(`/match/${match.id}/summary`);
    } else {
      navigate(`/match/${match.id}`);
    }
  };

  return (
    <Card className="w-full mb-4 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Match #{match.id.substring(0, 4)}</CardTitle>
          <Badge className={getStatusColor(match.status)}>
            {match.status === 'in-progress' ? 'In Progress' : match.status === 'completed' ? 'Completed' : 'Upcoming'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center mb-3 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formatDate(match.date)}</span>
          <Clock className="h-4 w-4 ml-3 mr-1" />
          <span>{getMatchTime(match.date)}</span>
        </div>
        
        <div className="grid grid-cols-5 my-3 items-center">
          <div className="col-span-2 text-right pr-2">
            <p className="font-medium">{getTeamNames(match.team1)}</p>
          </div>
          
          <div className="col-span-1 flex justify-center items-center">
            {match.status !== 'upcoming' 
              ? getScoreSummary() 
              : <span className="text-sm text-gray-400">vs</span>
            }
          </div>
          
          <div className="col-span-2 text-left pl-2">
            <p className="font-medium">{getTeamNames(match.team2)}</p>
          </div>
        </div>
        
        {match.status === 'completed' && match.score && (
          <div className="mt-2 bg-gray-50 p-2 rounded-md">
            <p className="text-sm font-medium mb-1">Set Scores:</p>
            <div className="flex flex-wrap gap-2">
              {match.score.sets.map((set, idx) => (
                <div key={idx} className="text-xs px-2 py-1 bg-white rounded border">
                  Set {idx + 1}: {set.team1} - {set.team2}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-0">
        {match.status === 'in-progress' && (
          <Button 
            variant="default"
            className="bg-padel-primary hover:bg-padel-secondary"
            onClick={handleContinueMatch}
          >
            Continue Match
          </Button>
        )}
        {match.status === 'upcoming' && (
          <Button 
            variant="default"
            className="bg-padel-primary hover:bg-padel-secondary"
            onClick={handleContinueMatch}
          >
            Start Match
          </Button>
        )}
        {match.status === 'completed' && (
          <Button 
            variant="outline" 
            onClick={handleViewDetails}
          >
            View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MatchCard;
