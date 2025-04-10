
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Flag } from 'lucide-react';
import { toast } from 'sonner';
import { MatchData } from '@/components/MatchCard';
import ScoreTracker from '@/components/ScoreTracker';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const MatchScorePage: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const [match, setMatch] = useState<MatchData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTeam1Score, setCurrentTeam1Score] = useState({
    games: 0,
    points: '0',
    sets: [0],
  });
  const [currentTeam2Score, setCurrentTeam2Score] = useState({
    games: 0,
    points: '0',
    sets: [0],
  });
  const [showFinishDialog, setShowFinishDialog] = useState(false);

  useEffect(() => {
    if (!matchId) return;
    
    // Load match data
    const storedMatches = localStorage.getItem('padelMatches');
    if (storedMatches) {
      const matches: MatchData[] = JSON.parse(storedMatches);
      const foundMatch = matches.find(m => m.id === matchId);
      
      if (foundMatch) {
        setMatch(foundMatch);
        
        // Initialize score from existing match data if it exists
        if (foundMatch.score) {
          const lastSetIndex = foundMatch.score.sets.length - 1;
          setCurrentTeam1Score({
            games: foundMatch.score.sets[lastSetIndex]?.team1 || 0,
            points: '0',
            sets: foundMatch.score.sets.map(set => set.team1),
          });
          
          setCurrentTeam2Score({
            games: foundMatch.score.sets[lastSetIndex]?.team2 || 0,
            points: '0',
            sets: foundMatch.score.sets.map(set => set.team2),
          });
        }
      } else {
        toast.error('Match not found');
        navigate('/dashboard');
      }
    }
    
    setIsLoading(false);
  }, [matchId, navigate]);

  const handleScoreUpdate = (team1Score: any, team2Score: any) => {
    setCurrentTeam1Score(team1Score);
    setCurrentTeam2Score(team2Score);
  };

  const saveMatch = () => {
    if (!match) return;
    
    // Calculate set wins
    const team1SetWins = currentTeam1Score.sets.filter((score, idx) => 
      score > currentTeam2Score.sets[idx] && score >= 6 && score - currentTeam2Score.sets[idx] >= 2
    ).length;
    
    const team2SetWins = currentTeam2Score.sets.filter((score, idx) => 
      score > currentTeam1Score.sets[idx] && score >= 6 && score - currentTeam1Score.sets[idx] >= 2
    ).length;

    // Create updated match with score
    const updatedMatch: MatchData = {
      ...match,
      status: team1SetWins >= 2 || team2SetWins >= 2 ? 'completed' : 'in-progress',
      score: {
        team1Sets: team1SetWins,
        team2Sets: team2SetWins,
        sets: currentTeam1Score.sets.map((score, idx) => ({
          team1: score,
          team2: currentTeam2Score.sets[idx] || 0
        }))
      }
    };

    // Update match in localStorage
    const storedMatches = localStorage.getItem('padelMatches');
    if (storedMatches) {
      const matches: MatchData[] = JSON.parse(storedMatches);
      const updatedMatches = matches.map(m => m.id === matchId ? updatedMatch : m);
      localStorage.setItem('padelMatches', JSON.stringify(updatedMatches));
      setMatch(updatedMatch);
      toast.success('Match saved successfully!');
    }
  };

  const handleFinishMatch = () => {
    saveMatch();
    navigate('/dashboard');
  };

  const handleOpenFinishDialog = () => {
    setShowFinishDialog(true);
  };

  const getTeamName = (team: string[]) => {
    return team.join(' & ');
  };

  if (isLoading) {
    return (
      <div className="padel-container">
        <p>Loading match...</p>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="padel-container">
        <p>Match not found</p>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="padel-container pb-20">
      <div className="mb-4 flex justify-between items-center">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={saveMatch}>
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>
          <Button 
            size="sm"
            variant="destructive"
            onClick={handleOpenFinishDialog}
          >
            <Flag className="h-4 w-4 mr-1" /> End
          </Button>
        </div>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-xl">Match Scoring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div className="text-center flex-1">
              <h2 className="font-semibold text-padel-primary">{getTeamName(match.team1)}</h2>
            </div>
            <div className="text-center text-gray-500 text-sm">VS</div>
            <div className="text-center flex-1">
              <h2 className="font-semibold text-padel-primary">{getTeamName(match.team2)}</h2>
            </div>
          </div>

          <ScoreTracker
            team1Name={getTeamName(match.team1)}
            team2Name={getTeamName(match.team2)}
            onScoreUpdate={handleScoreUpdate}
            initialScore={{
              team1: currentTeam1Score,
              team2: currentTeam2Score
            }}
            onFinishMatch={handleFinishMatch}
          />
        </CardContent>
      </Card>

      <AlertDialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End this match?</AlertDialogTitle>
            <AlertDialogDescription>
              The current score will be saved and the match will be marked as completed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFinishMatch}
              className="bg-padel-primary hover:bg-padel-secondary"
            >
              End Match
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MatchScorePage;
