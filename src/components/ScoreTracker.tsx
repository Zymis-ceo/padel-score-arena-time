
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Minus, RotateCcw, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TeamScore {
  games: number;
  points: string;
  sets: number[];
}

interface ScoreTrackerProps {
  team1Name: string;
  team2Name: string;
  onScoreUpdate?: (team1Score: TeamScore, team2Score: TeamScore) => void;
  initialScore?: {
    team1: TeamScore;
    team2: TeamScore;
  };
  currentSet?: number;
  onFinishMatch?: (team1Score: TeamScore, team2Score: TeamScore) => void;
}

const padelPoints = ['0', '15', '30', '40', 'Ad'];

const ScoreTracker: React.FC<ScoreTrackerProps> = ({
  team1Name,
  team2Name,
  onScoreUpdate,
  initialScore,
  currentSet = 0,
  onFinishMatch,
}) => {
  const [team1, setTeam1] = useState<TeamScore>({
    games: 0,
    points: '0',
    sets: initialScore?.team1.sets || [0],
  });

  const [team2, setTeam2] = useState<TeamScore>({
    games: 0,
    points: '0',
    sets: initialScore?.team2.sets || [0],
  });

  const [currentSetIndex, setCurrentSetIndex] = useState(currentSet);
  const [advantage, setAdvantage] = useState<'team1' | 'team2' | null>(null);
  const [deuce, setDeuce] = useState(false);
  const [setsToWin] = useState(2); // Best of 3 sets
  const [matchWinner, setMatchWinner] = useState<'team1' | 'team2' | null>(null);

  useEffect(() => {
    if (initialScore) {
      setTeam1(initialScore.team1);
      setTeam2(initialScore.team2);
    }
  }, [initialScore]);

  useEffect(() => {
    if (onScoreUpdate) {
      onScoreUpdate(team1, team2);
    }
  }, [team1, team2, onScoreUpdate]);

  const updateScore = (team: 'team1' | 'team2', increment: boolean) => {
    if (matchWinner) return;

    if (team === 'team1') {
      updateTeamScore(setTeam1, team1, team2, setTeam2, increment);
    } else {
      updateTeamScore(setTeam2, team2, team1, setTeam1, increment);
    }
  };

  const updateTeamScore = (
    setScoreFunc: React.Dispatch<React.SetStateAction<TeamScore>>,
    teamScore: TeamScore,
    opposingTeamScore: TeamScore,
    setOpposingTeamScore: React.Dispatch<React.SetStateAction<TeamScore>>,
    increment: boolean
  ) => {
    if (!increment) {
      // Handle point decrement
      handlePointDecrement(setScoreFunc, teamScore);
      return;
    }

    if (deuce) {
      handleDeuceScoring(teamScore, opposingTeamScore, setScoreFunc, setOpposingTeamScore);
      return;
    }

    let pointIndex = padelPoints.indexOf(teamScore.points);
    if (pointIndex === -1) pointIndex = 0;

    // Regular point handling
    if (pointIndex < 3) {
      // Regular point (0, 15, 30 -> 15, 30, 40)
      setScoreFunc(prev => ({
        ...prev,
        points: padelPoints[pointIndex + 1]
      }));
    } else {
      // Team on 40 scores
      if (opposingTeamScore.points === '40') {
        // Deuce situation
        setDeuce(true);
        setScoreFunc(prev => ({ ...prev, points: 'Deuce' }));
        setOpposingTeamScore(prev => ({ ...prev, points: 'Deuce' }));
      } else {
        // Game win
        handleGameWin(setScoreFunc, teamScore, setOpposingTeamScore);
      }
    }
  };

  const handleDeuceScoring = (
    teamScore: TeamScore,
    opposingTeamScore: TeamScore,
    setScoreFunc: React.Dispatch<React.SetStateAction<TeamScore>>,
    setOpposingTeamScore: React.Dispatch<React.SetStateAction<TeamScore>>
  ) => {
    const teamWithAdvantage = advantage;
    const scoringTeam = teamScore === team1 ? 'team1' : 'team2';

    if (teamWithAdvantage === null) {
      // No advantage yet, give advantage to scoring team
      setAdvantage(scoringTeam);
      setScoreFunc(prev => ({ ...prev, points: 'Ad' }));
      setOpposingTeamScore(prev => ({ ...prev, points: '-' }));
    } else if (teamWithAdvantage === scoringTeam) {
      // Team with advantage scores again, they win the game
      handleGameWin(setScoreFunc, teamScore, setOpposingTeamScore);
      setAdvantage(null);
      setDeuce(false);
    } else {
      // Opposing team scores, back to deuce
      setAdvantage(null);
      setScoreFunc(prev => ({ ...prev, points: 'Deuce' }));
      setOpposingTeamScore(prev => ({ ...prev, points: 'Deuce' }));
    }
  };

  const handleGameWin = (
    setScoreFunc: React.Dispatch<React.SetStateAction<TeamScore>>,
    teamScore: TeamScore,
    setOpposingTeamScore: React.Dispatch<React.SetStateAction<TeamScore>>
  ) => {
    const newGames = teamScore.games + 1;
    const updatedSets = [...teamScore.sets];
    updatedSets[currentSetIndex] = newGames;

    setScoreFunc(prev => ({
      ...prev,
      games: newGames,
      points: '0',
      sets: updatedSets
    }));

    setOpposingTeamScore(prev => ({
      ...prev,
      points: '0'
    }));

    setAdvantage(null);
    setDeuce(false);

    // Check if set is won
    if (newGames >= 6 && newGames - (teamScore === team1 ? team2.games : team1.games) >= 2) {
      handleSetWin(setScoreFunc, teamScore, setOpposingTeamScore);
    }
  };

  const handleSetWin = (
    setScoreFunc: React.Dispatch<React.SetStateAction<TeamScore>>,
    teamScore: TeamScore,
    setOpposingTeamScore: React.Dispatch<React.SetStateAction<TeamScore>>
  ) => {
    const newSetIndex = currentSetIndex + 1;
    setCurrentSetIndex(newSetIndex);
    
    // Initialize the next set
    const team1Wins = team1.sets.filter((score, idx) => 
      score > team2.sets[idx] && score >= 6 && score - team2.sets[idx] >= 2
    ).length;
    
    const team2Wins = team2.sets.filter((score, idx) => 
      score > team1.sets[idx] && score >= 6 && score - team1.sets[idx] >= 2
    ).length;

    // Calculate which team won this set
    const winningTeam = teamScore === team1 ? 'team1' : 'team2';
    const setsWon = winningTeam === 'team1' ? team1Wins + 1 : team2Wins + 1;

    // Check if match is won
    if (setsWon >= setsToWin) {
      setMatchWinner(winningTeam);
      return;
    }

    // Reset for next set
    setScoreFunc(prev => ({
      ...prev,
      games: 0,
      points: '0',
      sets: [...prev.sets, 0]
    }));

    setOpposingTeamScore(prev => ({
      ...prev,
      games: 0,
      points: '0',
      sets: [...prev.sets, 0]
    }));
  };

  const handlePointDecrement = (
    setScoreFunc: React.Dispatch<React.SetStateAction<TeamScore>>,
    teamScore: TeamScore
  ) => {
    // Only allow point decrement (not games or sets)
    if (deuce) {
      setDeuce(false);
      setAdvantage(null);
      setScoreFunc(prev => ({ ...prev, points: '40' }));
      const otherTeamSetFunc = teamScore === team1 ? setTeam2 : setTeam1;
      otherTeamSetFunc(prev => ({ ...prev, points: '40' }));
      return;
    }

    let pointIndex = padelPoints.indexOf(teamScore.points);
    if (pointIndex <= 0) return; // Don't decrement if already at 0

    setScoreFunc(prev => ({
      ...prev,
      points: padelPoints[pointIndex - 1]
    }));
  };

  const resetCurrentGame = () => {
    setTeam1(prev => ({ ...prev, points: '0' }));
    setTeam2(prev => ({ ...prev, points: '0' }));
    setAdvantage(null);
    setDeuce(false);
  };

  const handleFinishMatch = () => {
    if (onFinishMatch) {
      onFinishMatch(team1, team2);
    }
  };

  const renderSets = () => {
    const maxSets = Math.max(team1.sets.length, team2.sets.length);
    const sets = [];

    for (let i = 0; i < maxSets; i++) {
      sets.push(
        <div key={`set-${i}`} className="text-center p-1">
          <div className="font-semibold text-xs text-gray-500">Set {i + 1}</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className={`font-medium ${i === currentSetIndex ? 'text-padel-primary' : ''}`}>
              {team1.sets[i] || 0}
            </div>
            <div className={`font-medium ${i === currentSetIndex ? 'text-padel-primary' : ''}`}>
              {team2.sets[i] || 0}
            </div>
          </div>
        </div>
      );
    }

    return sets;
  };

  const getWinningTeamName = () => {
    if (!matchWinner) return null;
    return matchWinner === 'team1' ? team1Name : team2Name;
  };

  return (
    <div className="space-y-4">
      {matchWinner && (
        <div className="bg-green-50 p-3 rounded-lg mb-4 text-center">
          <div className="text-green-800 font-semibold mb-1">Match Complete!</div>
          <div className="text-lg font-bold text-padel-primary">{getWinningTeamName()} Wins!</div>
          <Button
            className="mt-2 bg-padel-primary hover:bg-padel-secondary"
            onClick={handleFinishMatch}
          >
            <CheckCircle className="mr-2 h-4 w-4" /> Finish Match
          </Button>
        </div>
      )}

      <div className="flex justify-around">
        {renderSets()}
      </div>

      <div className="grid grid-cols-3 gap-2 items-center">
        <div className="text-center">
          <h3 className="font-semibold truncate text-sm">{team1Name}</h3>
        </div>
        <div className="text-center text-xs text-gray-500 font-semibold">Current Game</div>
        <div className="text-center">
          <h3 className="font-semibold truncate text-sm">{team2Name}</h3>
        </div>

        <Card className="w-full">
          <CardContent className="p-2 text-center">
            <div className="text-3xl font-bold">{team1.games}</div>
            <div className="text-xs text-gray-500">Games</div>
          </CardContent>
        </Card>
        
        <Button 
          variant="outline" 
          size="sm"
          className="mx-auto text-xs"
          onClick={resetCurrentGame}
        >
          <RotateCcw className="h-3 w-3 mr-1" /> Reset
        </Button>
        
        <Card className="w-full">
          <CardContent className="p-2 text-center">
            <div className="text-3xl font-bold">{team2.games}</div>
            <div className="text-xs text-gray-500">Games</div>
          </CardContent>
        </Card>

        <div className="flex flex-col items-center">
          <Card className="w-full mb-2">
            <CardContent className="p-2 text-center">
              <div className="text-2xl font-bold">{team1.points}</div>
              <div className="text-xs text-gray-500">Points</div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              size="sm" 
              className="bg-padel-primary hover:bg-padel-secondary"
              onClick={() => updateScore('team1', true)}
              disabled={!!matchWinner}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => updateScore('team1', false)}
              disabled={team1.points === '0' || !!matchWinner}
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {deuce && (
          <div className="flex justify-center items-center">
            <Badge className="bg-padel-accent">Deuce</Badge>
          </div>
        )}

        <div className="flex flex-col items-center">
          <Card className="w-full mb-2">
            <CardContent className="p-2 text-center">
              <div className="text-2xl font-bold">{team2.points}</div>
              <div className="text-xs text-gray-500">Points</div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              size="sm" 
              className="bg-padel-primary hover:bg-padel-secondary"
              onClick={() => updateScore('team2', true)}
              disabled={!!matchWinner}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => updateScore('team2', false)}
              disabled={team2.points === '0' || !!matchWinner}
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreTracker;
