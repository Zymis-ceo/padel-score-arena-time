
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Users } from 'lucide-react';
import { toast } from 'sonner';
import { MatchData } from '@/components/MatchCard';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

const CreateMatchPage: React.FC = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [team1Player1, setTeam1Player1] = useState('');
  const [team1Player2, setTeam1Player2] = useState('');
  const [team2Player1, setTeam2Player1] = useState('');
  const [team2Player2, setTeam2Player2] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!team1Player1 || !team1Player2 || !team2Player1 || !team2Player2 || !date) {
      toast.error('Please fill in all fields');
      return;
    }

    // Create the match object
    const newMatch: MatchData = {
      id: Date.now().toString(),
      date: date.toISOString(),
      team1: [team1Player1, team1Player2],
      team2: [team2Player1, team2Player2],
      status: 'upcoming'
    };

    // Save the match to localStorage
    const storedMatches = localStorage.getItem('padelMatches');
    const matches = storedMatches ? JSON.parse(storedMatches) : [];
    matches.push(newMatch);
    localStorage.setItem('padelMatches', JSON.stringify(matches));

    toast.success('Match created successfully!');
    navigate(`/match/${newMatch.id}`);
  };

  return (
    <div className="padel-container pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Match</h1>
        <p className="text-muted-foreground">Enter match details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5 text-padel-primary" />
              Match Date & Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Users className="mr-2 h-5 w-5 text-padel-primary" />
              Team 1
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="team1Player1">Player 1</Label>
                <Input
                  id="team1Player1"
                  placeholder="Enter player name"
                  value={team1Player1}
                  onChange={(e) => setTeam1Player1(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team1Player2">Player 2</Label>
                <Input
                  id="team1Player2"
                  placeholder="Enter player name"
                  value={team1Player2}
                  onChange={(e) => setTeam1Player2(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Users className="mr-2 h-5 w-5 text-padel-primary" />
              Team 2
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="team2Player1">Player 1</Label>
                <Input
                  id="team2Player1"
                  placeholder="Enter player name"
                  value={team2Player1}
                  onChange={(e) => setTeam2Player1(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team2Player2">Player 2</Label>
                <Input
                  id="team2Player2"
                  placeholder="Enter player name"
                  value={team2Player2}
                  onChange={(e) => setTeam2Player2(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-padel-primary hover:bg-padel-secondary"
          >
            Create Match
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateMatchPage;
